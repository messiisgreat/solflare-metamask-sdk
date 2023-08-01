module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      legacyDecorators: true
    },
    requireConfigFile: false
  },
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es2020: true
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  globals: {
    browser: 'readonly',
    chrome: 'readonly',
    GIT_COMMIT_HASH: 'readonly'
  },
  ignorePatterns: ['**/assets/*.js'],
  rules: {
    'prettier/prettier': 1,
    'no-cond-assign': 1,
    'no-console': 0,
    'no-constant-condition': 0,
    'no-control-regex': 0,
    'no-debugger': 1,
    'no-dupe-args': 2,
    'no-dupe-keys': 2,
    'no-duplicate-case': 2,
    'no-empty-character-class': 1,
    'no-empty': 1,
    'no-ex-assign': 1,
    'no-extra-boolean-cast': 1,
    'no-extra-parens': [1, 'functions'],
    'no-extra-semi': 1,
    'no-func-assign': 2,
    'no-inner-declarations': [2, 'both'],
    'no-invalid-regexp': 2,
    'no-irregular-whitespace': 2,
    'no-negated-in-lhs': 2,
    'no-obj-calls': 2,
    'no-regex-spaces': 1,
    'no-sparse-arrays': 1,
    'no-unexpected-multiline': 2,
    'no-unreachable': 1,
    'use-isnan': 1,
    'valid-jsdoc': 0,
    'valid-typeof': 2,
    'accessor-pairs': 2,
    'block-scoped-var': 0,
    complexity: 0,
    'consistent-return': 0,
    curly: 2,
    'default-case': 0,
    'dot-location': [1, 'property'],
    'dot-notation': [
      1,
      {
        allowKeywords: true,
        allowPattern: '^[a-z]+(_[a-z]+)+$'
      }
    ],
    eqeqeq: 2,
    'guard-for-in': 0,
    'no-alert': 0,
    'no-caller': 2,
    'no-div-regex': 1,
    'no-labels': 2,
    'no-empty-pattern': 1,
    'no-eq-null': 2,
    'no-eval': 1,
    'no-extend-native': 1,
    'no-extra-bind': 1,
    'no-fallthrough': 2,
    'no-floating-decimal': 1,
    'no-implicit-coercion': 0,
    'no-implied-eval': 2,
    'no-invalid-this': 0,
    // 'babel/no-invalid-this': 0,
    'no-iterator': 2,
    'no-lone-blocks': 1,
    'no-loop-func': 2,
    'no-magic-numbers': 0,
    'no-multi-spaces': 2,
    'no-multi-str': 0,
    'no-native-reassign': 2,
    'no-new-func': 1,
    'no-new-wrappers': 1,
    'no-new': 1,
    'no-octal-escape': 2,
    'no-octal': 2,
    'no-param-reassign': [
      2,
      {
        props: false
      }
    ],
    'no-process-env': 0,
    'no-proto': 2,
    'no-redeclare': [
      2,
      {
        builtinGlobals: true
      }
    ],
    'no-return-assign': 0,
    'no-script-url': 2,
    'no-self-compare': 1,
    'no-sequences': 2,
    'no-throw-literal': 0,
    'no-unused-expressions': 0,
    'no-useless-call': 1,
    'no-useless-concat': 1,
    'no-void': 1,
    'no-warning-comments': 0,
    'no-with': 2,
    radix: 2,
    'vars-on-top': 0,
    'wrap-iife': [2, 'inside'],
    yoda: [
      2,
      'never',
      {
        onlyEquality: true
      }
    ],
    strict: [2, 'never'],
    'init-declarations': 0,
    'no-catch-shadow': 0,
    'no-delete-var': 2,
    'no-label-var': 1,
    'no-shadow-restricted-names': 1,
    'no-undef-init': 1,
    'no-undef': 2,
    'no-undefined': 0,
    'no-unused-vars': [
      1,
      {
        args: 'after-used',
        argsIgnorePattern: '^_'
      }
    ],
    'no-use-before-define': 0,
    'callback-return': 1,
    'global-require': 0,
    'handle-callback-err': 0,
    'no-mixed-requires': 0,
    'no-new-require': 2,
    'no-path-concat': 2,
    'no-process-exit': 1,
    'no-restricted-modules': 0,
    'no-sync': 1,
    'consistent-this': [1, 'me'],
    'eol-last': 1,
    'func-names': 0,
    'func-style': 0,
    'id-length': 0,
    'id-match': 0,
    'lines-around-comment': 0,
    'max-nested-callbacks': [1, 5],
    'new-parens': 2,
    'newline-after-var': 0,
    'no-array-constructor': 1,
    'no-continue': 0,
    'no-inline-comments': 0,
    'no-lonely-if': 1,
    'no-mixed-spaces-and-tabs': 1,
    'no-negated-condition': 0,
    'no-nested-ternary': 0,
    'no-new-object': 1,
    'no-prototype-builtins': 0,
    'no-restricted-syntax': 0,
    'no-spaced-func': 1,
    'no-ternary': 0,
    'no-trailing-spaces': 1,
    'no-underscore-dangle': 0,
    'no-unneeded-ternary': 1,
    'one-var': [1, 'never'],
    'operator-assignment': [1, 'always'],
    'operator-linebreak': 1,
    // 'quote-props': [1, 'as-needed'],
    // "quotes": [1, "single"],
    'require-jsdoc': 0,
    semi: [1, 'always'],
    'sort-vars': 0,
    'space-before-blocks': [1, 'always'],
    'space-in-parens': [1, 'never'],
    'space-infix-ops': 1,
    'space-unary-ops': [
      1,
      {
        words: true,
        nonwords: false
      }
    ],
    'spaced-comment': 0,
    'wrap-regex': 0,
    'constructor-super': 2,
    'no-class-assign': 2,
    'no-const-assign': 2,
    'no-dupe-class-members': 2,
    'no-this-before-super': 2,
    'no-var': 1,
    'prefer-arrow-callback': 1,
    'prefer-const': 1,
    'prefer-reflect': 0,
    'prefer-spread': 1,
    'prefer-template': 1,
    'require-yield': 2,
    'object-shorthand': 1,
    'arrow-parens': 1
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      env: {
        browser: true,
        es6: true,
        node: true
      },
      extends: [
        'eslint:recommended',
        'plugin:prettier/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended'
      ],
      globals: { Atomics: 'readonly', SharedArrayBuffer: 'readonly' },
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 2021,
        sourceType: 'module',
        project: './tsconfig.json',
        requireConfigFile: false
      },
      plugins: ['@typescript-eslint'],
      rules: {
        'prettier/prettier': 0,
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/ban-ts-comment': 0,
        '@typescript-eslint/no-empty-function': 0,
        '@typescript-eslint/no-unused-vars': [
          1,
          {
            args: 'after-used',
            argsIgnorePattern: '^_',
            ignoreRestSiblings: true,
            destructuredArrayIgnorePattern: '^_'
          }
        ],
        '@typescript-eslint/explicit-function-return-type': 'off',
        'no-shadow': 0 // we should adopt this rule?
      }
    }
  ]
};
