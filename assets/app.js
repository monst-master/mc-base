(() => {
'use strict';
const KEY='mc_base_v1';
const PAGES=[['dashboard','🏡','ダッシュボード'],['worlds','🌍','ワールド管理'],['coords','📍','座標メモ'],['projects','🧱','建築・タスク'],['items','📦','資材管理'],['live','📡','サーバー活動・現在地'],['realms','🛰️','Realms座標共有'],['villagers','🧑‍🌾','村人・取引'],['farms','🌾','トラップ・装置'],['goals','🏆','進捗・目標'],['machines','🏭','大型装置レシピ'],['enchants','✨','おすすめエンチャント'],['tools','🧮','便利ツール'],['map','🗺️','シードマップ'],['atlas','🛰️','統合版ワールド地図'],['demo','🎬','装置デモ'],['unichat','💬','統合チャット'],['device','📲','スマホ・PC連携'],['settings','⚙️','設定・バックアップ']];
const DEFAULT_GOALS=[['序盤','ベッドと拠点を作る'],['序盤','鉄装備を整える'],['序盤','ダイヤモンドを入手する'],['ネザー','ネザーへ進出する'],['ネザー','ブレイズロッドを集める'],['エンド','エンド要塞を発見する'],['エンド','エンダードラゴンを討伐する'],['エンド','エリトラを入手する'],['発展','自動収穫装置を作る'],['発展','ネザライト装備を揃える']];
const SCHEMA={
 worlds:{label:'ワールド',fields:[['name','ワールド名','text','マイワールド',true],['edition','エディション','select',['Java版','統合版（Bedrock）']],['mode','ゲームモード','select',['サバイバル','クリエイティブ','ハードコア','アドベンチャー']],['seed','シード値','text','任意'],['version','バージョン','text','例：1.21'],['note','メモ','textarea','ワールドの特徴など']]},
 coords:{label:'座標',fields:[['name','場所の名前（必須）','text','例：天空トラップ・新拠点・仕分け装置',true],['dimension','ディメンション','select',['オーバーワールド','ネザー','エンド']],['category','種類','select',['拠点','建造物','装置','大型装置','村','構造物','スポナー','バイオーム','スライムチャンク','洞窟・資源','ポータル','その他']],['x','X座標','number','0',true],['y','Y座標','number','64',true],['z','Z座標','number','0',true],['note','メモ','textarea','目印・行き方など']]},
 projects:{label:'建築・タスク',fields:[['name','名称','text','例：自動仕分け倉庫',true],['type','種類','select',['建築','探索','整地','装置','その他']],['status','ステータス','select',['未着手','進行中','完了']],['priority','優先度','select',['低','中','高']],['progress','進捗（0〜100%）','number','0'],['location','建築場所・座標','text','例：X 120, Y 70, Z -30'],['materials','必要な資材','textarea','石 256個、ガラス 64個など'],['note','作業メモ','textarea','次にやることなど']]},
 items:{label:'資材',fields:[['name','アイテム名','text','例：丸石',true],['category','分類','select',['ブロック','鉱石・インゴット','木材','レッドストーン','農作物','モブドロップ','その他']],['qty','現在の個数','number','0',true],['target','目標個数','number','64'],['location','保管場所','text','例：拠点の倉庫A'],['note','メモ','textarea','入手方法など']]},
 villagers:{label:'村人',fields:[['name','名前・識別名','text','例：司書A',true],['profession','職業','select',['司書','農民','防具鍛冶','道具鍛冶','武器鍛冶','聖職者','製図家','矢師','漁師','革細工師','肉屋','羊飼い','石工','無職','その他']],['level','取引レベル','select',['新米','見習い','一人前','熟練者','達人']],['trade','注目の取引','text','例：修繕のエンチャント本'],['price','取引価格・条件','text','例：エメラルド 20個'],['location','居場所・座標','text','例：交易所 X 100 Y 65 Z 20'],['note','メモ','textarea','固定取引・補充状況など']]},
 farms:{label:'トラップ・装置',fields:[['name','装置名','text','例：アイアンゴーレムトラップ',true],['type','種類','select',['経験値','アイテム回収','農場','村人関連','レッドストーン','その他']],['status','稼働状況','select',['計画中','建設中','稼働中','停止中']],['output','入手資源・効率','text','例：鉄インゴット 約300個/時'],['location','座標・設置場所','text','例：X 100 Y 80 Z 200'],['note','メンテナンスメモ','textarea','改善点など']]},
 goals:{label:'目標',fields:[['name','目標名','text','例：ウィザー討伐',true],['category','カテゴリ','select',['序盤','ネザー','エンド','発展','建築','自由目標']],['note','メモ','textarea','達成条件など']]}
};
const RECIPE={hopper:{name:'ホッパー',out:1,items:[['鉄インゴット',5],['チェスト',1]]},chest:{name:'チェスト',out:1,items:[['板材',8]]},furnace:{name:'かまど',out:1,items:[['丸石',8]]},piston:{name:'ピストン',out:1,items:[['板材',3],['丸石',4],['鉄インゴット',1],['レッドストーンダスト',1]]},observer:{name:'オブザーバー',out:1,items:[['丸石',6],['レッドストーンダスト',2],['ネザークォーツ',1]]},rail:{name:'レール',out:16,items:[['鉄インゴット',6],['棒',1]]},powered:{name:'パワードレール',out:6,items:[['金インゴット',6],['棒',1],['レッドストーンダスト',1]]},shulker:{name:'シュルカーボックス',out:1,items:[['シュルカーの殻',2],['チェスト',1]]},anvil:{name:'金床',out:1,items:[['鉄ブロック',3],['鉄インゴット',4]]},torch:{name:'松明',out:4,items:[['石炭 または 木炭',1],['棒',1]]}};
// MC BASE v3.0: shared machine plans and equipment enchantment presets.
const MACHINE_TEMPLATES={
 furnace:{name:'🔥 大型自動かまどアレイ',unit:'かまど台数',blurb:'入力・燃料・完成品を各ラインで自動搬送する並列かまど。',core:[['足場用ブロック',8],['レッドストーントーチ（任意）',0]],each:[['かまど',1],['ホッパー',3],['チェスト',3],['足場用ブロック',4]],steps:n=>[
 `幅に余裕を取り、${n}台のかまどを横一列に、1ブロックずつ操作できる向きで設置する。`,
 '各かまどの下に、完成品を引き出すホッパーを付け、その先に排出先チェストを置く。',
 '各かまどの上から素材投入用ホッパーを接続し、各ホッパーの上に素材チェストを置く。',
 '各かまどの側面に燃料投入用ホッパーを接続し、その上流に燃料チェストを設置する。',
 '燃料と精錬可能な素材を1台に入れ、上下・横のホッパーの向きと排出を試験する。',
 '正常に動いたら全台に材料を投入。チェストの整理と負荷を確認する。'
 ],caution:'各台に独立チェスト3個を用意する概算構成です。共有チェスト・高速ホッパー搬送を作る場合は回路と素材数が変わります。'},
 cane:{name:'🎋 大型サトウキビ自動農場',unit:'栽培マス数',blurb:'オブザーバーで成長を検知し、ピストンで上段を折る横一列の基本構想。',core:[['チェスト',1],['ホッパー',1],['水バケツ',2],['ガラス',16]],each:[['土または砂',1],['サトウキビ',1],['ピストン',1],['オブザーバー',1],['レッドストーンダスト',2],['ガラス',3],['建築用ブロック',3]],steps:n=>[
 `水に隣接する土または砂を${n}マス横一列に並べ、サトウキビを植える。`,
 'サトウキビの2段目に向けてピストンを後方から設置し、1段目は残せる高さにする。',
 '3段目の成長を観測するようオブザーバーの「顔」を作物へ向けて置く。',
 'オブザーバー出力を、ピストンと干渉しない位置に置いた固体ブロック上の赤石配線でピストンに伝える。',
 '前面に水流を設置して収穫物をホッパー・チェストへ送る。飛散防止ガラスを置く。',
 'まず1マスで成長検知・押し出し・収集を確認し、残りを接続する。信号の伝搬距離に注意する。'
 ],caution:'赤石の配線数・水流の長さは区画配置で変わるため概算。赤石信号の減衰に応じてリピーター等を追加してください。Java版と統合版で要検証。'},
 bamboo:{name:'🎍 大型竹自動農場',unit:'栽培マス数',blurb:'成長監視→ピストン収穫→ホッパー搬送を組み合わせる基本設計。',core:[['チェスト',1],['ホッパー',1],['ガラス',16]],each:[['土・草ブロックなど',1],['竹',1],['ピストン',1],['オブザーバー',1],['レッドストーンダスト',2],['ガラス',3],['建築用ブロック',3]],steps:n=>[
 `竹を植えられる床を${n}マス並べ、竹を1本ずつ植える。`,
 '成長しても根元を残せる高さの横位置にピストンを向ける。',
 '監視する竹が伸びた時に変化を検知できる向きにオブザーバーを置く。',
 'ピストンに信号を送る赤石配線を移動ブロックと干渉しない位置に施工する。',
 '前面に収穫物を導く回収水路または代替回収装置を設け、ホッパーをチェストに接続する。',
 '1列だけで動作試験後、列を拡張する。ロード範囲外では作物が育たない点にも注意する。'
 ],caution:'収集水路と段差の資材は地形で変わります。水流・統合版の赤石挙動は現地で検証してください。'},
 melon:{name:'🎃 カボチャ・スイカ自動収穫列',unit:'収穫マス数',blurb:'実が生成される位置を監視して自動で壊す収穫装置。',core:[['チェスト',1],['ホッパー',1],['水バケツ',1],['ガラス',12]],each:[['耕地用の土',1],['種（カボチャ/スイカ）',1],['ピストン',1],['オブザーバー',1],['レッドストーンダスト',2],['建築用ブロック',4]],steps:n=>[
 `耕地${n}マスと隣接する実の成長用の空きマスを確保し、植え付ける。`,
 '実が育つ位置を確保し、ピストンの押出方向を実が生成されるマスに向ける。',
 '実の生成を検知するオブザーバーを設置し、赤石でピストンへ接続する。',
 '実が壊れた時のアイテムを水路またはホッパー付きトロッコで収集し、チェストに送る。',
 '成長用の明るさと水源を確認し、1ユニットで動作テストしてから拡張する。'
 ],caution:'実の成長方向や検知方式・ホッパー付きトロッコの採用で構造が変わります。回収ラインの必要量は別途積算してください。'},
 sorter:{name:'📦 大型アイテム自動仕分け倉庫',unit:'仕分けアイテム種類',blurb:'ホッパーのアイテムフィルタで単一種を分別する倉庫設計。',core:[['入力チェスト',1],['輸送用ホッパー',4],['建築用ブロック',16]],each:[['ホッパー',2],['チェスト',1],['レッドストーンコンパレーター',1],['レッドストーンリピーター',1],['レッドストーントーチ',1],['レッドストーンダスト',3],['建築用ブロック',8],['フィルタ用アイテム（仮）',45]],steps:n=>[
 `仕分けたい${n}種類のアイテムを決め、各種類1列の収納チェスト・ホッパーを設置する。`,
 '各列に、搬送ラインからアイテムを受け取るフィルタ用ホッパーを配置する。',
 'フィルタ用ホッパーをコンパレーターで読み取り、リピーター・赤石トーチとダストで指定した個数の時だけ搬送する回路を作る。',
 'フィルタホッパーに対象アイテムと専用の名前を付けたダミーアイテムを必要数投入する。',
 '入力チェストから上流のホッパー搬送ラインをつなぎ、末端に未分類品の回収箱を置く。',
 '最初の1列で混合アイテムを流して漏れ・詰まり・隣接干渉がないかテスト後に増設する。'
 ],caution:'フィルタ用アイテム45個は標準例の仮置きで、フィルタ回路・スタック数（16/64）によって変動します。回路と素材数は概算です。'},
 village:{name:'👨‍🌾 大型村人交易ホール',unit:'村人ブース数',blurb:'職業ブロックと通路を整備する交易所の設計案（自動交易ではありません）。',core:[['照明（松明など）',12],['入口用ドア',2],['柵・安全扉',2]],each:[['職業ブロック（例：書見台）',1],['建築用ブロック',28],['ガラス',4],['照明',2],['床用ブロック',8]],steps:n=>[
 `村人${n}人分の1×2程度のブースと通路を設計し、壁・屋根と照明を設置する。`,
 '脱走・敵モブ侵入防止の安全な入口を付ける。',
 '各ブースで村人が職業ブロックにアクセスできる位置を確保する。',
 '村人を1人ずつ搬入し、望む職業・取引が成立するか確認する。',
 '交易画面を開ける通路を作り、名前や取引内容を「村人・取引管理」に記録する。',
 'ベッド・職業ブロックの紐づけや補充頻度を、エディションごとに検証する。'
 ],caution:'村人の職業・補充条件・ベッド/職業ブロックの紐付けはJava版と統合版で異なります。搬送用の線路等は含まず、建材は設計用概算。'},
 gold:{name:'🧰 大型ホッパー回収ライン',unit:'回収ポイント数',blurb:'複数地点のドロップをホッパー経由で中央のチェストへまとめる基本構成。',core:[['チェスト',2],['建築用ブロック',8]],each:[['ホッパー',2],['建築用ブロック',3],['ガラス',2]],steps:n=>[
 `回収地点${n}か所を中央チェストへつなぐ経路を作る。`,
 '各回収地点にドロップを受け取るホッパーを置き、出口が隣のホッパー/チェストを向くようにする。',
 'ホッパーの数を確認して直列または分岐構成にし、必要な足場を作る。',
 '中央に回収チェストを設置し、ゴミ詰まりを防ぐ収納余裕を用意する。',
 '各地点から1個ずつアイテムを投入し、全地点から正しく搬送されるか確認する。'
 ],caution:'2ホッパー/ポイントは短距離の仮定です。回収地点が遠い場合は距離分のホッパーや水流輸送の材料を加算してください。'}
};
let machineDraft={type:'furnace',units:8,name:'',note:''},machineEditing=null;
function makeMachinePlan(input){const tpl=MACHINE_TEMPLATES[input.type]||MACHINE_TEMPLATES.furnace;const n=Math.floor(clamp(input.units,1,64));const counts=new Map();for(const [name,qty] of tpl.core)counts.set(name,(counts.get(name)||0)+qty);for(const [name,qty] of tpl.each)counts.set(name,(counts.get(name)||0)+qty*n);const materials=[...counts].filter(x=>x[1]>0).map(([name,qty])=>({name,qty}));return {type:input.type,units:n,name:input.name?.trim()||tpl.name,note:input.note?.trim()||'',materials,steps:tpl.steps(n),caution:tpl.caution,summary:tpl.blurb};}
function materialCompare(m){const stored=records('items').find(x=>x.name?.trim()===m.name);return stored?`<span class="${Number(stored.qty)<m.qty?'pill hot':'pill done'}">${Number(stored.qty)<m.qty?`不足 ${fmtNum(m.qty-Math.max(0,Number(stored.qty)||0))}個`:'在庫あり'}</span>`:'<span class="pill low">在庫未登録</span>';}
function machineDetails(plan){return `<div class="machine-note">${H(plan.summary||'保存した装置設計')}<br>${H(plan.caution||'設計用概算です。現地で必ず動作テストしてください。')}</div><div class="machine-two"><div><h3>📦 必要素材（設計用概算）</h3><div class="machine-table">${plan.materials.map(m=>`<div class="machine-material"><span>${H(m.name)}<small>${fmtNum(Math.floor(m.qty/64))}スタック＋${m.qty%64}個（64換算）</small></span><strong>${fmtNum(m.qty)}個</strong>${materialCompare(m)}</div>`).join('')}</div></div><div><h3>🧱 作り方・施工手順</h3><ol class="machine-steps">${plan.steps.map(t=>`<li>${H(t)}</li>`).join('')}</ol></div></div><p class="hint">※ 装置の効率や動作を保証する完成済み設計図ではありません。バージョン・赤石挙動・回収経路・周辺施設によって追加素材が必要です。</p>`;}
function machinePreview(){const el=document.getElementById('machinePreview');if(!el)return;const plan=makeMachinePlan(machineDraft);el.innerHTML=`<h3>${H(plan.name)} <span class="pill">${plan.units}${H(MACHINE_TEMPLATES[plan.type].unit)}</span></h3>${machineDetails(plan)}<div class="actions" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px"><button class="btn primary" data-action="save-machine">${machineEditing?'設計を更新':'設計案を共有保存'}</button><button class="btn" data-action="copy-draft-machine">📋 設計案をコピー</button>${machineEditing?'<button class="btn ghost" data-action="new-machine">新しい設計に戻す</button>':''}</div>`;}
function machines(){if(!getWorld())return pageGuard();const tpl=MACHINE_TEMPLATES[machineDraft.type]||MACHINE_TEMPLATES.furnace,saved=records('blueprints');return `${heading('大型装置の設計・素材計算','装置と規模を指定してレシピ・施工手順を作成。設計案は管理人が共有保存でき、閲覧者も確認できます。')}
<section class="panel machine-editor"><div class="panel-head"><h3>⚙️ 装置レシピ考案</h3><span class="pill blue">${H(getWorld()?.edition||'Java版')}</span></div><div class="machine-form"><div class="field"><label for="machineType">装置の種類</label><select id="machineType">${Object.entries(MACHINE_TEMPLATES).map(([id,t])=>`<option value="${id}" ${id===machineDraft.type?'selected':''}>${H(t.name)}</option>`).join('')}</select></div><div class="field"><label for="machineUnits">${H(tpl.unit)}（1〜64）</label><input id="machineUnits" type="number" min="1" max="64" step="1" value="${machineDraft.units}"></div><div class="field"><label for="machineName">設計案の名前（保存時必須）</label><input id="machineName" maxlength="100" placeholder="例：新拠点 自動かまど32連" value="${H(machineDraft.name)}"></div><div class="field"><label for="machineNote">設計メモ</label><input id="machineNote" maxlength="400" placeholder="建設予定地、追加したい機能など" value="${H(machineDraft.note)}"></div></div><div class="machine-preview" id="machinePreview"></div></section>
<section style="margin-top:24px"><h2 style="font-size:19px">📒 共有保存した設計案 <span class="pill">${saved.length}件</span></h2><div class="cards">${saved.map(m=>`<article class="entry"><div class="entry-top"><div class="entry-title-wrap"><span class="entry-emoji">🏗️</span><div><h3>${H(m.name)}</h3><span class="pill blue">${H(MACHINE_TEMPLATES[m.type]?.unit||'ユニット')} ${fmtNum(m.units)}</span></div></div></div><p class="desc">${H(cut(m.note||MACHINE_TEMPLATES[m.type]?.blurb||'',120))}</p><small class="hint">必要素材 ${m.materials?.length||0} 種類 / 手順 ${m.steps?.length||0} 工程</small><div class="actions"><button class="btn sm" data-action="view-machine" data-id="${H(m.id)}">内容を見る</button><button class="btn sm" data-action="copy-machine" data-id="${H(m.id)}">コピー</button><button class="btn sm" data-action="edit-machine" data-id="${H(m.id)}">再編集</button><button class="btn sm" data-action="project-machine" data-id="${H(m.id)}">建築タスクに追加</button><button class="btn sm danger" data-action="delete-machine" data-id="${H(m.id)}">削除</button></div></article>`).join('')||'<div class="empty"><div class="art">📒</div><h3>保存済みの設計案はありません</h3><p>上の設計案を管理人が保存すると、招待ユーザーへ同期されます。</p></div>'}</div></section><div id="machineDetailPanel"></div>`;}
function takeMachineInputs(){for(const [key,id] of [['type','machineType'],['name','machineName'],['note','machineNote']]){const el=document.getElementById(id);if(el)machineDraft[key]=el.value;}const n=document.getElementById('machineUnits');if(n&&n.value.trim())machineDraft.units=Math.floor(clamp(n.value,1,64));}
function getMachine(id){return records('blueprints').find(x=>x.id===id);}
function formatMachine(plan){return `${plan.name}\n【必要素材（目安）】\n${plan.materials.map(m=>`${m.name}：${m.qty}個`).join('\n')}\n【作り方】\n${plan.steps.map((s,i)=>`${i+1}. ${s}`).join('\n')}\n【注意】${plan.caution||'バージョン別に動作検証してください。'}\n${plan.note||''}`;}
function saveMachine(){if(!isOwner())return toast('共有保存は管理人のみです。');takeMachineInputs();if(!machineDraft.name.trim())return toast('設計案の名前を入力してください。');const plan=makeMachinePlan(machineDraft);if(machineEditing){const target=getMachine(machineEditing);if(!target)return toast('保存先が見つかりません。');Object.assign(target,plan,{updatedAt:today()});}else{db.blueprints.unshift({...plan,id:makeId(),worldId:db.selectedWorld,createdAt:today()});}recordActivity(`大型装置「${plan.name}」の設計案を保存`);save();machineEditing=null;machineDraft={type:machineDraft.type,units:machineDraft.units,name:'',note:''};render();toast('設計案を共有保存しました。');}
function showMachine(id){const m=getMachine(id),el=document.getElementById('machineDetailPanel');if(!m||!el)return;el.innerHTML=`<section class="panel machine-preview" style="margin-top:20px"><div style="display:flex;justify-content:space-between;align-items:center"><h2 style="font-size:18px">📒 ${H(m.name)}（保存済み）</h2><button class="btn sm" data-action="close-machine">閉じる</button></div>${machineDetails(m)}</section>`;el.scrollIntoView({block:'start',behavior:'smooth'});}
function deleteMachine(id){if(!isOwner())return toast('管理人のみ削除できます。');const x=getMachine(id);if(!x||!confirm(`設計案「${x.name}」を削除しますか？`))return;db.blueprints=db.blueprints.filter(x=>x.id!==id);recordActivity(`設計案「${x.name}」を削除`);save();render();toast('削除しました。');}
function machineToProject(id){if(!isOwner())return toast('管理人のみ追加できます。');const x=getMachine(id);if(!x||!confirm(`「${x.name}」を建築タスクに追加しますか？`))return;db.projects.unshift({id:makeId(),worldId:db.selectedWorld,name:x.name,type:'装置',status:'未着手',priority:'中',progress:0,location:'',materials:x.materials.map(m=>`${m.name} ${m.qty}個`).join('\n'),note:`【設計案の注意】\n${x.caution||''}\n${x.steps.map((t,i)=>`${i+1}. ${t}`).join('\n')}`,createdAt:today()});recordActivity(`設計案「${x.name}」を建築タスクへ登録`);save();toast('建築タスクに登録しました。');}
const ENCHANT_LIST=[
 {id:'helmet',category:'防具',icon:'🪖',name:'ヘルメット / カメの甲羅',desc:'水中探索も考えた汎用装備',general:['ダメージ軽減 IV','耐久力 III','修繕 I','水中呼吸 III','水中採掘 I'],other:['爆発耐性 IV（ダメージ軽減と排他）','棘の鎧 III（任意）'],tip:'耐性系4種類は併用不可。水中呼吸・水中採掘はヘルメット系専用。'},
 {id:'chest',category:'防具',icon:'🛡️',name:'チェストプレート',desc:'一般的な耐久・防御優先',general:['ダメージ軽減 IV','耐久力 III','修繕 I'],other:['爆発耐性 IV（専用耐性に置換）','棘の鎧 III（任意）'],tip:'ダメージ軽減と火炎耐性・爆発耐性・飛び道具耐性は同時に付けられません。'},
 {id:'legs',category:'防具',icon:'👖',name:'レギンス',desc:'スニーク移動も強化',general:['ダメージ軽減 IV','耐久力 III','修繕 I','スニーク速度上昇 III'],other:['火炎耐性 IV（専用耐性に置換）'],tip:'スニーク速度上昇はレギンス専用の宝物エンチャント。'},
 {id:'boots',category:'防具',icon:'🥾',name:'ブーツ',desc:'落下と移動性能を重視',general:['ダメージ軽減 IV','耐久力 III','修繕 I','落下耐性 IV','水中歩行 III','ソウルスピード III'],other:['氷渡り II（水中歩行と排他）','爆発耐性 IV（ダメージ軽減に置換）'],tip:'水中歩行と氷渡りは競合します。ソウルスピードは別枠で併用可能。'},
 {id:'pick',category:'道具',icon:'⛏️',name:'ツルハシ',desc:'鉱石回収向け',general:['効率強化 V','耐久力 III','修繕 I','幸運 III'],other:['効率強化 V','耐久力 III','修繕 I','シルクタッチ I'],tip:'幸運とシルクタッチは競合。2本作るのがおすすめ。'},
 {id:'shovel',category:'道具',icon:'🪏',name:'シャベル',desc:'広範囲の整地用',general:['効率強化 V','耐久力 III','修繕 I','シルクタッチ I'],other:['効率強化 V','耐久力 III','修繕 I','幸運 III'],tip:'砂利から火打石を集めたい場合は幸運 III が便利。'},
 {id:'axe',category:'道具',icon:'🪓',name:'斧',desc:'木材伐採・戦闘の兼用',general:['効率強化 V','耐久力 III','修繕 I','シルクタッチ I'],other:['効率強化 V','耐久力 III','修繕 I','幸運 III'],tip:'戦闘向け斧ではダメージ増加・アンデッド特効・虫特効から1つ選びます。'},
 {id:'hoe',category:'道具',icon:'🌾',name:'クワ',desc:'畑作りとブロック採取',general:['効率強化 V','耐久力 III','修繕 I','幸運 III'],other:['効率強化 V','耐久力 III','修繕 I','シルクタッチ I'],tip:'幸運とシルクタッチは競合。葉・作物の用途で選択。'},
 {id:'shears',category:'道具',icon:'✂️',name:'ハサミ',desc:'葉や羊毛の回収',general:['効率強化 V','耐久力 III','修繕 I'],other:['耐久力 III','修繕 I'],tip:'ハサミのエンチャント方法・適用できる種類は版やバージョンで確認。'},
 {id:'brush',category:'道具',icon:'🖌️',name:'ブラシ',desc:'考古学の発掘用',general:['耐久力 III','修繕 I'],other:['耐久力 III'],tip:'摩耗を抑えるための構成です。'},
 {id:'sword',category:'武器',icon:'⚔️',name:'剣',desc:'普段使いの主力武器',general:['ダメージ増加 V','ドロップ増加 III','耐久力 III','修繕 I','火属性 II','ノックバック II（任意）','範囲ダメージ増加 III（Java版のみ）'],other:['アンデッド特効 V','ドロップ増加 III','耐久力 III','修繕 I','火属性 II'],tip:'ダメージ増加/アンデッド特効/虫特効は競合。火属性は肉の調達に便利。'},
 {id:'spear',category:'武器',icon:'🔱',name:'槍（1.21.11以降相当）',desc:'2025年追加の突進エンチャントに対応',general:['ダメージ増加 V','ドロップ増加 III','火属性 II','突進（Lunge） III','耐久力 III','修繕 I'],other:['アンデッド特効 V','突進（Lunge） III','耐久力 III','修繕 I'],tip:'槍は範囲ダメージ増加を付与できません。突進は空腹度を消費します。'},
 {id:'bow',category:'武器',icon:'🏹',name:'弓',desc:'普段使いと長距離射撃',general:['射撃ダメージ増加 V','無限 I','耐久力 III','フレイム I','パンチ II（任意）'],other:['射撃ダメージ増加 V','修繕 I','耐久力 III','フレイム I'],tip:'無限と修繕は同時に付けられません。無限でも矢を1本は持つ必要があります。'},
 {id:'crossbow',category:'武器',icon:'🎯',name:'クロスボウ',desc:'複数敵や貫通射撃',general:['拡散 I','高速装填 III','耐久力 III','修繕 I'],other:['貫通 IV','高速装填 III','耐久力 III','修繕 I'],tip:'拡散と貫通は競合。状況に応じた2本持ちも有効。'},
 {id:'trident',category:'武器',icon:'🔱',name:'トライデント',desc:'遠距離攻撃と帰還用',general:['串刺し V','忠誠 III','召雷 I','耐久力 III','修繕 I'],other:['串刺し V','激流 III','耐久力 III','修繕 I'],tip:'激流と忠誠・召雷は競合。激流は雨天・水中移動に便利。'},
 {id:'mace',category:'武器',icon:'🔨',name:'メイス',desc:'落下攻撃に特化',general:['重撃（Density） V','ウィンドバースト III','耐久力 III','修繕 I'],other:['防具貫通（Breach） IV','ウィンドバースト III','耐久力 III','修繕 I'],tip:'重撃と防具貫通は競合。ウィンドバーストは主にトライアルチャンバーの報酬などから入手。'},
 {id:'elytra',category:'移動・その他',icon:'🪽',name:'エリトラ',desc:'長距離飛行に使う装備',general:['耐久力 III','修繕 I'],other:['耐久力 III'],tip:'飛行中の耐久消耗があるため修繕は非常に重要。'},
 {id:'fishing',category:'移動・その他',icon:'🎣',name:'釣り竿',desc:'釣りの効率重視',general:['宝釣り III','入れ食い III','耐久力 III','修繕 I'],other:['入れ食い III','耐久力 III','修繕 I'],tip:'宝釣りは宝アイテム、入れ食いはヒットまでの待ち時間を改善。'},
 {id:'shield',category:'移動・その他',icon:'🛡️',name:'盾',desc:'攻撃の防御用',general:['耐久力 III','修繕 I'],other:['耐久力 III'],tip:'盾のエンチャントは金床などによる付与が中心です。'}
];
let enchantFilter='すべて',enchantMode='general';
function enchants(){const list=ENCHANT_LIST.filter(x=>enchantFilter==='すべて'||x.category===enchantFilter);return `${heading('装備別おすすめエンチャント','武器・防具・道具ごとの推奨構成。用途特化に切り替え、競合エンチャントを確認できます。')}<div class="panel enchant-controls"><label>装備カテゴリ<select id="enchantCategory">${['すべて','防具','道具','武器','移動・その他'].map(s=>`<option value="${H(s)}" ${s===enchantFilter?'selected':''}>${H(s)}</option>`).join('')}</select></label><label>構成タイプ<select id="enchantMode"><option value="general" ${enchantMode==='general'?'selected':''}>普段使い・おすすめ</option><option value="other" ${enchantMode==='other'?'selected':''}>用途特化・代替案</option></select></label><span class="pill blue">${list.length}装備</span></div><p class="hint">適用できるエンチャントはバージョンとJava/統合版で異なることがあります。競合する候補は同時に付けず、片方を選んでください。</p><div class="cards enchant-cards">${list.map(e=>{const current=enchantMode==='other'?e.other:e.general;return `<article class="entry"><div class="entry-top"><div class="entry-title-wrap"><span class="entry-emoji">${e.icon}</span><div><h3>${H(e.name)}</h3><span class="pill">${H(e.category)}</span></div></div></div><p class="desc">${H(e.desc)}</p><div class="enchant-tags">${current.map(t=>`<span class="enchant-tag">✦ ${H(t)}</span>`).join('')}</div><p class="machine-note">${H(e.tip)}</p><div class="actions"><button class="btn sm" data-action="copy-enchant" data-id="${H(e.id)}">📋 構成をコピー</button></div></article>`;}).join('')}</div><p class="help">参考：<a href="https://help.minecraft.net/hc/en-us/articles/360058730912" target="_blank" rel="noopener noreferrer">Minecraft公式エンチャント一覧</a> / <a href="https://www.minecraft.net/en-us/article/minecraft-java-edition-1-21-11" target="_blank" rel="noopener noreferrer">槍と突進の公式仕様</a>。Minecraft本体の装備状態を自動取得するものではありません。</p>`;}

const makeId=()=> (typeof crypto!=='undefined'&&crypto.randomUUID)?crypto.randomUUID():'id_'+Date.now()+'_'+Math.random().toString(36).slice(2);
const H=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const today=()=>new Date().toISOString();
function defaultState(){const id=makeId();return {version:3,selectedWorld:id,worlds:[{id,name:'マイワールド',edition:'Java版',mode:'サバイバル',seed:'',version:'',note:'',createdAt:today()}],coords:[],projects:[],items:[],villagers:[],farms:[],blueprints:[],goals:DEFAULT_GOALS.map(([category,name])=>({id:makeId(),worldId:id,category,name,note:'',done:false,createdAt:today()})),activity:[]};}
function normalize(src){if(!src||typeof src!=='object'||Array.isArray(src)||!Array.isArray(src.worlds))throw Error('バックアップ形式が正しくありません。');const d={version:3,selectedWorld:src.selectedWorld,worlds:[],coords:[],projects:[],items:[],villagers:[],farms:[],blueprints:[],goals:[],activity:[]};for(const k of Object.keys(d)){if(Array.isArray(d[k]))d[k]=Array.isArray(src[k])?src[k].filter(x=>x&&typeof x==='object'&&!Array.isArray(x)):[];}d.worlds=d.worlds.filter(x=>typeof x.id==='string'&&typeof x.name==='string');const valid=new Set(d.worlds.map(x=>x.id));for(const k of ['coords','projects','items','villagers','farms','blueprints','goals'])d[k]=d[k].filter(x=>typeof x.id==='string'&&valid.has(x.worldId));if(!valid.has(d.selectedWorld))d.selectedWorld=d.worlds[0]?.id||null;d.activity=d.activity.slice(-100);return d;}
let db;try{const raw=localStorage.getItem(KEY);db=raw?normalize(JSON.parse(raw)):defaultState();}catch(e){db=defaultState();}
let page='dashboard', query='',filter='all',editing=null,modalKind=null,activeToast=null,mobileMoreOpen=false;
let cloud=null,session=null,activeWorkspace=null,workspaces=[],saving=false,dirty=false,savingTimer=null,cloudChannel=null,cloudPoll=null,initializedUid=null,accessInitialized=false,viewerList=[],inviteList=[],blockedList=[],pendingList=[];
let mapCenterX=0,mapCenterZ=0,mapCell=27,mapDrag=null;
let worldImportDraft=null,pendingFolderHandle=null,linkedFolder=null,folderWatchTimer=null,folderWatchBusy=false;
const isOwner=()=>!!session&&!!activeWorkspace&&activeWorkspace.owner_id===session.user.id;

let converter={x:128,z:-240,source:'オーバーワールド',stackQty:141,stackSize:64,recipe:'hopper',recipeQty:16};
const getWorld=()=>db.worlds.find(x=>x.id===db.selectedWorld);
const records=(kind)=>db[kind].filter(x=>x.worldId===db.selectedWorld);
const fmtNum=n=>Number(n||0).toLocaleString('ja-JP');
const valNum=n=>Math.max(0,Number(n)||0);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,Number(v)||0));
const cut=(s,n=80)=>String(s||'').length>n?String(s).slice(0,n)+'…':String(s||'');
const dateShort=s=>{try{return new Date(s).toLocaleDateString('ja-JP',{month:'numeric',day:'numeric'});}catch{return ''}};
function save(){if(!isOwner()){sessionStorage.setItem('mc_view_world',db.selectedWorld||'');return true;}scheduleCloudSave();return true;}
function recordActivity(msg){db.activity.push({worldId:db.selectedWorld,text:msg,date:today()});db.activity=db.activity.slice(-100);}
function toast(s){const e=document.getElementById('toast');e.textContent=s;e.classList.add('show');clearTimeout(activeToast);activeToast=setTimeout(()=>e.classList.remove('show'),3100);}
function changePage(p){page=p;query='';filter='all';mobileMoreOpen=false;render();window.scrollTo({top:0,behavior:'instant'});}
function worldOptions(){document.getElementById('worldSelect').innerHTML=db.worlds.length?db.worlds.map(w=>`<option value="${H(w.id)}" ${w.id===db.selectedWorld?'selected':''}>${H(w.name)}</option>`).join(''):'<option value="">ワールドなし</option>';}
function renderNav(){const count={coords:records('coords').length,projects:records('projects').length,items:records('items').length,villagers:records('villagers').length,farms:records('farms').length,machines:records('blueprints').length};document.getElementById('sideNav').innerHTML=PAGES.map(([id,ic,label],i)=>`${id==='dashboard'||id==='machines'?`<div class="nav-label">${id==='dashboard'?'OVERVIEW':'PLANNING & TOOLS'}</div>`:''}<button class="nav-item ${page===id?'active':''}" data-page="${id}"><span class="n-icon">${ic}</span><span>${label}</span>${count[id]!=null?`<span class="n-count">${count[id]}</span>`:''}</button>`).join('');const mobile=[['dashboard','🏡','ホーム'],['coords','📍','座標'],['projects','🧱','建築'],['items','📦','資材'],['worlds','🌍','ワールド'],['more','☰','その他']];document.getElementById('mobileNav').innerHTML=mobile.map(([id,ic,label])=>`<button ${id==='more'?'data-action="mobile-more"':`data-page="${id}"`} class="${page===id?'active':''}"><span>${ic}</span>${label}</button>`).join('');const extra=['realms','live','villagers','farms','goals','machines','enchants','tools','map','atlas','demo','unichat','device','settings','worlds'];const menu=document.getElementById('mobileMore');menu.classList.toggle('open',mobileMoreOpen);menu.innerHTML=extra.map(id=>{const p=PAGES.find(x=>x[0]===id);return `<button data-page="${id}" class="${page===id?'active':''}">${p[1]} ${p[2]}</button>`}).join('');}
function heading(title,desc,btn=''){return `<div class="header-row"><div><div class="eyebrow">MC BASE / ${H(page.toUpperCase())}</div><h1 class="page-title">${title}</h1><p class="sub">${desc}</p></div>${btn}</div>`}
function newBtn(kind,text='新規登録'){return `<button class="btn primary" data-action="new" data-kind="${kind}">＋ ${text}</button>`;}
function empty(msg,emoji='📭',kind=''){return `<div class="empty"><div class="art">${emoji}</div><h3>${msg}</h3><p>データを追加すると、ここに一覧が表示されます。<br>管理人の変更はクラウドに自動保存されます。</p>${kind?newBtn(kind,'最初の1件を追加'):''}</div>`;}
function pageGuard(){return db.worlds.length?'':`${heading('ワールドを作成しましょう','各種データはワールドごとに独立して管理されます。') }<div class="no-world"><div style="font-size:50px">🌱</div><h3>新しい冒険の準備</h3><p>ワールドを登録すると、座標・資材・建築・村人などの管理が始められます。</p>${newBtn('worlds','ワールドを作成')}</div>`;}
function stat(title,value,foot,icon){return `<div class="stat"><div class="title">${title}</div><strong class="value">${value}</strong><small class="foot">${foot}</small><span class="stat-icon">${icon}</span></div>`;}
function pct(v){return `<div class="meter"><i style="width:${clamp(v,0,100)}%"></i></div>`;}
function dashboard(){if(!getWorld())return pageGuard();const w=getWorld(),p=records('projects'),g=records('goals'),c=records('coords'),f=records('farms');const finished=p.filter(x=>x.status==='完了').length,done=g.filter(x=>x.done).length,rate=g.length?Math.round(done/g.length*100):0,prog=p.length?Math.round(p.reduce((a,x)=>a+clamp(x.progress,0,100),0)/p.length):0;const recent=db.activity.filter(x=>x.worldId===w.id).slice(-5).reverse();return `<div class="hero"><div class="hero-copy"><span class="tag">✦ YOUR MINECRAFT COMMAND CENTER</span><h2>あなたのワールドを、<br>もっと冒険しやすく。</h2><p>建築、資材、村人、座標。冒険の記録をひとつの場所に。</p><div class="hero-stats"><span><strong>${H(w.name)}</strong>現在のワールド</span><span><strong>${H(w.edition||'未設定')}</strong>エディション</span></div></div><div class="blockart" aria-hidden="true"><div class="block a"></div><div class="block b"></div><div class="block c"></div><span class="spark">✦</span></div></div>
<div class="stats">${stat('登録した座標',fmtNum(c.length),'拠点や構造物の場所','📍')}${stat('建築・タスク',fmtNum(p.length),`完了 ${finished} 件`,'🧱')}${stat('資材の種類',fmtNum(records('items').length),'在庫をチェック','📦')}${stat('稼働中の装置',fmtNum(f.filter(x=>x.status==='稼働中').length),`登録した装置 ${f.length} 件`,'🌾')}</div>
<div class="twocol"><section class="panel"><div class="panel-head"><h3>⚡ クイックアクション</h3><small>よく使う機能へすぐ移動</small></div><div class="quick"><button data-action="new" data-kind="coords"><span>📍</span>座標を記録する</button><button data-action="new" data-kind="projects"><span>🧱</span>建築を追加する</button><button data-action="new" data-kind="items"><span>📦</span>資材を登録する</button><button data-page="machines"><span>🏭</span>装置レシピを考案</button><button data-page="enchants"><span>✨</span>エンチャント早見表</button><button data-page="tools"><span>🧮</span>ネザー座標変換</button><button data-page="device"><span>📲</span>スマホ・PC連携</button><button data-action="new" data-kind="villagers"><span>🧑‍🌾</span>村人を登録する</button><button data-action="new" data-kind="farms"><span>🌾</span>装置を記録する</button></div></section>
<section class="panel"><div class="panel-head"><h3>🏆 冒険の進捗</h3><button class="btn sm ghost" data-page="goals">目標を見る →</button></div><div class="progress-box"><div class="progress-top"><div class="ring" style="background:conic-gradient(#9de577 ${rate*3.6}deg,#294332 0)"><span>${rate}%</span></div><p><b>${done} / ${g.length} 件</b> の目標を達成！<br>チェックリストで冒険の<br>マイルストーンを管理。</p></div><div class="progress-mini"><div class="meter-label"><span>建築・タスクの平均進捗</span><b>${prog}%</b></div>${pct(prog)}</div></div></section></div>
<div class="twocol" style="margin-top:17px"><section class="panel"><div class="panel-head"><h3>🧱 進行中の建築・タスク</h3><button class="btn sm ghost" data-page="projects">すべて見る →</button></div><div class="recent-list">${p.filter(x=>x.status!=='完了').slice(0,4).map(x=>`<div class="recent-row"><span><b>${H(cut(x.name,28))}</b>　<span style="color:#9faea4">${H(x.status||'未着手')}</span></span><small>${clamp(x.progress,0,100)}%</small></div>`).join('')||'<p class="help">進行中のタスクはありません。</p>'}</div></section><section class="panel"><div class="panel-head"><h3>🕒 最近の操作</h3><small>直近の5件</small></div><div class="recent-list">${recent.map(x=>`<div class="recent-row"><span>${H(x.text)}</span><small>${dateShort(x.date)}</small></div>`).join('')||'<p class="help">操作すると、ここに履歴が表示されます。</p>'}</div></section></div>`;}
function toolbar(kind,more=''){return `<div class="toolbar"><div class="search"><input id="listSearch" value="${H(query)}" placeholder="名前・メモなどで検索"></div>${more}</div>`;}
function match(arr){const q=query.trim().toLocaleLowerCase();return arr.filter(x=>!q||Object.values(x).some(v=>String(v??'').toLocaleLowerCase().includes(q)));}
const buttons=(k,id)=>`<button class="btn sm" data-action="edit" data-kind="${k}" data-id="${H(id)}">編集</button><button class="btn sm danger" data-action="delete" data-kind="${k}" data-id="${H(id)}">削除</button>`;
function worlds(){return `${heading('ワールド管理','Java版・統合版、マルチサーバーなどをワールド別に管理できます。',newBtn('worlds','ワールドを追加'))}<div class="cards">${db.worlds.map(w=>{const wc=db.coords.filter(x=>x.worldId===w.id).length,wp=db.projects.filter(x=>x.worldId===w.id).length;return `<article class="entry"><div class="entry-top"><div class="entry-title-wrap"><div class="entry-emoji">🌍</div><div><h3>${H(w.name)}</h3><span class="pill ${w.id===db.selectedWorld?'done':''}">${w.id===db.selectedWorld?'● 選択中':H(w.edition||'Java版')}</span></div></div></div><div class="world-detail"><span>🎮 ${H(w.mode||'未設定')}</span><span>📍 ${wc} 地点</span><span>🧱 ${wp} タスク</span>${w.version?`<span>🔖 ${H(w.version)}</span>`:''}</div><p class="desc">${w.seed?`シード: ${H(w.seed)}\n`:''}${H(w.note||'')}</p><div class="actions"><button class="btn sm ${w.id===db.selectedWorld?'':'primary'}" data-action="select-world" data-id="${H(w.id)}">${w.id===db.selectedWorld?'選択中':'このワールドを開く'}</button>${buttons('worlds',w.id)}</div></article>`}).join('')||empty('ワールドがありません','🌱','worlds')}</div>`;}
function coords(){if(!getWorld())return pageGuard();const arr=match(records('coords').filter(x=>filter==='all'||x.dimension===filter));return `${heading('座標メモ','建造物・装置・トラップ・村などの座標を、必須の名前と種類付きで登録できます。',newBtn('coords','座標を追加'))}${toolbar('coords',`<select id="listFilter" class="filter"><option value="all">すべてのディメンション</option>${['オーバーワールド','ネザー','エンド'].map(s=>`<option ${filter===s?'selected':''}>${s}</option>`).join('')}</select>`)}<div class="cards">${arr.map(x=>`<article class="entry"><div class="entry-top"><div class="entry-title-wrap"><span class="entry-emoji">${x.dimension==='ネザー'?'🔥':x.dimension==='エンド'?'🌌':'📍'}</span><div><h3>${H(x.name)}</h3><span class="pill">${H(x.category||'その他')}</span></div></div><span class="pill blue">${H(x.dimension||'オーバーワールド')}</span></div><div class="meta">X: <b>${H(x.x)}</b>　Y: <b>${H(x.y)}</b>　Z: <b>${H(x.z)}</b></div><div class="desc">${H(x.note||'')}</div><div class="actions"><button class="btn sm" data-action="copy-coord" data-id="${H(x.id)}">📋 座標をコピー</button>${x.dimension!=='エンド'?`<button class="btn sm" data-action="convert-coord" data-id="${H(x.id)}">⇄ 座標変換</button>`:''}${buttons('coords',x.id)}</div></article>`).join('')||empty('座標が登録されていません','📍','coords')}</div>`;}
function projects(){if(!getWorld())return pageGuard();const arr=match(records('projects').filter(x=>filter==='all'||(x.status||'未着手')===filter));return `${heading('建築・タスク管理','工事の進捗や必要資材、座標を管理。進捗は10%単位でも更新できます。',newBtn('projects','タスクを追加'))}${toolbar('projects',`<select id="listFilter" class="filter"><option value="all">すべての状態</option>${['未着手','進行中','完了'].map(s=>`<option ${filter===s?'selected':''}>${s}</option>`).join('')}</select>`)}<div class="cards">${arr.map(x=>{const rate=clamp(x.progress,0,100);return `<article class="entry"><div class="entry-top"><div class="entry-title-wrap"><div class="entry-emoji">${x.type==='建築'?'🏗️':x.type==='探索'?'🗺️':x.type==='整地'?'⛏️':'⚙️'}</div><div><h3>${H(x.name)}</h3><span class="pill">${H(x.type||'その他')}</span></div></div><div class="right-tags"><span class="pill ${x.status==='完了'?'done':x.status==='進行中'?'mid':''}">${H(x.status||'未着手')}</span>${x.priority==='高'?'<span class="pill hot">優先度 高</span>':''}</div></div>${x.location?`<div class="meta">📍 ${H(x.location)}</div>`:''}<p class="desc">${H(cut(x.note,135))}${x.materials?`\n📦 ${H(cut(x.materials,100))}`:''}</p><div class="inline-meter"><div class="meter-label"><span>進捗</span><b>${rate}%</b></div>${pct(rate)}</div><div class="actions"><button class="btn sm icon" data-action="progress" data-id="${H(x.id)}" data-step="-10">−</button><button class="btn sm icon" data-action="progress" data-id="${H(x.id)}" data-step="10">＋</button><button class="btn sm" data-action="complete-project" data-id="${H(x.id)}">${rate===100?'未完了に戻す':'✓ 完了にする'}</button>${buttons('projects',x.id)}</div></article>`}).join('')||empty('建築・タスクがありません','🧱','projects')}</div>`;}
function items(){if(!getWorld())return pageGuard();const arr=match(records('items').filter(x=>filter==='all'||x.category===filter));const shortage=records('items').filter(x=>valNum(x.qty)<valNum(x.target)).length;return `${heading('資材・アイテム管理','必要数と現在の在庫を比較。足りない資材をすぐに把握できます。',newBtn('items','資材を追加'))}<div class="overview-box"><div class="infobox"><strong>${records('items').length}</strong><small>登録アイテム</small></div><div class="infobox"><strong>${fmtNum(records('items').reduce((n,x)=>n+valNum(x.qty),0))}</strong><small>総在庫個数</small></div><div class="infobox"><strong style="color:${shortage?'var(--gold)':'var(--accent)'}">${shortage}</strong><small>不足アイテム</small></div></div>${toolbar('items',`<select id="listFilter" class="filter"><option value="all">すべての分類</option>${SCHEMA.items.fields[1][3].map(s=>`<option ${filter===s?'selected':''}>${s}</option>`).join('')}</select>`)}<div class="panel table-wrap"><table class="data-table"><thead><tr><th>アイテム</th><th>在庫</th><th>目標</th><th>不足</th><th>保管場所</th><th style="text-align:right">操作</th></tr></thead><tbody>${arr.map(x=>{const stock=valNum(x.qty),target=valNum(x.target),short=Math.max(0,target-stock);return `<tr><td class="name">${H(x.name)}<div class="minor">${H(x.category||'その他')}</div></td><td><div class="counter"><button class="btn sm icon" data-action="item-step" data-id="${H(x.id)}" data-step="-1">−</button><strong>${fmtNum(stock)}</strong><button class="btn sm icon" data-action="item-step" data-id="${H(x.id)}" data-step="1">＋</button></div></td><td>${fmtNum(target)}</td><td>${short?`<span class="pill hot">あと ${fmtNum(short)}</span>`:'<span class="pill done">充足</span>'}</td><td>${H(x.location||'—')}</td><td><div class="rowacts">${buttons('items',x.id)}</div></td></tr>`}).join('')||`<tr><td colspan="6" style="text-align:center;padding:40px">資材がありません。「＋ 資材を追加」から登録してください。</td></tr>`}</tbody></table></div><p class="help">※ 在庫の「＋ / −」は1個単位。大量に変更するときは「編集」を使ってください。スタック換算は便利ツールにあります。</p>`;}
function villagers(){if(!getWorld())return pageGuard();const arr=match(records('villagers').filter(x=>filter==='all'||x.profession===filter));return `${heading('村人・取引管理','司書のエンチャント本、取引価格、交易所の場所などをメモ。',newBtn('villagers','村人を追加'))}${toolbar('villagers',`<select class="filter" id="listFilter"><option value="all">すべての職業</option>${SCHEMA.villagers.fields[1][3].map(s=>`<option ${filter===s?'selected':''}>${s}</option>`).join('')}</select>`)}<div class="cards">${arr.map(x=>`<article class="entry"><div class="entry-top"><div class="entry-title-wrap"><div class="entry-emoji">🧑‍🌾</div><div><h3>${H(x.name)}</h3><span class="pill">${H(x.profession||'無職')}</span></div></div><span class="pill blue">${H(x.level||'新米')}</span></div><div class="meta">📖 ${H(x.trade||'取引未登録')}</div><p class="desc">💎 ${H(x.price||'価格未登録')}<br>📍 ${H(x.location||'場所未登録')}${x.note?`\n${H(x.note)}`:''}</p><div class="actions">${buttons('villagers',x.id)}</div></article>`).join('')||empty('村人が登録されていません','🧑‍🌾','villagers')}</div>`;}
function farms(){if(!getWorld())return pageGuard();const arr=match(records('farms').filter(x=>filter==='all'||x.status===filter));return `${heading('トラップ・装置管理','トラップタワー、経験値装置、自動農場の状態と効率を記録。',newBtn('farms','装置を追加'))}${toolbar('farms',`<select id="listFilter" class="filter"><option value="all">すべての状態</option>${SCHEMA.farms.fields[2][3].map(s=>`<option ${filter===s?'selected':''}>${s}</option>`).join('')}</select>`)}<div class="cards">${arr.map(x=>`<article class="entry"><div class="entry-top"><div class="entry-title-wrap"><div class="entry-emoji">⚙️</div><div><h3>${H(x.name)}</h3><span class="pill">${H(x.type||'その他')}</span></div></div><span class="pill ${x.status==='稼働中'?'done':x.status==='建設中'?'mid':''}">${H(x.status||'計画中')}</span></div><div class="meta">📦 ${H(x.output||'効率未登録')}<br>📍 ${H(x.location||'場所未登録')}</div><p class="desc">${H(x.note||'')}</p><div class="actions">${x.status==='稼働中'?`<button class="btn sm" data-action="farm-toggle" data-id="${H(x.id)}">⏸ 停止する</button>`:`<button class="btn sm" data-action="farm-toggle" data-id="${H(x.id)}">▶ 稼働中にする</button>`}${buttons('farms',x.id)}</div></article>`).join('')||empty('装置が登録されていません','🌾','farms')}</div>`;}
function goals(){if(!getWorld())return pageGuard();const all=records('goals'),arr=match(all.filter(x=>filter==='all'||(filter==='done'?x.done:!x.done)));const complete=all.filter(x=>x.done).length,rate=all.length?Math.round(complete/all.length*100):0;let categories=[...new Set(arr.map(x=>x.category||'自由目標'))];return `${heading('進捗・目標チェックリスト','標準の冒険目標10個に加え、自由な目標を登録して達成を記録。',newBtn('goals','目標を追加'))}<div class="panel" style="padding:21px 22px;margin-bottom:20px"><div class="meter-label"><span>冒険の達成率</span><strong style="color:var(--accent)">${complete} / ${all.length} 件・${rate}%</strong></div>${pct(rate)}</div>${toolbar('goals',`<select id="listFilter" class="filter"><option value="all">すべての目標</option><option value="todo" ${filter==='todo'?'selected':''}>未達成</option><option value="done" ${filter==='done'?'selected':''}>達成済み</option></select>`)}${categories.map(c=>`<section class="goal-group"><h3 class="group-title">${c==='序盤'?'🌿':c==='ネザー'?'🔥':c==='エンド'?'🌌':c==='発展'?'⚙️':'🏁'} ${H(c)} <span class="pill">${arr.filter(x=>x.category===c).filter(x=>x.done).length} / ${arr.filter(x=>x.category===c).length}</span></h3>${arr.filter(x=>x.category===c).map(x=>`<div class="goal-row ${x.done?'done':''}"><input type="checkbox" aria-label="${H(x.name)}を達成" class="goal-check" data-id="${H(x.id)}" ${x.done?'checked':''}><div class="goal-text"><strong>${H(x.name)}</strong>${x.note?`<small>${H(x.note)}</small>`:''}</div><div class="actions">${buttons('goals',x.id)}</div></div>`).join('')}</section>`).join('')||empty('該当する目標がありません','🏆','goals')}`;}
function recipeResult(){const r=RECIPE[converter.recipe],needed=clamp(converter.recipeQty,1,100000000),b=Math.ceil(needed/r.out);return `必要数 ${fmtNum(needed)} 個 / ${fmtNum(b)} 回クラフト / 出来上がり ${fmtNum(b*r.out)} 個<br><br>${r.items.map(([name,qty])=>`<div class="recent-row"><span>${H(name)}</span><b>${fmtNum(qty*b)} 個</b></div>`).join('')}`;}
function tools(){return `${heading('便利ツール','ゲーム中に使える計算をオフラインで。') }<div class="toolgrid"><section class="panel tool-card"><h3>🔥 ネザー座標変換</h3><p>オーバーワールドとネザーの X・Z を8:1で換算します。Y座標は換算しません。</p><div class="form-grid"><div class="field span2"><label>変換元</label><select id="convertSource"><option ${converter.source==='オーバーワールド'?'selected':''}>オーバーワールド</option><option ${converter.source==='ネザー'?'selected':''}>ネザー</option></select></div><div class="field"><label>X座標</label><input id="convertX" type="number" step="any" value="${H(converter.x)}"></div><div class="field"><label>Z座標</label><input id="convertZ" type="number" step="any" value="${H(converter.z)}"></div></div><div class="tool-result" id="convertResult"></div><div style="margin-top:12px"><button class="btn sm" data-action="copy-conversion">📋 変換結果をコピー</button></div></section>
<section class="panel tool-card"><h3>📦 スタック換算</h3><p>アイテムの個数から、スタック数と余りを計算します（64個／16個）。</p><div class="form-grid"><div class="field"><label>アイテム個数</label><input id="stackQty" type="number" min="0" value="${H(converter.stackQty)}"></div><div class="field"><label>1スタックの個数</label><select id="stackSize"><option value="64" ${converter.stackSize===64?'selected':''}>64個</option><option value="16" ${converter.stackSize===16?'selected':''}>16個</option></select></div></div><div class="tool-result" id="stackResult"></div><p class="hint">※ スタック不可のアイテムや特殊な最大数は対象外です。</p></section>
<section class="panel tool-card"><h3>🛠️ クラフト素材計算</h3><p>代表的なクラフトレシピの必要素材をまとめて計算。素材の中間クラフトは展開しません。</p><div class="form-grid"><div class="field"><label>作りたいアイテム</label><select id="recipeType">${Object.entries(RECIPE).map(([id,r])=>`<option value="${id}" ${converter.recipe===id?'selected':''}>${r.name}</option>`).join('')}</select></div><div class="field"><label>作りたい個数</label><input type="number" id="recipeQty" min="1" max="100000000" value="${H(converter.recipeQty)}"></div></div><div class="tool-result" id="recipeResult" style="font-size:12px;line-height:1.7"></div></section>
<section class="panel tool-card"><h3>🧭 使い方とヒント</h3><p>冒険に役立つ管理の流れをまとめました。</p><div class="recent-list" style="padding:0"><div class="recent-row"><span>① 座標</span><small>拠点・村・構造物を記録</small></div><div class="recent-row"><span>② 建築</span><small>進捗と必要資材を入力</small></div><div class="recent-row"><span>③ 資材</span><small>在庫と不足分を確認</small></div><div class="recent-row"><span>④ 目標</span><small>達成したらチェック</small></div></div><hr class="divider"><p class="hint">ワールド名・シード・スポーン座標は「📲 スマホ・PC連携」から統合版セーブデータを取り込めます。資材・建築物・所持品の解析には未対応です。</p></section></div>`;}
function conversion(){const x=Number(converter.x)||0,z=Number(converter.z)||0,fn=converter.source==='オーバーワールド'?a=>a/8:a=>a*8,world=converter.source==='オーバーワールド'?'ネザー':'オーバーワールド';const fmt=n=>Number(n.toFixed(3)).toLocaleString('ja-JP',{maximumFractionDigits:3});return {x:fmt(fn(x)),z:fmt(fn(z)),world};}
function updateTools(){const c=conversion();const a=document.getElementById('convertResult');if(a)a.innerHTML=`<small>変換先：${c.world}</small><strong>X ${c.x} ／ Z ${c.z}</strong><small>小数が出る場合、ゲーム内で安全な設置位置を確認してください。</small>`;const b=document.getElementById('stackResult');if(b){const q=Math.floor(clamp(converter.stackQty,0,1000000000)),s=converter.stackSize;b.innerHTML=`<small>必要なスタック数</small><strong>${fmtNum(Math.floor(q/s))} スタック ＋ ${fmtNum(q%s)} 個</strong><small>最大スタック数 ${s} 個で計算</small>`;}const r=document.getElementById('recipeResult');if(r)r.innerHTML=recipeResult();}
function discordUserLabel(){const u=session?.user;if(!u)return '未ログイン';const i=u.identities?.find(x=>x.provider==='discord');return i?.identity_data?.global_name||i?.identity_data?.username||i?.identity_data?.name||u.user_metadata?.full_name||u.user_metadata?.name||u.email||u.id;}
function settings(){const owner=isOwner(),email=H(discordUserLabel());return `${heading('共有設定・バックアップ','管理者の承認制アクセス、Discordアカウントとクラウド保存を管理します。')}
<div class="settings-grid">
<section class="panel setting-card"><h3>👤 アカウントと権限</h3><p>ログイン：${email}<br>アクセス：<strong>${owner?'管理人（編集可）':'閲覧者（閲覧のみ）'}</strong><br>データの保存場所：Supabaseクラウド</p><p>複数端末で同じDiscordアカウントにログインすると最新データを読み込めます。</p><button class="btn" data-action="refresh-cloud">⟳ 最新データを確認</button></section>
<section class="panel setting-card"><h3>🌍 共有スペースを切り替える</h3><p>招待されたスペースと自分で作成したスペースを切り替えできます。</p><select id="workspaceSelect" class="filter" style="max-width:100%;width:100%">${workspaces.map(w=>`<option value="${H(w.id)}" ${activeWorkspace?.id===w.id?'selected':''}>${H(w.title)} ${w.owner_id===session?.user?.id?'（管理人）':'（閲覧者）'}</option>`).join('')}</select>${owner?'<p>共有スペースを追加する場合は以下のボタンから作成できます。</p><button class="btn" data-action="create-workspace">＋ 新規共有スペース</button>':''}</section>
${owner?`<section class="panel setting-card"><h3>🔗 閲覧者を招待する</h3><p>リンクを知っている人がDiscordログインすると<strong>承認申請</strong>を送信できます。<strong>管理者が明示的に承認するまでワールド・地図・チャットは閲覧できません。</strong>リンクは有効期限なし・利用回数制限なしですが、無効化できます。</p><button class="btn primary" data-action="create-invite">＋ 招待リンクを発行</button><div id="inviteLinkBox" style="margin-top:12px"></div><div id="invitesList">${invitesHtml()}</div></section>
<section class="panel setting-card"><h3>⏳ 管理者の承認待ち <span class="pill blue">${pendingList.length}件</span></h3><p>申請したユーザーを確認し、利用を許可する場合だけ「承認」を選択してください。拒否したユーザーは同じ招待リンクから再申請できません。</p><div id="pendingList">${pendingHtml()}</div><button class="btn sm" data-action="refresh-requests">⟳ 申請を更新</button></section>
<section class="panel setting-card"><h3>🛡️ 承認済み閲覧者</h3><p>招待リンクを無効にしても、承認済みの閲覧者は残ります。解除した人は同じリンクで再参加できないようにブロックされます。</p><div id="membersList">${membersHtml()}</div><h4>アクセスを解除したユーザー</h4><div>${blockedHtml()}</div></section>`:''}
<section class="panel setting-card"><h3>⬇ JSONバックアップ</h3><p>管理データの控えをダウンロードできます。シード値も含まれるため、ファイルは安全に保管してください。</p><button class="btn" data-action="export">バックアップを保存</button>${owner?'<button class="btn" data-action="import" style="margin-left:6px">バックアップから復元</button>':''}</section>
${owner?`<section class="panel setting-card danger-panel"><h3>🗑️ 登録データ初期化</h3><p>この共有スペースのデータを初期値に戻します。閲覧者にも反映されます。</p><button class="btn danger" data-action="reset">全データを初期化</button></section>`:''}</div>`}
function invitesHtml(){if(!inviteList.length)return '<p class="hint">発行済みリンクはありません。</p>';return inviteList.map(i=>`<p style="font-size:11px">${i.revoked_at?'❌ 無効':'🟢 有効'} ・ ${i.expires_at?`期限 ${H(new Date(i.expires_at).toLocaleDateString('ja-JP'))}`:'期限なし・回数無制限'} <button class="btn sm danger" data-action="revoke-invite" data-id="${H(i.id)}" ${i.revoked_at?'disabled':''}>無効化</button></p>`).join('')}
function pendingHtml(){return pendingList.map(m=>`<div class="private-request"><div><strong>${H(m.email||'Discordユーザー')}</strong><br><small>申請日時：${H(new Date(m.requested_at).toLocaleString('ja-JP'))}</small></div><div class="actions"><button class="btn sm primary" data-action="approve-request" data-id="${H(m.request_id)}">✓ 承認</button><button class="btn sm danger" data-action="deny-request" data-id="${H(m.request_id)}">✕ 拒否</button></div></div>`).join('')||'<p class="hint">承認待ちの申請はありません。</p>';}
function membersHtml(){if(!viewerList.length)return '<p class="hint">読み込み中...</p>';return viewerList.map(m=>`<p style="font-size:11px;line-height:2">${H(m.email||'アカウント')} (${m.role==='owner'?'管理人':'閲覧者'}) ${m.role==='viewer'?`<button class="btn sm danger" data-action="remove-viewer" data-id="${H(m.user_id)}">アクセス解除</button>`:''}</p>`).join('')}
function blockedHtml(){return blockedList.map(m=>`<p style="font-size:11px;line-height:2">${H(m.email||'アカウント')} <button class="btn sm" data-action="unblock-viewer" data-id="${H(m.user_id)}">ブロック解除</button></p>`).join('')||'<p class="hint">ブロックした閲覧者はいません。</p>';}
function render(){if(!activeWorkspace)return;worldOptions();renderNav();document.getElementById('headerName').textContent=PAGES.find(x=>x[0]===page)?.[2]||'MC BASE';document.getElementById('page').innerHTML=({dashboard,worlds,coords,projects,items,villagers,farms,goals,machines,enchants,tools,map:mapPage,live:livePage,realms:realmsPage,atlas,demo,unichat,device:devicePage,settings}[page]||dashboard)();if(page==='tools')updateTools();if(page==='machines')machinePreview();if(page==='map')drawMap();if(page==='device')renderWorldImportPreview();if(['live','map','atlas'].includes(page))liveRefresh();if(['realms','map','atlas'].includes(page))realmsRefresh();uRenderPageInit();document.getElementById('appRoot').classList.toggle('viewer',!isOwner());}
function fieldHtml([key,label,type,options,required],old){let v=old?.[key];if(v===undefined||v===null)v=(type==='select'?options[0]:type==='number'?(key==='y'?64:key==='target'?64:0):'');let control='';if(type==='select')control=`<select name="${key}" id="f_${key}">${options.map(o=>`<option value="${H(o)}" ${String(v)===String(o)?'selected':''}>${H(o)}</option>`).join('')}</select>`;else if(type==='textarea')control=`<textarea name="${key}" id="f_${key}" placeholder="${H(options||'')}">${H(v)}</textarea>`;else control=`<input id="f_${key}" name="${key}" type="${type}" ${type==='number'?'step="any"':''} value="${H(v)}" placeholder="${H(options||'')}" ${required?'required':''} maxlength="500">`;return `<div class="field ${type==='textarea'||(key==='note'&&type==='text')?'span2':''}"><label for="f_${key}">${label}${required?' *':''}</label>${control}</div>`;}
function openEditor(kind,id=null){if(!isOwner())return toast('閲覧者には編集権限がありません。');if(kind!=='worlds'&&!getWorld())return toast('先にワールドを作成してください。');const old=id?db[kind].find(x=>x.id===id):null;if(id&&!old)return;editing=id;modalKind=kind;document.getElementById('modalTitle').textContent=`${old?'編集':'新規登録'}：${SCHEMA[kind].label}`;document.getElementById('modalBody').innerHTML=`<div class="form-grid">${SCHEMA[kind].fields.map(f=>fieldHtml(f,old)).join('')}</div>${kind==='worlds'&&!old?'<p class="hint">新しいワールドには標準の冒険目標10個が自動登録されます。</p>':''}`;document.getElementById('modalLayer').classList.add('show');document.getElementById('modalLayer').setAttribute('aria-hidden','false');document.getElementById('f_name')?.focus();}
function closeModal(){document.getElementById('modalLayer').classList.remove('show');document.getElementById('modalLayer').setAttribute('aria-hidden','true');editing=modalKind=null;}
function submitModal(event){event.preventDefault();if(!isOwner())return toast('編集権限がありません。');if(!modalKind)return;const kind=modalKind,id=editing,form=new FormData(event.currentTarget),data={};for(const [key,label,type] of SCHEMA[kind].fields){data[key]=String(form.get(key)??'').trim();if(type==='number'){if(data[key]===''){toast(`${label}を入力してください`);return;}if(!Number.isFinite(Number(data[key]))){toast('数値を確認してください');return;}data[key]=Number(data[key]);}}if(!data.name){toast('名前を入力してください');return;}if(kind==='coords'&&(!['x','y','z'].every(k=>Number.isSafeInteger(data[k])))){toast('座標は整数で入力してください。');return;}if(kind==='projects'){data.progress=clamp(data.progress,0,100);if(data.status==='完了')data.progress=100;else if(data.progress===100)data.status='完了';else if(data.progress>0&&data.status==='未着手')data.status='進行中';}if(kind==='items'){data.qty=clamp(data.qty,0,1000000000);data.target=clamp(data.target,0,1000000000);}if(kind==='goals')data.done=id?db.goals.find(x=>x.id===id)?.done||false:false;if(id){const old=db[kind].find(x=>x.id===id);Object.assign(old,data);recordActivity(`${SCHEMA[kind].label}「${data.name}」を編集`);}else {const rec={id:makeId(),...(kind==='worlds'?{}:{worldId:db.selectedWorld}),...data,createdAt:today()};db[kind].unshift(rec);if(kind==='worlds'){db.selectedWorld=rec.id;db.goals.push(...DEFAULT_GOALS.map(([category,name])=>({id:makeId(),worldId:rec.id,category,name,note:'',done:false,createdAt:today()})));}recordActivity(`${SCHEMA[kind].label}「${data.name}」を追加`);}closeModal();save();render();toast(`${SCHEMA[kind].label}を保存しました。`);}
function deletion(kind,id){if(!isOwner())return toast('編集権限がありません。');const old=db[kind]?.find(x=>x.id===id);if(!old)return;const desc=kind==='worlds'?'このワールドの座標・建築・資材・村人・装置・目標もすべて削除されます。':'このデータを削除します。';if(!confirm(`「${old.name}」を削除しますか？\n${desc}\nこの操作は元に戻せません。`))return;db[kind]=db[kind].filter(x=>x.id!==id);if(kind==='worlds'){for(const k of ['coords','projects','items','villagers','farms','blueprints','goals'])db[k]=db[k].filter(x=>x.worldId!==id);db.activity=db.activity.filter(x=>x.worldId!==id);if(db.selectedWorld===id)db.selectedWorld=db.worlds[0]?.id||null;}recordActivity(`${SCHEMA[kind].label}を削除`);save();render();toast('削除しました。');}
function exportJson(){const txt=JSON.stringify({...db,exportedAt:today()},null,2);const blob=new Blob([txt],{type:'application/json;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`minecraft_base_backup_${new Date().toLocaleDateString('sv-SE')}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);toast('JSONバックアップを書き出しました。');}
async function importJson(file){if(!isOwner())return toast('管理人のみ復元できます。');if(!file)return;if(file.size>15*1024*1024){toast('ファイルが大きすぎます（上限15MB）。');return;}let obj;try{obj=normalize(JSON.parse(await file.text()));}catch(e){toast('読み込めませんでした：'+e.message);return;}if(!confirm(`このJSONのワールド ${obj.worlds.length} 件で現在の全データを置き換えます。\n現在のデータは上書きされます。続けますか？`))return;db=obj;save();changePage('dashboard');toast('バックアップを復元しました。');}
function mutate(kind,id,fn,msg){if(!isOwner())return toast('編集権限がありません。');const x=db[kind].find(x=>x.id===id);if(!x)return;fn(x);recordActivity(msg||`${SCHEMA[kind].label}を更新`);save();render();}
function clipboard(str){if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(str).then(()=>toast('クリップボードにコピーしました。'),()=>fallbackCopy(str));}else fallbackCopy(str);}
function fallbackCopy(str){const el=document.createElement('textarea');el.value=str;el.style.position='fixed';el.style.opacity='0';document.body.appendChild(el);el.select();let ok=false;try{ok=document.execCommand('copy');}catch(e){}el.remove();toast(ok?'コピーしました。':'コピーできませんでした。表示された座標を手動でコピーしてください。');}
const actionHandlers={
 'new':e=>openEditor(e.dataset.kind), 'edit':e=>openEditor(e.dataset.kind,e.dataset.id),'delete':e=>deletion(e.dataset.kind,e.dataset.id),'close-modal':closeModal,
 'logout':async()=>{if(cloud)await cloud.auth.signOut();resetAccess();},'refresh-cloud':()=>refreshCloud(true),'create-workspace':()=>createWorkspace(true),'create-invite':()=>createInvite(),'revoke-invite':e=>revokeInvite(e.dataset.id),'remove-viewer':e=>removeViewer(e.dataset.id),'unblock-viewer':e=>unblockViewer(e.dataset.id),'approve-request':e=>approveRequest(e.dataset.id),'deny-request':e=>denyRequest(e.dataset.id),'refresh-requests':()=>loadAccessLists(),'map-pan':e=>{mapCenterX+=Number(e.dataset.dx)*16;mapCenterZ+=Number(e.dataset.dz)*16;drawMap();},'map-zoom':e=>{mapCell=clamp(mapCell+Number(e.dataset.step),15,44);drawMap();},'map-jump':()=>{const x=Number(document.getElementById('mapJumpX')?.value),z=Number(document.getElementById('mapJumpZ')?.value);if(!Number.isFinite(x)||!Number.isFinite(z))return toast('座標を入力してください。');mapCenterX=Math.trunc(x);mapCenterZ=Math.trunc(z);drawMap();},'map-focus':e=>{mapCenterX=Number(e.dataset.x)||0;mapCenterZ=Number(e.dataset.z)||0;drawMap();document.getElementById('mapCanvas')?.scrollIntoView({block:'center',behavior:'smooth'});},'copy-seed':()=>{const w=getWorld();if(w?.seed)clipboard(w.seed);},'map-new-coord':()=>{openEditor('coords');}, 'choose-world-file':()=>document.getElementById('worldSnapshotFile').click(),'choose-world-folder':()=>pickWorldFolder(),'commit-world-snapshot':()=>commitWorldSnapshot(),'check-folder':()=>checkLinkedFolder(false),'stop-folder':()=>stopFolderWatcher(true), 'open-chunkbase':()=>window.open('https://www.chunkbase.com/apps/seed-map','_blank','noopener,noreferrer'),
 'save-machine':()=>saveMachine(),
 'copy-draft-machine':()=>{takeMachineInputs();clipboard(formatMachine(makeMachinePlan(machineDraft)));},
 'new-machine':()=>{machineEditing=null;machineDraft={type:'furnace',units:8,name:'',note:''};render();},
 'view-machine':e=>showMachine(e.dataset.id),
 'close-machine':()=>{const el=document.getElementById('machineDetailPanel');if(el)el.innerHTML='';},
 'copy-machine':e=>{const m=getMachine(e.dataset.id);if(m)clipboard(formatMachine(m));},
 'edit-machine':e=>{if(!isOwner())return toast('管理人のみ編集できます。');const m=getMachine(e.dataset.id);if(!m)return;machineEditing=m.id;machineDraft={type:m.type,units:m.units,name:m.name,note:m.note||''};render();window.scrollTo({top:0,behavior:'smooth'});},
 'project-machine':e=>machineToProject(e.dataset.id),
 'delete-machine':e=>deleteMachine(e.dataset.id),
 'export':exportJson,'import':()=>document.getElementById('importFile').click(),'mobile-more':()=>{mobileMoreOpen=!mobileMoreOpen;renderNav();},
 'select-world':e=>{db.selectedWorld=e.dataset.id;save();changePage('dashboard');toast('ワールドを切り替えました。');},
 'progress':e=>mutate('projects',e.dataset.id,x=>{x.progress=clamp((Number(x.progress)||0)+Number(e.dataset.step),0,100);x.status=x.progress===100?'完了':x.progress>0?'進行中':'未着手';},'タスクの進捗を変更'),
 'complete-project':e=>mutate('projects',e.dataset.id,x=>{if(Number(x.progress)>=100){x.progress=0;x.status='未着手';}else{x.progress=100;x.status='完了';}},'タスクの達成状態を変更'),
 'item-step':e=>mutate('items',e.dataset.id,x=>{x.qty=clamp(valNum(x.qty)+Number(e.dataset.step),0,1000000000)},'資材の在庫を変更'),
 'farm-toggle':e=>mutate('farms',e.dataset.id,x=>{x.status=x.status==='稼働中'?'停止中':'稼働中';},'装置の稼働状態を変更'),
 'copy-coord':e=>{const x=db.coords.find(x=>x.id===e.dataset.id);if(x)clipboard(`${x.name} [${x.dimension}] X:${x.x} Y:${x.y} Z:${x.z}`);},
 'convert-coord':e=>{const x=db.coords.find(x=>x.id===e.dataset.id);if(!x)return;converter.source=x.dimension;converter.x=Number(x.x)||0;converter.z=Number(x.z)||0;changePage('tools');},
 'copy-enchant':e=>{const x=ENCHANT_LIST.find(y=>y.id===e.dataset.id);if(x)clipboard(`${x.name} / ${enchantMode==='general'?'普段使い':'用途特化'}\n${(enchantMode==='general'?x.general:x.other).join('\n')}\n注意：${x.tip}`);},
 'copy-conversion':()=>{const c=conversion();clipboard(`${c.world} X:${c.x} Z:${c.z}`);},
 'reset':()=>{if(!confirm('すべての管理データを初期化しますか？\n元に戻すことはできません。'))return;if(!confirm('最終確認：全ワールドのデータを消去してよろしいですか？'))return;db=defaultState();save();changePage('dashboard');toast('初期化しました。');}
};
document.addEventListener('click',e=>{const n=e.target.closest('[data-page]');if(n){changePage(n.dataset.page);return;}const a=e.target.closest('[data-action]');if(a){if(!isOwner()&&['new','edit','delete','progress','complete-project','item-step','farm-toggle','reset','import','create-invite','revoke-invite','remove-viewer','create-workspace','save-machine','edit-machine','delete-machine','project-machine','unblock-viewer','choose-world-file','choose-world-folder','commit-world-snapshot','check-folder','stop-folder','u-map-upload','u-map-delete'].includes(a.dataset.action))return toast('閲覧者は変更できません。');actionHandlers[a.dataset.action]?.(a);}});
document.getElementById('worldSelect').addEventListener('change',e=>{db.selectedWorld=e.target.value||null;save();render();toast('ワールドを切り替えました。');});
document.getElementById('modalForm').addEventListener('submit',submitModal);
document.getElementById('modalLayer').addEventListener('click',e=>{if(e.target===e.currentTarget)closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
document.getElementById('importFile').addEventListener('change',e=>{const file=e.target.files[0];e.target.value='';importJson(file)});
document.getElementById('worldSnapshotFile').addEventListener('change',e=>{const file=e.target.files[0];e.target.value='';if(file)readWorldSnapshot(file,null)});
document.addEventListener('input',e=>{if(['machineName','machineUnits','machineNote'].includes(e.target.id)){takeMachineInputs();machinePreview();}if(e.target.id==='listSearch'){const pos=e.target.selectionStart;query=e.target.value;const pg=document.getElementById('page');const el=document.activeElement;const scroll=window.scrollY;pg.innerHTML=({coords,projects,items,villagers,farms,goals}[page]||dashboard)();const input=document.getElementById('listSearch');input?.focus();input?.setSelectionRange(pos,pos);window.scrollTo(0,scroll);}const ids=['convertX','convertZ','stackQty','recipeQty'];if(ids.includes(e.target.id)){converter[e.target.id==='convertX'?'x':e.target.id==='convertZ'?'z':e.target.id==='stackQty'?'stackQty':'recipeQty']=e.target.value;updateTools();}});
document.addEventListener('change',e=>{if(e.target.id==='machineType'){takeMachineInputs();machineDraft.type=e.target.value;machineEditing=null;const inp=document.getElementById('machineName');if(inp)machineDraft.name='';render();return;}if(e.target.id==='enchantCategory'){enchantFilter=e.target.value;render();return;}if(e.target.id==='enchantMode'){enchantMode=e.target.value;render();return;}if(e.target.id==='workspaceSelect'){switchWorkspace(e.target.value);return;}if(e.target.id==='listFilter'){filter=e.target.value;document.getElementById('page').innerHTML=({coords,projects,items,villagers,farms,goals}[page]||dashboard)();}else if(e.target.classList.contains('goal-check')){mutate('goals',e.target.dataset.id,x=>x.done=e.target.checked,'目標の達成状況を変更');}else if(e.target.id==='convertSource'){converter.source=e.target.value;updateTools();}else if(e.target.id==='stackSize'){converter.stackSize=Number(e.target.value);updateTools();}else if(e.target.id==='recipeType'){converter.recipe=e.target.value;updateTools();}});

function accessMessage(html,error=''){document.getElementById('accessContent').innerHTML=html;document.getElementById('accessError').textContent=error;}
function showAccess(){document.body.classList.remove('authenticated');document.getElementById('appRoot').classList.remove('viewer');}
function setConnected(){document.body.classList.add('authenticated');document.getElementById('syncStatus').textContent=`${isOwner()?'✎ 管理人':'👁 閲覧専用'} ・ ☁ 同期中`;render();}
function resetAccess(){uClear();stopFolderWatcher(false);if(cloudChannel&&cloud)cloud.removeChannel(cloudChannel);cloudChannel=null;if(cloudPoll)clearInterval(cloudPoll);cloudPoll=null;session=null;initializedUid=null;activeWorkspace=null;viewerList=[];pendingList=[];inviteList=[];blockedList=[];showAccess();accessMessage('<p>Discordアカウントでログインしてください。承認前はワールド・地図・チャットを閲覧できません。</p><button class="btn primary" id="discordLogin">💠 Discordでログイン</button>');wireLogin();}
function wireLogin(){document.getElementById('discordLogin')?.addEventListener('click',async()=>{if(!cloud)return;const {error}=await cloud.auth.signInWithOAuth({provider:'discord',options:{redirectTo:window.location.origin+window.location.pathname}});if(error)document.getElementById('accessError').textContent=error.message;});}
async function bootCloud(){
 const h=new URLSearchParams(location.hash.replace(/^#/,''));const t=h.get('invite');
 if(t){sessionStorage.setItem('mc_invite_pending',t);history.replaceState(null,'',location.pathname+location.search);}
 const cfg=window.MC_BASE_CONFIG||{};
 const url=cfg.supabaseUrl,key=cfg.supabasePublishableKey;
 if(!url||!key||url.includes('YOUR_')||key.includes('YOUR_')){
   accessMessage(`<p class="warning">🔧 初期セットアップが必要です。管理人が <strong>config.js</strong> にSupabase URLとPublishable Keyを設定し、HTTPSで公開してください。</p><p>設定が終わるまではDiscordログイン・招待制共有を使えません。付属の「導入ガイド」をご覧ください。</p>`);return;
 }
 if(!window.supabase?.createClient){accessMessage('<p class="warning">Supabase認証ライブラリを読み込めませんでした。インターネット接続や広告ブロッカーを確認してください。</p>');return;}
 if(location.protocol!=='https:'&&location.hostname!=='localhost'&&location.hostname!=='127.0.0.1'){
  accessMessage('<p class="warning">DiscordログインはHTTPSで公開して使用してください（ローカル開発時は localhost）。ファイルをダブルクリックした file:// 環境では利用できません。</p>');return;
 }
 cloud=window.supabase.createClient(url,key,{auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:true}});
 cloud.auth.onAuthStateChange((event,newSession)=>{if(event==='SIGNED_OUT'){resetAccess();return;}if(newSession&&event==='SIGNED_IN'){setTimeout(()=>authorize(newSession),10);}});
 const {data,error}=await cloud.auth.getSession();
 if(error){accessMessage('<p>認証状態の確認に失敗しました。ページを再読み込みしてください。</p>',error.message);return;}
 if(data.session)await authorize(data.session);else resetAccess();
}
async function authorize(s){
 if(initializedUid===s.user.id&&activeWorkspace&&!sessionStorage.getItem('mc_invite_pending'))return;
 session=s;initializedUid=s.user.id;showAccess();accessMessage('<p>共有スペースの権限を確認しています...</p>');
 try{
  const gate=await cloud.rpc('mc_private_gate_version');
  if(gate.error||gate.data!=='4.2')throw Error('Discord承認制のSQL/06が未適用です。安全のためログイン処理を停止しました。');
  const discordAuth=await cloud.rpc('mc_discord_account');
  if(discordAuth.error||discordAuth.data!==true)throw Error('Discord認証が確認できません。Discordアカウントでログインし直してください。');
  let joinedId=null;const token=sessionStorage.getItem('mc_invite_pending');
  if(token){const {data,error}=await cloud.rpc('mc_join_workspace',{p_token:token});if(error)throw error;joinedId=data;sessionStorage.removeItem('mc_invite_pending');}
  const {data,error}=await cloud.from('mc_workspaces').select('id,title,owner_id,data,revision,updated_at').order('updated_at',{ascending:false});
  if(error)throw error;workspaces=data||[];
  if(!workspaces.length){await showWelcome();return;}
  const selected=workspaces.find(x=>x.id===joinedId)||workspaces.find(x=>x.id===localStorage.getItem('mc_base_active_workspace'))||workspaces[0];
  await switchWorkspace(selected.id);
 }catch(e){showAccess();accessMessage('<p>共有スペースを開けません。招待権限やSupabase設定を確認してください。</p><button class="btn" id="retryAccess">もう一度確認</button><button class="btn ghost" id="fixDiscordSession">ログアウトしてDiscordで入り直す</button>',e.message);document.getElementById('retryAccess').onclick=()=>{initializedUid=null;authorize(session);};document.getElementById('fixDiscordSession').onclick=async()=>{await cloud.auth.signOut();resetAccess();};}
}
async function showWelcome(){
 showAccess();
 const result=await cloud.rpc('mc_can_create_workspace');
 const permitted=result.error?false:result.data===true;
 if(result.error){
  accessMessage('<p>公開用のアクセス制御設定を確認できません。</p><p>管理人は公開用SQLを実行したか確認してください。</p>',result.error.message);
  return;
 }
 if(!permitted){
  const requests=await cloud.rpc('mc_my_access_requests');
  const pending=requests.error?[]:(requests.data||[]).filter(r=>r.status==='pending');
  accessMessage(`<p>Discordアカウントでログイン中：<strong>${H(discordUserLabel())}</strong></p><h3>🔒 ${pending.length?'管理者の承認待ち':'管理者の許可が必要です'}</h3><p>${pending.length?'申請を受け付けました。管理者が承認すると使用できます。承認までは地図・ワールド・チャットを閲覧できません。':'このアカウントはまだ利用を許可されていません。管理者から招待リンクを受け取り、リンクを開いて申請してください。'}</p><p class="hint">招待リンクを持っていても、自動では承認されません。承認済みになったら「承認状態を確認」を押してください。</p><p class="hint">初期設定用アカウントID：<code>${H(session?.user?.id||'')}</code>（管理者のみ設定時に使用）</p><button class="btn primary" id="refreshApproval">⟳ 承認状態を確認</button><button class="btn" id="welcomeSignOut">別のDiscordアカウントでログイン</button>`);
  document.getElementById('refreshApproval').addEventListener('click',()=>{initializedUid=null;authorize(session);});
  document.getElementById('welcomeSignOut').addEventListener('click',async()=>{await cloud.auth.signOut();resetAccess();});
  return;
 }
 accessMessage(`<p>管理人としてログイン中：<strong>${H(discordUserLabel())}</strong></p><h3>共有スペースを作成</h3><p>許可済み管理人のみが新しいワールド管理スペースを作成できます。以前のMC BASE v1のデータは「旧データを使って作成」で引き継げます。</p><label>共有スペース名</label><input id="newWorkspaceName" maxlength="100" value="マイクラ共有ワールド"><button class="btn primary" id="startWorkspace">＋ 新しい共有スペースを作成</button>${localStorage.getItem(KEY)?'<button class="btn" id="migrateWorkspace">📦 旧データを使って作成</button>':''}`);
 document.getElementById('startWorkspace').onclick=()=>createWorkspace(false,false);
 if(document.getElementById('migrateWorkspace'))document.getElementById('migrateWorkspace').onclick=()=>createWorkspace(false,true);
}
async function createWorkspace(promptName=false,fromLegacy=false){
 if(!session)return;
 const title=promptName?prompt('共有スペース名','新しいマイクラ共有ワールド'):document.getElementById('newWorkspaceName')?.value;
 if(!title?.trim())return;
 let initial=defaultState();
 if(fromLegacy){try{initial=normalize(JSON.parse(localStorage.getItem(KEY)));}catch(e){return toast('旧データが読み取れませんでした。');}}
 try{const {data,error}=await cloud.rpc('mc_create_workspace',{p_title:title.trim(),p_data:initial});if(error)throw error;initializedUid=null;await authorize(session);await switchWorkspace(data);toast('共有スペースを作成しました。');}
 catch(e){toast('共有スペース作成エラー: '+e.message);document.getElementById('accessError').textContent=e.message;}
}
async function switchWorkspace(id){
 if(!id)return;stopFolderWatcher(false);worldImportDraft=null;
 const row=workspaces.find(w=>w.id===id);
 if(!row)return;
 if(cloudChannel){await cloud.removeChannel(cloudChannel);cloudChannel=null;}
 if(cloudPoll){clearInterval(cloudPoll);cloudPoll=null;}
 clearTimeout(savingTimer);dirty=false;saving=false;
 activeWorkspace=row;db=normalize(row.data);
 const savedWorld=sessionStorage.getItem('mc_view_world');if(row.owner_id!==session.user.id&&db.worlds.some(w=>w.id===savedWorld))db.selectedWorld=savedWorld;
 localStorage.setItem('mc_base_active_workspace',id);page=new URLSearchParams(location.search).get('review')==='1'?'settings':'dashboard';setConnected();
 cloudChannel=cloud.channel('mc-workspace-'+id).on('postgres_changes',{event:'UPDATE',schema:'public',table:'mc_workspaces',filter:'id=eq.'+id},()=>{if(!dirty&&!saving)refreshCloud(false);}).subscribe();
 cloudPoll=setInterval(()=>{if(!dirty&&!saving)refreshCloud(false);},15000);
 if(isOwner())await loadAccessLists();
}
async function refreshCloud(notify){if(!activeWorkspace||!cloud)return;
 try{const {data,error}=await cloud.from('mc_workspaces').select('id,title,owner_id,data,revision,updated_at').eq('id',activeWorkspace.id).single();if(error){if(error.code==='PGRST116'||error.code==='42501'){resetAccess();accessMessage('<p>この共有スペースへのアクセス権限がありません。再度招待が必要です。</p>');return;}throw error;}
 if(data.revision>activeWorkspace.revision){const currentSelection=db?.selectedWorld;activeWorkspace=data;workspaces=workspaces.map(w=>w.id===data.id?data:w);db=normalize(data.data);if(!isOwner()&&db.worlds.some(w=>w.id===currentSelection))db.selectedWorld=currentSelection;render();toast('クラウドの最新データを反映しました。');}
 else if(notify)toast('最新のデータです。');
 }catch(e){document.getElementById('syncStatus').textContent='⚠ 再接続待ち';if(notify)toast(e.message);if(/permission|PGRST116/i.test(e.message))resetAccess();}
}
function scheduleCloudSave(){if(!isOwner())return;dirty=true;document.getElementById('syncStatus').textContent='☁ 保存待ち';clearTimeout(savingTimer);savingTimer=setTimeout(flushCloudSave,500);}
async function flushCloudSave(){if(saving||!dirty||!isOwner())return;saving=true;dirty=false;const snapshot=JSON.parse(JSON.stringify(db));const revision=activeWorkspace.revision;
 try{const {data,error}=await cloud.rpc('mc_save_workspace',{p_workspace_id:activeWorkspace.id,p_data:snapshot,p_expected_revision:revision});if(error)throw error;activeWorkspace.revision=Number(data);activeWorkspace.data=snapshot;document.getElementById('syncStatus').textContent='✓ クラウド保存済み';}
 catch(e){document.getElementById('syncStatus').textContent='⚠ 保存できません';const conflict=e.message.includes('競合');if(conflict){alert('別の端末で管理データが更新されました。未保存の内容をバックアップしてから「最新データを確認」を押してください。\n※この端末では自動上書きしません。');}else{dirty=true;toast('クラウド保存失敗: '+e.message);}return;}
 finally{saving=false;}if(dirty)flushCloudSave();
}
async function loadAccessLists(){if(!isOwner())return;const [m,i,b,p]=await Promise.all([cloud.rpc('mc_get_members',{p_workspace_id:activeWorkspace.id}),cloud.from('mc_invites').select('id,expires_at,revoked_at').eq('workspace_id',activeWorkspace.id).order('created_at',{ascending:false}),cloud.rpc('mc_get_blocked',{p_workspace_id:activeWorkspace.id}),cloud.rpc('mc_get_access_requests',{p_workspace_id:activeWorkspace.id})]);if(!m.error)viewerList=m.data||[];if(!i.error)inviteList=i.data||[];if(!b.error)blockedList=b.data||[];if(!p.error)pendingList=p.data||[];if(p.error)toast('申請一覧の取得に失敗: '+p.error.message);if(page==='settings')render();}
async function approveRequest(id){if(!isOwner()||!confirm('このDiscordアカウントにワールド・地図・チャットの閲覧を許可しますか？'))return;const {error}=await cloud.rpc('mc_approve_access',{p_request_id:id});if(error)return toast(error.message);await loadAccessLists();toast('利用を承認しました。');}
async function denyRequest(id){if(!isOwner()||!confirm('この申請を拒否し、招待リンクからの再申請も禁止しますか？'))return;const {error}=await cloud.rpc('mc_deny_access',{p_request_id:id});if(error)return toast(error.message);await loadAccessLists();toast('申請を拒否しました。');}
async function createInvite(){if(!isOwner())return;try{const {data,error}=await cloud.rpc('mc_create_invite',{p_workspace_id:activeWorkspace.id});if(error)throw error;const link=window.location.origin+window.location.pathname+'#invite='+data;await loadAccessLists();const box=document.getElementById('inviteLinkBox');if(box)box.innerHTML=`<p class="hint">このリンクは発行直後だけ表示されます。リンクは承認申請用です。管理者が承認するまで使用できません。</p><div class="share-link"><input id="newInviteLink" readonly value="${H(link)}"><button class="btn" data-action="copy-invite">コピー</button></div>`;actionHandlers['copy-invite']=()=>clipboard(link);toast('承認申請用の招待リンクを発行しました。');}catch(e){toast(e.message);}}
async function revokeInvite(id){if(!isOwner()||!confirm('招待リンクを無効にしますか？'))return;const {error}=await cloud.rpc('mc_revoke_invite',{p_invite_id:id});if(error)return toast(error.message);await loadAccessLists();toast('招待リンクを無効化しました。');}
async function removeViewer(id){if(!isOwner()||!confirm('この閲覧者のアクセス権限を解除しますか？'))return;const {error}=await cloud.rpc('mc_remove_viewer',{p_workspace_id:activeWorkspace.id,p_user_id:id});if(error)return toast(error.message);await loadAccessLists();toast('閲覧権限を解除しました。');}
async function unblockViewer(id){if(!isOwner()||!confirm('このユーザーを再び招待できるようにしますか？'))return;const {error}=await cloud.rpc('mc_unblock_viewer',{p_workspace_id:activeWorkspace.id,p_user_id:id});if(error)return toast(error.message);await loadAccessLists();toast('ブロックを解除しました。');}
// v3.2: Read-only Bedrock world snapshot importer. Original world data is not uploaded.
function devicePage(){
 const w=getWorld(),snap=w?.snapshot,owner=isOwner();
 const linkActive=!!linkedFolder&&linkedFolder.worldId&&db.worlds.some(x=>x.id===linkedFolder.worldId);
 return `${heading('スマホ・PCワールド連携','統合版（Bedrock）のセーブデータを読み込み、シード値・スポーン座標などをMC BASEに共有します。')}
 <div class="device-grid"><section class="panel device-card"><h3>🎮 スマホのワールドをWindowsで遊ぶ</h3><ol class="device-steps"><li>WindowsにMinecraft統合版をインストールし、スマホと同じMicrosoftアカウントでログインします（PC版の利用権が必要）。</li><li>スマホのワールドを<strong>Realms</strong>でアップロードしてWindowsでダウンロードするか、ワールドを <code>.mcworld</code> に書き出してPCへコピーします。</li><li>Windowsの統合版で「プレイ」→「ワールドをインポート」から <code>.mcworld</code> を選択します。</li><li>MC BASEの下の取り込み機能で、同じ <code>.mcworld</code> を選択します。ゲーム本体へのインポートと管理サイトへの登録は別操作です。</li></ol><p class="hint">スマホ→PCへの単発コピーでは、その後のプレイ内容は自動同期されません。複数端末で継続して同じワールドを遊ぶ場合はRealmsなどの共有ワールドが必要です。</p></section>
 <section class="panel device-card"><h3>📱 スマホ側のワールド取り出し</h3><p><strong>Android：</strong>外部ストレージ保存のワールドなら、PCへUSB接続して <code>Android/data/com.mojang.minecraftpe/files/games/com.mojang/minecraftWorlds</code> からバックアップできます。アプリ保存のワールドやアクセス制限がある場合はRealmsなどを利用します。</p><p><strong>iPhone / iPad：</strong>端末のMinecraftファイル共有・MacのFinderを利用してバックアップできます。端末・バージョンによって直接取り出しが難しいときはRealmsを利用します。</p><p><strong>PC：</strong>コピーしたワールドフォルダ内の <code>level.dat</code> を直接選んでも取り込めます。複数ファイルを扱う場合は、ワールドフォルダの内容をZIPにして <code>.mcworld</code> に変更できます。</p><p class="hint">元のワールドファイルは必ず別途バックアップを保管してください。MC BASEにはワールド全体をバックアップする機能はありません。</p></section></div>
 <section class="panel device-card" style="margin-top:16px"><h3>☁ MC BASEへワールド情報を反映</h3><p>読み取るのは<strong>ワールド名・シード値・ゲームモード・難易度・ワールド初期スポーン座標</strong>と、記録されていればバージョン情報です。元の <code>.mcworld</code> や <code>db/</code> 内のブロック・チェスト情報はサーバーへ送信しません。</p>
 ${owner?`<div class="device-actions"><button class="btn primary" data-action="choose-world-file">📦 .mcworld / .zip / level.dat を選択</button><button class="btn" data-action="choose-world-folder">📂 PCのワールドフォルダを選択</button></div><p class="hint">フォルダ連携はChrome/Edgeなど対応ブラウザのHTTPS環境のみ。ゲームの保存先フォルダを自分で選ぶ必要があります。</p>`:'<p class="machine-note">🔒 この共有スペースでは管理人のみ取り込み可能です。管理人が登録すると閲覧者の画面にも最新情報が反映されます。</p>'}
 <div id="worldImportPreview"></div></section>
 <section class="panel device-card" style="margin-top:16px"><h3>🔄 フォルダ監視と更新状態</h3><p id="folderWatchStatus">${linkActive?`🟢 「${H(linkedFolder.name)}」を60秒ごとに確認中（このブラウザを開いている間のみ）`:'⏸ 監視していません。PCのワールドフォルダを選び、情報を登録すると監視を開始できます。'}</p>
 ${owner&&linkActive?'<div class="device-actions"><button class="btn" data-action="check-folder">今すぐ確認</button><button class="btn danger" data-action="stop-folder">監視を停止</button></div>':''}
 ${snap?`<div class="import-meta"><div><small>現在のワールド</small><strong>${H(w.name)}</strong></div><div><small>最終取り込み</small><strong>${H(snap.importedAt?new Date(snap.importedAt).toLocaleString('ja-JP'):'未記録')}</strong></div><div><small>初期スポーン</small><strong>${snap.spawn?`X ${H(snap.spawn.x)} / Y ${H(snap.spawn.y)} / Z ${H(snap.spawn.z)}`:'記録なし'}</strong></div><div><small>難易度・ゲームモード</small><strong>${H(snap.difficulty||'未取得')} / ${H(snap.mode||'未取得')}</strong></div><div><small>ソース</small><strong>${H(snap.sourceFile||'level.dat')}</strong></div></div>`:'<p class="hint">選択中のワールドに取り込まれたスナップショットはまだありません。</p>'}
 <p class="hint">※ 監視は<strong>このページが開いている間だけ</strong>動きます。ゲームの保存タイミングやフォルダ権限によって反映が遅れる場合があります。Realms・スマホ内のデータを直接監視する機能ではありません。</p></section>
 <section class="panel device-card" style="margin-top:16px"><h3>⚠ 自動反映できない情報</h3><p>Microsoft/Discordアカウントにログインしただけで、所持アイテム・チェストの中身・建造物・装置・全バイオーム・スポナー位置を取得することはできません。これらは <code>db/</code> のLevelDB解析など、別の仕組みが必要です。ワールド地形の自動描画も本機能の対象外です。</p></section>`;
}
function renderWorldImportPreview(){const el=document.getElementById('worldImportPreview');if(!el)return;if(!worldImportDraft){el.innerHTML='<div class="world-import-placeholder">ワールドファイルまたはフォルダを選択すると、読み取った情報をここに表示します。</div>';return;}
 const m=worldImportDraft;
 const opts=`<option value="__new__">＋ 新しいワールドとして追加</option>${db.worlds.map(w=>`<option value="${H(w.id)}" ${w.id===db.selectedWorld?'selected':''}>既存：「${H(w.name)}」${w.seed&&m.seed&&w.seed!==m.seed?'（シードが異なります）':''}</option>`).join('')}`;
 el.innerHTML=`<div class="import-preview"><h4>📋 読み取り結果（保存前）</h4><div class="import-meta"><div><small>名前</small><strong>${H(m.name||'未設定')}</strong></div><div><small>シード値</small><strong class="break-text">${H(m.seed||'未取得')}</strong></div><div><small>初期スポーン</small><strong>${m.spawn?`X ${H(m.spawn.x)} Y ${H(m.spawn.y)} Z ${H(m.spawn.z)}`:'未取得'}</strong></div><div><small>ゲームモード・難易度</small><strong>${H(m.mode||'不明')} / ${H(m.difficulty||'不明')}</strong></div><div><small>バージョン</small><strong>${H(m.version||m.baseGameVersion||'未取得')}</strong></div><div><small>読み込んだファイル</small><strong class="break-text">${H(m.sourceFile)}</strong></div></div><div class="field"><label for="worldImportTarget">情報の反映先</label><select id="worldImportTarget" class="filter" style="max-width:100%;width:100%">${opts}</select></div><p class="hint">既存ワールドへの反映では、登録済みの名前・手動座標・資材・建築計画を保持します。シード値が一致しないワールドには上書きできません。</p><button class="btn primary" data-action="commit-world-snapshot">✓ 管理データに反映する</button></div>`;
}
async function readWorldSnapshot(file,folderHandle){if(!isOwner())return toast('管理人のみ取り込めます。');
 const preview=document.getElementById('worldImportPreview');if(preview)preview.innerHTML='<p class="hint">📂 ワールドファイルを読み取り中です...</p>';
 try{if(!window.MCWorldImporter)throw Error('解析用スクリプトを読み込めていません。');const result=await window.MCWorldImporter.extractWorldInfo(file);worldImportDraft=result;pendingFolderHandle=folderHandle||null;renderWorldImportPreview();toast('ワールド情報を読み取りました。反映先を確認してください。');}
 catch(e){worldImportDraft=null;pendingFolderHandle=null;if(preview)preview.innerHTML=`<p class="warning">読み取り失敗：${H(e.message)}</p>`;toast('ワールドファイルを読み取れませんでした。');}
}
async function pickWorldFolder(){if(!isOwner())return;
 if(!window.showDirectoryPicker)return toast('このブラウザはフォルダ連携に未対応です。Chrome/EdgeのHTTPSページでお試しください。');
 try{const dir=await window.showDirectoryPicker({mode:'read'});const handle=await dir.getFileHandle('level.dat');const file=await handle.getFile();await readWorldSnapshot(file,dir);}
 catch(e){if(e.name!=='AbortError')toast('選択したフォルダ直下にlevel.datが必要です：'+e.message);}
}
function applyWorldMetadata(world,meta){
 if(world.seed&&meta.seed&&world.seed!==meta.seed)throw Error('シード値が一致しません。別のワールドに取り込めません。');
 if(world.edition==='Java版'&&world.seed)throw Error('Java版として登録されたワールドには統合版の情報を上書きできません。');
 if(meta.seed&&!world.seed)world.seed=meta.seed;
 if(meta.mode)world.mode=meta.mode;
 world.edition='統合版（Bedrock）';
 if(meta.version)world.version=meta.version;
 world.snapshot={sourceFile:meta.sourceFile,importedAt:meta.importedAt||new Date().toISOString(),seed:meta.seed||null,spawn:meta.spawn||null,mode:meta.mode||null,difficulty:meta.difficulty||null,version:meta.version||null,baseGameVersion:meta.baseGameVersion||null};
 if(meta.spawn){let spawn=db.coords.find(c=>c.worldId===world.id&&c.importSource==='bedrock-world-spawn');if(!spawn){spawn={id:makeId(),worldId:world.id,name:'初期スポーン（セーブデータ）',dimension:'オーバーワールド',category:'拠点',importSource:'bedrock-world-spawn',createdAt:today()};db.coords.push(spawn);}
 spawn.x=meta.spawn.x;spawn.y=meta.spawn.y;spawn.z=meta.spawn.z;spawn.note='level.dat に記録されたワールドのスポーン地点（プレイヤーの現在座標ではありません）';}
}
function commitWorldSnapshot(){if(!isOwner()||!worldImportDraft)return;const m=worldImportDraft;
 const dest=document.getElementById('worldImportTarget')?.value||'__new__';let w=dest==='__new__'?null:db.worlds.find(x=>x.id===dest);
 if(dest!=='__new__'&&!w)return toast('反映先のワールドが見つかりません。');
 if(w&&w.seed&&m.seed&&w.seed!==m.seed)return toast('シード値が違います。「新しいワールド」を選んでください。');
 const confirmText=w?`既存ワールド「${w.name}」へ、セーブデータの情報を反映しますか？\n（名前・資材・手動座標は保持します）`:`「${m.name||'取り込んだワールド'}」を新しい共有ワールドとして追加しますか？`;
 if(!confirm(confirmText))return;
 try{
  if(!w){w={id:makeId(),name:m.name||'取り込んだワールド',edition:'統合版（Bedrock）',mode:m.mode||'サバイバル',seed:'',version:'',note:'',createdAt:today()};db.worlds.unshift(w);
   db.goals.push(...DEFAULT_GOALS.map(([category,name])=>({id:makeId(),worldId:w.id,category,name,note:'',done:false,createdAt:today()})));}
  applyWorldMetadata(w,m);db.selectedWorld=w.id;recordActivity(`統合版セーブデータ「${m.name||w.name}」から情報を取り込み`);save();
  const dir=pendingFolderHandle;worldImportDraft=null;pendingFolderHandle=null;
  if(dir)startFolderWatcher(dir,w,m);changePage('device');toast('ワールド情報を共有保存します。クラウド同期状態をご確認ください。');
 }catch(e){toast('反映できません：'+e.message);}
}
function stopFolderWatcher(notify){if(folderWatchTimer)clearInterval(folderWatchTimer);folderWatchTimer=null;linkedFolder=null;folderWatchBusy=false;if(notify){if(page==='device')render();toast('フォルダ監視を停止しました。');}}
function startFolderWatcher(handle,w,meta){stopFolderWatcher(false);linkedFolder={handle,name:handle.name,worldId:w.id,seed:meta.seed||w.seed,lastModified:null};
 folderWatchTimer=setInterval(()=>checkLinkedFolder(true),60000);
}
async function checkLinkedFolder(silent){if(!isOwner()||!linkedFolder||folderWatchBusy)return;folderWatchBusy=true;
 try{const link=linkedFolder,w=db.worlds.find(x=>x.id===link.worldId);if(!w)throw Error('共有先のワールドが削除されました。');
 const fh=await link.handle.getFileHandle('level.dat');const f=await fh.getFile();
 if(link.lastModified===f.lastModified){if(!silent)toast('ファイルの更新はありません。');return;}
 const meta=await window.MCWorldImporter.extractWorldInfo(f);
 if(w.seed&&meta.seed&&w.seed!==meta.seed)throw Error('ワールドのシード値が変わりました。自動反映を停止します。');
 meta.sourceFile='PCフォルダ: '+link.name+'/level.dat';link.lastModified=f.lastModified;
 if(meta.seed===w.snapshot?.seed&&JSON.stringify(meta.spawn||null)===JSON.stringify(w.snapshot?.spawn||null)&&meta.mode===w.snapshot?.mode&&meta.difficulty===w.snapshot?.difficulty&&meta.version===w.snapshot?.version){if(!silent)toast('ワールド情報に変更はありません。');return;}
 applyWorldMetadata(w,meta);recordActivity(`PCフォルダのワールド情報を再読み込み`);save();if(page==='device')render();if(!silent)toast('フォルダの最新ワールド情報を共有保存します。');
 }catch(e){stopFolderWatcher(false);toast('フォルダ連携を停止しました：'+e.message);if(page==='device')render();}finally{folderWatchBusy=false;}
}
// Actual terrain/biome map is provided by the third-party Seedmap embed.
// A seed alone does not create terrain in MC BASE's schematic canvas.
// Links include only the world seed, selected version, and viewing coordinates.
function mcSeedmapVersion(w){
 const bedrock=String(w.edition||'').includes('統合版');
 const v=String(w.version||'').trim();
 if(bedrock){
  if(/^1\.21(?:\.|$)/.test(v))return 'be1.21.130';
  if(/^26\.50(?:\.|$)/.test(v))return 'be26.50';
  return 'be26.50';
 }
 return '26.3';
}
function mcSeedmapUrl(w,embed){
 const seed=String(w.seed||'').trim();
 if(!seed)return '';
 const u=new URL(embed?'https://seedmap.etnx.sh/embed':'https://seedmap.etnx.sh/');
 u.searchParams.set('seed',seed);
 u.searchParams.set('v',mcSeedmapVersion(w));
 const spawn=w.snapshot?.spawn;
 const x=Number(spawn?.x), z=Number(spawn?.z);
 u.searchParams.set('x',Number.isFinite(x)&&Math.abs(x)<30000001?String(Math.trunc(x)):'0');
 u.searchParams.set('z',Number.isFinite(z)&&Math.abs(z)<30000001?String(Math.trunc(z)):'0');
 u.searchParams.set('zoom','-3');
 return u.href;
}
function mcSeedTerrainPanel(w){
 if(!String(w.seed||'').trim())return '<section class="panel" style="padding:18px"><h3>🗺️ 地形・バイオームマップ</h3><p>シード値が未登録です。ワールド管理からシードを入力するか、統合版セーブデータを読み込んでください。</p></section>';
 const embed=mcSeedmapUrl(w,true),full=mcSeedmapUrl(w,false),version=mcSeedmapVersion(w);
 return `<section class="panel" style="padding:14px;margin-top:14px">
 <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:9px">
  <div><h3 style="margin:0 0 4px">🌍 地形・バイオームマップ（外部シードマップ連携）</h3>
  <p class="hint" style="margin:0">シード：${H(w.seed)} / 判定バージョン：${H(version)} / ${String(w.edition||'').includes('統合版')?'統合版':'Java版'}</p></div>
  <a class="btn primary" href="${H(full)}" target="_blank" rel="noopener noreferrer">🗺 詳細地図を開く ↗</a>
 </div>
 <iframe title="ワールドの地形・バイオームマップ（外部Seedmap）" src="${H(embed)}" loading="eager" referrerpolicy="no-referrer" allowfullscreen style="display:block;width:100%;height:560px;max-height:75vh;min-height:360px;border:1px solid #375e43;border-radius:10px;background:#16261c"></iframe>
 <p class="hint" style="margin:11px 0 0">※ 外部のSeedmapを埋め込んでいます。シード値・バージョン・表示座標が外部サイトのURLに含まれます。地形はワールド生成結果の予測図で、建築物や現在のチェスト位置を表すものではありません。バージョンが違う場合は「詳細地図」で変更してください。地図が表示されない場合も「詳細地図を開く」から確認できます。</p>
 </section>`;
}

function mapPage(){if(!getWorld())return pageGuard();const w=getWorld(),java=w.edition!=='統合版（Bedrock）';return `${heading('シードマップ','登録したシードから地形・バイオームマップを表示します。登録地点の座標グリッドも従来どおり使えます。')}
<div class="panel" style="padding:15px 20px;margin-bottom:16px"><span class="pill ${isOwner()?'done':'blue'}">${isOwner()?'✎ 管理人：シード編集可':'🔒 閲覧者：シード編集不可'}</span><p style="font-size:12px;color:#cbd9ce">🌍 ${H(w.name)}　/　${H(w.edition||'Java版')}　/　Version: ${H(w.version||'未設定')}</p><div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><strong style="overflow-wrap:anywhere">🔑 ${w.seed?H(w.seed):'シード未登録'}</strong><button class="btn sm" data-action="copy-seed" ${!w.seed?'disabled':''}>コピー</button>${isOwner()?`<button class="btn sm" data-action="edit" data-kind="worlds" data-id="${H(w.id)}">✎ シード値を設定</button>`:''}</div></div>
${mcSeedTerrainPanel(w)}
<details class="panel" style="padding:14px;margin-top:16px"><summary style="cursor:pointer;font-weight:700;padding:6px 2px">📍 座標グリッド・登録地点・スライムチャンクの模式図を開く</summary>
<div class="map-layout" style="margin-top:14px"><section class="panel map-pane"><div class="map-controls"><button class="btn sm" data-action="map-pan" data-dx="-7" data-dz="0">◀ 西</button><button class="btn sm" data-action="map-pan" data-dx="0" data-dz="-7">▲ 北</button><button class="btn sm" data-action="map-pan" data-dx="0" data-dz="7">▼ 南</button><button class="btn sm" data-action="map-pan" data-dx="7" data-dz="0">東 ▶</button><button class="btn sm" data-action="map-zoom" data-step="-6">−</button><button class="btn sm" data-action="map-zoom" data-step="6">＋</button></div><div class="map-controls"><input id="mapJumpX" type="number" placeholder="X座標" style="width:112px;padding:8px;color:white;border:1px solid #3c6142;border-radius:7px;background:#13241a"><input id="mapJumpZ" type="number" placeholder="Z座標" style="width:112px;padding:8px;color:white;border:1px solid #3c6142;border-radius:7px;background:#13241a"><button class="btn sm" data-action="map-jump">座標へ移動</button></div><p class="map-coord" id="mapPosition">地図を読み込み中...</p><canvas id="mapCanvas" class="map-canvas" width="840" height="580" aria-label="スライムチャンクと登録済み座標の模式マップ"></canvas><div class="map-key"><span><i class="map-swatch" style="background:#4d9851"></i>Java版スライムチャンク</span><span><i class="map-swatch" style="background:#efbe74"></i>登録座標</span><span><i class="map-swatch" style="background:#92c9ff"></i>原点</span></div><p class="help">※ このマップは<strong>模式図</strong>です。実際の地形やバイオームを生成した画像ではありません。Java版のみスライムチャンクをシード値から正確に判定します。</p></section>
<section class="panel map-side"><h3>🌳 バイオーム・構造物・スポナー</h3><p>実際のバイオーム分布、スポナー候補、村・要塞などは外部の専用シードマップで確認できます。リンク先でシード値・エディション・バージョンを設定してください。</p><button class="btn primary" data-action="open-chunkbase">🗺 Chunkbaseを開く ↗</button><button class="btn" data-action="copy-seed" ${!w.seed?'disabled':''}>📋 シード値をコピー</button><div class="detail-hint">スポナーはシード予測だけでは外れる場合があります。現地で発見した座標を「座標メモ」の種類「スポナー」として登録してください。</div><h3 style="margin-top:20px">📍 登録済み地点</h3><div style="max-height:290px;overflow-y:auto">${records('coords').filter(x=>x.dimension==='オーバーワールド').slice(0,30).map(x=>`<p style="border-bottom:1px solid #304437;padding:4px 0">${x.category==='スポナー'?'🕷️':x.category==='バイオーム'?'🌳':'📍'} <strong>${H(x.name)}</strong><br>X:${H(x.x)} Z:${H(x.z)} ・ ${H(x.category||'地点')}<br><button class="btn sm" data-action="map-focus" data-x="${H(x.x)}" data-z="${H(x.z)}">地図で表示</button></p>`).join('')||'<p>登録座標はありません。</p>'}</div>${isOwner()?'<button class="btn" data-action="map-new-coord">＋ 確認済み座標を登録</button>':''}<p style="font-size:11px;margin-top:20px">${!java?'統合版のスライムチャンクはJava版とは計算方法が違うため、この模式図では表示しません。':!w.seed?'シード値が未登録のため、計算結果を表示できません。':'スライム判定はJava版のシード計算式に基づきます。'}</p></section></div></details>`}
function minecraftSeed(raw){const v=String(raw||'').trim();if(!v)return null;if(/^-?\d+$/.test(v)){try{return BigInt.asIntN(64,BigInt(v));}catch{return null;}}let h=0;for(let i=0;i<v.length;i++){h=(Math.imul(31,h)+v.charCodeAt(i))|0;}return BigInt(h);}
function isSlime(seed,cx,cz){const a=BigInt(cx),b=BigInt(cz),i32=v=>BigInt.asIntN(32,v),mask=(1n<<48n)-1n;
 const combined=(seed+i32(a*a*0x4c1906n)+i32(a*0x5ac0dbn)+i32(b*b)*0x4307a7n+i32(b*0x5f24fn))^0x3ad8025fn;
 let state=(combined^0x5deece66dn)&mask;
 for(let tries=0;tries<5;tries++){state=(state*0x5deece66dn+0xbn)&mask;const bits=Number(state>>17n),value=bits%10;if(bits-value+9<2147483648)return value===0;}return false;
}
function drawMap(){const canvas=document.getElementById('mapCanvas');if(!canvas)return;const ctx=canvas.getContext('2d'),w=getWorld();if(!w)return;const cw=canvas.width,ch=canvas.height,c=mapCell,cols=Math.ceil(cw/c),rows=Math.ceil(ch/c),ccx=Math.floor(mapCenterX/16),ccz=Math.floor(mapCenterZ/16),startX=ccx-Math.floor(cols/2),startZ=ccz-Math.floor(rows/2),seed=minecraftSeed(w.seed),java=w.edition!=='統合版（Bedrock）';
 ctx.clearRect(0,0,cw,ch);ctx.fillStyle='#16261c';ctx.fillRect(0,0,cw,ch);let count=0;
 for(let z=0;z<=rows;z++)for(let x=0;x<=cols;x++){const cx=startX+x,cz=startZ+z,pX=x*c,pY=z*c,slime=seed!==null&&java&&isSlime(seed,cx,cz);if(slime)count++;ctx.fillStyle=slime?'#3d8950':(x+z)%2===0?'#1d3024':'#1b2c22';ctx.fillRect(pX,pY,c-1,c-1);if(cx===0&&cz===0){ctx.fillStyle='#72bced';ctx.fillRect(pX+c/2-5,pY+c/2-5,10,10);}if(c>=31&&(cx%4===0||cz%4===0)){ctx.fillStyle='#a4b9a355';ctx.font='11px sans-serif';if(c>=35)ctx.fillText(`${cx*16}`,pX+3,pY+12);}}
 const visible=records('coords').filter(a=>a.dimension==='オーバーワールド');
 for(const m of visible){const x=(Number(m.x)/16-startX)*c,z=(Number(m.z)/16-startZ)*c;if(x<0||z<0||x>cw||z>ch)continue;ctx.beginPath();ctx.arc(x,z,6,0,Math.PI*2);ctx.fillStyle=m.category==='スポナー'?'#fe7d91':m.category==='バイオーム'?'#b6a5f8':'#efbe74';ctx.fill();ctx.strokeStyle='#07160e';ctx.lineWidth=2;ctx.stroke();if(c>=24){ctx.fillStyle='#f8f3d8';ctx.font='bold 12px sans-serif';ctx.fillText(String(m.name||'').slice(0,11),x+9,z-8);}}
 liveOverlay(ctx,a=>(a/16-startX)*c,b=>(b/16-startZ)*c,'オーバーワールド',cw,ch);realmsOverlay(ctx,a=>(a/16-startX)*c,b=>(b/16-startZ)*c,'オーバーワールド',cw,ch);
 const label=document.getElementById('mapPosition');if(label)label.textContent=`中心 X: ${ccx*16} / Z: ${ccz*16}　・　1マス＝16×16ブロック　・　表示中のスライムチャンク ${seed!==null&&java?count+'個':'未表示'}`;
 if(!canvas.dataset.bound){canvas.dataset.bound='1';canvas.addEventListener('pointerdown',e=>{mapDrag={x:e.clientX,z:e.clientY,cx:mapCenterX,cz:mapCenterZ};canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointerup',e=>{if(!mapDrag)return;const ratio=canvas.width/canvas.getBoundingClientRect().width;mapCenterX=mapDrag.cx-(e.clientX-mapDrag.x)*ratio/mapCell*16;mapCenterZ=mapDrag.cz-(e.clientY-mapDrag.z)*ratio/mapCell*16;mapDrag=null;drawMap();});canvas.addEventListener('pointercancel',()=>mapDrag=null);}
}

// MC BASE v4 — integrated module; included inside app.js closure.
const U = {
  chatMessages: [], chatWorld: '', chatBusy: false, chatTimer: null, chatChannel: null,
  mapLayers: [], mapWorld: '', selectedLayer: null, atlasImage: null,
  atlasWorld: '', atlasCenterX: 0, atlasCenterZ: 0, atlasScale: 0.65,
  anim: null, animFrame: null, animStart: 0, animPaused: true, animPhase: 0,
  demoType: 'cane', lastChatLoad: 0
};
const escU=s=>H(String(s??''));
const fmtTimeU=s=>{try{return new Date(s).toLocaleString('ja-JP',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'});}catch{return '';}};
function uError(e){toast('処理できません: '+String(e?.message||e).slice(0,120));}
function uWorkspace(){return activeWorkspace?.id;}
function uOnline(){return !!cloud&&!!activeWorkspace;}
function uClear(){
 if(U.chatTimer)clearInterval(U.chatTimer); U.chatTimer=null;
 if(U.chatChannel&&cloud)cloud.removeChannel(U.chatChannel);U.chatChannel=null;
 if(U.animFrame)cancelAnimationFrame(U.animFrame);U.animFrame=null;
 U.chatWorld='';U.mapWorld='';U.selectedLayer=null;U.atlasImage=null;U.mapLayers=[];U.chatMessages=[];
}
function uRenderPageInit(){
 if(page==='unichat'){uStartChat();}
 if(page==='atlas'){uStartAtlas();}
 if(page==='demo'){uDrawDemo();}
}

// ---------- Authenticated workspace chat ----------
function unichat(){
 return `${heading('統合チャット','Web・Discord・統合版専用サーバーの会話を、ワールド単位で一か所にまとめます。')}
 <div class="u-notice"><strong>接続方法</strong> Webのメッセージはすぐに共有されます。DiscordはCloudflare Workerの定期同期（通常最大約1分＋処理遅延）、Minecraftは専用サーバーのアドオンが必要です。ローカルワールド・Realmsは自動中継非対応です。</div>
 <div class="u-layout"><section class="panel u-chat-panel"><div class="u-chat-title"><div><strong>💬 ${escU(getWorld()?.name||'ワールド')}</strong><small id="uChatStatus">受信準備中...</small></div><button type="button" class="btn sm" data-action="u-chat-refresh">↻ 更新</button></div>
 <div id="uChatLog" class="u-chatlog" aria-live="polite"><p class="hint">メッセージを読み込み中...</p></div>
 <form id="uChatForm" class="u-chat-form"><input type="text" id="uChatInput" required maxlength="500" placeholder="全チャットに共有するメッセージ（最大500文字）" autocomplete="off"><button type="submit" class="btn primary" id="uSendButton">送信</button></form>
 <p class="hint">このワールドのチャットは招待メンバー全員が閲覧できます。個人情報や機密情報を送らないでください。</p></section>
 <aside class="panel u-chat-help"><h3>連携先</h3><div class="u-connector"><b>🌐 WEB</b><span class="pill done">Discordログイン後利用可</span><p>閲覧者も送信できます。Supabase Realtimeで新着表示。</p></div>
 <div class="u-connector"><b>💠 Discord</b><span class="pill blue">Worker接続後</span><p>Botを指定チャンネルへ招待し、Workerを毎分実行します。</p></div>
 <div class="u-connector"><b>⛏️ Minecraft 統合版</b><span class="pill mid">BDS限定・実験的</span><p>対応するBedrock Dedicated Serverに通信アドオンを導入します。</p></div>
 ${isOwner()?`<div class="u-connector"><b>管理人の中継設定ID</b><p>WORKSPACE_ID</p><code class="u-code">${escU(uWorkspace())}</code><p>WORLD_ID</p><code class="u-code">${escU(db.selectedWorld)}</code><p>Workerの環境変数へ入力してください。これらは秘密鍵ではありません。</p></div>`:''}<div class="u-connector"><b>🔒 プライバシー</b><p>Discord側のチャンネル権限も限定公開にしてください。招待リンクを知る人でも、Discordログインとワークスペース権限が必要です。</p></div></aside></div>`;
}
async function uLoadChat(silent=false){
 if(!uOnline())return;
 if(U.chatBusy)return;U.chatBusy=true;
 const workspace=uWorkspace(),worldId=db.selectedWorld;
 try{
  const q=await cloud.from('mc_chat_messages').select('id,world_id,source,author,content,created_at').eq('workspace_id',workspace).eq('world_id',worldId).order('id',{ascending:false}).limit(150);
  if(q.error)throw q.error;
  if(uWorkspace()!==workspace||db.selectedWorld!==worldId)return;
  const previous=U.chatMessages[U.chatMessages.length-1]?.id;
  U.chatMessages=(q.data||[]).reverse();U.chatWorld=workspace+':'+worldId;
  uRenderChat(!silent||previous!==U.chatMessages[U.chatMessages.length-1]?.id);
 }catch(e){const e2=document.getElementById('uChatStatus');if(e2)e2.textContent='読込失敗：SQLを確認';if(!silent)uError(e);}finally{U.chatBusy=false;}
}
function uRenderChat(autoscroll=true){
 const el=document.getElementById('uChatLog');if(!el)return;
 const nearBottom=el.scrollHeight-el.scrollTop-el.clientHeight<110;
 el.innerHTML=U.chatMessages.map(m=>`<div class="u-message"><div class="u-chat-meta"><span class="u-source ${escU(m.source)}">${m.source==='discord'?'Discord':m.source==='minecraft'?'Minecraft':'Web'}</span><strong>${escU(m.author)}</strong><time>${fmtTimeU(m.created_at)}</time></div><div class="u-content">${escU(m.content)}</div></div>`).join('')||'<div class="u-chatempty">まだメッセージはありません。最初の投稿をしてみましょう。</div>';
 if((autoscroll&&nearBottom)||U.chatMessages.length<3)el.scrollTop=el.scrollHeight;
 const status=document.getElementById('uChatStatus');if(status)status.textContent=`${U.chatMessages.length}件表示 ・ ${new Date().toLocaleTimeString('ja-JP',{hour:'2-digit',minute:'2-digit'})} 更新`;
}
function uStartChat(){
 if(!uOnline())return;
 const key=uWorkspace()+':'+db.selectedWorld;
 if(U.chatWorld!==key){U.chatMessages=[];U.chatWorld=key;uLoadChat();}else uRenderChat();
 if(!U.chatTimer)U.chatTimer=setInterval(()=>{if(page==='unichat'&&uOnline())uLoadChat(true);},15000);
 if(U.chatChannel&&cloud)cloud.removeChannel(U.chatChannel);
 U.chatChannel=cloud.channel('mc-chat-'+uWorkspace()).on('postgres_changes',{event:'INSERT',schema:'public',table:'mc_chat_messages',filter:'workspace_id=eq.'+uWorkspace()},payload=>{if(page==='unichat'&&payload.new?.world_id===db.selectedWorld)uLoadChat(true);}).subscribe();
}
async function uSendChat(e){e.preventDefault();if(!uOnline())return toast('ログインが必要です。');
 const input=document.getElementById('uChatInput');if(!input)return;const content=input.value.trim();if(!content||content.length>500)return toast('1〜500文字で入力してください。');
 const btn=document.getElementById('uSendButton');if(btn)btn.disabled=true;
 const author=String(session.user.user_metadata?.full_name||session.user.email?.split('@')[0]||'ゲスト').slice(0,48);
 try{const {error}=await cloud.from('mc_chat_messages').insert({workspace_id:uWorkspace(),world_id:db.selectedWorld,source:'web',author,author_id:session.user.id,content});if(error)throw error;input.value='';await uLoadChat(true);}catch(e2){uError(e2);}finally{if(btn)btn.disabled=false;}
}

// ---------- Private map image overlay & named coordinates ----------
function atlas(){if(!getWorld())return pageGuard();const w=getWorld();return `${heading('統合版ワールドマップ','アップロードした地図画像に実際の座標を重ね、iPhone・PCから共有します。')}
 <div class="u-notice"><strong>地図の種類を明確に：</strong> 画像を登録するまでは座標グリッドを表示します。シード値だけから世界をゲーム内どおりに描画する機能ではありません。ゲーム内マップの画像や外部で正規に生成した画像を、座標範囲と一緒に登録すると地形付きで閲覧できます。</div>
 <div class="u-atlas-head panel"><div>🌍 <b>${escU(w.name)}</b> <span class="pill">${escU(w.edition)}</span> <span>シード：${escU(w.seed||'未設定')}</span></div><div class="u-atlas-buttons"><button class="btn sm" data-action="u-atlas-reset">原点へ</button><button class="btn sm" data-action="u-atlas-zoom" data-dir="1">＋</button><button class="btn sm" data-action="u-atlas-zoom" data-dir="-1">−</button><button class="btn sm" data-action="open-chunkbase">シードを外部マップで調べる ↗</button></div></div>
 <div class="u-atlas-layout"><section class="panel u-map-holder"><canvas id="uAtlasCanvas" width="960" height="600" aria-label="登録座標とワールド地図"></canvas><div class="u-map-footer"><span id="uAtlasStatus">地図を準備中</span><span>ドラッグで移動／ホイールで拡大縮小</span></div></section>
 <aside class="panel u-atlas-side"><h3>登録した地図</h3><div id="uAtlasLayers"><p class="hint">読み込み中...</p></div>
 ${isOwner()?`<div class="u-map-form"><h4>🔒 管理人：地図画像の登録</h4><label>PNG/JPG画像（最大10MB）<input id="uMapFile" type="file" accept="image/png,image/jpeg,image/webp"></label><div class="u-2cols"><label>左端 X<input id="uMapXMin" type="number" value="-512"></label><label>右端 X<input id="uMapXMax" type="number" value="512"></label><label>上端 Z<input id="uMapZMin" type="number" value="-512"></label><label>下端 Z<input id="uMapZMax" type="number" value="512"></label></div><label>表示する次元<select id="uMapDimension"><option>オーバーワールド</option><option>ネザー</option><option>エンド</option></select></label><button class="btn primary" data-action="u-map-upload">地図画像をクラウド保存</button></div>`:''}
 <div class="u-legend"><h4>📌 登録座標</h4><div id="uAtlasMarkers">${uCoordsSide()}</div>${isOwner()?'<button class="btn sm" data-action="map-new-coord">＋ 座標を追加</button>':''}</div></aside></div>`;}
function uCoordsSide(){return records('coords').slice(0,40).map(c=>`<button class="u-marker-row" data-action="u-atlas-focus" data-x="${escU(c.x)}" data-z="${escU(c.z)}"><strong>📍 ${escU(c.name)}</strong><small>X ${escU(c.x)} / Z ${escU(c.z)}</small></button>`).join('')||'<p class="hint">座標登録はまだありません。</p>';}
async function uStartAtlas(){
 if(!uOnline())return;
 const key=uWorkspace()+':'+db.selectedWorld;
 if(U.mapWorld!==key){U.mapWorld=key;U.selectedLayer=null;U.atlasImage=null;U.mapLayers=[];U.atlasCenterX=0;U.atlasCenterZ=0;U.atlasScale=0.65;uLoadLayers();}
 else {uRenderLayers();uDrawAtlas();}
 const canvas=document.getElementById('uAtlasCanvas');if(!canvas)return;
 let drag=null;
 canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,cx:U.atlasCenterX,cz:U.atlasCenterZ};canvas.setPointerCapture(e.pointerId);});
 canvas.addEventListener('pointerup',e=>{if(!drag)return;const r=canvas.width/canvas.getBoundingClientRect().width;U.atlasCenterX=drag.cx-(e.clientX-drag.x)*r/U.atlasScale;U.atlasCenterZ=drag.cz-(e.clientY-drag.y)*r/U.atlasScale;drag=null;uDrawAtlas();});
 canvas.addEventListener('pointercancel',()=>drag=null);
 canvas.addEventListener('wheel',e=>{e.preventDefault();U.atlasScale=Math.max(.08,Math.min(12,U.atlasScale*(e.deltaY<0?1.17:1/1.17)));uDrawAtlas();},{passive:false});
 uDrawAtlas();
}
async function uLoadLayers(){
 const ws=uWorkspace(),wo=db.selectedWorld;
 try{const {data,error}=await cloud.from('mc_map_layers').select('id,world_id,dimension,storage_path,x_min,x_max,z_min,z_max,created_at').eq('workspace_id',ws).eq('world_id',wo).order('created_at',{ascending:false});if(error)throw error;
  if(uWorkspace()!==ws||db.selectedWorld!==wo)return;
  U.mapLayers=data||[];uRenderLayers();if(U.mapLayers.length)await uSelectLayer(U.mapLayers[0].id);else uDrawAtlas();
 }catch(e){const el=document.getElementById('uAtlasLayers');if(el)el.textContent='読込失敗：SQL/Storage設定を確認';}
}
function uRenderLayers(){const el=document.getElementById('uAtlasLayers');if(!el)return;
 el.innerHTML=U.mapLayers.map(l=>`<div class="u-layer-row"><button class="btn sm ${U.selectedLayer===l.id?'primary':''}" data-action="u-map-select" data-id="${escU(l.id)}">🗺️ ${escU(l.dimension)} ${fmtTimeU(l.created_at)}</button>${isOwner()?`<button title="削除" class="btn sm danger" data-action="u-map-delete" data-id="${escU(l.id)}">×</button>`:''}</div>`).join('')||'<p class="hint">地図画像はまだありません。登録地点はグリッド上で確認できます。</p>';
}
async function uSelectLayer(id){const item=U.mapLayers.find(x=>x.id===id);if(!item)return;
 try{const {data,error}=await cloud.storage.from('mc-base-maps').createSignedUrl(item.storage_path,1800);if(error)throw error;
  const img=new Image();img.onload=()=>{if(U.selectedLayer!==id)return;U.atlasImage=img;U.atlasCenterX=(item.x_min+item.x_max)/2;U.atlasCenterZ=(item.z_min+item.z_max)/2;const scaleX=920/(item.x_max-item.x_min),scaleY=560/(item.z_max-item.z_min);U.atlasScale=Math.min(scaleX,scaleY);uDrawAtlas();};img.onerror=()=>toast('地図画像が開けません。署名URLを確認してください。');U.selectedLayer=id;U.atlasImage=null;uRenderLayers();img.src=data.signedUrl;
 }catch(e){uError(e);}
}
function uDrawAtlas(){const c=document.getElementById('uAtlasCanvas');if(!c)return;const ctx=c.getContext('2d');const W=c.width,Z=c.height,S=U.atlasScale,cx=U.atlasCenterX,cz=U.atlasCenterZ;
 ctx.fillStyle='#15251b';ctx.fillRect(0,0,W,Z);
 const px=(x)=>W/2+(x-cx)*S,py=(z)=>Z/2+(z-cz)*S;
 const layer=U.mapLayers.find(l=>l.id===U.selectedLayer);
 if(layer&&U.atlasImage)ctx.drawImage(U.atlasImage,px(layer.x_min),py(layer.z_min),(layer.x_max-layer.x_min)*S,(layer.z_max-layer.z_min)*S);
 const g=S>=.3?64:S>=.12?256:512;const x0=Math.floor((cx-W/2/S)/g)*g,x1=cx+W/2/S,z0=Math.floor((cz-Z/2/S)/g)*g,z1=cz+Z/2/S;
 ctx.strokeStyle='rgba(220,255,220,.19)';ctx.lineWidth=1;ctx.font='12px system-ui';ctx.fillStyle='rgba(231,250,228,.77)';
 for(let x=x0;x<=x1;x+=g){const p=px(x);ctx.beginPath();ctx.moveTo(p,0);ctx.lineTo(p,Z);ctx.stroke();ctx.fillText('X '+x,p+4,14);}
 for(let z=z0;z<=z1;z+=g){const p=py(z);ctx.beginPath();ctx.moveTo(0,p);ctx.lineTo(W,p);ctx.stroke();ctx.fillText('Z '+z,7,p-4);}
 ctx.strokeStyle='#e8ca77';ctx.beginPath();ctx.moveTo(px(0),0);ctx.lineTo(px(0),Z);ctx.moveTo(0,py(0));ctx.lineTo(W,py(0));ctx.stroke();
 const dim=layer?.dimension||'オーバーワールド';
 for(const m of records('coords').filter(x=>x.dimension===dim)){
  const x=px(Number(m.x)),y=py(Number(m.z));if(x<-25||y<-25||x>W+25||y>Z+25)continue;
  ctx.fillStyle=m.category==='スポナー'?'#f87171':m.category==='バイオーム'?'#c084fc':'#fde68a';ctx.beginPath();ctx.arc(x,y,6,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#0f1a13';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#fff';ctx.font='bold 13px system-ui';ctx.fillText(String(m.name).slice(0,18),x+10,y-9);
 }
 liveOverlay(ctx,px,py,dim,W,Z);realmsOverlay(ctx,px,py,dim,W,Z);
 const el=document.getElementById('uAtlasStatus');if(el)el.textContent=`中心 X ${Math.round(cx)} / Z ${Math.round(cz)} ・ 画像${U.atlasImage?'あり':'なし'} ・ ${dim}`;
}
async function uUploadMap(){if(!isOwner())return toast('地図の登録は管理人のみです。');const file=document.getElementById('uMapFile')?.files?.[0];if(!file)return toast('地図画像を選択してください。');if(file.size>10*1024*1024)return toast('画像は10MB以下にしてください。');if(!['image/png','image/jpeg','image/webp'].includes(file.type))return toast('PNG/JPG/WEBPのみ対応です。');
 const minX=Number(document.getElementById('uMapXMin').value),maxX=Number(document.getElementById('uMapXMax').value),minZ=Number(document.getElementById('uMapZMin').value),maxZ=Number(document.getElementById('uMapZMax').value);
 if(![minX,maxX,minZ,maxZ].every(Number.isSafeInteger)||minX>=maxX||minZ>=maxZ)return toast('座標範囲を確認してください。');
 const dim=document.getElementById('uMapDimension').value;const ws=uWorkspace();const wo=db.selectedWorld;const path=`${ws}/${wo}/${crypto.randomUUID()}.${file.type==='image/png'?'png':file.type==='image/jpeg'?'jpg':'webp'}`;
 const button=document.querySelector('[data-action="u-map-upload"]');if(button)button.disabled=true;
 try{const saved=await cloud.storage.from('mc-base-maps').upload(path,file,{cacheControl:'3600',upsert:false,contentType:file.type});if(saved.error)throw saved.error;
  const result=await cloud.from('mc_map_layers').insert({workspace_id:ws,world_id:wo,dimension:dim,storage_path:path,x_min:minX,x_max:maxX,z_min:minZ,z_max:maxZ});
  if(result.error){await cloud.storage.from('mc-base-maps').remove([path]);throw result.error;}
  toast('地図を保存しました。');await uLoadLayers();
 }catch(e){uError(e);}finally{if(button)button.disabled=false;}
}
async function uDeleteMap(id){if(!isOwner())return;if(!confirm('地図画像を削除しますか？'))return;
 const layer=U.mapLayers.find(x=>x.id===id);if(!layer)return;
 const res=await cloud.from('mc_map_layers').delete().eq('workspace_id',uWorkspace()).eq('id',id);
 if(res.error)return uError(res.error);
 // Storage removal follows database deletion; owner has delete RLS.
 const f=await cloud.storage.from('mc-base-maps').remove([layer.storage_path]);if(f.error)toast('地図データ削除済み。画像ファイル削除は失敗しました。');
 U.selectedLayer=null;U.atlasImage=null;await uLoadLayers();
}

// ---------- Interactive simulated machine diagrams ----------
const U_DEMOS={
 cane:{name:'サトウキビ自動収穫',type:'cane',material:'ピストン×1、オブザーバー×1、土×1、水バケツ×1、ホッパー×1、チェスト×1、ガラス（周囲に応じて）',steps:['水源に隣接する土へサトウキビを植える','根元を残す高さにピストンを設置','3段目の成長をオブザーバーで検知','信号をピストンに伝え、落ちたアイテムを水流で回収','ホッパーとチェストへの収納を確認する'],tips:'デモは概念図です。実際のレッドストーン配線・回収水路は規模によって変わります。'},
 furnace:{name:'自動かまどライン',type:'furnace',material:'かまど×1、ホッパー×3、チェスト×3、燃料、精錬材料',steps:['かまどを設置する','上面ホッパーから素材を投入する','側面ホッパーから燃料を投入する','下部ホッパーで完成品をチェストへ送る','1台で動作確認後、台数を増やす'],tips:'かまどの上下左右に接続するホッパーの向きを確認してください。'},
 sorter:{name:'自動仕分け倉庫',type:'sorter',material:'ホッパー×2、チェスト×1、コンパレーター×1、リピーター×1、レッドストーントーチ×1、ダスト×3、フィルタ用アイテム（構成による）',steps:['入力ラインに搬送ホッパーを配置','フィルタ用ホッパーと収納チェストを配置','コンパレーターでフィルタの中身を検出','リピーターとトーチで指定アイテムを分岐','未分類品が回収できることをテスト'],tips:'回路の配置とフィルタの個数はゲームバージョンと設計方式により調整してください。'}
};
function demo(){const t=U_DEMOS[U.demoType];return `${heading('装置の動作デモ','赤石装置がどの順序で働くかを2Dで確認。素材・作り方は下に表示します。')}
 <div class="u-notice">このアニメーションは仕組みを理解するための<strong>模式デモ</strong>です。Minecraft内部で動作する完成済みの装置データや正確なブロック配置図ではありません。</div>
 <div class="panel"><div class="u-demo-controls"><label>装置を選ぶ<select id="uDemoSelect">${Object.entries(U_DEMOS).map(([key,obj])=>`<option value="${key}" ${key===U.demoType?'selected':''}>${obj.name}</option>`).join('')}</select></label><button class="btn primary" data-action="u-demo-play" id="uDemoPlay">▶ 再生</button><button class="btn" data-action="u-demo-next">一工程進む</button><button class="btn" data-action="u-demo-reset">最初から</button><span id="uDemoPhase" class="pill blue">1 / 5</span></div>
 <canvas id="uDemoCanvas" width="960" height="390" class="u-demo-canvas" aria-label="装置の動作模式図"></canvas><div class="u-demo-legend">🟦 水・回収　 🟧 信号・ピストン　 🟩 成長・収穫　 🟨 入力と出力</div></div>
 <div class="u-layout"><section class="panel"><h3>📦 必要素材（1ユニットの参考量）</h3><p id="uDemoMaterials" class="u-info-text">${escU(t.material)}</p><button class="btn sm" data-page="machines">規模を指定して詳細素材計算へ →</button></section><section class="panel"><h3>🧱 作成の流れ</h3><ol id="uDemoSteps" class="u-steps">${t.steps.map((s,i)=>`<li class="${U.animPhase===i?'selected':''}">${escU(s)}</li>`).join('')}</ol><p class="hint">${escU(t.tips)}</p></section></div>`;}
function uDemoShapes(ctx,phase,t){
 const W=960,H=390;ctx.fillStyle='#14241b';ctx.fillRect(0,0,W,H);
 const block=(x,y,w,h,label,fill)=>{ctx.fillStyle=fill;ctx.fillRect(x,y,w,h);ctx.strokeStyle='#0009';ctx.lineWidth=3;ctx.strokeRect(x,y,w,h);ctx.fillStyle='#fff';ctx.font='bold 17px system-ui';ctx.textAlign='center';ctx.fillText(label,x+w/2,y+h/2+6);};
 const arrow=(x,y,x2,y2)=>{ctx.strokeStyle='#fbbf24';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke();ctx.fillStyle='#fbbf24';ctx.beginPath();ctx.arc(x2,y2,7,0,Math.PI*2);ctx.fill();};
 ctx.fillStyle='#e9f5ed';ctx.font='bold 27px system-ui';ctx.textAlign='left';ctx.fillText(U_DEMOS[t].name,38,48);
 if(t==='cane'){
  block(285,270,140,65,'土','#876440');block(100,270,160,65,'水路','#287aa6');block(450,270,150,65,'ホッパー','#566e72');block(620,270,180,65,'チェスト','#b27e35');
  const n=phase>=1?phase>=4?1:3:1;for(let i=0;i<n;i++)block(322,216-i*47,65,45,'竹','#3c8d46');
  block(485,125,165,60,'検知器','#668577');if(phase>=2)block(90,175,170,65,'信号','#ca733b');
  block(90,99,165,61,'ピストン',phase>=3?'#e69c3c':'#7c6658');
  if(phase>=3){arrow(255,132,315,164);block(455,190,75,32,'収穫','#79a549');}
  if(phase>=4)arrow(560,300,630,300);
 }else if(t==='furnace'){
  block(65,120,170,65,'材料','#b68e43');block(65,260,170,65,'燃料','#9b6145');block(350,185,235,115,'かまど',phase>=2?'#d76a39':'#68747b');block(715,190,180,80,'完成品','#aa8b45');
  if(phase>=1)arrow(235,157,355,203);if(phase>=2)arrow(235,290,355,266);if(phase>=3)arrow(585,245,715,245);if(phase>=4)ctx.fillText('✅ 排出成功',716,326);
 }else{
  block(70,150,175,90,'入力','#b88b45');block(345,150,200,90,'フィルタ','#4b8a6c');block(648,150,230,90,'チェスト','#b88b45');block(342,280,208,60,'赤石回路',phase>=2?'#d48c45':'#65777e');
  if(phase>=1)arrow(245,190,345,190);if(phase>=3)arrow(545,190,648,190);if(phase>=4)ctx.fillText('✅ 分類成功',665,315);
 }
 ctx.fillStyle='#a6dbb2';ctx.font='bold 17px system-ui';ctx.textAlign='left';ctx.fillText(`STEP ${phase+1} / 5`,40,365);
}
function uDrawDemo(){if(page!=='demo')return;const c=document.getElementById('uDemoCanvas');if(!c)return;uDemoShapes(c.getContext('2d'),U.animPhase,U.demoType);const p=document.getElementById('uDemoPhase');if(p)p.textContent=`${U.animPhase+1} / 5`;
 document.querySelectorAll('#uDemoSteps li').forEach((n,i)=>n.classList.toggle('selected',i===U.animPhase));
}
function uDemoPlay(){if(!U.animPaused){uDemoPause();return;}U.animPaused=false;let last=performance.now();const btn=document.getElementById('uDemoPlay');if(btn)btn.textContent='⏸ 一時停止';
 const frame=ts=>{if(U.animPaused||page!=='demo')return;if(ts-last>1250){U.animPhase=(U.animPhase+1)%5;uDrawDemo();last=ts;}U.animFrame=requestAnimationFrame(frame);};U.animFrame=requestAnimationFrame(frame);
}
function uDemoPause(){U.animPaused=true;if(U.animFrame)cancelAnimationFrame(U.animFrame);U.animFrame=null;const b=document.getElementById('uDemoPlay');if(b)b.textContent='▶ 再生';}

// Enhance original app navigation and event handlers without exposing credentials.
actionHandlers['u-chat-refresh']=()=>uLoadChat(false);
actionHandlers['u-atlas-reset']=()=>{U.atlasCenterX=U.atlasCenterZ=0;uDrawAtlas();};
actionHandlers['u-atlas-zoom']=e=>{U.atlasScale=Math.max(.08,Math.min(12,U.atlasScale*(e.dataset.dir==='1'?1.4:1/1.4)));uDrawAtlas();};
actionHandlers['u-atlas-focus']=e=>{U.atlasCenterX=Number(e.dataset.x)||0;U.atlasCenterZ=Number(e.dataset.z)||0;uDrawAtlas();};
actionHandlers['u-map-select']=e=>uSelectLayer(e.dataset.id);
actionHandlers['u-map-delete']=e=>uDeleteMap(e.dataset.id);
actionHandlers['u-map-upload']=uUploadMap;
actionHandlers['u-demo-play']=uDemoPlay;
actionHandlers['u-demo-next']=()=>{uDemoPause();U.animPhase=(U.animPhase+1)%5;uDrawDemo();};
actionHandlers['u-demo-reset']=()=>{uDemoPause();U.animPhase=0;uDrawDemo();};
document.addEventListener('submit',e=>{if(e.target.id==='uChatForm'){uSendChat(e);}});
document.addEventListener('change',e=>{if(e.target.id==='uDemoSelect'){uDemoPause();U.demoType=e.target.value;U.animPhase=0;render();}});


const LIVE={players:[],events:[],inv:[],builds:[],key:'',busy:false,token:''};
const liveActive=p=>!!p.online&&Date.now()-Date.parse(p.updated_at)<35000;
function livePage(){
 if(!getWorld())return pageGuard();
 return `${heading('📡 サーバー活動・現在地','BDS専用サーバーから活動履歴・位置・資材・建築地点を受信します。')}
 <div class="u-notice">プレイヤーの座標共有は承認済みメンバー限定です。BDSサーバーからの送信が必要です。スマホのローカルワールド・Realmsからは自動取得できません。建築活動地点は建築物の自動確定ではありません。</div>
 <section class="panel" style="padding:16px"><h3>📡 プレイヤー・活動・資材・建築マップ</h3><small id="liveTime">未同期</small><div id="liveData">読み込み中...</div></section>
 <section class="panel" style="padding:16px;margin-top:12px"><h3>🔌 サーバー接続設定</h3>
 ${isOwner()?`<p>送信先：<code>https://fxcwvopjrbpknvffyfgw.supabase.co/functions/v1/mc-live-ingest</code></p><p>WORKSPACE_ID：<code>${H(activeWorkspace.id)}</code><br>WORLD_ID：<code>${H(db.selectedWorld)}</code></p><p class="hint">接続トークンは発行時の一度だけ表示します。GitHubには保存せず、BDS側の秘密設定に入力してください。</p><button class="btn primary" data-action="live-token">🔑 接続トークン発行・更新</button><button class="btn danger" data-action="live-revoke">接続無効化</button><div id="liveSecret"></div>`:'<p>連携設定は管理者のみ変更できます。</p>'}</section>`;
}

const age=d=>{const n=Math.max(0,Math.floor((Date.now()-Date.parse(d))/1000));return n<60?n+'秒前':Math.floor(n/60)+'分前';};
function liveMarkup(){
 const p=LIVE.players.map(x=>`<div class="recent-row"><span>${liveActive(x)?'🟢':'⚫'} <b>${H(x.player_name)}</b>（${H(x.dimension)}）</span><span>X ${Math.floor(x.x)} / Y ${Math.floor(x.y)} / Z ${Math.floor(x.z)} <small>${age(x.updated_at)}</small></span></div>`).join('')||'<p class="hint">現在地データはまだありません。</p>';
 const counts=new Map();LIVE.inv.forEach(x=>counts.set(x.item_id,(counts.get(x.item_id)||0)+x.quantity));
 const m=[...counts].sort((a,b)=>b[1]-a[1]).slice(0,60).map(([k,v])=>`<div class="recent-row"><span>${H(k)}</span><b>${v}個</b></div>`).join('')||'<p class="hint">所持品データはまだありません。</p>';
 const b=LIVE.builds.map(x=>`<div class="live-site" style="border-bottom:1px solid #345344;padding:9px"><b>🏗️ ${H(x.label||'建築活動（未確認）')}</b> ・ ${H(x.dimension)} X${x.x} Y${x.y} Z${x.z}（${x.block_count}件）${isOwner()?`<div><input class="live-name" maxlength="80" placeholder="建築名" value="${H(x.label)}"><button class="btn sm" data-action="live-name" data-key="${H(x.area_key)}">名前を保存</button></div>`:''}</div>`).join('')||'<p class="hint">建築活動記録はありません。</p>';
 const e=LIVE.events.map(x=>`<div class="recent-row"><span><b>${H(x.player_name||'サーバー')}</b> / ${H(x.category)}<small>${H(x.detail)} ${x.x===null?'':'X'+x.x+' Y'+x.y+' Z'+x.z}</small></span><small>${age(x.happened_at)}</small></div>`).join('')||'<p class="hint">活動履歴はまだありません。</p>';
 return `<h4>🧭 現在地（オンライン ${LIVE.players.filter(liveActive).length}人）</h4>${p}<h4>📦 プレイヤー所持品の合計</h4><p class="hint">チェスト・倉庫在庫は含まず、既存の資材管理とは別集計です。</p>${m}<h4>🏗️ 建築活動エリア</h4>${b}<h4>📜 サーバー活動履歴</h4>${e}`;
}
async function liveRefresh(){
 if(!activeWorkspace||!db.selectedWorld||LIVE.busy)return;const key=activeWorkspace.id+'/'+db.selectedWorld;
 if(LIVE.key!==key){LIVE.key=key;LIVE.players=[];LIVE.events=[];LIVE.inv=[];LIVE.builds=[];}
 LIVE.busy=true;try{const ws=activeWorkspace.id,world=db.selectedWorld;
 const queries=[cloud.from('mc_live_players').select('player_name,dimension,x,y,z,online,updated_at').eq('workspace_id',ws).eq('world_id',world).limit(50),cloud.from('mc_live_activity').select('category,player_name,x,y,z,detail,happened_at').eq('workspace_id',ws).eq('world_id',world).order('happened_at',{ascending:false}).limit(40),cloud.from('mc_live_inventory').select('item_id,quantity').eq('workspace_id',ws).eq('world_id',world).limit(300),cloud.from('mc_build_areas').select('area_key,dimension,x,y,z,label,block_count').eq('workspace_id',ws).eq('world_id',world).limit(90)];
 const results=await Promise.all(queries);const error=results.find(x=>x.error);if(error)throw error.error;if(LIVE.key!==key)return;
 [LIVE.players,LIVE.events,LIVE.inv,LIVE.builds]=results.map(x=>x.data||[]);const el=document.getElementById('liveData');if(el)el.innerHTML=liveMarkup();const t=document.getElementById('liveTime');if(t)t.textContent='更新 '+new Date().toLocaleTimeString('ja-JP');
 if(page==='map')drawMap();if(page==='atlas')uDrawAtlas();
 }catch(e){const el=document.getElementById('liveData');if(el)el.textContent='同期エラー：'+e.message;}finally{LIVE.busy=false;}}
function liveOverlay(ctx,px,py,dim,W,H){
 for(const b of LIVE.builds.filter(x=>x.dimension===dim)){const x=px(b.x),y=py(b.z);if(x<0||y<0||x>W||y>H)continue;ctx.fillStyle='#ffb75e';ctx.fillRect(x-5,y-5,10,10);ctx.font='bold 12px sans-serif';ctx.fillText(String(b.label||'建築活動').slice(0,14),x+9,y-8);}
 for(const p of LIVE.players.filter(x=>x.dimension===dim&&liveActive(x))){const x=px(p.x),y=py(p.z);if(x<0||y<0||x>W||y>H)continue;ctx.fillStyle='#83dbff';ctx.beginPath();ctx.arc(x,y,7,0,Math.PI*2);ctx.fill();ctx.fillText(String(p.player_name).slice(0,14),x+9,y+12);}}
actionHandlers['live-token']=async()=>{if(!isOwner()||!confirm('新しいトークンを発行しますか？古いトークンは無効になります。'))return;const {data,error}=await cloud.rpc('mc_issue_live_connector',{p_workspace_id:activeWorkspace.id});if(error)return toast(error.message);LIVE.token=data;const el=document.getElementById('liveSecret');el.innerHTML='<p>連携トークン（再表示不可）</p><textarea id="liveTokenText" rows="3" style="width:100%" readonly></textarea><button class="btn sm" data-action="live-copy">コピー</button>';document.getElementById('liveTokenText').value=data;};
actionHandlers['live-copy']=()=>{if(LIVE.token)clipboard(LIVE.token);};
actionHandlers['live-revoke']=async()=>{if(!isOwner()||!confirm('連携を無効化しますか？'))return;const {error}=await cloud.rpc('mc_revoke_live_connector',{p_workspace_id:activeWorkspace.id});if(error)return toast(error.message);LIVE.token='';document.getElementById('liveSecret').textContent='';toast('連携を無効にしました');};
actionHandlers['live-name']=async e=>{if(!isOwner())return;const name=e.closest('.live-site').querySelector('.live-name').value.trim();if(!name)return toast('名前を入力してください');const {error}=await cloud.from('mc_build_areas').update({label:name,verified:true}).eq('workspace_id',activeWorkspace.id).eq('world_id',db.selectedWorld).eq('area_key',e.dataset.key);if(error)return toast(error.message);toast('保存しました');await liveRefresh();};
setInterval(()=>{if(activeWorkspace&&['live','map','atlas'].includes(page))liveRefresh();},12000);

/* Realms manual sharing; NO access to Realm game server / real-time API. */
const REALMS={locations:[],activity:[],materials:[],stats:null,key:'',busy:false};
function realmsPage(){
 if(!getWorld())return pageGuard();
 const owner=isOwner();
 return heading('Realms共有','位置を自分で登録し、承認されたメンバーとクラウドで共有します。')
 +'<div style="padding:12px 0"><a class="btn primary" href="./addon.html" target="_blank" rel="noopener">🧩 Realmsアドオンを入手する</a></div>'
 +'<div class="u-notice"><b>🛰️ Realmsモード</b>：ゲーム内の位置や所持品を自動取得するものではありません。MC BASEに登録した座標は、共有を許可した場合のみ他の承認済みメンバーの画面・内部マップに表示されます。</div>'
 +'<div class="twocol"><section class="panel" style="padding:16px"><h3>📍 自分の現在地を報告</h3>'
 +'<form id="realmsPositionForm"><label>プレイヤー名<input name="player_name" maxlength="80" required placeholder="Minecraftの名前"></label>'
 +'<label>次元<select name="dimension"><option>オーバーワールド</option><option>ネザー</option><option>エンド</option></select></label>'
 +'<div class="u-2cols"><label>X<input type="number" name="x" required></label><label>Y<input type="number" name="y" required></label><label>Z<input type="number" name="z" required></label></div>'
 +'<label style="display:flex;gap:8px;margin:12px 0"><input type="checkbox" name="share_enabled" style="width:auto">承認済みメンバーに座標を共有する</label>'
 +'<button class="btn primary" type="submit">座標を保存</button> <button type="button" class="btn" data-action="realms-hide">共有をオフ</button></form></section>'
 +'<section class="panel" style="padding:16px"><h3>📝 活動記録</h3><p class="hint">プレイした内容を報告してください。Realmsからの自動取得ではありません。</p>'
 +'<form id="realmsLogForm"><label>分類<select name="category"><option>建築</option><option>採掘</option><option>探索</option><option>資材</option><option>その他</option></select></label>'
 +'<label>内容<textarea name="detail" maxlength="300" required rows="3" placeholder="例：ネザー要塞を発見"></textarea></label>'
 +'<button class="btn primary" type="submit">活動を記録</button></form>'
 +(owner?'<button style="margin-top:12px" class="btn" data-action="realms-new-building">＋ 建築物の座標をマップへ登録</button>':'')
 +'</section></div>'+realmsAddonPanel()+'<section class="panel" style="padding:16px;margin-top:16px"><h3>🧭 共有されている座標</h3><small id="realmsStamp">読み込み中</small><div id="realmsRows"></div><h3>📜 活動履歴</h3><div id="realmsLogs"></div></section>';
}
function realmsAgo(t){const d=Math.max(0,Math.floor((Date.now()-Date.parse(t))/60000));return Number.isFinite(d)?d<60?d+'分前':Math.floor(d/60)+'時間前':'不明';}
function realmsRender(){
 const rows=document.getElementById('realmsRows'),logs=document.getElementById('realmsLogs');
 if(rows){
  rows.innerHTML=REALMS.locations.map(p=>'<div class="recent-row"><span><strong>'+(p.user_id===session.user.id?'👤 ':'📍 ')+H(p.player_name)+'</strong><small>'+H(p.dimension)+' / '+realmsAgo(p.updated_at)+' / '+(p.share_enabled?'公開中':'本人のみ')+' / 手動入力</small></span><b>X '+p.x+' Y '+p.y+' Z '+p.z+'</b></div>').join('')||'<p class="hint">共有中の座標はまだありません。</p>';
  const mine=REALMS.locations.find(p=>p.user_id===session.user.id),form=document.getElementById('realmsPositionForm');
  if(mine&&form&&!form.dataset.prefilled){for(const field of ['player_name','dimension','x','y','z'])form.elements.namedItem(field).value=mine[field];form.elements.namedItem('share_enabled').checked=mine.share_enabled;form.dataset.prefilled='1';}
  const stamp=document.getElementById('realmsStamp');if(stamp)stamp.textContent='クラウド読込：'+new Date().toLocaleTimeString('ja-JP');
 }
 const stock=document.getElementById('realmsAddonMaterials');if(stock){const available=REALMS.materials;stock.innerHTML=available.map(x=>'<div class="recent-row"><span>'+H(x.player_name)+' <code>'+H(x.item_id)+'</code></span><strong>'+x.quantity+'個</strong></div>').join('')||'<p class="hint">まだアドオンから共有された資材データはありません。</p>';const n=document.getElementById('realmsAddonStats');if(n)n.textContent=REALMS.stats?'これまでの記録：設置 '+REALMS.stats.blocks_placed+' / 破壊 '+REALMS.stats.blocks_broken:'アドオン同期はまだありません。';}
 if(logs)logs.innerHTML=REALMS.activity.map(a=>'<div class="recent-row"><span><b>'+H(a.category)+'</b> '+H(a.detail)+'</span><small>'+realmsAgo(a.created_at)+'</small></div>').join('')||'<p class="hint">活動の記録はありません。</p>';
}
async function realmsRefresh(){
 if(!activeWorkspace||!cloud||!db.selectedWorld||REALMS.busy)return;
 const key=activeWorkspace.id+':'+db.selectedWorld;
 if(REALMS.key!==key){REALMS.key=key;REALMS.locations=[];REALMS.activity=[];}
 REALMS.busy=true;
 try{
  const ws=activeWorkspace.id,w=db.selectedWorld;
  const a=await Promise.all([
   cloud.from('mc_realms_positions').select('user_id,player_name,dimension,x,y,z,share_enabled,updated_at').eq('workspace_id',ws).eq('world_id',w).order('updated_at',{ascending:false}).limit(60),
   cloud.from('mc_realms_activity').select('id,user_id,category,detail,x,y,z,created_at').eq('workspace_id',ws).eq('world_id',w).order('created_at',{ascending:false}).limit(60),
   cloud.from('mc_realms_addon_inventory').select('user_id,player_name,item_id,quantity,updated_at').eq('workspace_id',ws).eq('world_id',w).limit(120),
   cloud.from('mc_realms_addon_sync').select('blocks_placed,blocks_broken,updated_at').eq('workspace_id',ws).eq('world_id',w).eq('user_id',session.user.id).maybeSingle()
  ]);
  if(a.some(x=>x.error))throw a.find(x=>x.error).error;
  if(REALMS.key!==key)return;
  REALMS.locations=a[0].data||[];REALMS.activity=a[1].data||[];REALMS.materials=a[2].data||[];REALMS.stats=a[3].data||null;
  realmsRender();if(page==='map')drawMap();if(page==='atlas')uDrawAtlas();
 }catch(err){const e=document.getElementById('realmsRows');if(e)e.textContent='読み込みエラー：'+String(err.message||err);}
 finally{REALMS.busy=false;}
}
function realmsOverlay(ctx,px,py,dimension,W,H){
 if(REALMS.key!==activeWorkspace?.id+':'+db.selectedWorld)return;
 for(const a of REALMS.activity.filter(a=>a.category==='建築'&&Number.isInteger(a.x)&&Number.isInteger(a.z))){const x=px(a.x),y=py(a.z);if(x<0||y<0||x>W||y>H)continue;ctx.fillStyle='#ffbd63';ctx.fillRect(x-5,y-5,10,10);ctx.font='bold 11px sans-serif';ctx.fillText(String(a.detail||'建築地点').slice(0,12),x+9,y-9);}
 for(const p of REALMS.locations.filter(x=>x.share_enabled&&x.dimension===dimension)){
  const x=px(p.x),y=py(p.z);if(x<0||y<0||x>W||y>H)continue;
  ctx.beginPath();ctx.arc(x,y,6,0,Math.PI*2);ctx.fillStyle='#9de8ff';ctx.fill();
  ctx.strokeStyle='#103644';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#e9faff';ctx.font='bold 11px sans-serif';
  ctx.fillText(('手動: '+p.player_name).slice(0,18),x+10,y+10);
 }
}
function realmsNumber(form,key){const s=String(form.elements.namedItem(key).value);const v=Number(s);if(!s.trim()||!Number.isSafeInteger(v)||Math.abs(v)>30000000)throw Error('座標を正しい整数で入力してください');return v;}
async function realmsSavePosition(e){
 e.preventDefault();if(!activeWorkspace||!session)return;
 try{
  const form=e.target,n=String(form.elements.namedItem('player_name').value).trim().slice(0,80);if(!n)throw Error('プレイヤー名を入力してください');
  const row={workspace_id:activeWorkspace.id,world_id:db.selectedWorld,user_id:session.user.id,player_name:n,
   dimension:form.elements.namedItem('dimension').value,x:realmsNumber(form,'x'),y:realmsNumber(form,'y'),z:realmsNumber(form,'z'),
   share_enabled:form.elements.namedItem('share_enabled').checked,updated_at:new Date().toISOString()};
  const {error}=await cloud.from('mc_realms_positions').upsert(row,{onConflict:'workspace_id,world_id,user_id'});if(error)throw error;
  toast('位置を保存しました（手動報告）');await realmsRefresh();
 }catch(e){toast('保存失敗：'+String(e.message||e));}
}
async function realmsSaveLog(e){
 e.preventDefault();if(!activeWorkspace||!session)return;
 const f=e.target,detail=String(f.elements.namedItem('detail').value).trim().slice(0,300);if(!detail)return;
 const {error}=await cloud.from('mc_realms_activity').insert({workspace_id:activeWorkspace.id,world_id:db.selectedWorld,user_id:session.user.id,category:f.elements.namedItem('category').value,detail});
 if(error)return toast('記録できません：'+error.message);
 f.reset();toast('活動を記録しました');await realmsRefresh();
}
actionHandlers['realms-hide']=async()=>{
 if(!session||!activeWorkspace)return;
 const {error}=await cloud.from('mc_realms_positions').update({share_enabled:false,updated_at:new Date().toISOString()}).eq('workspace_id',activeWorkspace.id).eq('world_id',db.selectedWorld).eq('user_id',session.user.id);
 if(error)return toast(error.message);
 const inv=await cloud.from('mc_realms_addon_inventory').update({share_enabled:false}).eq('workspace_id',activeWorkspace.id).eq('world_id',db.selectedWorld).eq('user_id',session.user.id);
 if(inv.error)return toast(inv.error.message);
 const rm=await cloud.from('mc_realms_activity').delete().eq('workspace_id',activeWorkspace.id).eq('world_id',db.selectedWorld).eq('user_id',session.user.id).eq('category','建築').like('detail','アドオン同期：%');
 if(rm.error)return toast(rm.error.message);const f=document.getElementById('realmsPositionForm');if(f)f.elements.namedItem('share_enabled').checked=false;
 toast('位置共有をオフにしました');await realmsRefresh();
};
actionHandlers['realms-new-building']=()=>{if(!isOwner())return toast('管理者のみ座標登録ができます');changePage('coords');openEditor('coords');};
document.addEventListener('submit',e=>{
 if(e.target.id==='realmsPositionForm')void realmsSavePosition(e);
 if(e.target.id==='realmsLogForm')void realmsSaveLog(e);
});
setInterval(()=>{if(activeWorkspace&&['realms','map','atlas'].includes(page))void realmsRefresh();},12000);


function realmsAddonPanel(){
 return '<section class="panel" style="padding:17px;margin:16px 0"><h3>🧩 Realmsアドオンとの連携</h3>'
 +'<p class="hint">Realms内のアドオンで <code>/mcbase:menu</code> →「同期コードを表示」を選び、出力された <code>MCB1|...</code> の文字列をここへ貼り付けます。外部への自動送信ではありません。</p>'
 +'<form id="realmsAddonForm"><label>アドオン同期コード<textarea id="realmsAddonCode" rows="3" maxlength="1800" required placeholder="MCB1|プレイヤー名|..."></textarea></label>'
 +'<label style="display:flex;gap:8px;margin:10px 0"><input type="checkbox" id="realmsAddonShare" style="width:auto">現在地・所持品・建築活動地点を承認済みメンバーに共有する</label>'
 +'<p class="hint">チェックなしなら位置・所持品は本人のみ閲覧でき、活動履歴には座標を掲載しません。</p>'
 +'<button class="btn primary" type="submit">📥 アドオン記録をMC BASEへ反映</button></form>'
 +'<div id="realmsAddonStats" class="hint" style="margin-top:10px">アドオン未同期</div><h4>📦 同期した所持品（自分と共有許可済みメンバー）</h4><div id="realmsAddonMaterials"></div></section>';
}
function realmsAddonInt(v,minimum=-30000000,maximum=30000000){
 if(!/^-?\d+$/.test(v)||String(v).length>12)throw Error('同期コードの整数データが不正です');
 const n=Number(v);if(!Number.isSafeInteger(n)||n<minimum||n>maximum)throw Error('同期コードの数値が範囲外です');
 return n;
}
function realmsAddonParse(raw){
 const a=raw.trim().split('|');
 if(a.length!==13||a[0]!=='MCB1')throw Error('MCB1形式の同期コードを貼り付けてください');
 const player_name=decodeURIComponent(a[1]).trim().slice(0,80);
 if(!player_name)throw Error('プレイヤー名が空です');
 const dimension={'0':'オーバーワールド','1':'ネザー','2':'エンド'}[a[2]];
 if(!dimension)throw Error('次元コードが不正です');
 const x=realmsAddonInt(a[3]),y=realmsAddonInt(a[4]),z=realmsAddonInt(a[5]);
 const placed=realmsAddonInt(a[6],0,99999999),broken=realmsAddonInt(a[7],0,99999999);
 const items=[];
 if(a[8]){
  for(const pair of a[8].split(',').slice(0,4)){
   const sep=pair.lastIndexOf('~');
   if(sep<=0)throw Error('資材コードが不正です');
   const id=decodeURIComponent(pair.slice(0,sep));
   if(!/^[a-z0-9_.-]+:[a-z0-9_./-]+$/i.test(id)||id.length>100)throw Error('資材IDが不正です');
   items.push({item_id:id,quantity:realmsAddonInt(pair.slice(sep+1),0,1000000)});
  }
 }
 let last=null;
 if(a[9]||a[10]||a[11]){
  if(!a[9]||!a[10]||!a[11])throw Error('建築地点が不正です');
  last={x:realmsAddonInt(a[9]),y:realmsAddonInt(a[10]),z:realmsAddonInt(a[11])};
 }
 const site=decodeURIComponent(a[12]).trim().slice(0,28);
 return {player_name,dimension,x,y,z,placed,broken,items,last,site};
}
async function realmsAddonImport(e){
 e.preventDefault();
 if(!activeWorkspace||!session)return;
 const button=e.target.querySelector('button[type=submit]');
 if(button)button.disabled=true;
 try{
  const code=document.getElementById('realmsAddonCode').value;
  const p=realmsAddonParse(code);
  const share=document.getElementById('realmsAddonShare').checked;
  const base={workspace_id:activeWorkspace.id,world_id:db.selectedWorld,user_id:session.user.id};
  const prev=await cloud.from('mc_realms_addon_sync').select('blocks_placed,blocks_broken').eq('workspace_id',base.workspace_id).eq('world_id',base.world_id).eq('user_id',base.user_id).maybeSingle();
  if(prev.error)throw prev.error;
  const placedDelta=Math.max(0,p.placed-Number(prev.data?.blocks_placed||0));
  const brokenDelta=Math.max(0,p.broken-Number(prev.data?.blocks_broken||0));
  const when=new Date().toISOString();
  const pos=await cloud.from('mc_realms_positions').upsert({...base,player_name:p.player_name,dimension:p.dimension,x:p.x,y:p.y,z:p.z,share_enabled:share,updated_at:when},{onConflict:'workspace_id,world_id,user_id'});
  if(pos.error)throw pos.error;
  const del=await cloud.from('mc_realms_addon_inventory').delete().eq('workspace_id',base.workspace_id).eq('world_id',base.world_id).eq('user_id',base.user_id);
  if(del.error)throw del.error;
  if(p.items.length){
   const ins=await cloud.from('mc_realms_addon_inventory').insert(p.items.map(item=>({...base,player_name:p.player_name,...item,share_enabled:share,updated_at:when})));
   if(ins.error)throw ins.error;
  }
  if(!share){
   // Revoking sharing also removes previously shared map points from addon imports.
   const {error:revErr}=await cloud.from('mc_realms_activity').delete().eq('workspace_id',base.workspace_id).eq('world_id',base.world_id).eq('user_id',base.user_id).eq('category','建築').like('detail','アドオン同期：%');
   if(revErr)throw revErr;
  }
  if(placedDelta||brokenDelta){
   let detail='アドオン同期：設置 '+placedDelta+'・破壊 '+brokenDelta;
   if(p.site&&share)detail+=' / '+p.site;
   const activity=await cloud.from('mc_realms_activity').insert({...base,category:'建築',detail,
    x:share&&p.last?p.last.x:null,y:share&&p.last?p.last.y:null,z:share&&p.last?p.last.z:null});
   if(activity.error)throw activity.error;
  }
  const state=await cloud.from('mc_realms_addon_sync').upsert({...base,blocks_placed:p.placed,blocks_broken:p.broken,updated_at:when},{onConflict:'workspace_id,world_id,user_id'});
  if(state.error)throw state.error;
  toast('アドオン記録を保存しました（設置 +'+placedDelta+' / 破壊 +'+brokenDelta+'）');
  document.getElementById('realmsAddonCode').value='';
  await realmsRefresh();
 }catch(err){toast('アドオン同期失敗：'+String(err.message||err).slice(0,140));}
 finally{if(button)button.disabled=false;}
}
document.addEventListener('submit',e=>{if(e.target.id==='realmsAddonForm')void realmsAddonImport(e);});

bootCloud();
})();