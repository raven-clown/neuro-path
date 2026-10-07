# How it works

Neuro Path is a single hooks module (`plugins/neuro-path/hooks/register.tsx`). It listens to session events, keeps a small state machine of stages, and draws the pane from that state.

## Events it listens to

| Event | Used for |
| --- | --- |
| `prompt.submit` | Starts a run at User. Adds pinned skill checkpoints to the prompt context. |
| `turn.step` | Reads each model response as it streams. The first tool block that can be classified moves the map right away, before any permission prompt. Token usage of the response is charged to its stage. |
| `tool.call` | Confirms the stage when the tool runs and checks the result for failures. |
| `turn.complete` | Moves to Report and back to User, or straight to User when the turn was stopped. |
| `session.measure` | Context fill, rate-limit windows, reset times and cost. |
| `session.start` | Restores pinned skills, daily totals and an unfinished CI watch. |

Steps that run inside subagents do not move the map. Their tokens are charged to the stage that started them.

## When a stage lights up

| Moment | What happens |
| --- | --- |
| The model starts writing a tool call | The stage lights as soon as the name and the deciding field are known: the file path for `Edit` and `Write`, the full command for shell calls, the skill name for `Skill`. |
| A permission prompt or a question is open | The stage stays lit; the waiting time counts toward it. |
| The tool finishes | A failure bounces to Debug. A declined call is marked as declined in the log. |
| The final answer is written | Report is back-filled from the start of that response, then the run is delivered to User. |
| CI reports | Pass or fail arrives from the GitHub tracker, independent of what the session is doing. |

## Shell command rules

Commands are checked in this order and the first match wins.

| Stage | Pattern (simplified) |
| --- | --- |
| Explore | starts with `ls`, `cat`, `head`, `tail`, `find`, `rg`, `grep`, `tree`, `wc`, `git status/log/blame`, with no `&&` or `;` |
| Deploy | `vercel deploy`, `netlify deploy`, `kubectl apply`, `docker push`, `fly deploy`, `wrangler deploy`, `terraform apply`, `gcloud ... deploy` |
| Release | `gh release`, `git tag`, `npm publish`, `cargo publish`, `twine upload` |
| Merge | `gh pr merge`, `git merge`, `git rebase` |
| Pull request | `gh pr create/edit/view/comment/ready` |
| Push | `git push` |
| Commit | `git commit`, `git add` |
| CI | `gh run`, `gh workflow`, `gh pr checks` |
| Branch | `git checkout -b`, `git switch -c`, `git branch <name>`, `git worktree add` |
| Setup | package installs for npm, pnpm, yarn, bun, pip, poetry, uv, cargo, go, composer, dotnet |
| Test | `pytest`, `jest`, `vitest`, `mocha`, `phpunit`, `rspec`, `cypress`, `playwright test`, `npm test`, `cargo/go/dotnet/deno test` |
| Lint & types | `eslint`, `tsc`, `ruff`, `mypy`, `flake8`, `clippy`, `pylint`, `prettier`, `biome`, `stylelint`, `cargo check`, `go vet`, `validate` |
| Build | `npm run build`, `cargo/go/dotnet/gradle/mvn/vite/next build`, `make` |
| Preview | `curl` to `localhost` or `127.0.0.1` |
| Review | `git diff`, `git show` |

Commands that match none of these do not move the map.

## What counts as a failure

A failure bounces the run to Debug and adds a fix loop. It is counted when a tool returns an error in one of these stages: Setup, Build, Test, Lint & types, Verify, Commit, Push, CI, Preview, Merge, Release, Deploy.

These are not counted:

- a call you declined or interrupted
- `nothing to commit`
- `gh pr checks` exiting because checks are still pending
- errors from browser pane actions (a missing element is not a broken app); only a failing `curl` counts for Preview

A review that reports findings sends the run back to Code.

## Skills

Known skills are tied to stages, for example `brainstorming` and `writing-plans` to Plan, `test-driven-development` to Test, `systematic-debugging` to Debug, `requesting-code-review` to Review, `verification-before-completion` to Verify, `webapp-testing` to Preview. Any other skill can be pinned to a stage from the pane.

## Usage forecast

Each rate-limit window keeps the readings taken since its last reset. Once there are at least two minutes of readings, the pane draws a straight line through them and checks whether 100% comes before the reset time. Context turns left is the free space divided by the average growth per turn so far.

## CI tracking

After a successful `git push` or `gh pr create`, the plugin resolves the commit and branch in the working directory and polls `gh run list --commit <sha>` every 15 seconds, plus `gh run view --json jobs` for runs that are still going. It stops when every run has finished, after 3 minutes with no runs, or after 90 minutes. Remotes that are not on GitHub are skipped for now.

A fix request (the button, or auto-fix) never pastes log text into the prompt. It sends the run id, branch, commit and job name, each stripped to plain characters, and asks the session to read the log with `gh run view <id> --log-failed` as untrusted data. It does not ask for a commit or push.

## Redraws

The pane redraws only when something visible changes: a stage move, a CI state change, a new usage reading. Token counts on the map refresh at stage changes, daily totals are written in batches, and the map never redraws more than once every 1.5 seconds.

## Storage

| Key | Where | What |
| --- | --- | --- |
| `slots` | plugin store | pinned skill checkpoints |
| `days` | plugin store | daily totals, last 30 days |
| `autoFix` | plugin store | the CI auto-fix switch |
| session state | memory | the current run, usage readings, CI watch |
