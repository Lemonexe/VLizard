import numpy as np


# prettyprint numpy array to tsv
def array2tsv(arr, headlines=None, format_spec=None):
    arr = np.array(arr)
    if arr.ndim != 2: raise TypeError('arr must be a numpy array of two dimensions')

    lines = []

    if headlines:
        if len(headlines) != arr.shape[1]: raise ValueError('headlines has to be of same length as arr columns')
        headline = '\t'.join(map(str, headlines))
        lines.append(headline)

    formatter = str if not format_spec else format_spec.format  # lambda to map each numerical cell into a string
    for i in range(arr.shape[0]):
        row = arr[i, :]
        line = '\t'.join(map(formatter, row))
        lines.append(line)

    return '\n'.join(lines)


# save numpy array to exact filepath (e.g. data\example.tsv)
def save_array2tsv(arr, filepath, headlines=None, format_spec=None):
    content = array2tsv(arr, headlines, format_spec)
    with open(filepath, mode='w', encoding='utf-8') as new_tsv_file:
        print(content, file=new_tsv_file)


# helper to serialize vectors as columns of one matrix
def vecs2cols(*args):
    vec2col = lambda vec: vec[:, np.newaxis]
    cols = tuple(map(vec2col, args))
    return np.concatenate(cols, axis=1)
