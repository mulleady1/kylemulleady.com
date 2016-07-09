const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

process.env.BASE_URL = 'http://localhost:5000';

module.exports = {
	devtool: 'eval',
	entry: [
		'webpack-dev-server/client?http://localhost:5001',
    'webpack/hot/only-dev-server',
    './src/index'
	],
	output: {
		path: path.join(__dirname, 'wwwroot'),
		filename: 'bundle.js',
		libraryTarget: 'umd',
		publicPath: '/static/'
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
				loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader!sass-loader?outputStyle=expanded'
			}
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
	],
	postcss: [autoprefixer({ browsers: ['last 2 versions'] })]
};
