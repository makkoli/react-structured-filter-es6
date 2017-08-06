const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
	example: path.join(__dirname, 'example'),
	build: path.join(__dirname, 'demo')
};

module.exports = {
	devtool: 'source-map',
	entry: PATHS.example,
	output: {
		path: PATHS.build,
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.js$|\.jsx$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'React Structured Filter ES6 Example',
			template: 'example/index.html'
		})
	]
};

