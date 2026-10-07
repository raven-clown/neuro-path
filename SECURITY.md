# Security Policy

## Supported versions

Only the latest release receives fixes.

| Version | Supported |
| --- | --- |
| 0.1.x | yes |

## Reporting a vulnerability

Please do not open a public issue for security problems.

Use [private vulnerability reporting](https://github.com/raven-clown/neuro-path/security/advisories/new) instead. Include what you found, how to reproduce it, and what an attacker could do with it.

You can expect a first reply within 7 days. Once a fix is ready it ships in a patch release and the advisory is published with credit to you, unless you prefer to stay anonymous.

## What is in scope

Neuro Path runs inside Claude Code with the same permissions as the session. It runs `git` and `gh` locally for CI tracking and can submit a prompt when you press "Request a fix" or turn auto-fix on. Issues worth reporting include:

- a way to make the plugin run a command other than `git` or `gh`
- a way to inject text into the session through CI logs, branch names or commit data that changes what the session does without your action
- data written outside Claude Code's plugin store
