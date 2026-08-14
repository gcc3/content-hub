import meta from "./meta.json";
import { useEffect, useState } from "react";

// Everything this page says, in the three languages the gcc³ apps speak.
// Kept inside the page folder so gift stays a self-contained thing.
//
// The commands, the hook fields and the function names are code: they are the
// same words at every terminal, so they read the same here in every language,
// and only what is said about them is translated.
const STRINGS = {
  en: {
    // The English title is the one a search result carries, so it is kept
    // where the rest of the page's search metadata lives.
    title: meta.seo.title,
    tagline: "A push lands, and the script you named runs.",
    lede: "gift listens for GitHub events on a port of your own, and answers a push by running a script in a folder — build the site, pull the notes, restart the thing that just changed. Around that server sits a handful of git chores, run from the same command.",
    installCta: "Install gift",
    source: "Source on GitHub",
    facts: ["macOS · Linux", "Node 18+", "MIT"],

    deliveryTitle: "A push, and what it runs",
    deliveryLede: "A hook is a repository, the branches worth answering, a script, and the folder that script runs in. A delivery arrives and every hook watching that repository and that branch runs. Pick a push and watch it land:",
    delivery: {
      try: "Push",
      request: "POST /hooks/github",
      signature: "signature ok",
      push: "push",
      commits: "{n} commits",
      hooks: "hooks",
      columns: {
        name: "name",
        repo: "repository",
        branches: "branches",
        runs: "runs",
        dir: "in",
      },
      match: "match",
      noMatch: "—",
      matching: "matching…",
      ran: "{script} ran in {dir} · exit 0",
      nothing: "No match · nothing ran",
      resultLabel: "Delivery",
    },
    deliveryNote: "The secret is checked before any of that: a delivery whose signature does not add up is refused. gift create can make the webhook on GitHub for you with gh, and then asks GitHub back whether it is really there — a hook in your file that GitHub never calls is worth being told about rather than assumed to work.",

    hookTitle: "What gift create asks",
    hookParts: [
      {
        term: "Repository",
        detail: "The one whose pushes this hook answers, as owner/name.",
      },
      {
        term: "Branches",
        detail: "Comma separated, or * for any; main, master unless you say otherwise. A push to a branch outside the list is answered with No match and runs nothing.",
      },
      {
        term: "Name",
        detail: "A label, so gift list reads as something. Names may be reused — same-named hooks are deleted by their position in the list.",
      },
      {
        term: "Script",
        detail: "What to run when a delivery matches.",
      },
      {
        term: "Working directory",
        detail: "Where to run it. The server restarts itself once the hook is written, so there is nothing else to do.",
      },
    ],

    serverTitle: "The server",
    commands: [
      { cmd: "gift serve", body: "Pulls the latest code, rebuilds, and starts listening." },
      { cmd: "gift restart", body: "Puts the server back on the code already on disk — no pull, no rebuild, so it needs no network and returns straight away." },
      { cmd: "gift stop · gift status", body: "Stops it; says whether it is running." },
      { cmd: "gift list · gift create · gift delete", body: "Show the hooks, add one, remove one. The server restarts itself after either change." },
      { cmd: "gift log", body: "The last ten lines, and then each line as the server writes it. gift log 20 for more, --no-follow to print them and exit." },
      { cmd: "gift config", body: "Opens config.json in $EDITOR; --path prints where it is." },
      { cmd: "gift update", body: "A git pull --ff-only in the folder gift is installed from — so it is the checkout's way of upgrading, and has nothing to pull in a release install." },
    ],
    serverNote: "The port also carries a page of its own: the hooks as they are configured, and the last day of deliveries newest first, with what each one's script printed — filling in while it is still printing it.",

    funcsTitle: "The other things it does",
    funcsLede: "The same command runs a small set of git chores. gift help lists them, gift run opens a picker — a cursor to move, enter to run, a number key to run that row straight away — and gift <name> skips the picker. Enough of a name will do, and anything after it is passed on to the function itself.",
    runsLabel: "runs as",
    funcs: [
      {
        name: "repo-master",
        runs: "gift repo",
        body: "Every git repository under one folder, in a table that keeps itself up to date: which branch each is on, whether anything is uncommitted, how many lines that is, and when it last moved. Pick some rows and the menu is what may be done to them — open one in an editor or an agent, read a diff, fetch, pull, push, branch, merge, rebase, stash, or commit and push the lot. Nested checkouts and submodules get a row of their own.",
      },
      {
        name: "weekly-prs",
        runs: "gift weekly",
        body: "A week of pull requests, grouped by the day they were opened. Weeks run Monday to Sunday, and it asks how many weeks back unless you have already said.",
      },
      {
        name: "pull-repos",
        runs: "gift pull",
        body: "git pull --recurse-submodules --autostash in every repository below one folder, however deep it is. --dry-run says what it would pull without pulling it.",
      },
    ],

    configTitle: "One file of settings",
    configBody: "Every setting is in one file — config.json, beside the code. gift config opens it in your editor. gift's own settings are at the top level and each function's are under functions.<name>:",
    configNote: "It is written on first use with the settings worth looking at already in it, at their defaults, so opening it shows what there is to set rather than a blank page. Each one is declared in a config.schema.json next to the code that reads it — where its default, its description and the environment variable it reaches a script as all come from. A value already in the environment wins over the file, and a flag wins over both. The file is git-ignored and written 0600, because the webhook secret is in it.",

    startTitle: "Getting it",
    install: {
      body: "One line. It takes the latest release, unpacks it into ~/.gift, and runs the setup and install steps from there — so it asks for the public delivery URL as it goes, and leaves the gift command on your PATH. Node 18 or newer, curl and unzip, and nothing else to install first.",
      waysLabel: "How to install it",
      ways: { release: "Release", checkout: "From a checkout" },
      notes: {
        release: [
          "GIFT_INSTALL_DIR unpacks it somewhere other than ~/.gift, and GIFT_INSTALL_VERSION=v0.0.1 pins a release rather than taking the newest.",
          "Upgrading is the same line again: config.json, hooks.json and the logs are carried across, so the webhook secret and the hooks you configured survive the swap. A download that fails leaves the install that was working exactly where it was.",
        ],
        checkout: [
          "The two steps the one-liner runs for you, against the code you already have. gift is put in ~/.local/bin as a wrapper around that checkout, so it stays the copy you pull and edit.",
          "gift update is this way's upgrade — a git pull --ff-only in that folder. A release install has no checkout to pull, and takes the line on the other tab instead.",
        ],
      },
      copy: "copy",
      copied: "copied",
    },
    steps: [
      {
        lead: "Install it",
        body: " — the line above. It asks for the public URL that GitHub will deliver to, which is the one thing it cannot work out for itself.",
      },
      {
        lead: "gift config",
        body: " — the port to listen on, and the webhook secret to check deliveries against.",
      },
      {
        lead: "gift create",
        body: " — the repository, the branches, the script and where to run it. Answer yes and gh makes the webhook on GitHub for you; answer no and you add it yourself under Settings ▸ Webhooks, with the same secret.",
      },
      {
        lead: "gift serve",
        body: " — and the next push runs it. gift log to watch it happen.",
      },
    ],
    startNote: "~/.gift/uninstall.sh takes the gift command back off again, and deleting ~/.gift removes the rest; from a checkout it is ./uninstall.sh.",

    readme: "README",
    releases: "Releases",
  },

  zh: {
    title: "gift — 一次 push，跑一个脚本",
    tagline: "push 落地，你指定的脚本就跑起来。",
    lede: "gift 在你自己的端口上监听 GitHub 事件，收到一次 push，就在某个目录里跑一个脚本 —— 构建站点、拉取笔记、重启刚刚改动的那个东西。服务器周围还聚着几件 git 杂活，用同一条命令就能跑。",
    installCta: "安装 gift",
    source: "在 GitHub 查看源码",
    facts: ["macOS · Linux", "Node 18+", "MIT"],

    deliveryTitle: "一次 push，跑起来的是什么",
    deliveryLede: "一个 hook 就是：一个仓库、值得响应的分支、一个脚本，以及这个脚本运行的目录。一次投递到达，所有正在盯着那个仓库那个分支的 hook 都会跑起来。挑一次 push，看它落地：",
    delivery: {
      try: "推送",
      request: "POST /hooks/github",
      signature: "签名通过",
      push: "push",
      commits: "{n} 个提交",
      hooks: "hooks",
      columns: {
        name: "名称",
        repo: "仓库",
        branches: "分支",
        runs: "运行",
        dir: "目录",
      },
      match: "命中",
      noMatch: "—",
      matching: "匹配中…",
      ran: "{script} 在 {dir} 中执行完毕 · exit 0",
      nothing: "无匹配 · 什么也没跑",
      resultLabel: "投递",
    },
    deliveryNote: "在这一切之前，先核对密钥：签名对不上的投递会被拒绝。gift create 可以用 gh 替你在 GitHub 上把 webhook 建好，建好之后再回头问 GitHub 一句它是不是真的在那里 —— 文件里有、GitHub 却从不调用的 hook，值得被告知，而不是被默认能用。",

    hookTitle: "gift create 会问的五件事",
    hookParts: [
      {
        term: "Repository",
        detail: "这个 hook 要响应哪个仓库的 push，写作 owner/name。",
      },
      {
        term: "Branches",
        detail: "逗号分隔，或者用 * 表示任意；不特别说明就是 main, master。push 到列表之外的分支，回答是 No match，什么也不跑。",
      },
      {
        term: "Name",
        detail: "一个标签，好让 gift list 读起来像句话。名字可以重复 —— 同名的 hook 按它在列表里的位置删除。",
      },
      {
        term: "Script",
        detail: "匹配上之后要运行的东西。",
      },
      {
        term: "Working directory",
        detail: "在哪里运行它。hook 写好之后服务器会自己重启，不必再做别的。",
      },
    ],

    serverTitle: "服务器",
    commands: [
      { cmd: "gift serve", body: "拉取最新代码、重新构建，然后开始监听。" },
      { cmd: "gift restart", body: "让服务器回到磁盘上已有的代码 —— 不拉取，不构建，因此不需要网络，也立刻就返回。" },
      { cmd: "gift stop · gift status", body: "停止；以及它到底有没有在跑。" },
      { cmd: "gift list · gift create · gift delete", body: "列出 hook、加一个、删一个。这两种改动之后，服务器都会自己重启。" },
      { cmd: "gift log", body: "最后十行，然后服务器每写一行就打一行。gift log 20 可以多看几行，--no-follow 打完就退出。" },
      { cmd: "gift config", body: "用 $EDITOR 打开 config.json；--path 只打印它在哪。" },
      { cmd: "gift update", body: "在 gift 所安装的那个目录里执行 git pull --ff-only —— 也就是 checkout 那条路的升级方式；用 release 装的话，它没有东西可拉。" },
    ],
    serverNote: "这个端口上还有一个页面：当前配置着的 hook，以及最近一天的投递，最新的在最前，还有每一次投递里脚本打印出来的东西 —— 它还在打印的时候，页面就在往下填。",

    funcsTitle: "它还做的那些事",
    funcsLede: "同一条命令也跑一小组 git 杂活。gift help 列出它们；gift run 打开一个选单 —— 光标可以移动，回车执行，数字键直接执行那一行 —— 而 gift <name> 跳过选单。名字写一半就够，写在后面的东西会原样交给这个功能自己。",
    runsLabel: "怎么跑",
    funcs: [
      {
        name: "repo-master",
        runs: "gift repo",
        body: "一个目录下的所有 git 仓库，摆在一张会自己更新的表里：各自在哪个分支、有没有未提交的改动、那是多少行、最后一次变动是什么时候。选中几行，菜单就是可以对它们做的事 —— 用编辑器或 agent 打开、看 diff、fetch、pull、push、切分支、merge、rebase、stash，或者把它们全部提交并推上去。嵌套的仓库和子模块各占一行。",
      },
      {
        name: "weekly-prs",
        runs: "gift weekly",
        body: "某一周的 Pull Request，按提出的日期分组。一周从周一到周日；没有事先说明的话，它会问你要往回数几周。",
      },
      {
        name: "pull-repos",
        runs: "gift pull",
        body: "在某个目录之下的每一个仓库里执行 git pull --recurse-submodules --autostash，不管藏得多深。--dry-run 只说它会拉什么，不真的拉。",
      },
    ],

    configTitle: "设置只有一个文件",
    configBody: "所有设置都在一个文件里 —— config.json，就放在代码旁边。gift config 用你的编辑器打开它。gift 自己的设置在顶层，各个功能的设置在 functions.<name> 之下：",
    configNote: "这个文件在第一次用到时写出，里面已经带着那些值得看一眼的设置和它们的默认值 —— 打开它看到的是有哪些可以设，而不是一张白纸。每一项都声明在读它的那段代码旁边的 config.schema.json 里：默认值、说明，以及它交给脚本时用的环境变量名，都从那里来。环境里已经有的值胜过文件，命令行上的 flag 又胜过两者。文件被 git 忽略，并以 0600 写入，因为 webhook 密钥就在里面。",

    startTitle: "装上它",
    install: {
      body: "一行就够。它取来最新的 release，解包到 ~/.gift，然后在那里跑完 setup 和 install —— 过程中会问你对外的投递 URL，装完把 gift 命令放到你的 PATH 上。需要 Node 18 或更新的版本，以及 curl 和 unzip，别的什么都不用先装。",
      waysLabel: "怎么安装",
      ways: { release: "Release", checkout: "从 checkout 装" },
      notes: {
        release: [
          "GIFT_INSTALL_DIR 可以解包到 ~/.gift 以外的地方，GIFT_INSTALL_VERSION=v0.0.1 则是钉住某个 release，而不是取最新的那个。",
          "升级就是再跑一次这一行：config.json、hooks.json 和日志都会带过去，所以 webhook 密钥和你配好的 hook 都能活过这次替换。下载失败的话，原本能用的那份安装会原封不动地留在那里。",
        ],
        checkout: [
          "这就是那一行替你跑的两步，只不过针对你手上已有的代码。gift 会放在 ~/.local/bin，作为那份 checkout 的一层包装 —— 它始终是你拉取、你修改的那一份。",
          "gift update 是这条路的升级方式：在那个目录里执行 git pull --ff-only。用 release 装的没有 checkout 可拉，请改用另一个页签上的那一行。",
        ],
      },
      copy: "复制",
      copied: "已复制",
    },
    steps: [
      {
        lead: "装上它",
        body: " —— 上面那一行。它会问你 GitHub 要投递到的那个对外 URL，那是它唯一没法自己算出来的东西。",
      },
      {
        lead: "gift config",
        body: " —— 监听哪个端口，以及用哪个 webhook 密钥来核对投递。",
      },
      {
        lead: "gift create",
        body: " —— 仓库、分支、脚本，以及在哪里运行它。回答 yes，gh 就替你在 GitHub 上把 webhook 建好；回答 no，就自己去 Settings ▸ Webhooks 里加一个，用同一个密钥。",
      },
      {
        lead: "gift serve",
        body: " —— 下一次 push 就会把它跑起来。gift log 可以看着它发生。",
      },
    ],
    startNote: "~/.gift/uninstall.sh 把 gift 命令卸下来，再删掉 ~/.gift 就清干净了；从 checkout 装的话，是 ./uninstall.sh。",

    readme: "README",
    releases: "Releases",
  },

  ja: {
    title: "gift — push が届いたら、スクリプトが走る",
    tagline: "push が届く。指定しておいたスクリプトが走る。",
    lede: "gift は自分のポートで GitHub のイベントを待ち、push が来たらあるフォルダでスクリプトを走らせます。サイトをビルドする、ノートを取り込む、いま変わったものを再起動する。そのサーバーのまわりに、同じコマンドから走る git の雑用がいくつか集まっています。",
    installCta: "gift を入れる",
    source: "GitHub のソース",
    facts: ["macOS · Linux", "Node 18+", "MIT"],

    deliveryTitle: "push が届くと、何が走るか",
    deliveryLede: "hook とは、リポジトリと、応える価値のあるブランチと、スクリプトと、それを走らせるフォルダのことです。配信が届くと、そのリポジトリとそのブランチを見ていた hook がすべて走ります。push をひとつ選んで、届くところを見てください。",
    delivery: {
      try: "プッシュ",
      request: "POST /hooks/github",
      signature: "署名 ok",
      push: "push",
      commits: "{n} コミット",
      hooks: "hooks",
      columns: {
        name: "名前",
        repo: "リポジトリ",
        branches: "ブランチ",
        runs: "実行",
        dir: "場所",
      },
      match: "一致",
      noMatch: "—",
      matching: "照合中…",
      ran: "{script} を {dir} で実行 · exit 0",
      nothing: "一致なし · 何も走りません",
      resultLabel: "配信",
    },
    deliveryNote: "その前にまず秘密鍵の照合です。署名の合わない配信は受け取りません。gift create は gh を使って GitHub 側の webhook まで作れますし、作ったあとで本当にそこにあるかを GitHub に訊き返します。手元のファイルにはあるのに GitHub が一度も呼ばない hook は、動くものと決めてかかるより、教えてもらう価値があります。",

    hookTitle: "gift create が訊く五つ",
    hookParts: [
      {
        term: "Repository",
        detail: "この hook がどのリポジトリの push に応えるか。owner/name の形で。",
      },
      {
        term: "Branches",
        detail: "カンマ区切り、あるいは * で任意。何も言わなければ main, master です。この一覧から外れたブランチへの push には No match と答え、何も走りません。",
      },
      {
        term: "Name",
        detail: "ラベル。gift list が意味のある一覧に見えるように。名前は重なっても構いません —— 同名の hook は一覧での位置で消します。",
      },
      {
        term: "Script",
        detail: "一致したときに走らせるもの。",
      },
      {
        term: "Working directory",
        detail: "それをどこで走らせるか。hook を書き終えるとサーバーは自分で再起動するので、ほかにすることはありません。",
      },
    ],

    serverTitle: "サーバー",
    commands: [
      { cmd: "gift serve", body: "最新のコードを取り込み、ビルドし直してから待ち受けを始めます。" },
      { cmd: "gift restart", body: "すでにディスクにあるコードへサーバーを戻します。取り込みもビルドもしないので、ネットワークは要らず、すぐ返ってきます。" },
      { cmd: "gift stop · gift status", body: "止める。動いているかどうかを言う。" },
      { cmd: "gift list · gift create · gift delete", body: "hook を並べる、足す、消す。どちらの変更のあとも、サーバーは自分で再起動します。" },
      { cmd: "gift log", body: "最後の十行、そのあとはサーバーが書くたびに一行ずつ。gift log 20 でもっと、--no-follow なら出して終わり。" },
      { cmd: "gift config", body: "config.json を $EDITOR で開きます。--path は在り処だけを出します。" },
      { cmd: "gift update", body: "gift が入っているフォルダでの git pull --ff-only。つまり checkout から入れたときの更新の仕方で、release から入れたぶんには引くものがありません。" },
    ],
    serverNote: "そのポートにはページもひとつあります。いま設定されている hook と、この一日ぶんの配信が新しい順に並び、それぞれのスクリプトが何を書き出したかも —— まだ書いている途中から、埋まっていきます。",

    funcsTitle: "そのほかにすること",
    funcsLede: "同じコマンドが、git の小さな雑用もいくつか引き受けます。gift help が一覧を出し、gift run はピッカーを開き —— カーソルで動かし、enter で走らせ、数字キーならその行をそのまま —— gift <name> はピッカーを飛ばします。名前は途中まででも足り、そのあとに書いたものはその機能へそのまま渡ります。",
    runsLabel: "呼び方",
    funcs: [
      {
        name: "repo-master",
        runs: "gift repo",
        body: "ひとつのフォルダの下にある git リポジトリのすべてを、自分で更新し続ける表に。どのブランチにいるか、未コミットのものがあるか、それが何行か、最後に動いたのはいつか。行を選べば、メニューがそれらにできることです —— エディタやエージェントで開く、diff を読む、fetch、pull、push、ブランチを切る、merge、rebase、stash、あるいはまとめてコミットして push する。入れ子のリポジトリもサブモジュールも、それぞれの行を持ちます。",
      },
      {
        name: "weekly-prs",
        runs: "gift weekly",
        body: "ある一週間の Pull Request を、出された日ごとにまとめて。週は月曜から日曜まで。何週間前かを先に言っていなければ、訊いてきます。",
      },
      {
        name: "pull-repos",
        runs: "gift pull",
        body: "あるフォルダより下のリポジトリすべてで git pull --recurse-submodules --autostash を。どれだけ深くても届きます。--dry-run は、引かずに何を引くかだけを言います。",
      },
    ],

    configTitle: "設定はひとつのファイル",
    configBody: "設定はすべてひとつのファイルに —— config.json、コードのすぐ隣です。gift config がエディタで開きます。gift 自身の設定は最上位に、各機能の設定は functions.<name> の下に：",
    configNote: "このファイルは最初に使われたときに書き出され、見ておく価値のある設定がすでに既定値で入っています。開いて見えるのは白紙ではなく、何が設定できるかです。ひとつひとつは、それを読むコードの隣の config.schema.json で宣言されています —— 既定値も、説明も、スクリプトへ渡るときの環境変数名も、そこから来ます。環境にすでにある値はファイルに勝ち、フラグはその両方に勝ちます。ファイルは git 管理から外され、0600 で書かれます。webhook の秘密鍵が入っているからです。",

    startTitle: "手に入れる",
    install: {
      body: "一行です。最新のリリースを取ってきて ~/.gift に展開し、そこで setup と install まで済ませます —— 途中で外向きの配信 URL を訊き、終われば gift コマンドが PATH に乗っています。必要なのは Node 18 以上と curl と unzip、ほかに先に入れておくものはありません。",
      waysLabel: "入れ方",
      ways: { release: "リリース", checkout: "checkout から" },
      notes: {
        release: [
          "GIFT_INSTALL_DIR で ~/.gift 以外へ展開でき、GIFT_INSTALL_VERSION=v0.0.1 なら最新ではなくそのリリースに留められます。",
          "更新は同じ一行をもう一度。config.json も hooks.json もログも持ち越されるので、webhook の秘密鍵も、設定した hook も、入れ替えを生き延びます。ダウンロードに失敗したときは、動いていた側がそのまま残ります。",
        ],
        checkout: [
          "あの一行が代わりに走らせている二歩を、手元にすでにあるコードに対して。gift は ~/.local/bin に、その checkout を包むものとして置かれます —— つまり、あなたが pull し、書き換えるほうの一本です。",
          "この道の更新は gift update、そのフォルダでの git pull --ff-only です。リリースから入れたぶんには引く checkout がないので、隣のタブの一行を使ってください。",
        ],
      },
      copy: "コピー",
      copied: "コピーしました",
    },
    steps: [
      {
        lead: "入れる",
        body: " —— 上の一行を。GitHub が配信してくる外向きの URL だけは訊かれます。それだけは、自分では分からないので。",
      },
      {
        lead: "gift config",
        body: " —— 待ち受けるポートと、配信を照合するための webhook の秘密鍵を。",
      },
      {
        lead: "gift create",
        body: " —— リポジトリ、ブランチ、スクリプト、そしてどこで走らせるか。yes と答えれば gh が GitHub 側の webhook まで作ります。no と答えたなら、同じ秘密鍵で Settings ▸ Webhooks から自分で足してください。",
      },
      {
        lead: "gift serve",
        body: " —— あとは次の push が走らせます。gift log で、その様子を。",
      },
    ],
    startNote: "~/.gift/uninstall.sh が gift コマンドを外し、~/.gift を消せば残りも消えます。checkout からなら ./uninstall.sh です。",

    readme: "README",
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
