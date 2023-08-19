## Python backend

Or `appPy` for short, is a python application which does the heavy lifting.
All algorithms for thermodynamic consistency tests and fitting models are implemented here.

I/O is provided either via CLI (local development) or ~~Flask server~~ (for Electron app).

~~It is packed together with the Electron app, running silently.~~
~~See [Typescript frontend](appUI.md) for build process.~~

### Setup
⚠ Execute in `appPy` folder!
```
cd appPy
pip install --user pipenv
pipenv install --dev
```

### Local run
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
pipenv run cli\fit CPF CPOL -d 25kPa --txy
pipenv run cli\fit CHOL CHF -m NRTL -d 10kPa,25kPa,40kPa --xy --txy --gamma -p 1,1,0,0,0.3 -c g_12
```
See [appPy/cli](../appPy/cli), where filenames correspond to commands;
calling with `--help` will instruct you further.

#### Flask server
todo

### Development
Run unit tests: `pipenv run test`  
Run pylint: `pipenv run lint`  
Run prettier: `pipenv run prettier`
