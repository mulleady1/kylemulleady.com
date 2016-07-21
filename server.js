var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

config.entry.unshift('webpack/hot/only-dev-server');
config.entry.unshift('webpack-dev-server/client?http://localhost:5001');
config.module.loaders[0].loaders.unshift('react-hot');
config.module.loaders[1].loader = 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader!sass-loader?outputStyle=expanded';
config.plugins[0] = new webpack.HotModuleReplacementPlugin();

const HOST = '0.0.0.0';
const PORT = 5001;

new WebpackDevServer(webpack(config), {
	publicPath: config.output.publicPath,
	contentBase: 'wwwroot',
	hot: true,
	historyApiFallback: true
}).listen(PORT, HOST, function (err, result) {
	if (err) {
		return console.log(err);
	}

	console.log(`Listening at http://${HOST}:${PORT}/`);
});
