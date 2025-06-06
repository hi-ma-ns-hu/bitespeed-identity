module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', 'src/types/**/**.d.ts'],
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    },
    'import/extensions': ['.js', '.ts'],
  },
  overrides: [
    {
      env: {
        node: true,
      },
      extends: ['plugin:@typescript-eslint/disable-type-checked'],
      files: ['.eslintrc.js', 'src/**/*.js'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    // gives prettier error
    'prettier/prettier': ['error', { endOfLine: 'auto' }],

    // disable no-return-await
    'no-return-await': 'off',

    // ensures an imported module can be resolved to a module on the local filesystem
    'import/no-unresolved': ['error', { commonjs: true, amd: true }],

    // verifies all named exports and imports
    'import/named': 'error',

    // verifies all default exports and imports
    'import/default': 'error',

    // checks names exist at the time they are dereferenced
    'import/namespace': 'error',

    // report for issues like repeated exports of names or defaults
    'import/export': 'error',

    // for import/no-extraneous-dependencies
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],

    // disable no-nested-ternary
    'no-nested-ternary': 'off',

    // ensures that there is no resolvable path back to this module via its dependencies
    'import/no-cycle': 'off',

    // provide a consistent use of file extensions across the code base
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],

    // disable @typescript-eslint/ban-types
    '@typescript-eslint/ban-types': 'off',
  },
};