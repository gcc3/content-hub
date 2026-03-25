
gcc³
====


Light weight content hub.  
Use Markdown to write text, load in realtime.  
It can be used as a blog system, content server etc...  
Used by [gcc³.com](https://gcc3.com) web.  


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
Category will be loaded as indexes in sidebar.  


Development
-----------

Dependencies  
Node.js https://nodejs.org/en/docs  
React https://react.dev/reference/react  
Webpack https://webpack.js.org/guides/  
Babel https://babeljs.io/docs/  

Develop the project with hot reload:  
`npm run dev`  

This will start the webpack dev server at http://localhost:9500/  
The content server `PORT` can be set in `.env` file.  

Content server APIs  
/api/categories  
Get the list of categories.  
/api/notes/:category  
Get the list of notes in a category.  


Content String
--------------

String with format of `[type]category:note` is used to indicate the content to load.  

1. Load types (`type`)  
`type` can be `category`, `note`, `categories`.  
`[note]` indicates to load the note.  
`[category]` indicates to load the category.  
`[categories]` indicates to load all categories.  

2. `category`  
`category` is the exact folder name.  

3. `note`  
`note` is the exact file name (with relative path, relative to the category folder).  
So, sometimes contains the parent folder, if it is inside a subfolder.   
e,g: `Note1.md` or `subfolder/Note1.md`.  

For example:  
`[category]Life:` indicates to load the category `Life`.
`[note]Life:Note1` indicates to load the note `Note1.md` in the category `Life`.  

3. Root-level content  
To load the root folder or note in root folder.  
Use `[category]__root__:` or `[note]__root__:note_name`.  


.env
----

PORT  
Used to set the web and content server port.  
Default is 3180.  

REACT_APP_NAME  
Used to set the site name.  

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
