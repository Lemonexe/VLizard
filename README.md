# VLizard
**a VLE wizard** 🧙‍♂️⚗🦎

A useful toolbox for evaluation of VLE data (vapor-liquid equilibrium), which comprises tests of thermodynamic consistency & fitting models with non-linear regression.

The project is a monorepo consisting of Python Core+Backend and TypeScript Frontend.

In the initial phase, VLizard is intended as a toolbox for VLE data, but in future its scope may be expanded to include tools for LLE or reaction kinetics data.

## Setup

### Python
Execute in `appPy` folder
```
cd appPy
pip install --user pipenv
pipenv install --dev
```

## Run CLI
Examples for CLI commands:
```
pipenv run cli\slope --help
pipenv run cli\antoine CHOL
pipenv run cli\vle CPF CPOL
pipenv run cli\gamma CHF CHOL -d 25kPa --plot
pipenv run cli\rk CHF CHOL -d 25kPa,40kPa --plot
pipenv run cli\herington CHF CHOL -d 25kPa,40kPa --plot
pipenv run cli\fredenslund CHF CHOL -d 25kPa --ge --res
pipenv run cli\fit CHF CHOL -d 25kPa -m NRTL --plot
```
See [appPy/cli](appPy/cli), where filenames correspond to commands; calling with `--help` will instruct you further.

## Run app

todo

## Development

### Python

Run unit tests: `pipenv run test`  
Run lint: `pipenv run lint`  
Run prettier: `pipenv run prettier`

### TypeScript

todo

## Conventions
Since this software is highly mathematical, variable naming is often conventional rather than descriptive or semantical.  
Standard signs for quantities or operators are used, and indexes are marked using `_`, some indexes are used to mark purpose or origin:  
***dif***ference, ***res***idual, ***sum***, ***exp***erimental values, ***cal***culated, ***tab***elated

Visual language of charts is following: **black** is main data series, **green** is calculated model.  
Diamonds markers and full lines are used primarily. Auxiliary lines are dotted.  
If dataseries for two components are displayed, then **red** for 1st component, **blue** for 2nd component.
If those two correspond to more volatile and less volatile (as in case of VLE), then `^` and `v` markers will be used, respectively.

## References

Following literature sources were used for creation of this software:

- thermodynamic consistency tests
  - slope, Redlich-Kister, Herington: [J. Wisniak 2017](https://doi.org/10.1016/j.jct.2016.10.038)
  - Fredenslund: [A. Fredenslund 1977](https://doi.org/10.1016/B978-0-444-41621-6.X5001-7)
- dev data
  - CHOL,CHF,CPOL,CPF: [T. Sommer 2020](https://doi.org/10.1021/acs.jced.9b00746)
  - Antoine for isoamyl: [O. Rojas 2016](https://doi.org/10.1021/acs.jced.6b00197)
