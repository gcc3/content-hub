
Content Hub
===========


Light weight content hub, originally developed for [gcc³.com](https://gcc3.com) web.  
It can be used as a blog system, content server , document server, etc...  

Features:  
Use Markdown to write text files, auto indexing.  
Load in realtime.  


How To Use
----------

Setup  
`npm install` to install packages.  
Setup `.env` from `.env.example` and fill in the required values, refer `.env` section below.  
(Optional) Add `favicon.ico` in the `public/` directory.  

Serve  
Build the project for production:  
`npm run build`  
This generates the bundled `main.js` file in the `public/` directory.  
Serve the project with Express:  
`npm start`  
You can use PM2 to keep the server alive:  
`pm2 start ecosystem.config.js`  

Content  
Simply write and put the markdown files in the `notes/[category]/*.md` directory.  
Category folders and note files will be loaded to index.  

Scripts  
`pull.sh`
pull the source code, the landing pages (`src/pages`, cloned if missing) and  
the content, recursively.  
`notes-push.sh` and `notes-status.sh`  
Push or check status for all notes recursively.  
In case users want to edit the notes directly on the server.  


Landing Pages
-------------

Each folder in `src/pages/` is a landing page served at `/<folder>`, e.g. `/pob`.  
A page folder holds its own components, styles, `strings.js` and `meta.json`.  

`src/pages/` is a separate repo, set by `PAGES_REPO` in `.env` and git ignored  
here. `pull.sh` clones it when the folder is missing and pulls it when it is  
there, so `setup.sh` gets it before the build; the build stops with a message  
if it is absent. Anything else — no `PAGES_REPO`, or a `src/pages` that is on  
disk but is not a clone — stops `pull.sh` itself: a folder that cannot be  
pulled builds as well as one that can, and ships the pages it already held  
without saying so. Page edits are committed and pushed in that repo, not this  
one.  

Prerendering  
`npm run build` bundles the app and then runs `npm run prerender`, which renders  
every page once with React and writes the HTML to `public/.prerender/`.  
The server sends that file, so a URL arrives with its title, description and  
words already in it — the bundle then boots and takes the page over.  
Nothing is hydrated: the file on disk is the first frame, not a contract.  

The prerender also writes `public/sitemap.xml` and `public/robots.txt`.  
All three are git ignored and rebuilt on every deploy.  

Styles  
Production extracts the CSS modules into `public/main.css` so the prerendered  
HTML arrives styled. Class names come from `src/build/local-ident.js`, which  
webpack and the prerender both call, so the two agree on every name.  
Development keeps `style-loader` and hot reloading.  

Adding a page  
(in the pages repo)  
1. Create `src/pages/<slug>/` with a component and a `meta.json`.  
2. Register the component in `src/pages/index.js`.  
3. Register the page in `src/pages/projects.js` — this is what puts it in the  
   sitemap and the prerender. The build fails if it is missing.  

Search metadata  
The `seo` block in a page's `meta.json` is what a search result is made of:  

    "seo": {
      "blurb": "AI eyes and hands ...",  // one line, for the front page's ItemList
      "title": "Pob — desktop ...",      // <title>, and the English page title
      "description": "...",              // <meta name="description">, ~155 chars
      "category": "DeveloperApplication",// schema.org applicationCategory
      "os": "Windows, macOS, Linux",
      "image": "/notes/.../pob.webp",    // optional, the link preview image
      "keywords": "..."
    }

`title` is also the English title in `strings.js`, so the browser tab and the  
search result cannot disagree. The other languages keep their own.  
The front page's title and description live in `src/pages/home.json`.  


Content String
--------------

String with format of `[type]category:note` is used to indicate the content to load.  
Example: `http://gcc3.com/?content=[note]projects:simple ai.md`  

Format: `[type]category:note`  
Example:  
`[category]Life:` indicates to load the category `Life`.  
`[note]Life:Note1` indicates to load the note `Note1.md` in the category `Life`.  

1. `type`  
Load types.  
`type` can be `category`, `note`, `categories`.  
`[note]` indicates to load the note.  
`[category]` indicates to load the category.  
`[categories]` indicates to load all categories.  

2. `category`  
`category` is the exact folder name.  

3. `note`  
`note` is the exact relative path of the file, relative to the category folder.  
e,g: `Note1.md` or `.markdown/Note1.md`.  

- `.markdown` is a subfolder in the category folder
Refer [.note](https://github.com/lhypds/.note)  

- Root-level content  
To load the root folder or note in root folder.  
Use `[category]__root__:` or `[note]__root__:note_name`.  


Development
-----------

Dependencies  
Node.js https://nodejs.org/en/docs  
React https://react.dev/reference/react  
Webpack https://webpack.js.org/guides/  
Babel https://babeljs.io/docs/  

Develop the project:  
`npm install` and `npm run dev`  

For APIs refer `src/serve.js`  


.env
----

PORT  
Used to set the web and content server port.  
Default is 3180.  

PAGES_REPO  
Used to set the landing pages repo, cloned into `src/pages` by `pull.sh`.  
Default is `https://github.com/gcc3/gcc3-pages`.  

REACT_APP_BASE_PATH  
Used to set the base path for the app.  
For example, 
If the app is served at `https://example.com/docs/`, set `REACT_APP_BASE_PATH=/docs`.  

REACT_APP_NAME  
Used to set the site name.  

REACT_APP_SUBTITLE  
Used to set the site subtitle.  

REACT_APP_SITE_URL  
Used to set the site URL.  
Every canonical URL, sitemap entry and link preview is built from it.  
Defaults to `https://gcc3.com` when it is empty.  

REACT_APP_COPYRIGHT  
Used to set the site copyright information.  

REACT_APP_LINKS  
Used to set the site links in the format of `name1:url1,name2:url2`.  

REACT_APP_USE_SEARCH  
Enable search.  

REACT_APP_USE_REALTIME  
Enable realtime update with SSE.  

REACT_APP_DEFAULT_CONTENT  
Used to set the default load content.  

