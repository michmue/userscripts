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
	banner: {
    js: '//comment',
  },
});

let {host, port} = await ctx.serve({
    servedir: 'dist',
});

console.log(`http://localhost:${port}/`);