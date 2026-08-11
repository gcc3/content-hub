import meta from "./meta.json";
import { useEffect, useState } from "react";

// Everything this page says, in the three languages the gcc³ apps speak.
// Kept inside the page folder so psl stays a self-contained thing.
const STRINGS = {
  en: {
    // The English title is the one a search result carries, so it is kept
    // where the rest of the page's search metadata lives.
    title: meta.seo.title,
    tagline: "Prompt Script Language — an AI native language that lets you embed AI instructions in files written in other languages.",
    ledeBefore: "Wrap an instruction in ",
    ledeMiddle: " delimiters and it becomes a slot. The ",
    ledeAfter: " compiler fills the slot with code the model writes, in place, in the file you already have.",
    installCta: "Install psl",
    source: "Source on GitHub",
    tryARun: "Try a run",
    compiler: {
      run: "run",
      reset: "reset",
      caption: "One run, one slot. Run it again until the file has none left.",
      slots: [
        "one-line doc comment for Fib, Go style",
        "fill in the iterative loop and return, using a and b",
      ],
    },
    syntax: "The whole syntax",
    syntaxNote: "That is all of it. No keywords, no imports, no config in the file. Whitespace inside the delimiters is optional, and a slot may span several lines.",
    rules: [
      {
        title: "It writes in your language",
        body: "The model is shown the whole file with the slot marked, so what comes back is written in the surrounding language and reuses the names already defined above it. A slot alone on its line is indented to that line's column.",
      },
      {
        title: "It stays out of real code",
        body: "C++'s std::cout, Rust's Foo::Bar, PHP's self::method — scope resolution always glues :: to an identifier, and a glued :: is never a delimiter. Existing code in the file keeps working the way it reads.",
      },
      {
        title: "One slot, one run",
        body: "Each run resolves the first remaining slot and writes it back into the file. The file is always a real file, never a half-generated draft, and you can stop and read it after any run.",
      },
      {
        title: "Pick a model per slot",
        body: "A bare :: xxx :: uses your default model. Name one in front of the instruction — :: gpt-5.6> xxx :: — and that slot alone goes to it.",
      },
    ],
    optionsTitle: "Giving a slot more to go on",
    options: [
      {
        flag: "--image",
        body: "Hand the slot something to look at — a screenshot, a mockup, a photo. Takes a file path, a data: URL or base64. PNG, JPEG, GIF and WebP.",
      },
      {
        flag: "--prompt",
        body: "Tell it what the file cannot: the API being called, what each parameter means, in what units. Pass a path instead of text and psl reads the file. It is context, never the instruction.",
      },
    ],
    installTitle: "Getting it",
    install: {
      body: "One line, and nothing to install alongside it. The installer takes the build for your platform from the latest release, checks it against the release's checksums — one it cannot verify is never installed — and puts psl on your PATH. No Go toolchain involved.",
      platformsLabel: "Platform",
      platforms: { unix: "macOS · Linux", windows: "Windows" },
      notes: {
        unix: "Goes to /usr/local/bin when you can write there, and ~/.local/bin otherwise, so no root is involved either way. Pass --prefix through the pipe to put it somewhere else.",
        windows: "Goes to %LOCALAPPDATA%\\Programs\\psl and onto your user PATH, so no administrator rights are needed. Open a new terminal afterwards for psl to be found.",
      },
      copy: "copy",
      copied: "copied",
      updateBody: "Keeps itself current from there. Every download is checked against the release's checksums — one it cannot verify is never installed, and a failed update leaves the working psl exactly where it was.",
    },
    usedTitle: "Where it is used",
    relatedName: "Pob →",
    relatedBody: "Desktop automation, driven by Macro PSL. The macros that operate an application are written with slots, so a step can say what to do instead of naming a coordinate.",
    releases: "Releases",
  },

  zh: {
    title: "psl — Prompt Script Language",
    tagline: "Prompt Script Language —— 一种 AI 原生语言，让你把 AI 指令直接写进用别的语言写成的文件里。",
    ledeBefore: "用 ",
    ledeMiddle: " 把一句指令包起来，它就成了一个槽。",
    ledeAfter: " 编译器会用模型写出的代码填上这个槽 —— 就地填，填在你本来那个文件里。",
    installCta: "安装 psl",
    source: "在 GitHub 查看源码",
    tryARun: "跑一次看看",
    compiler: {
      run: "运行",
      reset: "重来",
      caption: "跑一次，填一个槽。再跑，直到文件里一个槽都不剩。",
      slots: [
        "给 Fib 写一行 Go 风格的文档注释",
        "用 a 和 b 补上迭代循环与返回",
      ],
    },
    syntax: "全部语法",
    syntaxNote: "就这些。没有关键字，没有 import，文件里也没有配置。分隔符里的空格可有可无，一个槽也可以跨好几行。",
    rules: [
      {
        title: "它用你的语言写",
        body: "模型看到的是整个文件，槽的位置被标了出来。所以写回来的代码是用周围那门语言写的，并且会复用上面已经定义好的名字。独占一行的槽，会按那一行的缩进对齐。",
      },
      {
        title: "它不碰真正的代码",
        body: "C++ 的 std::cout、Rust 的 Foo::Bar、PHP 的 self::method —— 作用域解析总是把 :: 紧贴在标识符上，而紧贴着的 :: 永远不是分隔符。文件里原有的代码，读起来还是原来那样。",
      },
      {
        title: "一次运行，一个槽",
        body: "每次运行只解析剩下的第一个槽，并把结果写回文件。文件始终是一个真正的文件，不会是生成到一半的草稿；任何一次运行之后你都可以停下来读它。",
      },
      {
        title: "按槽选模型",
        body: ":: xxx :: 用默认模型。在指令前写上模型名 —— :: gpt-5.6> xxx :: —— 就只有这一个槽交给它。",
      },
    ],
    optionsTitle: "给一个槽更多线索",
    options: [
      {
        flag: "--image",
        body: "给这个槽一样可看的东西 —— 截图、设计稿、照片。接受文件路径、data: URL 或 base64。支持 PNG、JPEG、GIF 和 WebP。",
      },
      {
        flag: "--prompt",
        body: "告诉它文件里看不出来的事：调用的是什么 API、每个参数是什么意思、单位是什么。传路径而不是文字，psl 会去读那个文件。它是上下文，永远不是指令本身。",
      },
    ],
    installTitle: "怎么装",
    install: {
      body: "一行命令，不需要额外装任何东西。安装脚本会从最新的 release 取你平台的构建，用 release 的校验和核对 —— 核不上的绝不安装 —— 然后把 psl 放进你的 PATH。不需要 Go 工具链。",
      platformsLabel: "平台",
      platforms: { unix: "macOS · Linux", windows: "Windows" },
      notes: {
        unix: "能写就装到 /usr/local/bin，不能就装到 ~/.local/bin —— 两种都不需要 root。想装别处，把 --prefix 顺着管道传进去。",
        windows: "装到 %LOCALAPPDATA%\\Programs\\psl 并加进你的用户 PATH，所以不需要管理员权限。装完开一个新终端，psl 才找得到。",
      },
      copy: "复制",
      copied: "已复制",
      updateBody: "之后它会自己保持更新。每次下载都会用 release 的校验和核对 —— 核不上的绝不安装，更新失败也只是让原来能用的 psl 原地不动。",
    },
    usedTitle: "用在哪里",
    relatedName: "Pob →",
    relatedBody: "桌面自动化，由 Macro PSL 驱动。操作应用的宏是用槽写的，所以一步可以直接说要做什么，而不是写死一个坐标。",
    releases: "Releases",
  },

  ja: {
    title: "psl — Prompt Script Language",
    tagline: "Prompt Script Language —— 他の言語で書かれたファイルの中に AI への指示をそのまま埋め込める、AI ネイティブな言語。",
    ledeBefore: "指示を ",
    ledeMiddle: " で囲むと、そこがスロットになります。",
    ledeAfter: " コンパイラがそのスロットを、モデルの書いたコードでその場で埋めます。いま手元にあるファイルの中で。",
    installCta: "psl をインストール",
    source: "GitHub のソース",
    tryARun: "一度動かしてみる",
    compiler: {
      run: "実行",
      reset: "戻す",
      caption: "一回の実行につき、スロット一つ。残りがなくなるまで、もう一度。",
      slots: [
        "Fib への一行のドキュメントコメント、Go のスタイルで",
        "a と b を使って反復ループと return を埋める",
      ],
    },
    syntax: "文法はこれだけ",
    syntaxNote: "以上です。キーワードも import も、ファイル内の設定もありません。区切りの内側の空白は任意で、スロットは複数行にまたがっても構いません。",
    rules: [
      {
        title: "その言語で書いてくれる",
        body: "モデルにはスロットの位置を示したファイル全体が渡ります。だから返ってくるコードは周囲の言語で書かれ、上ですでに定義された名前をそのまま使います。行に単独で置かれたスロットは、その行の桁に合わせて字下げされます。",
      },
      {
        title: "本物のコードには手を出さない",
        body: "C++ の std::cout、Rust の Foo::Bar、PHP の self::method —— スコープ解決の :: は必ず識別子に接しており、接した :: が区切りになることはありません。ファイル内の既存のコードは、読めるとおりに動き続けます。",
      },
      {
        title: "一スロット、一実行",
        body: "実行ごとに、残っている最初のスロットだけを解決してファイルに書き戻します。ファイルは常に本物のファイルであって生成途中の下書きにはならず、どの実行のあとでも手を止めて読めます。",
      },
      {
        title: "スロットごとにモデルを選ぶ",
        body: ":: xxx :: は既定のモデルを使います。指示の前にモデル名を書けば —— :: gpt-5.6> xxx :: —— そのスロットだけがそちらに渡ります。",
      },
    ],
    optionsTitle: "スロットに手がかりを足す",
    options: [
      {
        flag: "--image",
        body: "見せるものを渡します。スクリーンショット、モック、写真。ファイルパス、data: URL、base64 のいずれでも。PNG・JPEG・GIF・WebP に対応。",
      },
      {
        flag: "--prompt",
        body: "ファイルからは分からないことを伝えます。呼んでいる API、各引数の意味、単位。テキストの代わりにパスを渡せば psl がそのファイルを読みます。あくまで文脈であって、指示そのものではありません。",
      },
    ],
    installTitle: "入手する",
    install: {
      body: "一行だけ。ほかに入れるものはありません。インストーラは最新リリースから自分のプラットフォーム向けのビルドを取り、リリースのチェックサムで検証し —— 検証できないものは決してインストールされません —— psl を PATH に置きます。Go のツールチェーンは要りません。",
      platformsLabel: "プラットフォーム",
      platforms: { unix: "macOS · Linux", windows: "Windows" },
      notes: {
        unix: "書ける場合は /usr/local/bin、そうでなければ ~/.local/bin へ。どちらも root は要りません。別の場所に入れるなら --prefix をパイプ越しに渡します。",
        windows: "%LOCALAPPDATA%\\Programs\\psl に入れ、ユーザーの PATH に追加するので、管理者権限は要りません。psl が見つかるよう、あとで新しいターミナルを開いてください。",
      },
      copy: "コピー",
      copied: "コピーしました",
      updateBody: "あとは自分で最新に保ちます。ダウンロードはリリースのチェックサムで毎回検証され、検証できないものは決してインストールされません。更新に失敗しても、動いている psl はそのまま残ります。",
    },
    usedTitle: "使われている場所",
    relatedName: "Pob →",
    relatedBody: "Macro PSL で動くデスクトップ自動化。アプリを操作するマクロはスロットで書かれるので、座標を名指しする代わりに「何をするか」を書けます。",
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
