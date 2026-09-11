# FE Exam Quiz

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/imaronnet/fe-exam-quiz)

基本情報技術者試験（FE）の4択問題を手軽に練習できる、小さなVite製Webアプリです。

## GitHub Codespacesで最短起動

1. 上の **Open in GitHub Codespaces** をクリック
2. Codespaceの作成完了を待つ
3. 依存関係のインストールとVite開発サーバーの起動が自動実行されます
4. 自動で開くプレビュー、または **Ports** タブの `5173` を開く

Codespaces用に `.devcontainer` を含めているため、追加セットアップなしで始めやすくしています。

## ローカルセットアップ

Node.js `^20.19.0` または `>=22.12.0` を想定しています。

```bash
npm install
npm run dev
```

起動後、表示されるURL（通常は `http://localhost:5173`）をブラウザで開いてください。

## ビルド

```bash
npm run build
```

## アプリの内容

- 問題を1問ずつ表示
- 4択から回答
- 回答後に正誤と解説を表示
- 最後にスコアを表示
- もう一度最初からやり直し可能

問題データはサンプルとしてアプリ内に直接含めているため、外部APIや追加データなしですぐ動きます。
