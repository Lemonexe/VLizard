import numpy as np

# helper to serialize vectors as columns of one matrix
serialize_rows = lambda *args: np.vstack(tuple(args))
serialize_cols = lambda *args: serialize_rows(*args).T
