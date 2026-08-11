import { useEffect, useState } from "react";

// Everything this page says, in the three languages the gcc³ apps speak.
// Kept inside the page folder so stash stays a self-contained thing.
const STRINGS = {
  en: {
    title: "stash — keep the things you find",
    tagline: "Paste a link. Keep the thing.",
    lede: "Pages, posts, videos, channels, conversations, repositories, mobile apps — the things you find in a day scatter across a dozen apps that will not talk to each other. stash puts them in one place, with a note attached, in a collection you can share or take away with you.",
    open: "Open stash",
    source: "Source on GitHub",
    boxTitle: "One box for everything",
    boxLede: "There is nothing to file. Paste a link and stash reads it, works out what it is, and puts it in the right place. Type something that is not a link and it becomes a note.",
    paste: {
      placeholder: "paste links, type text...",
      inputAria: "Paste a link or type text",
      stash: "Stash",
      try: "try",
      working: "Analyzing…",
      empty: "Nothing stashed yet.",
      samples: [
        {
          chip: "GitHub",
          store: "Repositories",
          source: "GitHub",
          name: "lhypds/stash",
          byline: "lhypds",
          preview: "Stashing things like pages, posts, videos, channels, repositories and mobile apps — into a personal, shareable collection.",
          meta: "TypeScript · MIT",
        },
        {
          chip: "YouTube",
          store: "Videos",
          source: "YouTube",
          name: "Me at the zoo",
          byline: "jawed",
          preview: "The first video uploaded to YouTube. Recorded at the San Diego Zoo.",
          meta: "0:19 · 2005",
        },
        {
          chip: "ChatGPT",
          store: "Chats",
          source: "ChatGPT",
          name: "Shared conversation",
          byline: "ChatGPT",
          preview: "A shared conversation is read like any other page, and a screenshot of it is kept alongside the text.",
          meta: "screenshot captured",
        },
        {
          chip: "App Store",
          store: "Apps",
          source: "App Store",
          name: "An app you found",
          byline: "Its developer",
          preview: "Name, icon, developer and description come straight from the store listing.",
          meta: "iOS",
        },
        {
          chip: "Plain text",
          store: "Notes",
          source: "Written by you",
          name: "a thought worth keeping",
          byline: "you",
          preview: "Anything that is not a link becomes a note. Attach an image or a text file to it.",
          meta: "note",
        },
      ],
      fallback: {
        store: "Pages",
        source: "Other",
        name: "Any other link",
        byline: "the page itself",
        preview: "Every link that is not one of the recognised platforms is still stashed as a page — title, image and description read from the page, plus a screenshot.",
        meta: "screenshot captured",
      },
    },
    storesTitle: "Ten stores",
    stores: [
      { name: "Pages", sources: "Any website" },
      { name: "Posts", sources: "X · Threads · Instagram · RedNote · Facebook · Bluesky · Mastodon · Zhihu · WeChat" },
      { name: "Publishers", sources: "Profile pages on the same platforms as Posts" },
      { name: "Videos", sources: "YouTube · bilibili · TikTok · WeChat Channels · Vimeo · Twitch · niconico" },
      { name: "Channels", sources: "Creator pages on the same platforms as Videos" },
      { name: "Chats", sources: "ChatGPT · Gemini · Grok · Claude · Doubao" },
      { name: "Repositories", sources: "GitHub · GitLab · Bitbucket · Codeberg · Gitee" },
      { name: "Apps", sources: "App Store · Google Play — found by searching, not by link" },
      { name: "Skills", sources: "skills.sh — found by searching, not by link" },
      { name: "Notes", sources: "Written by you, with an image or a text file attached" },
    ],
    behavesTitle: "How it behaves",
    features: [
      {
        name: "A username is the whole sign-up",
        body: "No password, no email, no confirmation link. Pick a name and your stash is there. Put a password on it later if you want it locked.",
      },
      {
        name: "Lock it when you are done",
        body: "A locked stash is read-only until you unlock it, so a shared screen or a borrowed laptop cannot change anything.",
      },
      {
        name: "Rich previews, not bare links",
        body: "Title, image, author and a snippet are pulled from the page itself, so a stashed item still means something a year from now. Pages and chats also keep a screenshot.",
      },
      {
        name: "Notes on anything",
        body: "Add your own note beside an item — why you kept it, what to do with it — with an image or a text file attached.",
      },
      {
        name: "Search and filter",
        body: "Search across everything you have kept, or narrow to one store and one source.",
      },
      {
        name: "Yours to take",
        body: "Share your stash with a link, or export the whole thing as a ZIP whenever you like.",
      },
    ],
  },

  zh: {
    title: "stash — 把找到的东西留下来",
    tagline: "粘一条链接，东西就留下了。",
    lede: "网页、帖子、视频、频道、对话、代码仓库、手机应用 —— 一天里遇到的东西散落在十几个互不搭理的应用里。stash 把它们放到同一个地方，可以附上一段自己的备注，整个集合能分享，也能随时打包带走。",
    open: "打开 stash",
    source: "在 GitHub 查看源码",
    boxTitle: "一个框，收下所有东西",
    boxLede: "没有需要归档的动作。粘一条链接，stash 会去读它、判断它是什么，然后放到该放的地方。输入的不是链接，它就成为一条笔记。",
    paste: {
      placeholder: "粘贴链接，或直接打字…",
      inputAria: "粘贴链接或输入文字",
      stash: "收下",
      try: "试试",
      working: "解析中…",
      empty: "还什么都没收。",
      samples: [
        {
          chip: "GitHub",
          store: "代码仓库",
          source: "GitHub",
          name: "lhypds/stash",
          byline: "lhypds",
          preview: "把网页、帖子、视频、频道、仓库和手机应用这类东西，收进一个属于自己、也能分享的集合。",
          meta: "TypeScript · MIT",
        },
        {
          chip: "YouTube",
          store: "视频",
          source: "YouTube",
          name: "Me at the zoo",
          byline: "jawed",
          preview: "YouTube 上传的第一个视频，拍摄于圣地亚哥动物园。",
          meta: "0:19 · 2005",
        },
        {
          chip: "ChatGPT",
          store: "对话",
          source: "ChatGPT",
          name: "分享出来的对话",
          byline: "ChatGPT",
          preview: "分享出来的对话会像普通网页一样被读取，并且连同正文一起保留一张截图。",
          meta: "已截图",
        },
        {
          chip: "App Store",
          store: "应用",
          source: "App Store",
          name: "你发现的一个应用",
          byline: "它的开发者",
          preview: "名称、图标、开发者和介绍，都直接取自商店页面。",
          meta: "iOS",
        },
        {
          chip: "纯文字",
          store: "笔记",
          source: "你自己写的",
          name: "一个值得留下的想法",
          byline: "你",
          preview: "不是链接的内容都会变成笔记，可以再附上一张图或一个文本文件。",
          meta: "笔记",
        },
      ],
      fallback: {
        store: "网页",
        source: "其他",
        name: "任何其他链接",
        byline: "网页本身",
        preview: "不属于已识别平台的链接，同样会作为网页收下 —— 标题、配图和描述取自网页本身，另外还有一张截图。",
        meta: "已截图",
      },
    },
    storesTitle: "十个库",
    stores: [
      { name: "网页", sources: "任何网站" },
      { name: "帖子", sources: "X · Threads · Instagram · 小红书 · Facebook · Bluesky · Mastodon · 知乎 · 微信" },
      { name: "作者", sources: "与「帖子」相同平台上的主页" },
      { name: "视频", sources: "YouTube · 哔哩哔哩 · TikTok · 微信视频号 · Vimeo · Twitch · niconico" },
      { name: "频道", sources: "与「视频」相同平台上的创作者页面" },
      { name: "对话", sources: "ChatGPT · Gemini · Grok · Claude · 豆包" },
      { name: "代码仓库", sources: "GitHub · GitLab · Bitbucket · Codeberg · Gitee" },
      { name: "应用", sources: "App Store · Google Play —— 用搜索找，不是贴链接" },
      { name: "Skills", sources: "skills.sh —— 用搜索找，不是贴链接" },
      { name: "笔记", sources: "你自己写的，可附一张图或一个文本文件" },
    ],
    behavesTitle: "它是怎么运作的",
    features: [
      {
        name: "一个用户名就是全部注册流程",
        body: "没有密码、没有邮箱、没有确认链接。起个名字，你的 stash 就在那儿了。之后想上锁，再加个密码。",
      },
      {
        name: "用完就锁上",
        body: "锁上之后是只读的，直到你解锁为止。共用的屏幕、借来的笔记本，都改不了任何东西。",
      },
      {
        name: "带内容的预览，不是光秃秃的链接",
        body: "标题、配图、作者和摘要都从网页本身取回，所以一年之后再看，收下的那一条仍然是有意义的。网页和对话还会另存一张截图。",
      },
      {
        name: "什么都能加备注",
        body: "在条目旁边写下你自己的话 —— 为什么留它、打算拿它做什么 —— 还能附一张图或一个文本文件。",
      },
      {
        name: "搜索与筛选",
        body: "在收下的所有东西里搜索，或者只看某一个库、某一个来源。",
      },
      {
        name: "东西是你的",
        body: "用一条链接分享你的 stash，或者随时把整个集合导出成一个 ZIP。",
      },
    ],
  },

  ja: {
    title: "stash — 見つけたものを、そのまま残す",
    tagline: "リンクを貼れば、それが残る。",
    lede: "ページ、投稿、動画、チャンネル、会話、リポジトリ、モバイルアプリ —— 一日のうちに見つけるものは、互いに口をきかない十数個のアプリに散らばります。stash はそれを一か所に集め、自分のメモを添えて、共有もエクスポートもできる一つのコレクションにします。",
    open: "stash を開く",
    source: "GitHub のソース",
    boxTitle: "何でも入る、一つの入力欄",
    boxLede: "整理の手間はありません。リンクを貼れば stash がそれを読み、何なのかを判断して、あるべき場所へ置きます。リンクでないものを打てば、それはノートになります。",
    paste: {
      placeholder: "リンクを貼るか、そのまま入力…",
      inputAria: "リンクを貼るかテキストを入力",
      stash: "残す",
      try: "お試し",
      working: "解析中…",
      empty: "まだ何もありません。",
      samples: [
        {
          chip: "GitHub",
          store: "リポジトリ",
          source: "GitHub",
          name: "lhypds/stash",
          byline: "lhypds",
          preview: "ページ、投稿、動画、チャンネル、リポジトリ、モバイルアプリを、自分だけの、そして共有できるコレクションへ。",
          meta: "TypeScript · MIT",
        },
        {
          chip: "YouTube",
          store: "動画",
          source: "YouTube",
          name: "Me at the zoo",
          byline: "jawed",
          preview: "YouTube に最初に投稿された動画。サンディエゴ動物園にて。",
          meta: "0:19 · 2005",
        },
        {
          chip: "ChatGPT",
          store: "会話",
          source: "ChatGPT",
          name: "共有された会話",
          byline: "ChatGPT",
          preview: "共有された会話も他のページと同じように読まれ、本文とあわせてスクリーンショットが残ります。",
          meta: "スクリーンショット取得済み",
        },
        {
          chip: "App Store",
          store: "アプリ",
          source: "App Store",
          name: "見つけたアプリ",
          byline: "その開発者",
          preview: "名前、アイコン、開発者、説明は、ストアの掲載情報からそのまま。",
          meta: "iOS",
        },
        {
          chip: "テキスト",
          store: "ノート",
          source: "自分で書いたもの",
          name: "残しておきたい思いつき",
          byline: "あなた",
          preview: "リンクでないものはノートになります。画像やテキストファイルを添えられます。",
          meta: "ノート",
        },
      ],
      fallback: {
        store: "ページ",
        source: "その他",
        name: "そのほかのリンク",
        byline: "ページそのもの",
        preview: "対応プラットフォーム以外のリンクも、ページとして残せます。タイトル・画像・説明はページから読み取り、スクリーンショットも一緒に。",
        meta: "スクリーンショット取得済み",
      },
    },
    storesTitle: "十のストア",
    stores: [
      { name: "ページ", sources: "あらゆるウェブサイト" },
      { name: "投稿", sources: "X · Threads · Instagram · RedNote · Facebook · Bluesky · Mastodon · 知乎 · WeChat" },
      { name: "投稿者", sources: "「投稿」と同じプラットフォームのプロフィールページ" },
      { name: "動画", sources: "YouTube · bilibili · TikTok · WeChat チャンネル · Vimeo · Twitch · ニコニコ" },
      { name: "チャンネル", sources: "「動画」と同じプラットフォームの制作者ページ" },
      { name: "会話", sources: "ChatGPT · Gemini · Grok · Claude · Doubao" },
      { name: "リポジトリ", sources: "GitHub · GitLab · Bitbucket · Codeberg · Gitee" },
      { name: "アプリ", sources: "App Store · Google Play —— リンクではなく検索から" },
      { name: "Skills", sources: "skills.sh —— リンクではなく検索から" },
      { name: "ノート", sources: "自分で書いたもの。画像やテキストファイルを添えて" },
    ],
    behavesTitle: "ふるまい",
    features: [
      {
        name: "登録はユーザー名だけ",
        body: "パスワードもメールも確認リンクもありません。名前を決めれば、そこにあなたの stash があります。鍵をかけたくなったら、あとからパスワードを。",
      },
      {
        name: "終わったら鍵をかける",
        body: "ロック中は解除するまで読み取り専用。共有の画面でも、借りたノートパソコンでも、何も変わりません。",
      },
      {
        name: "裸のリンクではなく、中身の見えるカード",
        body: "タイトル、画像、著者、抜粋をページ自身から取ってくるので、一年後に見ても意味が残ります。ページと会話にはスクリーンショットも。",
      },
      {
        name: "何にでもメモを",
        body: "項目の隣に自分の言葉を —— なぜ残したのか、どうするつもりなのか。画像やテキストファイルも添えられます。",
      },
      {
        name: "検索と絞り込み",
        body: "残したもの全体を検索するか、ストアと出どころで絞り込むか。",
      },
      {
        name: "持ち出せる",
        body: "リンク一本で共有、いつでも丸ごと ZIP でエクスポート。",
      },
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
