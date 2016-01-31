module.exports = {
  use: [
    'postcss-import',
    'postcss-custom-media',
    'postcss-custom-properties',
    'postcss-calc',
    'postcss-color-function',
    'postcss-discard-comments',
    'autoprefixer'
  ],
  input: 'app/app.css',
  dir: 'static'
}
