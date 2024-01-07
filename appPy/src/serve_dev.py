import sys

sys.path.append(sys.path[0] + '/..')

from src.config import cfg
from src.api.app import app

if __name__ == '__main__':
    is_debug_mode = 'debug' in sys.argv
    app.run(port=cfg.port_number, debug=is_debug_mode)