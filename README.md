# VLizard
**a VLE wizard** 🧙‍♂️⚗🦎

A useful toolbox for evaluation of VLE data (vapor-liquid equilibrium), which comprises tests of thermodynamic consistency & fitting models with non-linear regression.

The project is a monorepo consisting of:
- [Python Core+Backend](docs/appPy.md)
- [Typescript Frontend](docs/appUI.md)

In the initial phase, VLizard is intended as a toolbox for VLE data, but in future its scope may be expanded to include tools for LLE or reaction kinetics data.

Conventions upheld across this repo are summarized [here](docs/conventions.md).

## Setup, run, build
See respective docs for [python backend](docs/appPy.md), [Typescript frontend](docs/appUI.md)

## References
Following literature sources were used for creation of this software:

- thermodynamic consistency tests
  - slope, Redlich-Kister, Herington: [J. Wisniak 2017](https://doi.org/10.1016/j.jct.2016.10.038)
  - Fredenslund: [A. Fredenslund 1977](https://doi.org/10.1016/B978-0-444-41621-6.X5001-7)
- dev data
  - CHOL,CHF,CPOL,CPF: [T. Sommer 2020](https://doi.org/10.1021/acs.jced.9b00746)
  - Antoine for isoamyl: [O. Rojas 2016](https://doi.org/10.1021/acs.jced.6b00197)
