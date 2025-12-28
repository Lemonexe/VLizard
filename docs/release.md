## Release

### PR template

Release checklist:
- [ ] create this PR by:
  - [ ] bumping version in `package.json`
  - [ ] running `npm i` to have `package.lock` updated
  - [ ] committing `Bump version yyyy.minor.patch`
- [ ] at this branch, build locally & QA:
  - [ ] Windows exe build
  - [ ] Linux flatpak build
  - [ ] macOS dmg build
- [ ] prepare release notes
- [ ] merge this PR, and do the following in quick succession:
  - _because when it's in `master`, all VLizard copies will advertise app update. It's not ideal, but whatever, VLizard has very few users._
- [ ] tag `master HEAD` as `yyyy.minor`
- [ ] create [a github release](https://github.com/Lemonexe/VLizard/releases) `yyyy.minor`
- [ ] update [zenodo](https://doi.org/10.5281/zenodo.13357210)
