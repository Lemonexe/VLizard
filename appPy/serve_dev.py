import sys
from src.api.app import app

if __name__ == '__main__':
    port = next((arg for arg in sys.argv if arg[:5] == 'port='), None)
    port = int(port[5:]) if port else 8080

    is_debug_mode = 'debug' in sys.argv
    app.run(port=port, debug=is_debug_mode)
