import { useEffect, useState } from "react";

// Everything this page says, in the three languages the gcc³ apps speak.
// Kept inside the page folder so Simple AI stays a self-contained thing.
const STRINGS = {
  en: {
    title: "Simple AI — one AI chat, everywhere you work",
    tagline: "One chat, in the browser and in your terminal, across every model worth asking.",
    ledeBefore: "Simple AI is a command-based AI chat. Type a question and it answers; type a ",
    ledeAfter: " command and you are steering the thing itself — which model, which role, which files it can see. The same conversation, whether you opened a browser tab or a shell.",
    open: "Open Simple AI",
    source: "Source on GitHub",
    docs: "Documentation",
    modelsLabel: "models from",
    entrancesTitle: "Three ways in",
    entrances: [
      {
        name: "In the browser",
        body: "The full interface — full screen or split screen, several themes, and the documentation tucked behind the page itself.",
      },
      {
        name: "In your terminal",
        body: "Then type sc. The same conversation and the same settings as the web, without leaving the shell. Starting it also starts the MCP client.",
      },
      {
        name: "In a browser terminal",
        body: "The CLI, served as a page — for a machine you would rather not install anything on.",
      },
    ],
    cliTitle: "The CLI, from a standing start",
    terminal: {
      replay: "replay",
      lines: [
        "+ simple-ai-chat",
        "Simple AI · connected to simple-ai.io",
        "commands · models · roles · stores · files · voice",
        "notes.pdf · 14 pages · reading…",
      ],
      ask: "read notes.pdf and pull out what I promised to do",
    },
    abilitiesTitle: "What it can do",
    abilities: [
      { name: "Write and think", body: "Text generation across every connected model." },
      { name: "Draw and redraw", body: "Image generation, and editing the image it just made." },
      { name: "Look", body: "Vision — hand it a screenshot or a photo and ask about it." },
      { name: "Read your files", body: "TXT, DOCX, PDF and JSON go straight into the conversation." },
      { name: "Use tools", body: "Function calling and the Model Context Protocol, so it can reach the things you connect." },
      { name: "Know your data", body: "Data stores and databases you attach, queried as part of an answer." },
      { name: "Check itself", body: "De-hallucination detection, and WolframAlpha for anything that should be computed rather than guessed." },
      { name: "Take a role", body: "Named roles and custom prompts, saved and switched between." },
      { name: "Speak", body: "Voice output, and answers that account for where you are." },
      { name: "Show its work", body: "Code highlighting and LaTeX equations rendered in place." },
      { name: "Talk to itself", body: "Node connections — models handed the same question, so the answers can be checked against each other." },
      { name: "In your language", body: "Eighteen of them." },
    ],
    evenTitle: "sc-even — the same chat, on your glasses",
    evenBodyBefore: "sc-even puts Simple AI on Even G2 smart glasses. Speak, and what you said is transcribed and sent to ",
    evenBodyAfter: "; the reply comes back on the lens. Your phone shows the same session as a terminal you can also type into, so a long answer is readable and a precise question is easy to ask.",
    evenBodyTwo: "Sign in with your Simple AI account and the conversation and settings are yours rather than the session's. Transcription works in several languages.",
    evenDownload: "Get it on Even Hub",
    gestures: [
      { gesture: "Tap", meaning: "Start recording — the lens shows that it is listening" },
      { gesture: "Tap again", meaning: "Stop, transcribe, and send" },
      { gesture: "Scroll", meaning: "Page back and forward through a long reply" },
      { gesture: "Double-tap", meaning: "Leave" },
    ],
  },

  zh: {
    title: "Simple AI — 一个 AI 对话，跟着你走",
    tagline: "一个对话，在浏览器里，也在终端里，接通每一个值得一问的模型。",
    ledeBefore: "Simple AI 是一个以命令为中心的 AI 对话应用。输入问题，它回答；输入以 ",
    ledeAfter: " 开头的命令，你就在调整它本身 —— 用哪个模型、用什么角色、能看到哪些文件。无论你打开的是浏览器标签页还是一个 shell，都是同一个对话。",
    open: "打开 Simple AI",
    source: "在 GitHub 查看源码",
    docs: "文档",
    modelsLabel: "模型来自",
    entrancesTitle: "三个入口",
    entrances: [
      {
        name: "在浏览器里",
        body: "完整界面 —— 全屏或分屏、多种主题，文档就藏在页面背面。",
      },
      {
        name: "在终端里",
        body: "然后输入 sc。和网页版同一个对话、同一套设置，不用离开 shell。启动它的同时也会启动 MCP 客户端。",
      },
      {
        name: "在浏览器里的终端",
        body: "把 CLI 当作网页提供 —— 给那些你不太想往上装东西的机器。",
      },
    ],
    cliTitle: "CLI，从零开始",
    terminal: {
      replay: "重放",
      lines: [
        "+ simple-ai-chat",
        "Simple AI · 已连接 simple-ai.io",
        "命令 · 模型 · 角色 · 数据 · 文件 · 语音",
        "notes.pdf · 14 页 · 读取中…",
      ],
      ask: "读一下 notes.pdf，把我答应要做的事挑出来",
    },
    abilitiesTitle: "它能做什么",
    abilities: [
      { name: "写与想", body: "在所有接通的模型上生成文本。" },
      { name: "画与改", body: "生成图像，并且能接着修改它刚画出来的那张。" },
      { name: "看", body: "视觉 —— 给它一张截图或照片，然后问。" },
      { name: "读你的文件", body: "TXT、DOCX、PDF 和 JSON 直接进入对话。" },
      { name: "用工具", body: "函数调用与 Model Context Protocol，让它能够到你接上的东西。" },
      { name: "了解你的数据", body: "你挂上的数据集和数据库，会作为回答的一部分被查询。" },
      { name: "自我核对", body: "幻觉检测，以及 WolframAlpha —— 该算出来的东西就不要猜。" },
      { name: "扮演角色", body: "命名的角色和自定义提示词，可保存、可切换。" },
      { name: "开口说话", body: "语音输出，回答也会考虑你所在的位置。" },
      { name: "把过程摊开", body: "代码高亮与 LaTeX 公式就地渲染。" },
      { name: "自己跟自己对话", body: "节点连接 —— 把同一个问题交给多个模型，让答案彼此对照。" },
      { name: "用你的语言", body: "十八种。" },
    ],
    evenTitle: "sc-even —— 同一个对话，戴在眼前",
    evenBodyBefore: "sc-even 把 Simple AI 装进 Even G2 智能眼镜。说话，你说的内容会被转写并发给 ",
    evenBodyAfter: "，回答显示在镜片上。手机上是同一个会话的终端界面，也可以直接打字 —— 于是长回答读得清楚，精确的问题也问得方便。",
    evenBodyTwo: "用你的 Simple AI 账号登录，对话和设置就属于你，而不是属于这一次会话。转写支持多种语言。",
    evenDownload: "在 Even Hub 获取",
    gestures: [
      { gesture: "轻点", meaning: "开始录音 —— 镜片上会显示正在听" },
      { gesture: "再点一次", meaning: "停止、转写、发送" },
      { gesture: "滑动", meaning: "在长回答里前后翻页" },
      { gesture: "双击", meaning: "退出" },
    ],
  },

  ja: {
    title: "Simple AI — ひとつの AI チャットを、どこででも",
    tagline: "ひとつのチャットを、ブラウザでも、ターミナルでも。聞く価値のあるモデルすべてに。",
    ledeBefore: "Simple AI はコマンド中心の AI チャットです。質問を打てば答え、",
    ledeAfter: " で始まるコマンドを打てば、それ自体を操っていることになります。どのモデルか、どの役割か、どのファイルを見せるか。ブラウザのタブでもシェルでも、会話はひとつです。",
    open: "Simple AI を開く",
    source: "GitHub のソース",
    docs: "ドキュメント",
    modelsLabel: "モデル提供元",
    entrancesTitle: "入口は三つ",
    entrances: [
      {
        name: "ブラウザで",
        body: "フル機能のインターフェース。全画面か分割画面、複数のテーマ、そしてページの裏側に収められたドキュメント。",
      },
      {
        name: "ターミナルで",
        body: "そして sc と打つ。ウェブと同じ会話、同じ設定を、シェルを離れずに。起動すると MCP クライアントも一緒に立ち上がります。",
      },
      {
        name: "ブラウザの中のターミナルで",
        body: "CLI をページとして提供。何もインストールしたくない機械のために。",
      },
    ],
    cliTitle: "CLI を、ゼロから",
    terminal: {
      replay: "もう一度",
      lines: [
        "+ simple-ai-chat",
        "Simple AI · simple-ai.io に接続",
        "コマンド · モデル · 役割 · データ · ファイル · 音声",
        "notes.pdf · 14 ページ · 読み込み中…",
      ],
      ask: "notes.pdf を読んで、私がやると言ったことを抜き出して",
    },
    abilitiesTitle: "できること",
    abilities: [
      { name: "書く・考える", body: "つながっているすべてのモデルでのテキスト生成。" },
      { name: "描く・描き直す", body: "画像生成と、いま作った画像の編集。" },
      { name: "見る", body: "ビジョン。スクリーンショットや写真を渡して、それについて尋ねる。" },
      { name: "ファイルを読む", body: "TXT・DOCX・PDF・JSON がそのまま会話に入ります。" },
      { name: "道具を使う", body: "関数呼び出しと Model Context Protocol。つないだものへ手が届きます。" },
      { name: "あなたのデータを知る", body: "取り付けたデータストアやデータベースを、回答の一部として参照します。" },
      { name: "自分を確かめる", body: "ハルシネーション検出と、WolframAlpha。推測ではなく計算すべきことのために。" },
      { name: "役割をまとう", body: "名前つきの役割とカスタムプロンプト。保存して切り替えられます。" },
      { name: "声に出す", body: "音声出力と、いる場所を踏まえた回答。" },
      { name: "過程を見せる", body: "コードのハイライトと LaTeX 数式をその場で描画。" },
      { name: "自分同士で話す", body: "ノード接続。同じ問いを複数のモデルへ渡し、答えを突き合わせます。" },
      { name: "あなたの言語で", body: "十八言語。" },
    ],
    evenTitle: "sc-even —— 同じチャットを、眼鏡の上に",
    evenBodyBefore: "sc-even は Simple AI を Even G2 スマートグラスに載せます。話せば、その内容が文字起こしされて ",
    evenBodyAfter: " へ送られ、返事はレンズに表示されます。手元のスマートフォンには同じセッションがターミナルとして映り、そこから打つこともできます。長い答えは読みやすく、正確な問いは尋ねやすく。",
    evenBodyTwo: "Simple AI のアカウントでサインインすれば、会話も設定もセッションのものではなくあなたのものになります。文字起こしは複数言語に対応。",
    evenDownload: "Even Hub で入手",
    gestures: [
      { gesture: "タップ", meaning: "録音を開始 —— レンズに聞いていることが出ます" },
      { gesture: "もう一度タップ", meaning: "停止して、文字起こしして、送信" },
      { gesture: "スクロール", meaning: "長い返事を前後にめくる" },
      { gesture: "ダブルタップ", meaning: "終了" },
    ],
  },
};

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "zh", label: "中文" },
  { code: "ja", label: "日本語" },
];

const STORAGE_KEY = "gcc3-lang";

// Remembered choice first, then what the browser asks for, then English.
const initialLanguage = () => {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && STRINGS[saved]) return saved;
  } catch {
    // storage can be unavailable; fall through to the browser's language
  }
  const browser = (navigator.language || "").toLowerCase();
  if (browser.startsWith("zh")) return "zh";
  if (browser.startsWith("ja")) return "ja";
  return "en";
};

const useStrings = () => {
  const [language, setLanguage] = useState(initialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const choose = (next) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // not being able to remember it is not a reason to refuse the change
    }
    setLanguage(next);
  };

  return { t: STRINGS[language], language, languages: LANGUAGES, setLanguage: choose };
};

export { useStrings };
