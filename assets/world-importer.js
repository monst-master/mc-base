/* MC BASE v3.2 — Bedrock world metadata read-only import.
 * Reads a selected .mcworld/.zip/level.dat locally; never uploads the source file.
 * LevelDB chunks, player inventories, structure data and chest items are deliberately not parsed.
 */
(function(root){
'use strict';
class Reader {
 constructor(bytes){this.bytes=bytes instanceof Uint8Array?bytes:new Uint8Array(bytes);this.v=new DataView(this.bytes.buffer,this.bytes.byteOffset,this.bytes.byteLength);this.p=0;this.decoder=new TextDecoder('utf-8',{fatal:false});}
 ensure(n){if(!Number.isSafeInteger(n)||n<0||this.p+n>this.bytes.length)throw Error('level.dat が途中で切れているか形式が異なります。');}
 skip(n){this.ensure(n);this.p+=n;}
 u8(){this.ensure(1);return this.v.getUint8(this.p++);}
 i8(){this.ensure(1);return this.v.getInt8(this.p++);}
 u16(){this.ensure(2);const a=this.v.getUint16(this.p,true);this.p+=2;return a;}
 i16(){this.ensure(2);const a=this.v.getInt16(this.p,true);this.p+=2;return a;}
 u32(){this.ensure(4);const a=this.v.getUint32(this.p,true);this.p+=4;return a;}
 i32(){this.ensure(4);const a=this.v.getInt32(this.p,true);this.p+=4;return a;}
 i64(){this.ensure(8);const a=this.v.getBigInt64(this.p,true);this.p+=8;return a.toString();}
 f32(){this.ensure(4);const a=this.v.getFloat32(this.p,true);this.p+=4;return a;}
 f64(){this.ensure(8);const a=this.v.getFloat64(this.p,true);this.p+=8;return a;}
 text(){const n=this.u16();this.ensure(n);const s=this.decoder.decode(this.bytes.subarray(this.p,this.p+n));this.p+=n;return s;}
 length(max=1000000){const n=this.i32();if(n<0||n>max)throw Error('NBT 配列の長さが異常です。');return n;}
 payload(type,depth){if(depth>32)throw Error('NBT の入れ子が深すぎます。');switch(type){
  case 1:return this.i8();case 2:return this.i16();case 3:return this.i32();case 4:return this.i64();case 5:return this.f32();case 6:return this.f64();
  case 7:{const n=this.length(8000000);this.skip(n);return `[bytearray:${n}]`;}
  case 8:return this.text();
  case 9:{const kind=this.u8(),n=this.length(200000);if(kind===0&&n!==0)throw Error('NBT リストが不正です。');const a=[];for(let i=0;i<n;i++)a.push(this.payload(kind,depth+1));return a;}
  case 10:{const r=Object.create(null);for(let i=0;i<20000;i++){const t=this.u8();if(t===0)return r;const k=this.text();r[k]=this.payload(t,depth+1);}throw Error('NBT のタグ数が多すぎます。');}
  case 11:{const n=this.length(1000000);this.skip(n*4);return `[intarray:${n}]`;}
  case 12:{const n=this.length(1000000);this.skip(n*8);return `[longarray:${n}]`;}
  default:throw Error('対応していないNBTタグ: '+type);
 }}
}
function parseLevelDat(input){
 const bytes=input instanceof Uint8Array?input:new Uint8Array(input);
 if(bytes.length<12||bytes.length>8*1024*1024)throw Error('level.dat のサイズが不正です（上限8MB）。');
 const r=new Reader(bytes),fileFormat=r.u32(),declared=r.u32();
 if(fileFormat<1||fileFormat>100)throw Error('統合版の level.dat ではありません。');
 if(declared<4||declared>bytes.length-8)throw Error('level.dat のヘッダーが不正です。');
 if(r.u8()!==10)throw Error('NBTルートがCompoundではありません。');
 r.text();const root=r.payload(10,0);
 const coord=['SpawnX','SpawnY','SpawnZ'].map(k=>Number(root[k]));
 const spawn=coord.every(n=>Number.isSafeInteger(n)&&Math.abs(n)<30000001)?{x:coord[0],y:coord[1],z:coord[2]}:null;
 const rawSeed=root.RandomSeed;
 const seed=(typeof rawSeed==='string'&&/^-?\d+$/.test(rawSeed))?rawSeed:null;
 const version=Array.isArray(root.lastOpenedWithVersion)&&root.lastOpenedWithVersion.length>=3?root.lastOpenedWithVersion.slice(0,4).join('.'):null;
 const gameTypes={0:'サバイバル',1:'クリエイティブ',2:'アドベンチャー',3:'スペクテイター'};
 const difficulties={0:'ピースフル',1:'イージー',2:'ノーマル',3:'ハード'};
 const name=typeof root.LevelName==='string'?root.LevelName.trim().slice(0,120):'';
 return {edition:'統合版（Bedrock）',name,seed,spawn,mode:gameTypes[root.GameType]||null,difficulty:difficulties[root.Difficulty]||null,version:version||null,baseGameVersion:typeof root.baseGameVersion==='string'?root.baseGameVersion:null,fileFormat};
}
async function extractWorldInfo(file){
 if(!file||typeof file.name!=='string')throw Error('ファイルを選択してください。');
 const lower=file.name.toLowerCase();let meta;
 if(lower==='level.dat'||lower.endsWith('.dat')){
  if(file.size>8*1024*1024)throw Error('level.dat が大きすぎます。');
  meta=parseLevelDat(new Uint8Array(await file.arrayBuffer()));
 }else if(lower.endsWith('.mcworld')||lower.endsWith('.zip')){
  if(file.size>512*1024*1024)throw Error('ワールドファイルが512MBを超えています。level.dat単体を選択してください。');
  if(!root.JSZip)throw Error('ZIP読み取り機能が利用できません。ページを再読み込みしてください。');
  let zip;try{zip=await root.JSZip.loadAsync(await file.arrayBuffer());}catch{throw Error('ZIPまたは.mcworldファイルを開けません。');}
  const entries=Object.values(zip.files).filter(x=>!x.dir&&/(^|\/)level\.dat$/i.test(x.name)&&!x.name.includes('__MACOSX'));
  if(entries.length!==1)throw Error('level.dat が見つからない、または複数見つかりました。1ワールドだけを選択してください。');
  const entry=entries[0];if(entry._data?.uncompressedSize>8*1024*1024)throw Error('level.dat の展開後サイズが大きすぎます。');
  let data;try{data=await entry.async('uint8array');}catch{throw Error('level.dat を取り出せません。');}
  meta=parseLevelDat(data);
  const nameEntry=Object.values(zip.files).find(x=>!x.dir&&x.name===entry.name.replace(/level\.dat$/i,'levelname.txt'));
  if(!meta.name&&nameEntry&&nameEntry._data?.uncompressedSize<=4096){try{meta.name=(await nameEntry.async('string')).trim().slice(0,120);}catch{/*optional*/}}
 }else throw Error('.mcworld / .zip / level.dat に対応しています。');
 return {...meta,sourceFile:file.name.slice(0,160),sourceSize:file.size,importedAt:new Date().toISOString()};
}
root.MCWorldImporter={parseLevelDat,extractWorldInfo};
})(typeof window!=='undefined'?window:globalThis);
