// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    map: process.env.NODE_ENV === 'production',
    // to edit target browsers: use "browserlist" field in package.json
    "autoprefixer": {}
  }
};
