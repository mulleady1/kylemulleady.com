const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: [
		'./src/index'
	],
	output: {
		path: path.join(__dirname, 'wwwroot'),
		filename: 'js/bundle.js',
		libraryTarget: 'umd'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loaders: ['react-hot', 'babel']
			},
			{
				test: /\.(css|scss)$/,
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader!sass-loader?outputStyle=expanded')
			}
		]
	},
	plugins: [
		new ExtractTextPlugin('css/styles.css'),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': '"production"'
		})
	],
	postcss: [autoprefixer({ browsers: ['last 2 versions'] })]
};
