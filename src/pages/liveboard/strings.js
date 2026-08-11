import { useEffect, useState } from "react";

// Everything this page says, in the three languages the gcc³ apps speak.
// Kept inside the page folder so liveboard stays a self-contained thing.
const STRINGS = {
  en: {
    title: "liveboard — anything on a screen, kept live",
    tagline: "Put anything on a screen, and let it keep itself up to date.",
    lede: "A spare monitor, a wall-mounted tablet, the second screen nobody uses — liveboard turns it into a board you compose yourself. Cards carry the things you would otherwise go and check: the weather, a page, a number, a note to whoever walks past.",
    open: "Open liveboard",
    source: "Source on GitHub",
    shotAlt: "A liveboard with several cards arranged on a screen",
    cardsTitle: "The cards",
    cardsLede: "Pick one to see what it does.",
    modules: {
      board: "Board 1",
      foot: "Drag it anywhere on the board · resize it · edit its settings · duplicate it",
      packs: [
        {
          pack: "basic",
          note: "General purpose cards.",
          modules: [
            { name: "Website", body: "Puts a live webpage on the board — a status page, a camera, a dashboard you already have." },
            { name: "Note", body: "Plain text, edited in place. The card everyone ends up using most." },
            { name: "Weather", body: "Current conditions and the forecast for a location you set, refreshed on its own." },
            { name: "Chat", body: "Talk to a model without leaving the board, and keep the reply up on the screen." },
            { name: "Code", body: "Runs JavaScript and Python right in the page, with the output on the card." },
          ],
        },
        {
          pack: "calc",
          note: "Working calculators, several of them for people living in Japan.",
          modules: [
            { name: "Calculator", body: "A replica of the 1984 Macintosh calculator, down to the layout Steve Jobs drew. Keyboard input included." },
            { name: "Real Estate Calc", body: "A Japanese property purchase: price, loan and fees in, estimated net value after X years out." },
            { name: "Stock Calc", body: "An initial sum plus a monthly one, taken out to a value after tax — NISA or the 20.315% taxable rate." },
            { name: "Currency Calc", body: "One amount shown in several currencies at once, on ECB reference rates. No key to set up." },
            { name: "Token Calc", body: "What one AI workload costs across Anthropic, OpenAI, DeepSeek and Kimi models, side by side, with cache and batch rates." },
          ],
        },
      ],
    },
    behavesTitle: "How a board behaves",
    behaviours: [
      {
        name: "Arrange it once",
        body: "Drag cards where you want them and pull them to the size they need. The layout is the point — a board is read from across a room, not scrolled.",
      },
      {
        name: "Keep several boards",
        body: "One for the morning, one for the numbers, one for the thing you are watching this week. Switch between them, or leave one up for good.",
      },
      {
        name: "Edit any card directly",
        body: "Every card's settings are open to you. Change them in place, duplicate a card you have already tuned, or reset one that got away from you.",
      },
      {
        name: "Take the layout with you",
        body: "Export a board and import it on another screen, or sign in and keep it on the server so the same board comes up wherever you open it.",
      },
      {
        name: "Ask for a card's contents",
        body: "Connect a Simple AI account and cards can be written and rewritten by a model — the Chat card, and anything else that takes text.",
      },
      {
        name: "In your language",
        body: "The whole board runs in English, 日本語 or 中文, and cards carry their own titles in each.",
      },
    ],
    openTitle: "The cards are not fixed",
    openBody: "liveboard ships with none of its own cards. They arrive in packs, and a pack is a repository — point a board at one and its cards show up in the menu. The two above are the published packs; a board that needs a card nobody has written yet can carry its own.",
  },

  zh: {
    title: "liveboard — 把任何东西放上屏幕，并让它一直是新的",
    tagline: "把任何东西放上一块屏幕，让它自己保持最新。",
    lede: "一台闲置的显示器、一块挂在墙上的平板、那块没人用的副屏 —— liveboard 把它变成一块由你自己排布的板子。卡片承载那些你原本得专门去看一眼的东西：天气、某个网页、某个数字，或者留给路过的人的一句话。",
    open: "打开 liveboard",
    source: "在 GitHub 查看源码",
    shotAlt: "屏幕上排布着若干卡片的一块 liveboard",
    cardsTitle: "卡片",
    cardsLede: "点一个看看它做什么。",
    modules: {
      board: "板子 1",
      foot: "拖到板上任何位置 · 调整大小 · 编辑设置 · 复制一份",
      packs: [
        {
          pack: "basic",
          note: "通用卡片。",
          modules: [
            { name: "网页", body: "把一个正在跑的网页放上板子 —— 状态页、摄像头画面，或者你本来就有的某个看板。" },
            { name: "便签", body: "纯文本，就地编辑。最后大家用得最多的就是这张卡。" },
            { name: "天气", body: "你指定地点的实况与预报，自己刷新。" },
            { name: "对话", body: "不离开板子就能跟模型说话，回答就留在屏幕上。" },
            { name: "代码", body: "在页面里直接跑 JavaScript 和 Python，输出就显示在卡片上。" },
          ],
        },
        {
          pack: "calc",
          note: "能真正用的计算器，其中几个是给在日本生活的人准备的。",
          modules: [
            { name: "计算器", body: "1984 年 Macintosh 计算器的复刻，连 Steve Jobs 画的那个布局都一样。支持键盘输入。" },
            { name: "房产计算", body: "日本购房：输入房价、贷款和各项费用，估算 X 年后的净值。" },
            { name: "股票计算", body: "一笔本金加上每月定投，算到税后的价值 —— NISA 或 20.315% 的应税税率。" },
            { name: "汇率换算", body: "一个金额同时以多种货币显示，用欧洲央行参考汇率。不需要配置任何密钥。" },
            { name: "Token 计算", body: "同一份 AI 用量在 Anthropic、OpenAI、DeepSeek 和 Kimi 各模型上分别要多少钱，并排对比，含缓存与批处理价。" },
          ],
        },
      ],
    },
    behavesTitle: "一块板子是怎么用的",
    behaviours: [
      {
        name: "排一次就好",
        body: "把卡片拖到你想要的位置，拉到需要的大小。布局本身就是重点 —— 板子是隔着房间看的，不是拿来滚动的。",
      },
      {
        name: "可以有好几块板",
        body: "早上一块，数字一块，这周正在盯的事情一块。在它们之间切换，或者干脆让某一块一直亮着。",
      },
      {
        name: "任何卡片都能直接改",
        body: "每张卡的设置都对你开放。就地修改、把调好的卡复制一份，或者把跑偏的那张重置回去。",
      },
      {
        name: "布局带得走",
        body: "导出一块板，在另一块屏幕上导入；或者登录之后存在服务器上，在哪儿打开都是同一块板。",
      },
      {
        name: "让卡片自己写内容",
        body: "接上一个 Simple AI 账号，卡片的文字就可以由模型来写和改写 —— 对话卡，以及任何吃文字的卡片。",
      },
      {
        name: "用你的语言",
        body: "整块板支持 English、日本語、中文，卡片在每种语言下都有自己的标题。",
      },
    ],
    openTitle: "卡片不是写死的",
    openBody: "liveboard 自己不带任何卡片。卡片以「包」的形式到来，而一个包就是一个仓库 —— 把板子指向它，它的卡片就出现在菜单里。上面这两个是已发布的包；如果一块板需要一张还没人写过的卡，它也可以带上自己的。",
  },

  ja: {
    title: "liveboard — 画面に何でも、そして常に最新に",
    tagline: "画面に何でも置いて、あとは勝手に新しくなってもらう。",
    lede: "余っているモニタ、壁のタブレット、誰も使っていない二枚目の画面 —— liveboard はそれを、自分で組み立てるボードに変えます。カードが載せるのは、本来わざわざ見にいくもの。天気、あるページ、ある数字、通りかかる人への一言。",
    open: "liveboard を開く",
    source: "GitHub のソース",
    shotAlt: "カードがいくつも並んだ liveboard の画面",
    cardsTitle: "カード",
    cardsLede: "選ぶと、そのカードの働きが出ます。",
    modules: {
      board: "ボード 1",
      foot: "ボードのどこへでもドラッグ · サイズ変更 · 設定を編集 · 複製",
      packs: [
        {
          pack: "basic",
          note: "汎用のカード。",
          modules: [
            { name: "ウェブサイト", body: "動いているウェブページをそのままボードへ。ステータスページ、カメラ、すでにあるダッシュボード。" },
            { name: "ノート", body: "その場で編集できるただのテキスト。結局いちばん使われるカード。" },
            { name: "天気", body: "指定した地点の現況と予報。自分で更新します。" },
            { name: "チャット", body: "ボードを離れずにモデルと話し、返答は画面に出したまま。" },
            { name: "コード", body: "ページの中で JavaScript と Python を実行し、出力をカードに表示します。" },
          ],
        },
        {
          pack: "calc",
          note: "実用的な計算機。いくつかは日本に住む人向け。",
          modules: [
            { name: "電卓", body: "1984 年の Macintosh 電卓の復刻。Steve Jobs が引いたレイアウトそのままに、キーボード入力にも対応。" },
            { name: "不動産計算", body: "日本での物件購入。価格・ローン・諸費用を入れて、X 年後の正味価値を見積もります。" },
            { name: "株式計算", body: "初期投資と毎月の積立から、税引後の価値まで —— NISA か、課税の 20.315%。" },
            { name: "通貨換算", body: "一つの金額を複数通貨で同時に表示。ECB の参照レートを使い、鍵の設定は不要。" },
            { name: "Token 計算", body: "同じ AI 用量が Anthropic・OpenAI・DeepSeek・Kimi の各モデルでいくらになるか、並べて比較。キャッシュとバッチの料金も。" },
          ],
        },
      ],
    },
    behavesTitle: "ボードのふるまい",
    behaviours: [
      {
        name: "並べるのは一度きり",
        body: "カードを置きたいところへドラッグし、必要な大きさに引き伸ばす。レイアウトこそが要点です。ボードは部屋の向こうから読むもので、スクロールするものではありません。",
      },
      {
        name: "ボードは何枚でも",
        body: "朝用に一枚、数字用に一枚、今週見ているもの用に一枚。切り替えても、一枚だけ出しっぱなしでも。",
      },
      {
        name: "どのカードもその場で編集",
        body: "カードの設定はすべて開かれています。その場で変える、調整済みのカードを複製する、おかしくなった一枚をリセットする。",
      },
      {
        name: "レイアウトは持ち運べる",
        body: "ボードを書き出して別の画面で読み込む。あるいはサインインしてサーバーに置けば、どこで開いても同じボードが出てきます。",
      },
      {
        name: "カードの中身を書いてもらう",
        body: "Simple AI のアカウントをつなぐと、カードの文章をモデルが書いたり書き直したりできます。チャットのカードも、テキストを扱うほかのカードも。",
      },
      {
        name: "自分の言語で",
        body: "ボード全体が English・日本語・中文 に対応し、カードもそれぞれの言語のタイトルを持っています。",
      },
    ],
    openTitle: "カードは固定ではない",
    openBody: "liveboard 自身はカードを一枚も持っていません。カードはパックとして届き、パックとはリポジトリのことです。ボードをそこへ向ければ、メニューにカードが現れます。上の二つは公開済みのパック。まだ誰も書いていないカードが必要なボードは、自分のものを持つこともできます。",
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
