const {task} = require("jake");
const {sh} = require("sh-thunk");

const backendFilesGlob = ["*.php", "*.html", "lib", "bootstrap.js"];

function wrapQuotes(globs) {
    return globs.map(s => `"${s}"`);
}

task("js-server", sh`webpack-dev-server --mode development`);

task("js-server-hot", sh`webpack-dev-server --mode development --hot`);

task("js", sh`webpack --mode production`);

task(
    "js-analyze",
    sh`ANALYZE_BUNDLE=1 NODE_ENV=production webpack --mode production`,
);
