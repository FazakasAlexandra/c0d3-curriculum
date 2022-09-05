const path = require("path");

module.exports = {
  entry: path.join(__dirname, "src", "app.js"),
  mode: "production",
  output: {
    path: path.resolve(__dirname, "public/dist"), // We will put the compiled file into public/dist
    filename: "app.js",
  },
  module: {
    rules: [
      {
        // This section tells Webpack to use Babel to translate your React into JavaScript
        test: /\.js$/, // Regex for all JavaScript file
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
        },
      },
    ],
  },
};
