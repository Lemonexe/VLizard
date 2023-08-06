
# plt.ion() enables pyplot interactive mode, which allows rendering charts async (open chart windows all at once instead of one by one)
# however, the chart windows will close when end of program is reached, so the program has to be kept alive as long as user wishes
def pause_to_keep_charts():
    input("Press ENTER to end the program (closes all charts)")
