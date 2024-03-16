import sys
from waitress import serve
from src.api.app import app

if __name__ == "__main__":
    print('Starting server...')
    port = next((arg for arg in sys.argv if arg[:5] == 'port='), None)
    port = int(port[5:]) if port else 37137

    serve(app, host='localhost', port=port)
