module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint",
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    "prettier/prettier": [
      "error",
      {
        htmlWhitespaceSensitivity: "ignore", //指定 HTML 文件的全局空白区域敏感度。空格被认为是不敏感的
        singleQuote: true, //单引号
        semi: false, //语句末尾打印分号。不加
        trailingComma: "none", //多行时尽可能打印尾随逗号。不尾随
        bracketSpacing: true, //括号之间的空格
        jsxBracketSameLine: true, //将 > 多行 JSX 元素放在最后一行的末尾
        endOfLine: "auto", // 忽略换符验证
        printWidth: 100,
      },
    ],
    indent: [2, 2, { SwitchCase: 1 }],
    "no-console": process.env.NODE_ENV === "production" ? "off" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-useless-escape": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2020,
  },
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)",
      ],
      env: {
        jest: true,
      },
    },
  ],
};
