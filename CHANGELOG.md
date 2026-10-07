# Changelog

All notable changes to this project are listed here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.1.0] - 2026-10-07

### Added

- Live pipeline map with 25 stages in five phases, from the prompt back to the user.
- Stages light up as soon as a step is decided, before approval prompts.
- Arrows on every move, curved lines for skipped stages, and red loops back to Debug when a step fails.
- Next-step forecast from the routes taken in the session.
- Time and tokens per stage, and per run.
- Usage meter for the context window, the 5-hour and weekly limits, reset times and a pace forecast.
- GitHub Actions tracking after a push or a new pull request, with job status, a fix request button and an optional auto-fix switch.
- Daily totals for 30 days: active time, tokens by type, cost, runs and fix loops.
- Skill checkpoints that pin a skill to a stage.
- Compact text view for the terminal.

[Unreleased]: https://github.com/raven-clown/neuro-path/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/raven-clown/neuro-path/releases/tag/v0.1.0
