var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

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
