import * as esbuild from 'esbuild'
import * as fs from "fs";


let entryPoints = fs.readdirSync("./src", {withFileTypes: true})
    .filter(dirent => dirent.isFile())
    .flatMap(value => {
        return "./src/" + value.name;
    });


let ctx = await esbuild.context({
    entryPoints: entryPoints,
    outdir: 'dist',
    bundle:true,
    format: 'esm',
    sourcemap: "both",
    target: "es2021",
    // sourceRoot: "http://localhost:8000/"
    // outfile: 'out.js',
});

let {host, port} = await ctx.serve({
    servedir: 'dist',
});

console.log(`http://localhost:${port}/`);



// console.log(entryPoints);
// let c = `// ==UserScript==
// // @name\t\t\t\t\t\tDevelopment
// // @version 1
// // @match\t\t\t\t\t\t*://hanime.tv/videos/hentai/*
// // @match\t\t\t\t\t\t*://hanime.tv/omni-player/*
// // @match\t\t\t\t\t\t*://player.hanime.tv/*
// //
// // @allFrames true
// // @run-at document-end
// // @grant   GM.fetch
// // ==/UserScript==
// `;

// /**
//  * @param {string} entryPoint
//  * @param {string} metadata
//  */
// function addUserScriptMetaData(entryPoint, metadata) {
//     var fs = require('fs');
//     var data = fs.readFileSync('./example.js').toString().split("\n");
//     data.splice(0, 0, "Append the string whatever you want at top" );
//     var text = data.join("\n");
//
//     fs.writeFile('./example.js', text, function (err) {
//         if (err) return err;
//     });
// }
//
// for (const entryPoint of entryPoints) {
//     let inputStream = fs.createReadStream(entryPoint);
//     let lineReader = readline.createInterface({
//         input: inputStream
//     });
//
//     let metadata = "";
//     lineReader.on('line', function (line) {
//         if (line.includes("==/UserScript==")) {
//             lineReader.removeAllListeners('line', this);
//             lineReader.close();
//             inputStream.close();
//             addUserScriptMetaData(entryPoint, metadata);
//             metadata = "";
//         }
//         console.log('Line from file:', line);
//     });
// }
