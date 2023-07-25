# Contributing to Aero

Before we get into it, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to Aero and its packages, which are hosted in the [Aero Organisation](https://github.com/aero-mod/). These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [I don't want to read this whole thing I just have a question(!!!)](#i-dont-want-to-read-this-whole-thing-i-just-have-a-question)
- [Architecture](#architecture)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Pull Requests](#pull-requests)
- [Styleguides](#styleguides)
  - [Git Commit Messages](#git-commit-messages)
  - [JavaScript Styleguide](#javascript-styleguide)
  - [Documentation Styleguide](#documentation-styleguide)

## Code of Conduct

This project and everyone participating in it is governed by the [Aero Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to Staff at [The Aero Discord Server](https://aero.icu/discord).

## I don't want to read this whole thing I just have a question(!!!)

That's fine, I don't want to read this whole thing either. Just [open an issue](https://github.com/aero-mod/aero/issues) or [join the Discord server](https://aero.icu/discord) and ask away. (Please make sure it's not a duplicate of an existing issue!!)

## Architecture

Aero is separated into four packages in the `/packages` directory:

- `common`: Contains common code used by other packages (filesystem utilities, ipc, etc.)
- `main`: Contains the Aero injector code (csp, ipc *handling*, etc.)
- `preload`: The smallest of the packages, contins the source of `aeroNative` and related code.
- `renderer`: The main item, renderer contains all the client code: ui, apis, etc.

Changes to any of these packages or config files should be made in a fork of the repository, and then submitted as a pull request. (upon merging our actions runners will release a development build of Aero)

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for Aero. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

Before creating bug reports, please check the existing issues using the `bug` tag to see if the issue has already been reported. (If it has, please **don't comment on the existing issue** unless you have additional information to add.)

**Note:** If you find a **Closed** issue that seems like it is the same thing that you're experiencing and the issue persists, open a new issue and include a link to the original issue in the body of your new one.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for Aero, including completely new features and minor improvements to existing functionality. Following these guidelines helps maintainers and the community understand your suggestion.

Before creating enhancement suggestions, please check the existing issues using the `enhancement` tag to see if the enhancement has already been suggested. (As before, if it has, please **only comment on the existing issue** if you have additional information or ideas to add.)

### Pull Requests

Pull requests should try to follow the [JavaScript Styleguide](#javascript-styleguide) and [Git Commit Messages](#git-commit-messages) as closely as possible. This is to uphold the quality of the codebase and make it easier to maintain.

## Styleguides

### Git Commit Messages

```
<type>: <scope> Message
```

Commit messages should be in the present tense, and should be short and concise. If desired, type should be one of the following: `fix`, `feat`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `revert`, or `wip`. The scope should be the package or area of the codebase that the commit affects. The message should be a short description of the change.

### JavaScript Styleguide

Please use either an editor that supports [EditorConfig](https://editorconfig.org/) and [ESLint](https://eslint.org/) or run `pnpm lint` before committing to ensure that your code is formatted correctly. Make sure to also run prettier on your code before committing.

### Documentation Styleguide

Be short and concise. If you're documenting a function, make sure to include the ts signature and return value. If you're documenting a class, make sure to include the constructor and any methods. If you're documenting an api, make sure to give a clear overview of what it does and specific examples of how to use it's methods.