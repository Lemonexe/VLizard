## Python backend

Or `appPy` for short, is a python application which does the heavy lifting –
all algorithms for thermodynamic consistency tests, non-linear regression and the fitting models are implemented here.

I/O is provided either via **Flask server** (for Electron app) or **CLI** (local development, may be outdated).

~~It is packed together with the Electron app, running silently.~~
~~See [Typescript frontend](appUI.md) for build process.~~

Uses `pipenv` for dependency management, see [Pipfile](../appPy/Pipfile) _(also specifies python version)_.

### Setup
⚠ Execute in `appPy` folder!
```
cd appPy
pip install --user pipenv
pipenv install --dev
```

### Local run

#### Flask server
Run server: `pipenv run start`  
Run development server: `pipenv run dev`  
Uses port 37137 by default (arbitrary number).    

See [http/](../http) for API documentation (as IntelliJ http files).  

Endpoints assume valid systems and datasets, UI must take care of that.
CRUD controllers operate on `.tsv` files, which store user input data.
Analyses are run via `POST` endpoints, which return json and also persist it in `.json` files as cache.


#### CLI
Examples for CLI commands:
```
pipenv run cli\slope --help
pipenv run cli\vapor CHOL
pipenv run cli\vle CPF CPOL
pipenv run cli\gamma CHF CHOL -d 25kPa --plot
pipenv run cli\rk CHF CHOL -d 25kPa,40kPa --plot
pipenv run cli\herington CHF CHOL -d 25kPa,40kPa
pipenv run cli\fredenslund CHF CHOL -d 25kPa --ge --res
pipenv run cli\fit CPF CPOL -m vanLaar -d 25kPa --txy
pipenv run cli\fit CHOL CHF -d 10kPa,25kPa,40kPa --xy --txy --gamma -c c_12
```
See [appPy/cli](../appPy/cli), where filenames correspond to commands;
calling with `--help` will instruct you further.

### Development
Run unit tests: `pipenv run test`  
Run pylint: `pipenv run lint`  
Run prettier: `pipenv run prettier`
