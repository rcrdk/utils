import type { KnipConfig } from 'knip'

export default {
  exclude: ['devDependencies'],
  ignore: ['src/types/**'],
  compilers: {
    css: (text: string) => [...text.replaceAll('plugin', 'import').matchAll(/(?<=@)import[^;]+/g)].join('\n'),
  },
} satisfies KnipConfig
