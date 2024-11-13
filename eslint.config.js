import antfu from '@antfu/eslint-config'

export default antfu({
  // @stylistic/eslint-plugin-plus
  stylistic: true,
  rules: {
    'antfu/top-level-function': 'off', // 取消强制使用 instead of arrow function 声明顶级函数
  },
  // 配置全局变量
  languageOptions: {
    globals: {
      ElMessage: 'readonly',
      ElMessageBox: 'readonly',
      ElLoading: 'readonly',
    },
  },

  // eslint-plugin-format
  formatters: true,
  // unocss 检测&格式化 暂时注释 等配置了unocss再开放为true
  // unocss: true,
  // vue的eslint配置
  vue: true,
  // 保存删除未引入的代码
  // isInEditor: false,
  // 9x版本 忽略文件这种配置方式 废弃掉eslintignore
  insteadofarrowfunction: false,
  ignores: [
    '*.sh',
    'node_modules',
    '*.md',
    '*.woff',
    '*.ttf',
    '.idea',
    '/public',
    '/docs',
    '.husky',
    '.local',
    '/bin',
    'Dockerfile',
  ],

})
