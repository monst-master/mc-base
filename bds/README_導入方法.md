# MC BASE 4.3 — サーバー連動ガイド

**対象**: Minecraft 統合版の Bedrock Dedicated Server（BDS）。iPhone単体のワールドやRealmsでは動作しません。
**公開Webソフト**: https://monst-master.github.io/mc-base/

## 取得する情報
- プレイヤーの現在座標、ディメンション、オンライン状態（約5秒周期）
- プレイヤーの所持品（約20秒周期。チェスト・樽・シュルカーボックスは対象外）
- 参加・退出・ブロック設置・ブロック破壊の活動履歴
- ブロック設置地点を32×32ブロック単位で集計。**建築物を自動認識する機能ではありません**。
- 管理者が建築活動エリアに名前を付けると、MC BASEの「シードマップの座標グリッド」「統合版ワールドマップ」にピンを表示
- 手動命名（BDSの権限あるユーザーのみ）: `/scriptevent mcbase:site 拠点名` — 実行した座標に仮登録されます

## 導入（BDS管理者）
1. BDSの該当ワールドに `bds/MC_BASE_Bridge_BP` をビヘイビアーパックとして導入し、有効化。
2. BDS `config/e6649951-82ea-44f0-a02b-74694b0644ac/` フォルダを作り、`bds/config/variables.json` と `permissions.json` をコピー。サーバーバージョンによってはUUIDがscriptモジュールUUIDを要求する構成もあるため、Microsoftの公式BDS設定案内を優先。
3. MC BASEの管理画面「📡 サーバー活動・現在地」→「接続トークン発行・更新」から64文字の秘密トークンを発行。
4. `bds/config/secrets.example.json` を BDS `config/e6649951-82ea-44f0-a02b-74694b0644ac/secrets.json` としてコピーし、`mcbase_token` を発行したトークンに差し替える。**トークンはGitHub、Discord、チャットに貼らない**。
5. BDSを再起動し、BDSコンソールでScript API読み込みエラーがないことを確認。
6. プレイヤーが参加すると、約5〜20秒間隔でMC BASEの画面に表示されます。更新されない場合はBDSコンソールの `MC BASE bridge could not send data` と permissions/URL/トークンを確認。

## 本ワールド向け初期設定
`bds/config/variables.json` に既存のMC BASEワークスペース・ワールドIDを設定済みです。別のワールドを接続するときは適切なIDへ変更してください。

## セキュリティと制約
- サーバーの連携トークンはSupabaseにハッシュだけ保存され、GitHubからは取得できません。漏えい時はMC BASEから再発行してください。
- クラウド上の位置・所持品・活動記録は**Discord認証と管理者承認を受けたメンバーのみ閲覧**できます（RLS）。
- 参加者に位置共有・活動記録について事前通知し、必要なら `mcbase_share_positions` / `mcbase_share_inventory` をfalseにしてください。
- 現在地は**BDSから最後に受信した座標**です。連携できないときやオフライン時はリアルタイム情報ではありません。
- 資材管理は既存の手動在庫を残し、BDSからのプレイヤー所持品スナップショットを別表示します。クラウドの倉庫在庫を勝手に上書きしません。
- 実地形の外部Seedmap iframeは外部サイトの制約でピンを直接重ねられません。MC BASE内部の座標グリッドおよび画像アップロード式ワールドマップに反映します。
- 専用サーバーのインストールやホスティング自体はこのパックでは実施されません。無料GitHub Pagesと既存Supabaseを利用しますが、BDSを常時稼働させる端末・費用は別です。
- `@minecraft/server-net` と `@minecraft/server-admin` はBDS専用の実験的APIです。サーバー更新でモジュール依存バージョンや設定を調整する必要があります。

## 公式資料
- https://learn.microsoft.com/en-us/minecraft/creator/documents/scriptingservers
- https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server-net/minecraft-server-net
- https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server-admin/serversecrets

## GitHub内の構成
- `bds/MC_BASE_Bridge_BP/manifest.json`: ビヘイビアーパック定義
- `bds/MC_BASE_Bridge_BP/scripts/main.js`: ゲームイベントとスナップショット送信
- `bds/config/variables.json`: ワークスペース、ワールド、送信先と共有設定
- `bds/config/permissions.json`: BDS HTTP通信許可
- `bds/config/secrets.example.json`: **ダミー文字列のみ**。本物のトークンを入れたファイルは公開しないでください
