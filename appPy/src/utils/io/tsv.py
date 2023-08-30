import csv
import numpy as np


def open_tsv(file_path):
    """
    Open a path with .tsv file and return it as list of lists, while filtering out empty rows.

    file_path (str): exact path to tsv file
    return (list of lists): tsv file content as list of rows, each row is a list of cells for each column
    """
    with open(file_path, encoding='utf-8') as tsv_file:
        reader = csv.reader(tsv_file, delimiter='\t')
        return [row for row in reader if len(row) > 0]


def matrix2tsv(M, headlines=None, format_spec=None):
    """
    Prettyprint 2D matrix to tsv format, optionally with headlines.

    arr (list of lists or np.array(m,n)): data matrix to be printed
    headlines (list of str or None): list of headlines for each column
    format_spec (str or None): format specification for each numerical cell, e.g. '.2f' for two decimal places
    return (str): tsv formatted string
    """
    # validate that it is castable as matrix
    M = np.array(M)
    if M.ndim != 2 or M.shape[0] == 0 or M.shape[1] == 0:
        raise ValueError('arr must have two dimensions, both non-empty')
    n_cols = M.shape[1]

    lines = []

    if headlines:
        if len(headlines) != n_cols: raise ValueError('headlines has to be of same length as arr columns')
        lines.append('\t'.join(map(str, headlines)))

    formatter = format_spec.format if format_spec else str  # lambda to map each numerical cell into a string
    lines.extend(['\t'.join(map(formatter, row)) for row in M])

    return '\n'.join(lines)


def save_matrix2tsv(arr, file_path, headlines=None, format_spec=None):
    """Save 2D matrix to tsv at exact file path."""
    content = matrix2tsv(arr, headlines, format_spec)
    with open(file_path, mode='w', encoding='utf-8') as new_tsv_file:
        print(content, file=new_tsv_file)
