import io
from matplotlib import pyplot as plt, ticker
# not explicitly used, pipenv runs fine without it, but it's needed for building the executable
import matplotlib.backends.backend_svg  # pylint: disable=unused-import
from src.config import cfg


def init_plot(mode):
    """Initialize plot output in given mode."""
    if mode is None: return
    if mode == 'ion':
        plt.figure(figsize=(8, 6), dpi=200)
        return
    if mode == 'svg':
        plt.switch_backend('Agg')
        return

    raise ValueError(f'Unknown output mode {mode}')


def finish_plot(mode):
    """Finalize plot output in given mode, may return a value."""
    if mode is None: return None

    # render in interactive mode
    if mode == 'ion':
        final_styles()
        plt.ion()
        plt.show()
        return None

    # render the plot to SVG as raw string content
    if mode == 'svg':
        final_styles()
        svg_buffer = io.BytesIO()
        plt.savefig(svg_buffer, format='svg')
        plt.close()
        svg_content = svg_buffer.getvalue().decode('utf-8')
        svg_buffer.close()
        # Remove <?xml> and <!DOCTYPE> headers
        svg_tag_index = svg_content.find('<svg')
        return svg_content[svg_tag_index:] if svg_tag_index > 0 else svg_content

    raise ValueError(f'Unknown output mode {mode}')


def final_styles():
    """Apply final styles to plot before rendering."""
    ax = plt.gca()
    if cfg.chart_tick_marks:
        ax.tick_params(direction='in')
    else:
        ax.tick_params(length=0)
    if cfg.chart_grid: plt.grid(True)

    # hack to ensure square aspect ratio, see https://stackoverflow.com/a/57249253/19120862
    x_left, x_right = ax.get_xlim()
    y_bottom, y_top = ax.get_ylim()
    ax.set_aspect(abs((x_right-x_left) / (y_bottom-y_top)) / cfg.chart_aspect_ratio)

    # hide legend & title if requested
    if not cfg.chart_legend: plt.legend().set_visible(False)
    if not cfg.chart_title: plt.title(None)


# custom axis number formatter function
dynamic_number_format = lambda x, _pos: f"{int(x)}" if x == int(x) else f"{x:.1f}"


def x_dynamic_number_format():
    plt.gca().xaxis.set_major_formatter(ticker.FuncFormatter(dynamic_number_format))


def y_dynamic_number_format():
    plt.gca().yaxis.set_major_formatter(ticker.FuncFormatter(dynamic_number_format))
