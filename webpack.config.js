module.exports = {
    entry: "./js/app.jsx",
    output: {
        path: __dirname + "/public",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel",
                query: {
                    presets:['react']
                }
            },
            { test: /\.css$/, loader: "style!css" }
        ]
    }
};
