## VLizard user manual

Welcome to the user manual for VLizard, a VLE wizard. 🧙‍♂️⚗🦎

This document will quickly guide you through the process of using VLizard app for processing VLE data.  
It does not cover all advanced features, but should be enough to get you started.  

🎓 Tests of thermodynamic consistency are covered in separate documents: [Overview of tests](tests.md), [Theoretical background](test_theory.md).

#### Content
1. [First navigation](#first-navigation)
2. [Adding Pure compounds](#adding-pure-compounds)
3. [Adding VLE dataset](#adding-vle-dataset)
4. [Fitting thermodynamic models](#fitting-thermodynamic-models)
5. [Other features](#other-features)
6. [Troubleshooting](#troubleshooting)

### First navigation

After opening the app, you should see the welcome page, and most importantly, the navigation top bar:

![top bar](images/top_bar.png)

The "About" icon will lead to this manual.
As for the other icons, we will get to them later.  
Let's visit the **Pure compounds** page.

### Adding Pure compounds

For any kind of VLE data processing you need to have a vapor pressure model for each pure compound.

I think an example is worth a thousand words, so if you have VLizard freshly installed, there is example data from literature for ethanol & water.  
So click the "Perform analysis" icon:
![analysis icon](images/analysis_icon.png)

You should see a dialog with behavior of the vapor pressure model, which should be self-explanatory.  
💡 Any dialog can be closed by clicking on X, the blurred background, or by pressing Escape.  
💡 Any plot can be saved as vectorized `svg` image to your computer.

Try editing a model via the pencil icon.  
💡 This is fullscreen dialog, it can be closed only via buttons, not Escape key, so you don't accidentally lose progress. 

You can now Add a new model at top of page, and fill the dialog similarly.
In case you have obtained the model parameters elsewhere, enter them.
Or, if you have experimental data for vapor pressure, you can "Perform fitting" – paste your data into the table and Optimize parameters.

Don't worry about temperature range, it's only informative – calculations will warn you when you extrapolate too much _(can be tweaked in settings)_.  
👉 After adding a model, it's recommended to do an analysis to sanity check it.

Of course, any model can be deleted, but let's avoid for now, and proceed by visiting the **Binary systems** page.

### Adding VLE dataset

All binary systems are listed here.
Each system can have multiple datasets, and you can fold/expand them using arrows.

Look at one of the example datasets:  
Icon ![edit table icon](images/edit_table_icon.png) lets you edit the VLE data.  
Icon ![visualize icon](images/visualize_icon.png) visualizes your data.   
Icon ![analysis icon](images/analysis_icon.png) **is most important** – it opens a menu with a wide range of analyses. The help button will help you get familiar with them _(leads to [overview of tests](tests.md))_.

In order to do the same with your data, you can enter it similarly to editing.
Either "Add new" system, or save some clicks by adding dataset for an existing system via ![new table icon](images/new_table_icon.png)  
💡 If you have your table differently arranged, no problem, just rearrange the column headers and pick your units of measure.

✅ Congratulations, you now have mastered the most important feature of VLizard!  
You can visit the **Fitting** page if you're interested.
It's also needed for the van Ness test.

### Fitting thermodynamic models

Last but not least, VLizard can fit your VLE data with a thermodynamic model.  
Here you can see your systems, but with no fitted models, so add one via ![new table icon](images/new_table_icon.png)

Select the datasets to be fitted and your model.  
Initial parameters are provided, which you can tweak.  
You may specify which parameters should not be optimized = left as initial estimate.  
The "Optimize & Save" button will proceed with fitting, and results will be displayed and persisted.   
💡 Mark all parameters as constant if you'd like to just input fitted parameters from elsewhere.

### Other features

There are some icons in the top bar we have not talked about yet:

- Home icon will get you to the welcome page. Not particularly useful.
- Refresh will refresh all vapor pressure models, VLE data and fitted models
  - Use if you have manipulated the data manually _outside_ VLizard. 
- Open data folder – opens the VLizard data, located in your Documents directory.
  - Data is stored in `.tsv` files, which may be edited manually with Excel, but:
    - ⚠ Do only at your own risk, the app expects a very specific format, and may crash otherwise. Doing a backup is advised.
    - Though moving or deleting files is safe.
- Settings – so you can tweak VLizard to your liking!

### Troubleshooting

Oops, sometimes trouble happens!
Here are some general steps you can try.

If nothing helps, please report the bug 🐛 [using this contact](bug_tracking.md).

- Sometimes you may get an error notification at left bottom.
  - This means that a specific action failed, but you can still do other things. 
  - Please check if the error appears only for particular data.
    - If so, check the data for mistakes.
    - If there is no visible mistake, send the data along with bug report.
  - Please note that for fitting, some crashes are normal! Optimization simply does not always converge.
    - Try different initial params, or select different portion of data.
- If you encounter an error screen, the app is unusable 😱
  - `ctrl+R` refreshes the UI without having to restart whole app. 
  - But restart will be necessary for this error screen: `Lost connection to the Core server!`
- `ctrl+shift+I` will display the UI console. Please copy any error you see there, and send it along with a bug report. 

In any case, keep in mind this a free open-source project.
I am doing my best to make it functional and user-friendly, but do not expect miracles 🙂
