import signal
import sys
from waitress import serve
from src.api.app import app

# handle exit to prevent VLizard_server.exe hanging when Electron is closed
def signal_handler(_signal_number, _stack_frame):
    print('Exiting server...')
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

if __name__ == "__main__":
    print('Starting server...')
    port = next((arg for arg in sys.argv if arg[:5] == 'port='), None)
    port = int(port[5:]) if port else 37137

    serve(app, host='localhost', port=port)
