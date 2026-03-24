
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
Used to enable the search.  

REACT_APP_DEFAULT_LOAD  
Used to set the default load content.  
`category` for load the first category.  
`categories` for load all categories.  
`category_name` for load a specific category, e.g. `REACT_APP_DEFAULT_LOAD=Life`.  
`category_name:note_name` for load a specific note, e.g. `REACT_APP_DEFAULT_LOAD=Life:Note1`.  
`category_name` and `note_name` should be the folder name and the file name.  
