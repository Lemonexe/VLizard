import csv
import numpy as np


def open_tsv(file_path):
    """
    Open a path with .tsv file and return it as list of lists, filter out empty rows.

    file_path (str): exact path to tsv file
    return (list of lists): tsv file content as list of rows, each row is a list of cells for each column
    """
    with open(file_path, encoding='utf-8') as tsv_file:
        reader = csv.reader(tsv_file, delimiter='\t')
        return [row for row in reader if len(row) > 0]


def array2tsv(arr, headlines=None, format_spec=None):
    """
    Prettyprint numpy array to tsv format.

    arr (numpy array): array to be printed
    headlines (list of str): list of headlines for each column
    format_spec (str): format specification for each numerical cell, e.g. '.2f' for two decimal places
    return (str): tsv formatted string
    """
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


def save_array2tsv(arr, filepath, headlines=None, format_spec=None):
    """Save numpy array to exact filepath."""
    content = array2tsv(arr, headlines, format_spec)
    with open(filepath, mode='w', encoding='utf-8') as new_tsv_file:
        print(content, file=new_tsv_file)
