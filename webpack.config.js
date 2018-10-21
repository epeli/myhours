const {createWebpackConfig} = require("@epeli/webpack-config");

module.exports = createWebpackConfig({
    template: "src/index.html.tmpl",
});
