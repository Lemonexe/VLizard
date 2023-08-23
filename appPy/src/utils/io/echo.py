import click
from src.config import cli_fg_ok, cli_fg_err, cli_fg_warn

# this file contains helpers to push click library to the edge of program, so it is not tightly bound
echo = click.echo

# helper function that takes string and appends dotted underline beneath it
underline = lambda text: text + '\n' + '¨' * (len(text))

# helper functions for styled echo texts
err_echo = lambda text: click.secho(text, fg=cli_fg_err)
ok_echo = lambda text: click.secho(text, fg=cli_fg_ok)
warn_echo = lambda text: click.secho(text, fg=cli_fg_warn)
underline_echo = lambda text: click.echo(underline(text))