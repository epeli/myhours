const createWebpackConfig = require("./webpack-config");

module.exports = createWebpackConfig({
    htmlPlugin: {
        template: "index.tmpl.html",
        title: "sadff",
    },
});
