# Code Quality Guidelines

## General Principles
- **Readability first** – code should be self‑explanatory; use meaningful names.
- **Consistent style** – run `black` (Python) or `clang-format` (C++) on every commit.
- **No dead code** – remove unused functions, imports, and commented‑out blocks.

## Naming Conventions
- **Python:** snake_case for variables/functions, PascalCase for classes.
- **JavaScript/Node:** camelCase for variables/functions, PascalCase for constructors/classes.
- **C++ (future):** snake_case for functions/variables, PascalCase for types.

## Linting & Formatting
- Python: `black`, `ruff` (or `flake8`).
- JavaScript/Node: `eslint --fix`.
- CI will fail on lint errors.

## Pull‑Request Standards
1. **One logical change per PR** – avoid mixing unrelated features.
2. **Include a clear description** of what the PR does and why.
3. **Link to an issue** (if applicable).
4. **All tests must pass** before merging.
5. **Squash‑merge** to keep history clean.

## Documentation
- Every public function/class gets a docstring/example usage.
- Update `README.md` or relevant module docs when APIs change.
