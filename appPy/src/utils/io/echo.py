import click
from src.config import cst

echo = click.echo
"""Write to console."""

underline = lambda text: text + '\n' + '¨' * (len(text))
"""Append dotted underline beneath a string."""

err_echo = lambda text: click.secho(text, fg=cst.cli_fg_err)
"""Write error styled text to console."""

ok_echo = lambda text: click.secho(text, fg=cst.cli_fg_ok)
"""Write success styled text to console."""

warn_echo = lambda text: click.secho(text, fg=cst.cli_fg_warn)
"""Write warning styled text to console."""

underline_echo = lambda text: click.echo(underline(text))
"""Write underlined text to console."""
