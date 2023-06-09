# VLizard
**a VLE wizard** 🧙‍♂️⚗🦎

A useful toolbox for evaluation of VLE data (vapor-liquid equilibrium). This comprises running tests of thermodynamic consistency and ~fitting models with non-linear regression~ _(TODO mid-term future)_

The project is a monorepo consisting of Python Core+Backend ~and Typescript Frontend~ _(TODO short-term future)_

In the inital phase, VLizard is a toolbox for VLE data, but in future it shall be expanded to be a broad scope data tool – it might comprise tools for LLE or reaction kinetics.

## Setup

### Python
Execute in `appPy` folder
```
cd appPy
pip install --user pipenv
pipenv install --dev
```

## Run
Examples for CLI commands:
```
pipenv run cli\antoine CHOL
pipenv run cli\rk CHF CHOL -d 25kPa --plot
pipenv run cli\fredenslund CPF CPOL --ge --res
```
See [appPy/cli](appPy/cli), where filenames correspond to commands; calling with `--help` will instruct you further.

## Development

### Python

Run unit tests: `pipenv run test`  
Run lint: `pipenv run lint`  
Run prettier: `pipenv run prettier`


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

- dev data from [T. Sommer 2020](https://doi.org/10.1021/acs.jced.9b00746) _(CHOL,CHF,CPOL,CPF)_, [O. Rojas 2016](https://doi.org/10.1021/acs.jced.6b00197) _(Antoine for isoamyl)_
- thermodynamic consistency tests: slope, Redlich-Kister, Herington, Fredenslund from [J. Wisniak 2017](https://doi.org/10.1016/j.jct.2016.10.038), [A. Fredenslund 1977](https://doi.org/10.1016/B978-0-444-41621-6.X5001-7)
