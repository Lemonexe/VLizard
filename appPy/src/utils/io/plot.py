def pause_to_keep_charts():
    """
    Pause CLI execution to keep charts open.
    Plt.ion() enables pyplot interactive mode, which allows rendering charts async (open chart windows all at once instead of one by one).
    However, the chart windows will close when end of program is reached, so the program has to be kept alive as long as user wishes.
    """
    input("Press ENTER to end the program (closes all charts)")
