import { useEffect, useState } from "react";

// Everything this page says, in the three languages the gcc³ apps speak.
// Kept inside the page folder so Pob stays a self-contained thing.
const STRINGS = {
  en: {
    title: "Pob — Perception & Operation Bridge",
    eyebrow: "Perception & Operation Bridge",
    tagline: "Gives AI a pair of eyes and a pair of hands on your desktop.",
    lede: "Pob is an overlay. It sits on top of whatever application you point it at, perceives that application through the window that contains it, and operates it — pointer, keys, and everything in between. Applications with no API get one.",
    download: "Download Pob",
    downloadFor: "Download for {platform}",
    source: "Source on GitHub",
    shotAlt: "Pob running as an overlay above a desktop application",
    platformNames: { windows: "Windows", macos: "macOS", linux: "Linux" },
    capabilitiesTitle: "What it can do",
    capabilities: [
      { term: "Sees", detail: "Screen capture of the window underneath, on demand or as the macro runs." },
      { term: "Points", detail: "Absolute mouse movement, clicks, drags and scrolls." },
      { term: "Types", detail: "Text entry and named key presses, including modifiers and function keys." },
      { term: "Remembers", detail: "Every session is written to its own folder, so you can read back what happened." },
      { term: "Repeats", detail: "Record a run once and replay it as a macro, as often as you like." },
      { term: "Travels", detail: "Windows, macOS and Linux — including a Windows VM driven from a Mac." },
    ],
    macroTitle: "Macro PSL — step through one",
    macroLedeBefore: "A macro is read line by line. Where a line needs a judgement rather than a number, it holds an instruction in ",
    macroLedeMiddle: " delimiters, and that instruction is answered from what is on screen before the line runs. So a step can say ",
    macroLedeEmphasis: "the message box",
    macroLedeAfter: " instead of guessing at a coordinate that moves the next time the window resizes.",
    footnoteBefore: "The instruction language is ",
    footnoteAfter: ", written by the same hand and usable on its own.",
    macro: {
      step: "step",
      restart: "start over",
      perceive: "perceive",
      operate: "operate",
      idle: "pob",
      statuses: [
        "Ready.",
        "Pointer to 398, 915",
        "Click",
        "Looking at the screen — is a chat window open?",
        "Looking for another unread message, up to 10 times",
        "Reading the layout for the message box — x = 512",
        "Click",
        "Writing a reply to what is on screen",
        "Return",
        "No unread messages left",
        "",
        "Running sign-out.psl",
      ],
      answers: {
        3: "yes",
        4: "1 unread",
        5: "512",
        7: "\"On my way — see you at 7.\"",
      },
      comment: "// Reply to every unread message, then sign out.",
      slots: [
        "a chat window is open",
        "another unread message in the list",
        "the x offset to the message box",
        "a short reply to the message on screen",
      ],
    },
    waysTitle: "Four ways to drive it",
    ways: [
      {
        name: "From an AI client",
        body: "Pob speaks MCP, so Claude Code, Claude Desktop and Gemini CLI can see the screen and work the machine themselves. Ask for the thing you want done and let the client do it.",
      },
      {
        name: "From a macro",
        body: "Record what you do once, then replay it. A recorded macro is an editable text file, so you can go back in and replace a brittle coordinate with an instruction.",
      },
      {
        name: "From your phone",
        body: "Every running instance serves a remote control page. Open it on a phone on the same network to watch what Pob sees and drive it from the couch.",
      },
      {
        name: "From the keyboard client",
        body: "A desktop keyboard and trackpad that types into the machine Pob is running on — useful when the machine you are driving is a VM or across the room.",
      },
    ],
    startTitle: "Getting started",
    steps: [
      {
        lead: "Download the release",
        body: " for your platform and unpack it. On macOS, drag Pob to Applications; on Windows and Linux, run the installer that comes with it. Either way the pob command lands on your PATH.",
      },
      {
        lead: "Open it over the app",
        body: " you want automated. Pob floats above it and reads that window.",
      },
      {
        lead: "Give it an instruction",
        body: ", record a macro, or connect an AI client to its MCP server and let the client take it from there.",
      },
    ],
    releases: "Releases",
  },

  zh: {
    title: "Pob — Perception & Operation Bridge",
    eyebrow: "Perception & Operation Bridge",
    tagline: "给 AI 一双眼睛和一双手，放在你的桌面上。",
    lede: "Pob 是一层浮窗。它浮在你指给它的那个应用之上，透过承载这个应用的窗口去感知它，然后操作它 —— 指针、按键，以及两者之间的一切。没有 API 的应用，从此有了一个。",
    download: "下载 Pob",
    downloadFor: "下载 {platform} 版",
    source: "在 GitHub 查看源码",
    shotAlt: "Pob 作为浮窗运行在桌面应用之上",
    platformNames: { windows: "Windows", macos: "macOS", linux: "Linux" },
    capabilitiesTitle: "它能做什么",
    capabilities: [
      { term: "看", detail: "对下方窗口截屏 —— 按需截，或者在宏运行的过程中截。" },
      { term: "指", detail: "绝对坐标的鼠标移动、点击、拖拽和滚动。" },
      { term: "打字", detail: "文本输入和按名字指定的按键，包括修饰键和功能键。" },
      { term: "记得", detail: "每次会话都写进自己的文件夹，事后可以回头读发生了什么。" },
      { term: "重复", detail: "把一次操作录下来，之后想重放多少次就多少次。" },
      { term: "跨平台", detail: "Windows、macOS 和 Linux —— 包括从 Mac 驱动一台 Windows 虚拟机。" },
    ],
    macroTitle: "Macro PSL —— 逐行走一遍",
    macroLedeBefore: "宏是一行一行读的。当某一行需要的是判断而不是数字时，它就用 ",
    macroLedeMiddle: " 包住一句指令；在这一行真正执行之前，这句指令会根据屏幕上的内容得到回答。于是一步可以直接说",
    macroLedeEmphasis: "「消息框」",
    macroLedeAfter: "，而不用去猜一个下次窗口一改大小就失效的坐标。",
    footnoteBefore: "这门指令语言是 ",
    footnoteAfter: "，出自同一人之手，也可以单独使用。",
    macro: {
      step: "下一步",
      restart: "重来",
      perceive: "感知",
      operate: "操作",
      idle: "pob",
      statuses: [
        "就绪。",
        "指针移到 398, 915",
        "点击",
        "看一眼屏幕 —— 聊天窗口开着吗？",
        "找下一条未读消息，最多找 10 次",
        "读取消息框的位置 —— x = 512",
        "点击",
        "根据屏幕上的内容写一句回复",
        "回车",
        "没有未读消息了",
        "",
        "运行 sign-out.psl",
      ],
      answers: {
        3: "是",
        4: "还有 1 条未读",
        5: "512",
        7: "「在路上了 —— 七点见。」",
      },
      comment: "// 回复每一条未读消息，然后退出登录。",
      slots: [
        "聊天窗口开着",
        "列表里还有一条未读消息",
        "消息框的横向偏移",
        "针对屏幕上这条消息的一句简短回复",
      ],
    },
    waysTitle: "四种驱动方式",
    ways: [
      {
        name: "从 AI 客户端",
        body: "Pob 说 MCP，所以 Claude Code、Claude Desktop 和 Gemini CLI 可以自己看屏幕、自己动手。你说你要什么，剩下的交给客户端。",
      },
      {
        name: "从一个宏",
        body: "把要做的事录一遍，之后重放。录下来的宏是一个可编辑的文本文件，你可以回去把一个脆弱的坐标换成一句指令。",
      },
      {
        name: "从手机",
        body: "每个运行中的实例都提供一个远程控制页面。在同一网络下的手机上打开它，就能看到 Pob 看到的画面，并且在沙发上操作它。",
      },
      {
        name: "从键盘客户端",
        body: "一个桌面键盘和触控板，直接输入到 Pob 所在的那台机器 —— 当你操作的是虚拟机、或者那台机器在房间另一头时很有用。",
      },
    ],
    startTitle: "开始使用",
    steps: [
      {
        lead: "下载你平台的 release",
        body: "并解压。macOS 上把 Pob 拖进「应用程序」；Windows 和 Linux 上运行附带的安装脚本。无论哪种方式，pob 命令都会出现在你的 PATH 里。",
      },
      {
        lead: "把它开在目标应用之上",
        body: "。Pob 会浮在上面，读取那个窗口。",
      },
      {
        lead: "给它一句指令",
        body: "、录一个宏，或者把 AI 客户端接到它的 MCP 服务上，剩下的交给客户端。",
      },
    ],
    releases: "Releases",
  },

  ja: {
    title: "Pob — Perception & Operation Bridge",
    eyebrow: "Perception & Operation Bridge",
    tagline: "AI に、デスクトップを見る目と動かす手を。",
    lede: "Pob はオーバーレイです。指定したアプリの上に浮かび、そのアプリを収めているウィンドウを通して知覚し、そして操作します。ポインタ、キー、その間のすべて。API を持たないアプリにも、これで一つ。",
    download: "Pob をダウンロード",
    downloadFor: "{platform} 版をダウンロード",
    source: "GitHub のソース",
    shotAlt: "デスクトップアプリの上でオーバーレイとして動く Pob",
    platformNames: { windows: "Windows", macos: "macOS", linux: "Linux" },
    capabilitiesTitle: "できること",
    capabilities: [
      { term: "見る", detail: "下にあるウィンドウのスクリーンキャプチャ。必要なときにも、マクロの実行中にも。" },
      { term: "指す", detail: "絶対座標でのマウス移動、クリック、ドラッグ、スクロール。" },
      { term: "打つ", detail: "テキスト入力と、名前で指定するキー。修飾キーとファンクションキーを含みます。" },
      { term: "残す", detail: "セッションごとに専用のフォルダへ記録。あとから何が起きたかを読み返せます。" },
      { term: "繰り返す", detail: "一度録っておけば、マクロとして何度でも再生できます。" },
      { term: "渡り歩く", detail: "Windows・macOS・Linux。Mac から動かす Windows VM も含めて。" },
    ],
    macroTitle: "Macro PSL —— 一行ずつ辿る",
    macroLedeBefore: "マクロは一行ずつ読まれます。数値ではなく判断が要る行では、指示を ",
    macroLedeMiddle: " で囲んで持たせます。その指示は、行が実行される前に画面の内容から答えが決まります。だから一手を",
    macroLedeEmphasis: "「メッセージ欄」",
    macroLedeAfter: "と書けます。ウィンドウの大きさが変わった途端にずれる座標を当てにいく必要はありません。",
    footnoteBefore: "この指示の言語は ",
    footnoteAfter: "。同じ手で書かれ、単体でも使えます。",
    macro: {
      step: "次の行",
      restart: "最初から",
      perceive: "知覚",
      operate: "操作",
      idle: "pob",
      statuses: [
        "準備完了。",
        "ポインタを 398, 915 へ",
        "クリック",
        "画面を見る —— チャットウィンドウは開いている？",
        "次の未読メッセージを探す（最大 10 回）",
        "メッセージ欄の位置を読む —— x = 512",
        "クリック",
        "画面の内容に対する返信を書く",
        "Return",
        "未読はもうありません",
        "",
        "sign-out.psl を実行",
      ],
      answers: {
        3: "はい",
        4: "未読 1 件",
        5: "512",
        7: "「今向かっています —— 7 時に。」",
      },
      comment: "// 未読メッセージすべてに返信して、サインアウトする。",
      slots: [
        "チャットウィンドウが開いている",
        "リストに未読メッセージがもう一件ある",
        "メッセージ欄までの横方向のオフセット",
        "画面のメッセージへの短い返信",
      ],
    },
    waysTitle: "動かし方は四つ",
    ways: [
      {
        name: "AI クライアントから",
        body: "Pob は MCP を話します。Claude Code、Claude Desktop、Gemini CLI がそのまま画面を見て、機械を操作できます。やってほしいことを伝えれば、あとはクライアントの仕事です。",
      },
      {
        name: "マクロから",
        body: "一度やって見せて、あとは再生。録ったマクロは編集できるテキストファイルなので、壊れやすい座標をあとから指示に置き換えられます。",
      },
      {
        name: "スマートフォンから",
        body: "動いているインスタンスはどれもリモート操作ページを提供します。同じネットワークのスマートフォンで開けば、Pob が見ているものを見ながらソファから操作できます。",
      },
      {
        name: "キーボードクライアントから",
        body: "Pob が動いている機械へ打ち込むデスクトップキーボードとトラックパッド。相手が VM のときや、部屋の向こうにあるときに効きます。",
      },
    ],
    startTitle: "はじめかた",
    steps: [
      {
        lead: "自分のプラットフォームのリリースをダウンロード",
        body: "して展開します。macOS では Pob をアプリケーションへドラッグ、Windows と Linux では同梱のインストーラを実行。どちらの場合も pob コマンドが PATH に入ります。",
      },
      {
        lead: "自動化したいアプリの上で開く",
        body: "。Pob はその上に浮かび、そのウィンドウを読みます。",
      },
      {
        lead: "指示を出す",
        body: "、マクロを録る、あるいは AI クライアントを MCP サーバーにつないで任せる。",
      },
    ],
    releases: "Releases",
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
