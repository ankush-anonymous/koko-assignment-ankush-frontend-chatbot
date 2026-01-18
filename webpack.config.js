const path = require('path');
const webpack = require('webpack');

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
            configFile: 'tsconfig.webpack.json',
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
  // Exclude app directory and examples from compilation
  externals: {
    // Don't bundle Next.js specific modules
  },
  // Don't externalize React - bundle it to make it truly standalone
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NEXT_PUBLIC_BASE_URL': JSON.stringify(process.env.NEXT_PUBLIC_BASE_URL || ''),
      'process.env.NEXT_PUBLIC_API_ROUTE': JSON.stringify(process.env.NEXT_PUBLIC_API_ROUTE || 'api/v1/chat'),
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
};
