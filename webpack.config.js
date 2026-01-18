const path = require('path');

module.exports = {
  mode: 'production',
  entry: './standalone/chatbot-loader.tsx',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'chatbot.js',
    globalObject: 'window',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              jsx: 'react',
            },
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('tailwindcss'),
                  require('autoprefixer'),
                ],
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname),
    },
  },
  // Don't externalize React - bundle it to make it truly standalone
  optimization: {
    minimize: true,
  },
};
