import globals from 'globals'
import pluginJs from '@eslint/js'

export default [
  {
    extends: ['standard', 'prettier'],
    languageOptions: { globals: globals.browser },
  },
  pluginJs.configs.recommended,
]
