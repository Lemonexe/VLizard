import sys

sys.path.append(sys.path[0] + '/..')

from waitress import serve
from src.api.app import app

if __name__ == "__main__":
    port = next((arg for arg in sys.argv if arg[:5] == 'port='), None)
    port = int(port[5:]) if port else 8080

    serve(app, host='localhost', port=port)
