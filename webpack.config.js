const path                    = require('path');
const HTMLWebpackPlugin       = require('html-webpack-plugin');
const {CleanWebpackPlugin}    = require('clean-webpack-plugin');
const CopyPlugin              = require('copy-webpack-plugin');
const MiniCssExtractPlugin    = require('mini-css-extract-plugin');
const TerserPlugin            = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const isDev  = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimisation = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  };
  
  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetsPlugin(),
      new TerserPlugin(),
    ];
  }
  
  return config;
};

module.exports = {
  context:      path.resolve(__dirname, 'src'),
  mode:         'development',
  entry:        ['@babel/polyfill', './app.js'],
  output:       {
    path:     path.resolve(__dirname, 'dist'),
    filename: '[name].[fullhash].js',
  },
  resolve:      {
    alias: {
      '@':      path.resolve(__dirname, 'src'),
      '@snake': path.resolve(__dirname, 'src/js/snake'),
      '@scss':  path.resolve(__dirname, 'src/scss'),
    }
  },
  optimization: optimisation(),
  devServer:    {
    contentBase: path.join(__dirname, 'dist'),
    port:        8080,
    hot:         isDev,
  },
  plugins:      [
    new HTMLWebpackPlugin({
      template: './index.html',
      minify:   isProd,
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/favicon.ico'),
          to:   path.resolve(__dirname, 'dist')
        },
        {
          from: path.resolve(__dirname, 'src/img'),
          to:   path.resolve(__dirname, 'dist/img')
        },
        {
          from: path.resolve(__dirname, 'src/sounds'),
          to:   path.resolve(__dirname, 'dist/sounds')
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[fullhash].css',
    }),
  ],
  module:       {
    rules: [
      {
        test:    /\.m?js$/,
        exclude: /node_modules/,
        use:     {
          loader:  'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        }
      },
      {
        test: /\.css$/i,
        use:  [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use:  [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(jpe?g|png|svg|gif)$/,
        use:  ['file-loader'],
      }
    ],
  },
  devtool:      'source-map',
};