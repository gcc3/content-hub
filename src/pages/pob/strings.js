import meta from "./meta.json";
import { useEffect, useState } from "react";

// Everything this page says, in the three languages the gcc³ apps speak.
// Kept inside the page folder so Pob stays a self-contained thing.
const STRINGS = {
  en: {
    // The English title is the one a search result carries, so it is kept
    // where the rest of the page's search metadata lives.
    title: meta.seo.title,
    eyebrow: "Perception & Operation Bridge",
    tagline: "Gives AI a pair of eyes and a pair of hands on your desktop.",
    lede: "Pob is an overlay. It sits on top of whatever application you point it at, perceives that application through the window that contains it, and operates it — pointer, keys, and everything in between. Applications with no API get one.",
    download: "Download Pob",
    downloadFor: "Download for {platform}",
    source: "Source on GitHub",
    platformNames: { windows: "Windows", macos: "macOS", linux: "Linux" },
    archLabel: "Processor architecture",
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
      watch: "watch",
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
        "Watching. A second later the screen looks different — is that a new message?",
        "Reading the layout again — the list has scrolled, x = 486",
        "Click",
        "Writing a reply to the message that just arrived",
        "Return",
        "Still watching. The next change asks again.",
      ],
      answers: {
        3: "yes",
        4: "1 unread",
        5: "512",
        7: "\"On my way — see you at 7.\"",
        11: "yes",
        12: "486",
        14: "\"Got it — thanks!\"",
      },
      comment: "// Reply to every unread message, then keep replying as they arrive.",
      slots: [
        "a chat window is open",
        "another unread message in the list",
        "the x offset to the message box",
        "a short reply to the message on screen",
        "a new message has arrived",
        "the x offset to the message box",
        "a short reply to it",
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
    install: {
      body: "One command on macOS and Linux. It works out which release fits this machine, downloads it, and puts it where a hand would have — Pob.app in Applications on a Mac, the app tree and a link on Linux. Either way the pob command lands on your PATH, and there is no toolchain to install first.",
      platformsLabel: "Platform",
      platforms: { unix: "macOS · Linux", windows: "Windows" },
      notes: {
        unix: [
          "On Linux it installs for you alone, under ~/.local; pipe it into sudo sh instead and it installs for everyone. On macOS an admin account needs no sudo to write to /Applications. Anything after sh -s -- reaches the install: --prefix DIR, --bin DIR, --version VER, or --uninstall to take it back off again.",
          "macOS then asks for two permissions and prompts for neither: allow the blocked first open under System Settings ▸ Privacy & Security, then add Pob to Accessibility and to Screen Recording by hand. Until you do, clicks are dropped in silence.",
        ],
        windows: [
          "Windows has no one-liner yet. Take the zip for your machine, unzip it, and run the line above from inside the folder — the app goes somewhere permanent and the pob command lands on your PATH.",
        ],
      },
      copy: "copy",
      copied: "copied",
      zip: "Get the zip →",
    },
    steps: [
      {
        lead: "Install it",
        body: " — the command above, or the release zip for your platform, unpacked and installed by hand.",
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
    platformNames: { windows: "Windows", macos: "macOS", linux: "Linux" },
    archLabel: "处理器架构",
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
      watch: "守着",
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
        "守着屏幕。一秒之后画面变了 —— 是来新消息了吗？",
        "重新读一次消息框的位置 —— 列表滚动过了，x = 486",
        "点击",
        "给刚到的这条消息写一句回复",
        "回车",
        "继续守着。下一次画面变化，再问一遍。",
      ],
      answers: {
        3: "是",
        4: "还有 1 条未读",
        5: "512",
        7: "「在路上了 —— 七点见。」",
        11: "是",
        12: "486",
        14: "「收到 —— 谢啦！」",
      },
      comment: "// 回复每一条未读消息，然后一直守着新来的。",
      slots: [
        "聊天窗口开着",
        "列表里还有一条未读消息",
        "消息框的横向偏移",
        "针对屏幕上这条消息的一句简短回复",
        "来了一条新消息",
        "消息框的横向偏移",
        "针对这条消息的一句简短回复",
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
    install: {
      body: "macOS 和 Linux 上一条命令就够。它会判断这台机器该用哪个 release，下载下来，然后放到手动安装本来会放的地方 —— Mac 上是「应用程序」里的 Pob.app，Linux 上是应用目录加一个链接。两种情况下 pob 命令都会进入你的 PATH，事先也不需要装任何工具链。",
      platformsLabel: "平台",
      platforms: { unix: "macOS · Linux", windows: "Windows" },
      notes: {
        unix: [
          "Linux 上默认只为你一个人装，装在 ~/.local 下；改成管道给 sudo sh，就是为所有人装。macOS 上管理员账户写 /Applications 不需要 sudo。sh -s -- 后面的东西都会传给安装过程：--prefix DIR、--bin DIR、--version VER，或者用 --uninstall 把它卸掉。",
          "macOS 之后还要两项权限，而且两项都不会主动弹窗：先在「系统设置 ▸ 隐私与安全性」里放行第一次被拦下的启动，再手动把 Pob 加进「辅助功能」和「屏幕录制」。在此之前，点击会被悄无声息地丢掉。",
        ],
        windows: [
          "Windows 暂时还没有一行命令。下载适合你机器的 zip，解压，然后在文件夹里运行上面这行 —— 应用会装到一个固定的位置，pob 命令也会进入你的 PATH。",
        ],
      },
      copy: "复制",
      copied: "已复制",
      zip: "下载 zip →",
    },
    steps: [
      {
        lead: "装上它",
        body: " —— 上面那条命令，或者下载你平台的 release zip，解压后手动装。",
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
    platformNames: { windows: "Windows", macos: "macOS", linux: "Linux" },
    archLabel: "プロセッサアーキテクチャ",
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
      watch: "見張り",
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
        "画面を見張る。一秒後、表示が変わった —— 新しいメッセージ？",
        "メッセージ欄の位置を読み直す —— リストがスクロールした、x = 486",
        "クリック",
        "今届いたメッセージへの返信を書く",
        "Return",
        "見張りは続きます。次に画面が変われば、また訊きます。",
      ],
      answers: {
        3: "はい",
        4: "未読 1 件",
        5: "512",
        7: "「今向かっています —— 7 時に。」",
        11: "はい",
        12: "486",
        14: "「了解 —— ありがとう！」",
      },
      comment: "// 未読メッセージすべてに返信して、そのあとは新着を待ち続ける。",
      slots: [
        "チャットウィンドウが開いている",
        "リストに未読メッセージがもう一件ある",
        "メッセージ欄までの横方向のオフセット",
        "画面のメッセージへの短い返信",
        "新しいメッセージが届いた",
        "メッセージ欄までの横方向のオフセット",
        "そのメッセージへの短い返信",
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
    install: {
      body: "macOS と Linux は一行で終わります。このマシンに合うリリースを見つけて取ってきて、手で入れたのと同じ場所へ置きます —— Mac なら「アプリケーション」の Pob.app、Linux ならアプリ本体とリンク。どちらでも pob コマンドが PATH に入り、先に用意しておくツールチェーンもありません。",
      platformsLabel: "プラットフォーム",
      platforms: { unix: "macOS · Linux", windows: "Windows" },
      notes: {
        unix: [
          "Linux では既定であなた一人のために ~/.local へ、sudo sh へ渡せば全員のために入ります。macOS の管理者アカウントなら /Applications へ書くのに sudo は要りません。sh -s -- のあとに書いたものはインストールへ渡ります：--prefix DIR、--bin DIR、--version VER、外すときは --uninstall。",
          "macOS はこのあと権限を二つ要求しますが、どちらも自分からは訊いてきません。「システム設定 ▸ プライバシーとセキュリティ」で最初の起動のブロックを解除し、アクセシビリティと画面収録に Pob を手で追加してください。それまで、クリックは黙って捨てられます。",
        ],
        windows: [
          "Windows にはまだ一行がありません。マシンに合う zip を取って展開し、そのフォルダの中で上の行を実行します —— アプリは定位置に入り、pob コマンドが PATH に入ります。",
        ],
      },
      copy: "コピー",
      copied: "コピーしました",
      zip: "zip を入手 →",
    },
    steps: [
      {
        lead: "インストールする",
        body: "。上の一行か、自分のプラットフォームのリリース zip を展開して手で入れるか。",
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
