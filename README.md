<div align="center">

# Neuro Path

**A live pipeline map for Claude Code.**
See which stage your session is in, where it goes next, what each step cost, when CI breaks, and how close you are to your usage limits.

[![Validate](https://github.com/raven-clown/neuro-path/actions/workflows/validate.yml/badge.svg)](https://github.com/raven-clown/neuro-path/actions/workflows/validate.yml)
[![Release](https://img.shields.io/github/v/release/raven-clown/neuro-path?color=d97757)](https://github.com/raven-clown/neuro-path/releases)
[![License: MIT](https://img.shields.io/badge/license-MIT-a29e94.svg)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-2.1.286%2B-d97757.svg)](https://docs.claude.com/en/docs/claude-code)

<img src="docs/images/overview.png" alt="Neuro Path pane: a run in progress, a CI failure bouncing back to Debug, and the daily summary" width="100%">

</div>

## Why

A long coding session moves through a lot of steps: reading the code, planning, editing, running tests, fixing what broke, reviewing, committing, pushing, waiting on CI. From the transcript alone it is hard to tell where you are, how many times a step had to be redone, or what a run actually cost.

Neuro Path draws that as a map in a side pane. Each stage is a node, every move between stages is a line with an arrow, and lines that skip stages or loop back for a fix show up exactly as they happened.

## What you get

**The pipeline, live.** 25 stages in five phases, from the prompt to the report that comes back to you:

| Phase | Stages |
| --- | --- |
| Understand | Ask, Explore, Research, Plan |
| Build | Branch, Setup, Code, Debug, Docs, Build |
| Check | Test, Lint & types, Review, Security, Verify |
| Ship | Commit, Push, Pull request, CI, Preview, Merge, Release, Deploy |
| Deliver | Report, then back to User |

- The current stage pulses. A dashed arrow points at the stage that most likely comes next, based on the routes this session has already taken.
- Stages light up the moment the step is decided, not after it finishes, so a question waiting for your answer or a command waiting for approval shows as the current stage.
- A failed test, build, lint, push or CI run draws a red dashed line back to Debug, then on to Code, and the next arrow points at the step to retry.
- Every row shows the real time spent and the tokens used in that stage.

**Usage, with a forecast.** Context window fill, the 5-hour and weekly limits, when each one resets, and whether your current pace runs out before the reset (`full ~14:52` in red) or not (`pace OK`).

**GitHub Actions without watching the tab.** After a push or a new pull request the pane follows the workflow runs for that commit, job by job. When a job fails you get a toast, the map bounces to Debug, and one button sends the failing log tail back into the session to be fixed. An optional auto-fix switch does that without waiting for you.

**Daily totals.** Active time, tokens split into input, output and cache, cost, runs, fix loops, and the stages that took the most time and tokens. The last 30 days are kept on your machine; the pane shows the last 7.

**Skill checkpoints.** Pin any skill to a stage (for example `/simplify` after Code). From then on every coding task is asked to run it at that point, and the map shows when it did.

<table>
<tr>
<td width="50%"><img src="docs/images/hero.png" alt="Run in progress with CI running"></td>
<td width="50%"><img src="docs/images/bounce.png" alt="CI failure bouncing back to Debug"></td>
</tr>
<tr>
<td align="center">A run in progress, CI checking the push</td>
<td align="center">A failed CI job sends the run back to Debug</td>
</tr>
</table>

## Install

Neuro Path is a Claude Code plugin, published from this repository as a plugin marketplace.

```
/plugin marketplace add raven-clown/neuro-path
/plugin install neuro-path@neuro-path
```

Restart the session, then open the pane any time with:

```
/neuro
```

### Requirements

- Claude Code **2.1.286 or newer** (the plugin uses function hooks and pane rendering from that release). Check with `claude --version`.
- The desktop app draws the full map. The terminal shows a compact text version.
- For CI tracking: the [GitHub CLI](https://cli.github.com/) signed in (`gh auth status`) and a repository whose `origin` is on GitHub.

## How stages are detected

Detection is based on the tools a session calls and the commands it runs. A few examples:

| Stage | Triggered by |
| --- | --- |
| Explore | `Read`, `Grep`, `Glob`, read-only shell commands such as `ls`, `cat`, `git status` |
| Plan | plan mode, early task lists, `brainstorming`, `writing-plans` |
| Code / Docs | `Edit` and `Write`; Markdown and `docs/` files count as Docs |
| Test | `pytest`, `jest`, `vitest`, `npm test`, `go test`, `cargo test` and similar |
| Lint & types | `eslint`, `tsc`, `ruff`, `mypy`, `clippy`, `plugin validate` |
| Commit / Push / PR | `git commit`, `git push`, `gh pr create` |
| CI | `gh run`, `gh pr checks`, and the built-in GitHub tracker |
| Preview | browser pane actions, `curl` to localhost |

The full rules, including what counts as a failure and what is ignored, are in [docs/how-it-works.md](docs/how-it-works.md). If a step lands in the wrong stage, please [open a stage detection issue](https://github.com/raven-clown/neuro-path/issues/new?template=stage_detection.yml).

## Privacy

Everything stays on your machine. The plugin reads session events through the plugin API, keeps its numbers in Claude Code's local plugin store, and only runs `git` and `gh` locally for CI tracking. Nothing is sent anywhere else.

## Roadmap

- GitLab pipelines through `glab`
- Custom stage rules per project
- Export of daily totals to CSV
- A compact band above the prompt for people who keep the pane closed

Ideas and votes are welcome in [Discussions](https://github.com/raven-clown/neuro-path/discussions).

## Contributing

Bug reports, detection fixes and new ideas are all useful. Start with [CONTRIBUTING.md](CONTRIBUTING.md); it covers running the plugin from a local clone with hot reload, validating it, and the pull request flow.

## License

[MIT](LICENSE)
