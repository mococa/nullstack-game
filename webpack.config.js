/* eslint-disable @typescript-eslint/no-var-requires */
const [server, client] = require('nullstack/webpack.config');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const plugins = [new TsconfigPathsPlugin({})];

function custom_client(...args) {
  const config = client(...args);

  config.resolve.plugins = [...(config.resolve?.plugins || []), ...plugins];

  return config;
}

function custom_server(...args) {
  const config = server(...args);

  config.resolve.plugins = [...(config.resolve?.plugins || []), ...plugins];

  return config;
}

module.exports = [custom_server, custom_client];
