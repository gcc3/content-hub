import meta from "./meta.json";
import { useEffect, useState } from "react";

// Everything this page says, in the three languages the gcc³ apps speak.
// Kept inside the page folder so tikt stays a self-contained thing.
const STRINGS = {
  en: {
    // The English title is the one a search result carries, so it is kept
    // where the rest of the page's search metadata lives.
    title: meta.seo.title,
    tagline: "A tick tied in time.",
    lede: "In ancient times people tied knots in ropes to record what happened. tikt keeps the idea and drops everything else: a rope is a timeline, a knot is an event, and recording one takes a single press.",
    open: "Open tikt",
    source: "Source on GitHub",
    tieOne: "Tie one",
    footnote: "Intensity is the whole point of holding. A quick tap says it happened; a long hold says it happened a lot. Later, that number is what the charts are made of.",
    recorder: {
      empty: "An empty rope. Hold the pad to tie the first knot.",
      countOne: "1 knot on this rope",
      countMany: "{{count}} knots on this rope",
      ropeAria: "A rope carrying {{count}} knots",
      hold: "hold to record",
      keepHolding: "keep holding",
      holdAria: "Hold to record",
      clear: "clear rope",
      legend: [
        { key: "Tap", meaning: "counts as one" },
        { key: "Hold", meaning: "climbs towards ten" },
        { key: "Release", meaning: "ties the knot" },
      ],
    },
    threeWords: "Three words",
    vocabulary: [
      {
        word: "Rope",
        gloss: "a timeline",
        body: "One rope per thing you are keeping track of — coffees, headaches, practice sessions, arguments. Make as many as you need; each keeps its own history.",
      },
      {
        word: "Knot",
        gloss: "an event",
        body: "One moment, tied onto the rope. Every knot carries the time it happened and how strongly it landed, from one to ten.",
      },
      {
        word: "Tikt",
        gloss: "the tick",
        body: "The act itself. Name the record, hold the pad, let go. It takes about a second, which is the only reason anyone keeps a record at all.",
      },
    ],
    lookingBack: "Looking back",
    lookingBackLede: "Every rope keeps its own statistics, and you can read them at three distances.",
    views: [
      { name: "Day", body: "A calendar of the last thirty days, each day shaded by how much happened. Tap a day to see only its knots." },
      { name: "Month", body: "The last twelve months as bars. The shape of a habit shows up here long before you would have noticed it." },
      { name: "Year", body: "Ten years at a glance, for the ropes you keep for a long time." },
    ],
    smallThings: "Small things",
    details: [
      "Sign in with a username. No password, nothing to reset.",
      "Sound feedback while you hold, and a mute switch for when you would rather not.",
      "Undo right after recording, in case the knot was a mistake.",
      "Your date of birth turns into your age on the account page — useful when a rope spans years.",
      "English, 日本語 and 中文.",
    ],
  },

  zh: {
    title: "tikt — 在时间上打一个结",
    tagline: "在时间上打一个结。",
    lede: "古人结绳记事。tikt 保留了这个想法，其余一概省去：一根绳是一条时间线，一个结是一件事，记录一次只需要按一下。",
    open: "打开 tikt",
    source: "在 GitHub 查看源码",
    tieOne: "打一个结",
    footnote: "按住的意义全在强度上。轻轻一点表示「发生了」，长按表示「发生得很厉害」。之后所有的图表，都是由这个数字画出来的。",
    recorder: {
      empty: "空绳一根。按住下面的方块，打上第一个结。",
      countOne: "这根绳上有 1 个结",
      countMany: "这根绳上有 {{count}} 个结",
      ropeAria: "一根系着 {{count}} 个结的绳子",
      hold: "按住记录",
      keepHolding: "继续按住",
      holdAria: "按住记录",
      clear: "清空绳子",
      legend: [
        { key: "点一下", meaning: "记为 1" },
        { key: "按住", meaning: "一路涨到 10" },
        { key: "松手", meaning: "打上这个结" },
      ],
    },
    threeWords: "三个词",
    vocabulary: [
      {
        word: "绳",
        gloss: "一条时间线",
        body: "每件想记的事一根绳 —— 咖啡、头痛、练习、争吵。要几根就建几根，各自保存各自的历史。",
      },
      {
        word: "结",
        gloss: "一件事",
        body: "一个瞬间，系在绳上。每个结都带着发生的时间，以及它有多重，从 1 到 10。",
      },
      {
        word: "tikt",
        gloss: "记录这个动作",
        body: "动作本身。给记录起个名字，按住方块，松手。大约一秒钟 —— 也正因为如此，这个记录才真的能一直记下去。",
      },
    ],
    lookingBack: "回头看",
    lookingBackLede: "每根绳都有自己的统计，可以从三种距离来读。",
    views: [
      { name: "日", body: "最近三十天的日历，每天按发生的多少深浅不同。点某一天，只看那天的结。" },
      { name: "月", body: "最近十二个月的柱状图。一个习惯的形状，会在你自己察觉之前先出现在这里。" },
      { name: "年", body: "十年一览，给那些你会长期留着的绳子。" },
    ],
    smallThings: "一些小事",
    details: [
      "用一个用户名登录。没有密码，也就没有什么可重置的。",
      "按住时有声音反馈，不想要的时候可以静音。",
      "记录完可以马上撤销，万一这个结打错了。",
      "生日会在账户页变成年龄 —— 当一根绳跨越好几年时会用得上。",
      "English、日本語、中文。",
    ],
  },

  ja: {
    title: "tikt — 時のなかに結び目をひとつ",
    tagline: "時のなかに、結び目をひとつ。",
    lede: "むかしの人は縄を結んで出来事を記録しました。tikt はその発想だけを残し、あとは削ぎ落としています。ロープは時間軸、結び目は出来事、記録はひと押し。",
    open: "tikt を開く",
    source: "GitHub のソース",
    tieOne: "結んでみる",
    footnote: "押し続けることの意味は強度にあります。軽く叩けば「あった」、長く押せば「かなりあった」。あとで出てくるグラフは、すべてこの数字からできています。",
    recorder: {
      empty: "まだ何もないロープ。パッドを押し続けて、最初の結び目を。",
      countOne: "このロープに結び目 1 つ",
      countMany: "このロープに結び目 {{count}} つ",
      ropeAria: "結び目が {{count}} つあるロープ",
      hold: "押して記録",
      keepHolding: "そのまま",
      holdAria: "押し続けて記録",
      clear: "ロープを空に",
      legend: [
        { key: "タップ", meaning: "1 として数える" },
        { key: "長押し", meaning: "10 に向かって上がる" },
        { key: "離す", meaning: "結び目になる" },
      ],
    },
    threeWords: "三つの言葉",
    vocabulary: [
      {
        word: "ロープ",
        gloss: "時間軸",
        body: "記録したいことごとに一本。コーヒー、頭痛、練習、口論。必要なだけ作れて、それぞれが自分の履歴を持ちます。",
      },
      {
        word: "結び目",
        gloss: "出来事",
        body: "ロープに結ばれた一瞬。いつ起きたかと、どれくらい強かったか（1 から 10）を持ちます。",
      },
      {
        word: "tikt",
        gloss: "記録する行為",
        body: "行為そのもの。名前をつけ、パッドを押し、離す。かかるのは一秒ほど。記録が続くのは、それだけの理由です。",
      },
    ],
    lookingBack: "振り返る",
    lookingBackLede: "ロープごとに統計があり、三つの距離から読めます。",
    views: [
      { name: "日", body: "直近三十日のカレンダー。その日にどれだけあったかで濃さが変わります。日を選べばその日の結び目だけ。" },
      { name: "月", body: "直近十二か月の棒グラフ。習慣のかたちは、自分で気づくよりずっと早くここに出ます。" },
      { name: "年", body: "十年を一目で。長く続けるロープのために。" },
    ],
    smallThings: "細かいこと",
    details: [
      "ユーザー名だけでログイン。パスワードはなく、再設定するものもありません。",
      "押している間の音のフィードバックと、鳴らしたくないときのミュート。",
      "記録した直後の取り消し。結び目を間違えたときに。",
      "生年月日はアカウント画面で年齢になります。ロープが何年にもわたるときに効いてきます。",
      "English・日本語・中文。",
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
