// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  {
    ignores: [
      "node_modules",
      "**/*.config.js"
    ],
    extends: [
      ...angular.configs.tsRecommended,
    ],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        project: ["./tsconfig.json"]
      },
    },
    rules: {
      "max-params": "off",
      "@angular-eslint/component-class-suffix": ["error", {suffixes: ["Component", "Directive"]}],
      "@angular-eslint/no-attribute-decorator": "error",
      "@angular-eslint/prefer-output-readonly": "error",
      "@angular-eslint/use-component-view-encapsulation": "off",
      "@angular-eslint/no-inputs-metadata-property": "error",
      "@angular-eslint/no-output-on-prefix": "off",
      "@angular-eslint/no-output-rename": "error",
      "@angular-eslint/no-outputs-metadata-property": "error",
      "@angular-eslint/use-lifecycle-interface": "error",
      "@angular-eslint/use-pipe-transform-interface": "off",
      "complexity": [
        "error",
        {
          max: 40,
        },
      ],
      "curly": "error",
      "eol-last": "off",
      "eqeqeq": [
        "error",
        "smart"
      ],
      "no-console": [
        "error",
        {
          "allow": [
            "log",
            "warn",
            "dir",
            "timeLog",
            "assert",
            "clear",
            "count",
            "countReset",
            "group",
            "groupEnd",
            "table",
            "dirxml",
            "error",
            "groupCollapsed",
            "Console",
            "profile",
            "profileEnd",
            "timeStamp",
            "context"
          ]
        }
      ],
      "no-unused-labels": "error",
      "no-use-before-define": "warn",
      "no-var": "error",
      "prefer-const": "error",
      "@typescript-eslint/dot-notation": "off",
      "prefer-promise-reject-errors": "off",
      "max-nested-callbacks": ["error", 6],
      "@typescript-eslint/no-this-alias": "off",
      "accessor-pairs": "off",
      "max-depth": "off",
      "@typescript-eslint/member-ordering": "off",
      "array-callback-return": "off"
    }
  },
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "zxa",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "zxa",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      "@angular-eslint/template/banana-in-box": "error",
      "@angular-eslint/template/click-events-have-key-events": "off",
      "@angular-eslint/template/eqeqeq": "error",
      "@angular-eslint/template/no-negated-async": "error",
      "@angular-eslint/template/use-track-by-function": "error",
      "@angular-eslint/template/no-positive-tabindex": "error",
      "@angular-eslint/template/no-autofocus": "error",
      "@angular-eslint/template/mouse-events-have-key-events": "error",
    },
  }
);
