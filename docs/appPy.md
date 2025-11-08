## Python backend

Or `appPy` for short, is a python application which does the heavy lifting –
all algorithms for thermodynamic consistency tests, non-linear regression and the fitting models are implemented here.  
Uses `pipenv` for dependency management, see [Pipfile](../appPy/Pipfile) _(also specifies python version)_.

I/O is provided either mainly via **Flask server** _(for Electron app)_,
or alternatively **CLI** _(for local development, may be outdated)_.  
The server application can be built as a single executable binary using `pyinstaller`.
The binary is then packed together with the Electron app, running silently as its child process.
See [Typescript frontend](appUI.md) for build process of the Electron app.

Regardless of how do you run `appPy`, user data is always read from directors `~/Documents/VLizard`, analogically on Windows, Linux, macOS respectively. 


### Setup
⚠ All commands shall be run in `appPy` directory!
```
cd appPy

pyenv install $(cat .python-version)
pyenv local $(cat .python-version)
# (or manually install python version as per the file .python-version)

pip install --user pipenv
pipenv install --dev
```

### Build
Build has to be done natively on each respective platform: Windows, Linux, macOS.
```
pipenv shell
pyinstaller --onefile --name VLizard_server serve.py
exit
```

### Local run

#### Flask server
Run production server: `pipenv run start`  
Run development server: `pipenv run dev` _(has hot reload)_  
Run built production server: `.\dist\VLizard_server.exe` or `./dist/VLizard_server`  
Uses port 37137 by default.

See [http/](../http) for API documentation (as IntelliJ http files).  

Endpoints assume valid systems and datasets, UI must take care of that.
CRUD controllers operate on `.tsv` files, which store user input data.
Analyses are run via `POST` endpoints, which return json and also persist it in `.json` files as cache.

### Development
Unit tests: `pipenv run test`  
Pylint: `pipenv run lint`  
Prettier: `pipenv run prettier`

#### CLI
Examples for CLI commands on Linux (on Windows, write `\` instead of `/`):
```
pipenv shell
python cli/slope.py --help
python cli/vapor.py CHOL
python cli/vle.py CPF CPOL
python cli/vle.py CPF CPOL --txy --pxy -d 25kPa
python cli/gamma.py CHF CHOL -d 25kPa --gamma --phi
python cli/gamma.py CHF CHOL -d 25kPa --c12 0.4 -c c_12,virB_1,virB_2,virB_12
python cli/rk.py CHF CHOL -d 25kPa,40kPa --plot
python cli/herington.py CHF CHOL -d 25kPa,40kPa
python cli/fredenslund.py CHF CHOL -d 25kPa --ge --res
python cli/fit.py CPF CPOL vanLaar -d 25kPa --ptxy --persist
python cli/tabulate.py CPOL CPF vanLaar -p 33 --txy
python cli/tabulate.py CPOL CPF vanLaar -t 321 --pxy
python cli/vn.py CPOL CPF vanLaar -d 25kPa --plot
python cli/fit.py CHOL CHF NRTL -d 10kPa,25kPa,40kPa --xy --ptxy --gamma -c c_12
python cli/fit.py EtOH H2O UNIQUAC --skip -d Kamihama2012,Voutsas2011 --xy --gamma -p 1.972,1.4,2.10547,0.92,2.0046,-2.4936,-728.9705,756.9477
exit
```
See [appPy/cli](../appPy/cli), where filenames correspond to commands;
calling with `--help` will instruct you further.
