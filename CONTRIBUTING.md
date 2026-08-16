# Contributing to Bronom

Thank you for helping improve Bronom. Bug reports, focused design proposals, documentation suggestions, accessibility feedback, code contributions, and private security reports are welcome.

## Contribution license and sign-off

Bronom is licensed under the Apache License 2.0. Unless you explicitly state otherwise, a contribution intentionally submitted for inclusion in Bronom is provided under the same license as described in section 5 of [LICENSE](LICENSE).

Every commit in a pull request must also carry a Developer Certificate of Origin sign-off. Add it with:

```bash
git commit --signoff
```

The sign-off certifies the [Developer Certificate of Origin 1.1](https://developercertificate.org/). It records that you have the right to submit the contribution under the project's license. Maintainers may ask you to squash or amend commits that are missing it.

Keep pull requests focused, explain the user-visible behavior, add tests for changed behavior, and avoid including credentials, private website data, or third-party material you cannot license.

Report vulnerabilities privately through [.github/SECURITY.md](.github/SECURITY.md) rather than a public issue.

## Development

Bronom requires Node.js 22 or newer.

```bash
npm ci
npm test
npm run typecheck
npm run build
npm run build:website
```

The isolated Docker/Xvfb integration suite is available for browser, Electron lifecycle, MCP, clipboard, and native-dialog validation:

```bash
npm run test:integration:docker
```
