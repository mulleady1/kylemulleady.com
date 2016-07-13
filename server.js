var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

config.entry.unshift('webpack/hot/only-dev-server');
config.entry.unshift('webpack-dev-server/client?http://localhost:5001');
config.module.loaders[0].loaders.unshift('react-hot');
config.plugins.unshift(new webpack.HotModuleReplacementPlugin());

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
