# TOOLS.md - Technical Tools & Conventions

*This file contains notes about development tools, coding standards, and local conventions.*

---

## Development Environment

### Languages & Runtimes
- **C++**: Modern C++ (C++17/20 preferred), CMake, Clang/GCC
- **Python**: Python 3.10+, uv/poetry for deps, pytest for tests
- **Assembly**: NASM/GAS, objdump for disassembly inspection

### Build Tools
- CMake for C++ projects
- Make for simple builds
- Ninja when build speed matters

### Code Quality Tools
- **C++**: clang-format, clang-tidy, cppcheck, valgrind, AddressSanitizer
- **Python**: black/ruff (formatting), mypy (type checking), pylint/ruff (linting), pytest (testing)
- **General**: git pre-commit hooks, CI/CD pipelines

### Azure Tools
- Azure CLI (`az`)
- Azure Functions Core Tools
- Bicep for infrastructure as code
- Application Insights for observability

---

## Coding Standards

### Naming Conventions
- **C++**: `snake_case` for functions/variables, `PascalCase` for classes, `UPPER_CASE` for constants
- **Python**: PEP 8 (snake_case everywhere, PascalCase for classes)
- **Assembly**: Descriptive labels, prefix with scope (e.g., `.L_local_label`)

### File Organization
- Header guards or `#pragma once` in C++
- One class per file (unless tightly coupled)
- Tests colocated or in parallel `tests/` directory
- README per module explaining purpose

### Documentation
- Function docstrings/comments explaining purpose and gotchas
- Complex algorithms get explanation comments
- Public APIs need full documentation
- Don't comment the obvious

### Testing Philosophy
- Unit tests for logic
- Integration tests for system interactions
- Property-based testing when applicable
- Mocks/stubs for external dependencies
- Test the happy path and error paths
- Aim for >80% coverage, but coverage isn't the goal—good tests are

---

## Performance Considerations

### When to Optimize
1. Measure first (profilers: perf, valgrind, py-spy)
2. Identify hot paths
3. Optimize hot paths only
4. Measure again to verify improvement
5. Don't optimize prematurely

### Common Optimizations
- **C++**: Move semantics, reserve() for vectors, avoid copies, inline hot functions
- **Python**: Use built-in functions (they're C), avoid nested loops, consider numpy/cython for heavy compute
- **Assembly**: Minimize memory access, keep hot data in cache, unroll loops when proven beneficial

---

## Architecture Patterns

### Preferred Patterns
- **Dependency Injection**: For testability
- **Repository Pattern**: For data access abstraction
- **Factory Pattern**: When object creation is complex
- **Strategy Pattern**: For swappable algorithms
- **Observer Pattern**: For event-driven systems

### Anti-Patterns to Avoid
- God objects (do one thing well)
- Circular dependencies
- Global mutable state
- Tight coupling
- Premature abstraction

---

## Azure Best Practices

### Resource Organization
- Use resource groups logically
- Tag everything (project, environment, owner, cost-center)
- Use naming conventions (e.g., `rg-project-env`, `app-project-env`)

### Security
- Use Managed Identities (no secrets in code)
- Key Vault for secrets
- Private endpoints for sensitive resources
- Network security groups for isolation

### Cost Management
- Right-size VMs (don't over-provision)
- Use auto-scaling where appropriate
- Shutdown dev/test resources when not in use
- Monitor spending with budgets and alerts

---

## Notes Section

*Add project-specific conventions, tool preferences, or local setup notes here as needed.*

---

**Last Updated:** 2026-02-01
