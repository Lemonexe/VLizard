## Python backend

Or `appPy` for short, is a python application which does the heavy lifting –
all algorithms for thermodynamic consistency tests, non-linear regression and the fitting models are implemented here.

Uses `pipenv` for dependency management, see [Pipfile](../appPy/Pipfile) _(also specifies python version)_.

I/O is provided either mainly via **Flask server** _(for Electron app)_,
or alternatively **CLI** _(for local development, may be outdated)_.

The server application can be built as a single executable binary using `pyinstaller`.
The binary is then packed together with the Electron app, running silently as its child process.
See [Typescript frontend](appUI.md) for build process of the Electron app.

Regardless of how do you run `appPy`, user data is always read from directors `~\Documents\VLizard`, analogically on Windows, Linux, macOS respectively. 


### Setup
⚠ All commands shall be run in `appPy` directory!
```
cd appPy
pip install --user pipenv
pipenv install --dev
```

#### Linux setup
You may not be able to install `pipenv` into the global Python pre-installed on your system.
In order to use the system Python, install pipenv via your package manager.  
Additional packages may be required, e.g. for Debian 13:
```
sudo apt install pipenv
sudo apt install build-essential python3-dev gfortran libopenblas-dev  pkg-config libopenblas64-dev
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
Run built production server: `.\dist\VLizard_server.exe`  
Uses port 37137 by default _(an arbitrary number)_.    

See [http/](../http) for API documentation (as IntelliJ http files).  

Endpoints assume valid systems and datasets, UI must take care of that.
CRUD controllers operate on `.tsv` files, which store user input data.
Analyses are run via `POST` endpoints, which return json and also persist it in `.json` files as cache.

### Development
Unit tests: `pipenv run test`  
Pylint: `pipenv run lint`  
Prettier: `pipenv run prettier`

#### CLI
Examples for CLI commands on Windows:
```
pipenv run cli\slope --help
pipenv run cli\vapor CHOL
pipenv run cli\vle CPF CPOL
pipenv run cli\vle CPF CPOL --txy --pxy -d 25kPa
pipenv run cli\gamma CHF CHOL -d 25kPa --gamma --phi
pipenv run cli\gamma CHF CHOL -d 25kPa --c12 0.4 -c c_12,virB_1,virB_2,virB_12
pipenv run cli\rk CHF CHOL -d 25kPa,40kPa --plot
pipenv run cli\herington CHF CHOL -d 25kPa,40kPa
pipenv run cli\fredenslund CHF CHOL -d 25kPa --ge --res
pipenv run cli\fit CPF CPOL vanLaar -d 25kPa --ptxy --persist
pipenv run cli\tabulate CPOL CPF vanLaar -p 33 --txy
pipenv run cli\tabulate CPOL CPF vanLaar -t 321 --pxy
pipenv run cli\vn CPOL CPF vanLaar -d 25kPa --plot
pipenv run cli\fit CHOL CHF NRTL -d 10kPa,25kPa,40kPa --xy --ptxy --gamma -c c_12
pipenv run cli\fit EtOH H2O UNIQUAC --skip -d Kamihama2012,Voutsas2011 --xy --gamma -p 1.972,1.4,2.10547,0.92,2.0046,-2.4936,-728.9705,756.9477
```
See [appPy/cli](../appPy/cli), where filenames correspond to commands;
calling with `--help` will instruct you further.

On Linux, write `pipenv run python cli/vle.py` instead of `pipenv run cli\vle`, assuming `python` is executable.  
To render plots in CLI, you may need `sudo apt install python3-tk`.
