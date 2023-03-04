module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [],
    rules: {
        'no-console': 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-unused-vars': 'off',
        'max-len': 0
    },
    parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 7,
        sourceType: 'module'
    }
};
