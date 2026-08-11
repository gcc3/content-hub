import { useEffect, useState } from "react";

// Everything this page says, in the three languages the gcc³ apps speak.
// Kept inside the page folder so q stays a self-contained thing.
const STRINGS = {
  en: {
    title: "q — surveys, written and read with AI",
    tagline: "Say what you want to know. Get a survey back.",
    lede: "Writing a good survey is slow, and reading the results is slower. q does both ends: the model drafts the questions from a sentence, and once the answers are in, it tells you what they add up to. Small, quick, and free of everything a survey tool usually asks of you.",
    open: "Open q",
    source: "Source on GitHub",
    walkTitle: "Walk through one",
    demo: {
      stages: ["Describe", "Answer", "Read"],
      topicLabel: "What would you like to survey?",
      topic: "where people do their best work",
      generate: "Generate",
      generating: "Generating…",
      generateNote: "The model drafts the questions, the options and the wording around them. Everything it writes is yours to edit before anyone sees it.",
      questionOf: "Question 1 of 6",
      question: "Where do you get your best work done?",
      description: "Pick the place you actually finish things, not the one you like the idea of.",
      options: ["At home", "In an office", "A café or a library", "Somewhere different every week"],
      submit: "Submit",
      pickOne: "Pick one",
      collected: "281 responses collected",
      yours: "yours",
      analysisLabel: "Analysis",
      analysis: "Home leads, but only just — taken together, the three answers that are not an office account for four in five responses. The split between a fixed place and a changing one is the sharper divide here, and it runs almost evenly down the middle.",
      startOver: "Start over",
    },
    stepsTitle: "Four steps, end to end",
    steps: [
      {
        name: "Say what you want to know",
        body: "A sentence is enough. The model drafts a description, the questions and the options, and marks the ones that take more than one answer.",
      },
      {
        name: "Edit anything",
        body: "Rewrite a question, add one, reorder them, or ask for a revision in plain words — “make it shorter, and drop the demographics”. The survey underneath is plain data you can edit directly.",
      },
      {
        name: "Send the link",
        body: "One link, no account needed to answer. Respondents can leave an email if they want a copy of their own answers.",
      },
      {
        name: "Read what came back",
        body: "Every question gets its own chart as responses arrive, and the model writes the summary of what the whole set says.",
      },
    ],
    typesTitle: "Question types",
    types: [
      { name: "Single choice", body: "One answer from a list, with an optional “Other” box for the answer you did not think of." },
      { name: "Multiple choice", body: "Any number of answers from the list." },
      { name: "Yes / no", body: "For the questions that really are that simple." },
      { name: "Free text", body: "When the interesting part is what people write themselves." },
    ],
    scoredTitle: "Surveys that score",
    scoredBody: "A survey can also be a test. Give the questions weights, group them into dimensions, and set what each score band means — the result each respondent sees is then a reading rather than a tally. Scored surveys are shown as a radar across their dimensions, so the shape of an answer is visible before any of the numbers are.",
    scoredList: [
      "Group questions into named dimensions",
      "Score bands with a label and an explanation of their own",
      "A per-respondent result page, shareable on its own",
      "English, 日本語 and 中文 throughout",
    ],
  },

  zh: {
    title: "q — 用 AI 出题，用 AI 读结果",
    tagline: "说出你想知道什么，问卷就回来了。",
    lede: "写一份好问卷很慢，读结果更慢。q 把两头都接了过来：你写一句话，模型起草问题；答案回来之后，它告诉你这些答案加起来说明了什么。小、快，并且不向你索取问卷工具通常会索取的一切。",
    open: "打开 q",
    source: "在 GitHub 查看源码",
    walkTitle: "走一遍看看",
    demo: {
      stages: ["描述", "作答", "阅读"],
      topicLabel: "你想调查什么？",
      topic: "大家在什么地方做出最好的工作",
      generate: "生成",
      generating: "生成中…",
      generateNote: "模型会起草问题、选项，以及围绕它们的所有措辞。它写的每一句，在别人看到之前都归你改。",
      questionOf: "第 1 题 / 共 6 题",
      question: "你在什么地方做出最好的工作？",
      description: "选你真正把事情做完的地方，而不是你喜欢想象的那个地方。",
      options: ["在家", "在办公室", "咖啡馆或图书馆", "每周都换一个地方"],
      submit: "提交",
      pickOne: "先选一个",
      collected: "已收集 281 份回答",
      yours: "你的",
      analysisLabel: "分析",
      analysis: "在家领先，但只是略微领先 —— 把三个「不是办公室」的答案加在一起，占了五分之四。这里更明显的分界其实是固定的地方与变动的地方之间，而这条线几乎正好从中间划过。",
      startOver: "重新开始",
    },
    stepsTitle: "四步，从头到尾",
    steps: [
      {
        name: "说出你想知道什么",
        body: "一句话就够。模型会起草说明、问题和选项，并标出哪些题可以多选。",
      },
      {
        name: "什么都能改",
        body: "改写一题、加一题、调整顺序，或者直接用大白话提要求 ——「短一点，把人口统计那部分去掉」。底下的问卷就是普通的数据，你可以直接编辑。",
      },
      {
        name: "把链接发出去",
        body: "一条链接，作答不需要注册。想拿一份自己答案的副本，留个邮箱就行。",
      },
      {
        name: "读回来的东西",
        body: "回答一份份进来，每道题都有自己的图；整份问卷说明了什么，由模型来写这段总结。",
      },
    ],
    typesTitle: "题型",
    types: [
      { name: "单选", body: "从一列选项里选一个，可以带一个「其他」框，留给你没想到的那个答案。" },
      { name: "多选", body: "从这列选项里想选几个就选几个。" },
      { name: "是 / 否", body: "留给那些真就这么简单的问题。" },
      { name: "文本", body: "当有意思的部分恰恰是别人自己写下来的东西。" },
    ],
    scoredTitle: "会计分的问卷",
    scoredBody: "问卷也可以是一份测验。给题目设权重、归入维度，再定义每个分数区间意味着什么 —— 于是每位答题者看到的不再是一个总分，而是一段解读。计分问卷会以维度雷达图呈现，一个答案的形状，在你看清任何数字之前就已经显现。",
    scoredList: [
      "把题目归入命名的维度",
      "分数区间各有自己的标签和说明",
      "每位答题者一个结果页，可以单独分享",
      "全程支持 English、日本語、中文",
    ],
  },

  ja: {
    title: "q — AI で作り、AI で読む アンケート",
    tagline: "知りたいことを言えば、アンケートが返ってくる。",
    lede: "よいアンケートを書くのは遅く、結果を読むのはもっと遅い。q はその両端を引き受けます。一文からモデルが設問を起草し、回答が集まればそれが何を意味するかを書く。小さく、速く、アンケートツールが普通は要求してくるもの一切なし。",
    open: "q を開く",
    source: "GitHub のソース",
    walkTitle: "ひととおり辿る",
    demo: {
      stages: ["書く", "答える", "読む"],
      topicLabel: "何について聞きたいですか？",
      topic: "人がいちばんよい仕事をする場所",
      generate: "生成",
      generating: "生成中…",
      generateNote: "設問も選択肢も、その周りの言葉づかいもモデルが起草します。書かれたものはすべて、誰かの目に触れる前にあなたが直せます。",
      questionOf: "設問 1 / 6",
      question: "いちばんよい仕事ができるのはどこですか？",
      description: "憧れている場所ではなく、実際に物事が終わる場所を選んでください。",
      options: ["自宅", "オフィス", "カフェか図書館", "毎週ちがう場所"],
      submit: "送信",
      pickOne: "ひとつ選んでください",
      collected: "281 件の回答",
      yours: "あなた",
      analysisLabel: "分析",
      analysis: "自宅が首位ですが、僅差です。オフィス以外の三つを合わせると、回答の五分の四を占めます。ここでより鋭い分かれ目は、決まった場所か変わる場所か —— そしてその線は、ほぼ真ん中を通っています。",
      startOver: "最初から",
    },
    stepsTitle: "四つの手順で、端から端まで",
    steps: [
      {
        name: "知りたいことを言う",
        body: "一文で足ります。モデルが説明文、設問、選択肢を起草し、複数回答の設問には印をつけます。",
      },
      {
        name: "どこでも直せる",
        body: "設問を書き直す、足す、並べ替える。あるいは普通の言葉で頼む ——「もっと短く、属性の質問は削って」。土台にあるのはただのデータなので、直接編集もできます。",
      },
      {
        name: "リンクを送る",
        body: "リンク一本、回答にアカウントは不要。自分の回答の控えが欲しい人はメールアドレスを残せます。",
      },
      {
        name: "返ってきたものを読む",
        body: "回答が届くたび、設問ごとにグラフが育ちます。全体が何を語っているかの要約は、モデルが書きます。",
      },
    ],
    typesTitle: "設問の種類",
    types: [
      { name: "単一選択", body: "一覧からひとつ。思いつかなかった答えのための「その他」欄も付けられます。" },
      { name: "複数選択", body: "一覧からいくつでも。" },
      { name: "はい / いいえ", body: "本当にそれだけで済む問いのために。" },
      { name: "自由記述", body: "面白いのが、その人自身の言葉であるとき。" },
    ],
    scoredTitle: "点数のつくアンケート",
    scoredBody: "アンケートは診断にもなります。設問に重みをつけ、次元にまとめ、点数帯ごとの意味を決める —— すると回答者が見るのは合計ではなく、一つの読み解きになります。採点型はレーダーで示されるので、数字を追う前に答えのかたちが見えます。",
    scoredList: [
      "設問を名前つきの次元にまとめる",
      "点数帯ごとのラベルと説明",
      "回答者ごとの結果ページ、単独で共有可能",
      "全体を通して English・日本語・中文",
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
