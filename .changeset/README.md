# Changesets

This folder is managed by [@changesets/cli](https://github.com/changesets/changesets).

## Adding a changeset

Run the interactive prompt from the repository root:

```bash
npm run changeset
```

Or drop a markdown file manually:

```md
---
'dom-shot': patch
---

Short description of the change.
```

## Release flow

Changelog entries are **handwritten** in `packages/dom-shot/CHANGELOG.md` (package-name
title, `## X.Y.Z` sections with `### Minor/Patch/Major Changes` bullets, newest
on top). The GitHub Actions `Release` workflow still consumes changeset files
for version bumps only: it opens a "Version PR" bumping the package version,
and — when that PR is merged — publishes to npm via
`npm run release --workspace=dom-shot`.
