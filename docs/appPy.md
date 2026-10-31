# Python backend

Or `appPy` for short, is a python application which does the heavy lifting –
all algorithms for thermodynamic consistency tests, non-linear regression and the fitting models are implemented here.  
Uses [uv](https://docs.astral.sh/uv/) for dependencies and project Python management.
Dependencies and named tasks are declared in [pyproject.toml](../appPy/pyproject.toml),
resolved versions are committed in [uv.lock](../appPy/uv.lock), and the exact Python
3.14 patch is pinned in [.python-version](../appPy/.python-version).

I/O is provided either mainly via **Flask server** _(for Electron app)_,
or alternatively **CLI** _(for local development, may be outdated)_.  
The server application can be built as a single executable binary using `pyinstaller`.
The binary is then packed together with the Electron app, running silently as its child process.
See [Typescript frontend](appUI.md) for build process of the Electron app.

Regardless of how do you run `appPy`, user data is always read from directors `~/Documents/VLizard`, analogically on Windows, Linux, macOS respectively. 


## Setup
⚠ All commands shall be run in `appPy` directory!
Install [uv](https://docs.astral.sh/uv/getting-started/installation/) first, then:
```
cd appPy
uv sync --locked
```

uv downloads the pinned Python automatically and creates `appPy/.venv`, including
development tools. This project requires uv-managed Python; system Python and
shell configuration do not need to change. Use `uv run` to run project commands.
For an editor, select `.venv/bin/python` (Windows: `.venv\Scripts\python.exe`).

## Build
Build has to be done natively on each respective platform: Windows, Linux, macOS.
```
uv run pyinstaller --onefile --name VLizard_server serve.py
```

## Local run

### Flask server
Run production server: `uv run task start`\
Run development server: `uv run task dev` _(has hot reload)_\
Run built production server: `.\dist\VLizard_server.exe` or `./dist/VLizard_server`  
Uses port 37137 by default.

See [http/](../http) for API documentation (as IntelliJ http files).  

Endpoints assume valid systems and datasets, UI must take care of that.
CRUD controllers operate on `.tsv` files, which store user input data.
Analyses are run via `POST` endpoints, which return json and also persist it in `.json` files as cache.

## Development
Unit tests: `uv run task test`\
Pylint: `uv run task lint`\
Prettier: `uv run task prettier`

### CLI
Examples for CLI commands on Linux (on Windows, write `\` instead of `/`):
```
uv run python cli/slope.py --help
uv run python cli/vapor.py CHOL
uv run python cli/vle.py CPF CPOL
uv run python cli/vle.py CPF CPOL --txy --pxy -d 25kPa
uv run python cli/gamma.py CHF CHOL -d 25kPa --gamma --phi
uv run python cli/gamma.py CHF CHOL -d 25kPa --c12 0.4 -c c_12,virB_1,virB_2,virB_12
uv run python cli/rk.py CHF CHOL -d 25kPa,40kPa --plot
uv run python cli/herington.py CHF CHOL -d 25kPa,40kPa
uv run python cli/fredenslund.py CHF CHOL -d 25kPa --ge --res
uv run python cli/fit.py CPF CPOL vanLaar -d 25kPa --ptxy --persist
uv run python cli/tabulate.py CPOL CPF vanLaar -p 33 --txy
uv run python cli/tabulate.py CPOL CPF vanLaar -t 321 --pxy
uv run python cli/vn.py CPOL CPF vanLaar -d 25kPa --plot
uv run python cli/fit.py CHOL CHF NRTL -d 10kPa,25kPa,40kPa --xy --ptxy --gamma -c c_12
uv run python cli/fit.py EtOH H2O UNIQUAC --skip -d Kamihama2012,Voutsas2011 --xy --gamma -p 1.972,1.4,2.10547,0.92,2.0046,-2.4936,-728.9705,756.9477
```
See [appPy/cli](../appPy/cli), where filenames correspond to commands;
calling with `--help` will instruct you further.
