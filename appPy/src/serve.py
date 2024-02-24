import sys

sys.path.append(sys.path[0] + '/..')

from waitress import serve
from src.config import cst
from src.api.app import app

if __name__ == "__main__":
    serve(app, host='localhost', port=cst.port_number)
