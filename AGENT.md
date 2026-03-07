# AGENT.md

## Branch and merge policy

- Never merge pull requests without explicit approval from the repository owner.
- Use squash merge by default unless explicitly requested otherwise.
- For emergency recovery on `main`, create and push a backup branch before any force update.

## CI and security guardrails

- Do not commit hard-coded credentials in tests or app code.
- Keep Docker build inputs scoped and run containers as a non-root user.
- Keep CI installs deterministic and allow required package build scripts.
