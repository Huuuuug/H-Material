module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // @see: https://commitlint.js.org/#/reference-rules
    /**
     * type[scope]: [function] description
     * ^^^^
     */
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
        'release',
        'improvement',
      ],
    ],
    'type-empty': [2, 'never'],
    'type-case': [2, 'always', 'lower-case'],
    /**
     * type[scope]: [function] description
     *      ^^^^^
     */
    'scope-enum': [
      2,
      'always',
      ['packages', 'internal', 'docs', 'play', 'build', 'script', 'project'],
    ],
    /**
     * type[scope]: [function] description [No more than 72 characters]
     *      ^^^^^
     */
    'scope-case': [2, 'always', 'lower-case'],
    'header-max-length': [2, 'always', 72],
    'subject-empty': [2, 'never'],
    'subject-case': [0],
  },
  prompt: {
    message: {
      type: "Select the type of change that you're committing:",
      scope: 'Denote the SCOPE of this change (optional):',
      customScope: 'Denote the SCOPE of this change:',
      subject: 'Write a SHORT, IMPERATIVE tense description of the change:\n',
      body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
      breaking:
        'List any BREAKING CHANGES (optional). Use "|" to break new line:\n',
      footerPrefixsSelect:
        'Select the ISSUES type of changeList by this change (optional):',
      customFooterPrefixs: 'Input ISSUES prefix:',
      footer: 'List any ISSUES by this change. E.g.: #31, #34:\n',
      confirmCommit: 'Are you sure you want to proceed with the commit above?',
    },
    types: [
      {
        value: 'feat',
        name: 'feat:     🚀  A new feature',
        emoji: '🚀',
      },
      {
        value: 'fix',
        name: 'fix:      🧩  A bug fix',
        emoji: '🧩',
      },
      {
        value: 'docs',
        name: 'docs:     📚  Documentation only changes',
        emoji: '📚',
      },
      {
        value: 'style',
        name: 'style:    🎨  Changes that do not affect the meaning of the code',
        emoji: '🎨',
      },
      {
        value: 'refactor',
        name: 'refactor: ♻️   A code change that neither fixes a bug nor adds a feature',
        emoji: '♻️',
      },
      {
        value: 'perf',
        name: 'perf:     ⚡️  A code change that improves performance',
        emoji: '⚡️',
      },
      {
        value: 'test',
        name: 'test:     ✅  Adding missing tests or correcting existing tests',
        emoji: '✅',
      },
      {
        value: 'build',
        name: 'build:    📦️   Changes that affect the build system or external dependencies',
        emoji: '📦️',
      },
      {
        value: 'ci',
        name: 'ci:       🎡  Changes to our CI configuration files and scripts',
        emoji: '🎡',
      },
      {
        value: 'chore',
        name: "chore:    🔨  Other changes that don't modify src or test files",
        emoji: '🔨',
      },
      {
        value: 'revert',
        name: 'revert:   ⏪️  Reverts a previous commit',
        emoji: '⏪️',
      },
      {
        value: 'release',
        name: 'release:   📌  release',
        emoji: '📌',
      },
      {
        value: 'improvement',
        name: 'improvement:   💪  improve ',
        emoji: '💪',
      },
    ],
    useEmoji: true,
    themeColorCode: '',
    allowCustomIssuePrefixs: false,
    allowEmptyIssuePrefixs: false,
  },
}
