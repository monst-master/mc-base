# MC BASE — Realmsアドオン連携（v4.5）

## ダウンロード
https://monst-master.github.io/mc-base/addon.html

上記のページで「MC BASE Realmsアドオン（.mcpack）を生成・保存」をクリックすると、GitHub Pagesで公開しているアドオンソースを**ブラウザ内でZIP化し、.mcpackファイルとして保存**します。追加の外部ホスティングは使用しません。

## 対応範囲
- Minecraft **統合版（Bedrock）** と Realms のビヘイビアーパック
- ワールド内でプレイヤー本人が記録に同意して開始した後に、設置・破壊回数を記録
- 自分の現在位置、所持品上位4種類、最後の設置地点、手動命名した建築地点を同期コードにまとめる
- MC BASEの「Realms座標共有」画面に**手動で同期コードを貼り付ける**と、Discord認証済みアカウントの位置・所持品・活動をSupabaseへ反映
- 共有をオンにしない限り、位置と所持品は本人以外に公開しない。共有を取り消すと以前のアドオン建築座標ピンを削除
- 同期された座標・建築地点はMC BASEの内部の座標グリッドと画像登録式地図に表示。外部Seedmapのiframeにはオーバーレイできない

## iPhoneでRealmsに導入
1. **Realmsのバックアップを作成**してください。
2. アドオンのダウンロードページをSafariで開いて `.mcpack` を生成・保存。iPhoneの「ファイル」からMinecraftで開いてインポートします。
3. Minecraft → プレイ → Realms → Realm Hub → ワールドタブ → 対象スロット「ワールドを編集」 → ビヘイビアーパックから `MC BASE Realms Companion` を有効化します。Realmsオーナーの操作が必要です。
4. Realmsへ入り、チャットから `/mcbase:menu` を入力。**最初に記録を開始**します（本人同意制、最初は停止）。
5. ブロックを設置・破壊したり、建築地点をメニューで命名したりします。
6. 再度 `/mcbase:menu` を実行し「MC BASE同期コードを表示」を選びます。ゲーム内チャット・メニューに `MCB1|...` 形式のコードが出ます。
7. MC BASEへログイン → メニュー「Realms座標共有」→「🧩 Realmsアドオンとの連携」→ 同期コードを貼り付け → 共有範囲を選択 →「アドオン記録をMC BASEへ反映」。
8. ゲーム画面のテキストをiPhoneで直接コピーできない場合、別端末からコードを見て入力する必要があります。同期は自動ではありません。

## 正直な制約
- **Realmsに外部HTTP送信機能はありません。** `@minecraft/server-net` はBDSのみで動作します。アドオン内の記録は自動、**MC BASEへの反映は手動**です。
- 同期コードはプレイヤー本人が編集可能な自己申告データで、チート耐性やサーバー認証済みの記録ではありません。
- プレイヤーのインベントリは同期コード発行時点の**上位4種類のみ**。チェスト・樽・シュルカーボックス等は対象外です。
- 位置情報は同期時のスナップショットであり、Realmsのリアルタイム追跡ではありません。
- 建築地点は最後の設置座標またはプレイヤーが記録した座標で、建物の輪郭を自動解析するものではありません。
- 古いRealmsや一部のMinecraftバージョンでは `@minecraft/server` 2.1.0、カスタムコマンドの利用条件が異なる可能性があります。実機確認後、必要ならパックの依存バージョンを更新してください。
- インポート前にRealmsのワールドをバックアップし、初回はワールドのコピーでテストしてください。

## ソースファイル
- `realms/MC_BASE_Realms_Companion_BP/manifest.json`
- `realms/MC_BASE_Realms_Companion_BP/scripts/main.js`
- `addon.html`（ブラウザ内で.mcpackを生成）

## 公式情報
- Realmsでのアドオン有効化: https://help.minecraft.net/hc/en-us/articles/24120525083533
- Bedrockアドオン基礎: https://help.minecraft.net/hc/en-us/articles/4409140076813
- Script API Custom Commands: https://learn.microsoft.com/en-us/minecraft/creator/documents/scripting/custom-commands
- BDSのみHTTP対応: https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server-net/minecraft-server-net
