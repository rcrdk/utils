/* eslint-disable import/no-anonymous-default-export */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test', 'wip'],
    ],
    'subject-empty': [2, 'never'],
  },
}
