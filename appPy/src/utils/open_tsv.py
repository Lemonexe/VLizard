import csv


# open a filename with .tsv file and return it as list of lists, no parsing
def open_tsv(filename):
    lines = []
    with open(filename, encoding='utf-8') as tsvfile:
        reader = csv.reader(tsvfile, delimiter='\t')
        for row in reader:
            lines.append(row)
    return lines
