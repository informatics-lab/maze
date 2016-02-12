# TypeScript Maze

See it at https://rawgit.com/met-office-lab/maze/master/maze.html (or see below for getting it running locally)

### Background
I am writing this as both a learning exercise for myself in trying to understand TypeScript and its benefits, and also to serve as an extensible project that other interested parties could contribute to. 

The Met Office Informatics Lab has regular visitors as well as summer placement students and work experience students and we were looking to provide something a bit more engaging than simply learning Python/JavaScript/whatever using online tutorials. Hopefully this (coupled to real robots in the lab that can be programmed to solve mazes) will help!

Note that it is still a work in progress!

### Getting it running
It is intentionally a very simple App. I have been running it locally on my Mac through Apache Web Server, and using the TypeScript compiler (tsc) to transcompile the TypeScript into the JavaScript that actually runs on the browser (run 'tsc' from the root directory of the project). It is arguably easiest to install TypeScript via nodejs (http://nodejs.org/download/). Note that there is a tsc config file provided (tsconfig.json). This is currently set up to compile all TypeScript files into a single JavaScript file located in the 'compiledJs' directory. 

In summary: 
* If you don't already have nodejs installed then do that first (see link above).
* With nodejs installed run `npm install -g typescript`
* Run locally by pointing your browser at maze.html, or you can run it through Apache web server or similar
* If you want to modify any of the Typescript then recompile it to JavaScript before running using `tsc` from the root directory

If you prefer for each TypeScript file to create an equivalent JavaScript file, and have all these resulting JavaScript files in a directory then: replace the `"outFile": "compiledJs/maze.js"` in tsconfig.json with `"outDir": "[name of directory you want you JS in]"`

I have been using Sublime Text 3 as my IDE and followed these instructions to get up and running: https://cmatskas.com/getting-started-with-typescript-and-sublime-text/

The compiled JavaScript is also included in the repository, so the result can be seen quickly at https://rawgit.com/met-office-lab/maze/master/maze.html.

### Browser support / testing
Note that as this has mostly been a way for me to learn TypeScript (rather than an operational product!) I've only been testing this on Chrome on my Mac. If it doesn't work on your browser then let me know and I'll try to fix it if I can.

### Original JavaScript source
I originally wrote this in JavaScript and the later re-wrote it in TypeScript. I wanted to learn about OO in JavaScript first before I tried it in TypeScript so that I could better appreciate what TypeScript does, and the benefits it brings. The JavaScript source then became out-of-date as I worked only on the TypeScript version, so it is no longer part of the repo, but for interested parties it can still be found in earlier commits - the most recent version of the repo that still contains the original JavaScript source can be found at https://github.com/met-office-lab/maze/tree/f7f69bcf7972ebe060aa51b0f8b89909166ba00e
