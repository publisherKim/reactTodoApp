const path = require('path');

module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "settings": {
        "import/resolver": {
            node: { paths: [path.resolve('./src')] }
        },
    },
    "parserOptions": {
        "ecmaVersion": 2015,
        "sourceType": "module"
    },
    "rules": {
        "no-unused-vars": 1,
        "comma-dangle": 0,
        "eol-last": 0,
        "no-console": 0
    }
};