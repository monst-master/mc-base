import { world, system, CustomCommandPermissionLevel } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";

// MC BASE Realms Companion: client/world-side only, NO external HTTP or telemetry upload.
// Each player must opt in before counters are recorded. Sync code is shown privately.
const P="mcbase:";
const get=(p,k)=>p.getDynamicProperty(P+k);
const set=(p,k,v)=>p.setDynamicProperty(P+k,v);
const num=(p,k)=>Math.max(0,Math.trunc(Number(get(p,k))||0));
const pos=p=>[Math.floor(p.location.x),Math.floor(p.location.y),Math.floor(p.location.z)];
function dim(p){const id=p.dimension.id;return id==="minecraft:nether"?"1":id==="minecraft:the_end"?"2":"0";}
function text(p,v){try{p.sendMessage("§a[MC BASE] §r"+v);}catch{}}
function inventory(p){
 const bag=p.getComponent("minecraft:inventory")?.container;
 if(!bag)return [];
 const m=new Map();
 for(let i=0;i<bag.size;i++){const s=bag.getItem(i);if(s)m.set(s.typeId,(m.get(s.typeId)||0)+s.amount);}
 return [...m].sort((a,b)=>b[1]-a[1]).slice(0,4);
}
function exportCode(p){
 const [x,y,z]=pos(p);
 const last=String(get(p,"last_place")||"").split(",").map(Number);
 const hasLast=last.length===3&&last.every(Number.isSafeInteger);
 const site=String(get(p,"site")||"").slice(0,28);
 const materials=inventory(p).map(([id,amount])=>encodeURIComponent(id)+"~"+amount).join(",");
 return ["MCB1",encodeURIComponent(p.name),dim(p),x,y,z,num(p,"placed"),num(p,"broken"),materials,
   hasLast?last[0]:"",hasLast?last[1]:"",hasLast?last[2]:"",encodeURIComponent(site)].join("|");
}
function showExport(p){
 if(get(p,"enabled")!==true){text(p,"先に記録を有効にしてください。");return;}
 const code=exportCode(p);
 text(p,"同期コード（自分にだけ表示）: "+code);
 text(p,"MC BASE → Realms座標共有 → アドオン同期コードに貼り付けてください。");
 new MessageFormData().title("MC BASE 同期コード")
  .body("Webに貼り付けるコードです。\n\n"+code+"\n\n※ 直接Webへ自動送信はできません。")
  .button1("閉じる").button2("メニューに戻る")
  .show(p).then(r=>{if(!r.canceled&&r.selection===1)system.run(()=>showMenu(p));}).catch(()=>{});
}
function nameSite(p){
 new ModalFormData().title("建築地点を名前で記録")
   .textField("地点の名前","例：天空トラップ",{defaultValue:String(get(p,"site")||"")})
   .show(p).then(r=>{
    if(r.canceled)return;
    const v=String(r.formValues?.[0]||"").trim().slice(0,28);
    if(!v){text(p,"地点名を入力してください。");return;}
    set(p,"site",v);
    set(p,"last_place",pos(p).join(","));
    text(p,"「"+v+"」を現在座標に記録しました。同期コードを出力してMC BASEに反映できます。");
   }).catch(e=>text(p,"入力画面を開けません: "+String(e).slice(0,80)));
}
function showMenu(p){
 try{
  const enabled=get(p,"enabled")===true;
  const [x,y,z]=pos(p);
  const f=new ActionFormData().title("§lMC BASE / Realms")
    .body("§7現在地：§fX "+x+" Y "+y+" Z "+z+"\n§7記録：§f"+(enabled?"有効":"無効")+"\n§7ブロック設置 "+num(p,"placed")+" / 破壊 "+num(p,"broken")+"\n§7外部送信なし。同期時はWebへ貼り付けます。")
    .button(enabled?"記録を停止する":"記録を開始する")
    .button("📋 MC BASE同期コードを表示")
    .button("🏗️ 建築地点に名前を付ける")
    .button("📦 所持品上位を表示")
    .button("📍 現在地を確認");
  f.show(p).then(r=>{
    if(r.canceled)return;
    switch(r.selection){
     case 0:
      set(p,"enabled",!enabled);
      text(p,!enabled?"本人の操作により記録を開始しました。":"記録を停止しました（過去の記録は保持）。");
      break;
     case 1:showExport(p);break;
     case 2: if(enabled)nameSite(p);else text(p,"先に記録を有効にしてください。");break;
     case 3:text(p,inventory(p).map(([id,n])=>id+" ×"+n).join("、")||"所持品なし");break;
     case 4:text(p,"座標："+p.dimension.id+" "+pos(p).join(", "));break;
    }
  }).catch(e=>text(p,"メニューエラー: "+String(e).slice(0,80)));
 }catch(e){text(p,"メニュー起動エラー: "+String(e).slice(0,90));}
}
world.afterEvents.playerPlaceBlock.subscribe(e=>{
 const p=e.player;
 try{if(get(p,"enabled")!==true)return;
  set(p,"placed",Math.min(num(p,"placed")+1,99999999));
  set(p,"last_place",[e.block.location.x,e.block.location.y,e.block.location.z].join(","));
 }catch{}
});
world.afterEvents.playerBreakBlock.subscribe(e=>{
 const p=e.player;
 try{if(get(p,"enabled")!==true)return;set(p,"broken",Math.min(num(p,"broken")+1,99999999));}catch{}
});
world.afterEvents.playerSpawn.subscribe(e=>{
 if(!e.initialSpawn)return;
 system.runTimeout(()=>text(e.player,"Realms連携アドオン有効。チャット欄で /mcbase:menu を入力して記録開始（本人同意制）。"),70);
});
// Command for non-operator players. If a Realm version restricts custom commands,
// the addon remains passive and no data is shared outside the game.
system.beforeEvents.startup.subscribe(e=>{
 try{
  e.customCommandRegistry.registerCommand({
    name:"mcbase:menu",
    description:"MC BASE Realmsの個人記録メニューを開きます",
    permissionLevel:CustomCommandPermissionLevel.Any
  },origin=>{
   if(!origin.sourceEntity||origin.sourceEntity.typeId!=="minecraft:player")return;
   const p=origin.sourceEntity;
   system.run(()=>showMenu(p));
  });
 }catch(e){console.warn("MC BASE custom command could not register: "+String(e));}
});
