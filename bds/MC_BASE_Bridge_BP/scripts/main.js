// MC BASE BDS bridge 1.0 (experimental server-net/server-admin modules).
// No secrets are in this file. Store token in BDS config/secrets.json.
import { world, system } from "@minecraft/server";
import { http, HttpRequest, HttpRequestMethod, HttpHeader } from "@minecraft/server-net";
import { variables, secrets } from "@minecraft/server-admin";

const workspaceId=String(variables.get("mcbase_workspace_id")||"");
const worldId=String(variables.get("mcbase_world_id")||"");
const endpoint=String(variables.get("mcbase_endpoint")||"");
const sharePositions=variables.get("mcbase_share_positions")!==false;
const shareInventory=variables.get("mcbase_share_inventory")!==false;
const queuedEvents=[],queuedSites=[];
let sending=false,cycles=0,lastErrorTime=0;

function dimName(dim) {
 const id=typeof dim==="string"?dim:dim?.id;
 return id==="minecraft:nether"?"ネザー":id==="minecraft:the_end"?"エンド":"オーバーワールド";
}
function place(player,location,category,detail) {
 const pos=location||player?.location;
 if(!pos)return;
 queuedEvents.push({category,player_id:String(player?.id||player?.name||""),player_name:String(player?.name||""),dimension:dimName(player?.dimension),
  x:Math.floor(pos.x),y:Math.floor(pos.y),z:Math.floor(pos.z),detail:String(detail||"").slice(0,180)});
 if(queuedEvents.length>120)queuedEvents.splice(0,queuedEvents.length-120);
}
world.afterEvents.playerJoin.subscribe(e=>{
 queuedEvents.push({category:"join",player_id:String(e.playerId||e.playerName),player_name:String(e.playerName||"")});
});
world.afterEvents.playerLeave.subscribe(e=>{
 queuedEvents.push({category:"leave",player_id:String(e.playerId||e.playerName),player_name:String(e.playerName||"")});
});
world.afterEvents.playerPlaceBlock.subscribe(e=>place(e.player,e.block?.location,"block_place",e.block?.typeId));
world.afterEvents.playerBreakBlock.subscribe(e=>place(e.player,e.block?.location,"block_break",e.brokenBlockPermutation?.type?.id||""));

system.afterEvents.scriptEventReceive.subscribe(e=>{
 if(e.id!=="mcbase:site"||!e.sourceEntity?.location)return;
 const name=String(e.message||"").trim().slice(0,80);
 if(!name)return;
 const player=e.sourceEntity,pos=player.location;
 queuedSites.push({label:name,x:Math.floor(pos.x),y:Math.floor(pos.y),z:Math.floor(pos.z),dimension:dimName(player.dimension),player_name:player.name||""});
 if(queuedSites.length>25)queuedSites.splice(0,queuedSites.length-25);
});
function inventorySnapshot(player) {
 try{
  const container=player.getComponent("minecraft:inventory")?.container;
  if(!container)return {player_id:String(player.id||player.name),player_name:player.name,items:[]};
  const counts=new Map();
  for(let i=0;i<container.size;i++){
   const item=container.getItem(i);if(!item)continue;
   counts.set(item.typeId,(counts.get(item.typeId)||0)+item.amount);
  }
  return {player_id:String(player.id||player.name),player_name:player.name,
    items:[...counts].slice(0,180).map(([item_id,quantity])=>({item_id,quantity}))};
 }catch{return null;}
}
async function flush() {
 if(sending)return;
 if(!/^[0-9a-f-]{36}$/i.test(workspaceId)||!worldId||!endpoint.startsWith("https://"))return;
 const token=secrets.get("mcbase_token");if(!token)return;
 sending=true;
 const events=queuedEvents.splice(0,30),sites=queuedSites.splice(0,8);
 try{
  const players=world.getAllPlayers();
  const positions=sharePositions?players.slice(0,40).map(p=>({
   player_id:String(p.id||p.name),player_name:p.name,dimension:dimName(p.dimension),
   x:p.location.x,y:p.location.y,z:p.location.z
  })):[];
  const inventory=shareInventory&&(cycles%4===0)?players.slice(0,20).map(inventorySnapshot).filter(Boolean):[];
  // Position updates every ~5 sec; inventory snapshots every ~20 sec.
  const safeEvents=sharePositions?events:events.map(({x,y,z,...rest})=>rest);
  const body=JSON.stringify({workspace_id:workspaceId,world_id:worldId,
   share_positions:sharePositions,share_inventory:shareInventory,
   players:positions,inventory,events:safeEvents,sites:sharePositions?sites:[]});
  const req=new HttpRequest(endpoint);
  req.method=HttpRequestMethod.Post;
  req.body=body;
  req.headers=[new HttpHeader("Content-Type","application/json"),
    new HttpHeader("X-MC-Base-Token",token)];
  req.timeout=8;
  const resp=await http.request(req);
  if(resp.status<200||resp.status>=300)throw Error("HTTP "+resp.status);
 }catch(e){
  queuedEvents.unshift(...events);queuedSites.unshift(...sites);
  if(queuedEvents.length>120)queuedEvents.length=120;
  if(queuedSites.length>25)queuedSites.length=25;
  const time=Date.now();
  if(time-lastErrorTime>120000){console.warn("MC BASE bridge could not send data: "+String(e));lastErrorTime=time;}
 }finally{sending=false;cycles++;}
}
system.runInterval(()=>{void flush();},100);
