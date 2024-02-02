import io
from matplotlib import pyplot as plt


def init_plot(mode):
    """Initialize plot output in given mode."""
    if mode is None: return
    if mode == 'ion':
        plt.figure()
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
        plt.ion()
        plt.show()
        return None

    # render the plot to SVG as raw string content
    if mode == 'svg':
        svg_buffer = io.BytesIO()
        plt.savefig(svg_buffer, format='svg')
        svg_content = svg_buffer.getvalue().decode('utf-8')
        svg_buffer.close()
        # Remove <?xml> and <!DOCTYPE> headers
        svg_tag_index = svg_content.find('<svg')
        return svg_content[svg_tag_index:] if svg_tag_index > 0 else svg_content

    raise ValueError(f'Unknown output mode {mode}')
