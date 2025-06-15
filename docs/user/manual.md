## VLizard user manual

Welcome to the user manual for VLizard, a VLE wizard. 🧙‍♂️⚗🦎

This document will quickly guide you through the process of using VLizard app for processing VLE data.  
Both isobaric and isothermal VLE data are supported, though some features are only for isobaric data.  
It does not cover all advanced features, but should be enough to get you started.  
Please refer to other pages for advice on tests of thermodynamic consistency.

#### Other documentation pages
- [Quick overview of tests](tests.md)
- [Theoretical background on tests](test_theory.md)
- [Vapor pressure models](ps_models.md)
- [VLE models](VLE_models.md)
- [Literary references](../references.md)
- [Bug tracking](bug_tracking.md)

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

The (?) icon will lead to this manual.
But let's start by visiting the **Pure compounds** page.

### Adding Pure compounds

Having a vapor pressure model available for each pure compound is a prerequisite for any kind of VLE data processing.

If you have just freshly installed VLizard, there are example data from literature for ethanol & water.  
So click the "Perform analysis" icon:
![analysis icon](images/analysis_icon.png)

A dialog appears with visualization of the vapor pressure model.  
💡 Any plot can be saved as vectorized `svg` image to your computer.

Try editing a model via the pencil icon.  
💡 This is fullscreen dialog, it can be closed only via buttons, not Escape key, so you don't accidentally lose progress. 

You may also "Add a new model" at the top of the page, and fill the dialog similarly – enter the model parameters that you have available.
Or, if you have experimental data for vapor pressure, you can "Perform fitting" – paste your data into the table and click "Optimize".

Don't worry about the temperature range, it's only informative – calculations will warn you when you extrapolate too much, but won't fail.  
👉 After adding a model, it is recommended to do an perform analysis to sanity check it.

Of course, any model can be deleted.
Let us now proceed to visit the **Binary systems** page.

### Adding VLE dataset

All binary systems are listed here.
Each system can have multiple datasets, and you can fold/expand them using arrows.

Look at one of the example datasets:  
Icon ![edit table icon](images/edit_table_icon.png) lets you edit the VLE data.  
Icon ![visualize icon](images/visualize_icon.png) visualizes your data.   
Icon ![analysis icon](images/analysis_icon.png) **is most important** – it opens a menu with a wide range of analyses.

The analyses include visualization (same as above) and all the tests of thermodynamic consistency.  
The help button leads to [overview of tests](tests.md) so you can learn more about them.

Now you may enter your experimental VLE data, be it isobaric or isothermal.  
Either "Add new" binary system, or you may add a dataset directly to an existing system via ![new table icon](images/new_table_icon.png)  
💡 Is your table in a different format? No problem, just rearrange the column headers and pick your units of measure.

Now you may perform analysis for your VLE data – the most important feature!

### Fitting thermodynamic models

The only remaining feature to be described is the  **Fitting** page.
You may skip this if you do not need to fit your VLE data with a thermodynamic model. 
Note that it is required to perform the van Ness test of thermodynamic consistency.

This page lists your binary systems, but there are no fitted models yet, so add one via ![new table icon](images/new_table_icon.png)  
A dialog appears:
- Select the datasets to be fitted and a model of your choice (see [models overview](VLE_models.md)).
- Initial parameters are provided, which you may modify if you wish.
- Using the "Params to keep constant" selection, you may omit some of them from optimization → will be left as initial estimate.
- The "Optimize & Save" button will proceed with fitting, the model will be tabulated, and results displayed & persisted.

💡 Mark all parameters as constant if you wish to just input the final model parameters from elsewhere.

After a successful fitting, you shall see the model persisted in the list.  
Icon ![visualize icon](images/visualize_icon.png) to display fitting again (tabulates model through original data).  
Icon ![analysis icon](images/analysis_icon.png) to tabulate the model at arbitrary pressure.

### Other features

There are some icons in the top bar we have not covered yet:

- **Home** will get you to the welcome page.
- **Refresh** will refresh all vapor pressure models, VLE data and fitted models.
  - Use if you have manipulated the data manually _outside_ VLizard.
- **Open data folder** opens the VLizard data, located in your Documents directory.
  - Data is stored in `.tsv` files, which may be edited manually with Excel, but edit at your own risk!
    - The app expects a specific format, and could crash, so make a backup before editing files manually.
    - Though moving, renaming or deleting files manually is generally safe.
- **Settings** lets you tweak VLizard to your particular needs

Note: the local data files are stored at following directories:
- Windows: `C:\Users\%username%\Documents\VLizard\`
- macOS: `~/Documents/VLizard/`
- Linux: `~/Documents/VLizard/`

### Troubleshooting

Having problems?
Here are some general steps you can try.  
If nothing helps, please report the bug 🐛 [using this contact](bug_tracking.md).

- Sometimes you may get an error notification at left bottom.
  - This means that a specific procedure failed, but you can still do other things. 
  - Please check if the error appears only for particular data.
    - If so, check the data for mistakes in format.
    - If there is no visible mistake, send the data along with bug report.
  - Please note that for Fitting, some failures are normal! Optimization simply does not always converge.
    - Try different initial params, or select different portion of your data.
- If you encounter an error screen (toolbar not visible), the app is unfortunately unusable
  - `ctrl+R` refreshes the UI without having to restart whole app. 
  - But restart will be necessary for this error screen: `Lost connection to the Core server!`
- `F12` will display the app console. I'd like to ask you to copy any error you see there, and please send it along with a bug report. 

In any case, please keep in mind this a free open-source project.
I am doing my best to make it functional and user-friendly, but it may not always be perfect.
Thank you for your understanding!
