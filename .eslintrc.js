module.exports = {
    "env": {
      "es6": true,
      "node": true
    },
    "extends": "standard",
    "rules": {
      "comma-dangle": ["error", "only-multiline"],
      "semi": ["error", "always", { "omitLastInOneLineBlock": true }],
      "no-warning-comments": [ "warn", {
        "terms": [ "TODO", "FIXME" ],
        "location": "start"
      }]
    }
};
