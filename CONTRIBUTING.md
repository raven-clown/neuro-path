# Contributing

Thanks for taking the time to help. Small fixes are as welcome as new features.

## Ways to help

- **Wrong stage?** If a command or tool lands in the wrong stage, open a [stage detection issue](https://github.com/raven-clown/neuro-path/issues/new?template=stage_detection.yml) with the exact command. These are the most useful reports.
- **Bugs.** Use the [bug report form](https://github.com/raven-clown/neuro-path/issues/new?template=bug_report.yml) and include your Claude Code version and surface (desktop or terminal).
- **Ideas.** Start a thread in [Discussions](https://github.com/raven-clown/neuro-path/discussions) or open a [feature request](https://github.com/raven-clown/neuro-path/issues/new?template=feature_request.yml).
- **Code.** Look for issues labeled `good first issue` or `help wanted`.

## Local setup

You need Claude Code 2.1.286 or newer and Git.

```bash
git clone https://github.com/raven-clown/neuro-path.git
cd neuro-path
claude --plugin-dir plugins/neuro-path
```

`--plugin-dir` loads the plugin from your clone and reloads it every time you save a file, so you can edit `hooks/register.tsx` and see the pane change in the same session. In the desktop app, set `CLAUDE_CODE_PLUGIN_DIRS` to the absolute path of `plugins/neuro-path` in `~/.claude/settings.json` under `env` instead.

Uninstall the marketplace copy first (`/plugin uninstall neuro-path@neuro-path`) so the two do not both load.

## Project layout

```
.claude-plugin/marketplace.json     marketplace entry
plugins/neuro-path/
  .claude-plugin/plugin.json        plugin manifest
  hooks/hooks.json                  points at the hooks module
  hooks/register.tsx                all hooks and drawing
  types/index.d.ts                  state contract
docs/                               docs and screenshots
```

## Before you open a pull request

1. Validate the marketplace and the plugin:

   ```bash
   claude plugin validate .
   claude plugin validate plugins/neuro-path
   ```

2. Type-check. Loading the plugin once with `--plugin-dir` makes Claude Code write the API types for your version into `plugins/neuro-path/.claude-plugin/types` (ignored by Git). Then:

   ```bash
   npx -p typescript@5 tsc -p plugins/neuro-path/.claude-plugin/types/tsconfig.json
   ```

3. Try it in a real session: run a test, make a commit, and check that the map moves the way you expect.
4. If the pane looks different, add a before and after screenshot to the pull request.
5. Add a line under `Unreleased` in [CHANGELOG.md](CHANGELOG.md).

## Code style

- Match the surrounding code: two-space indent, single quotes, no semicolons.
- Keep comments out unless something is truly not obvious from the code.
- Keep state in `$.state` and persisted values in `$.store`. Module variables reset on every reload.
- A render hook never writes state. Write from handlers or other events.
- Keep the map calm: anything that changes the SVG on every model response will make the pane flicker.

## Commits and pull requests

- One topic per pull request.
- Commit messages in the imperative mood, under 72 characters for the first line: `Detect pnpm test as Test`.
- Pull requests are squash-merged into `main`.

## Releases

Maintainers bump the version in `plugins/neuro-path/.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json`, move the `Unreleased` notes in the changelog under the new version, and push a `vX.Y.Z` tag. The release workflow publishes the GitHub release from the changelog.

## Code of conduct

This project follows the [Code of Conduct](CODE_OF_CONDUCT.md). By taking part you agree to it.
