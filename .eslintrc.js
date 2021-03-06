module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "amd": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 8,
        "sourceType": "module"
    },

    "rules": {
        "avoidEscape": true,
        "allowTemplateLiterals": true,
        "no-console": "off",
        "allow": ["log", "warn", "error"]
    }
};