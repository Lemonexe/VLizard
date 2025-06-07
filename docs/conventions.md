## Conventions

### Terminology
`system` = binary system as set of datasets  
`dataset` = an isobaric VLE table  
`fit` = fitted model parameters for a specific system+datasets

### Variable naming
Since this software is highly mathematical, variable naming is often conventional rather than descriptive or semantical.  
Standard signs for quantities or operators are used, and indexes are marked using `_`, some indexes are used to mark purpose or origin:  
***dif***ference, ***res***idual, ***sum***, ***exp***erimental values, ***cal***culated, ***tab***elated, ***disp***lay,  ***int***erval,  
***vec***tor, ***M***atrix _(in cases where it may not be expected, e.g. serializing vectors to a matrix)_

Model params are represented as:
- `params`: ordered list _(in calculations)_
- `nparams`: named params as ordered key: value dict _(in API, persisted files)_

### Units of measurement
Following units of measurement are used in calculations, unless explicitly stated otherwise:
- pressure: `kPa` _(in logarithmic form as well)_
- temperature: `K`

In UI, units are converted to user's preference as per config for: 1) result values to be displayed, 2) from user inputs fields.  
Notably, raw tabular data and model parameters are **not** converted (using standard units). 

### Styles
Visual language of charts is following: **black** is main data series, **green** is calculated model.  
Diamonds markers and full lines are used primarily. Auxiliary lines are dotted.  
If dataseries for two components are displayed, then **red** for 1st component, **blue** for 2nd component.
If those two correspond to more volatile and less volatile (as in case of VLE), then `D` and `v` markers will be used, respectively.

### Files

- User files are stored in directory `User\Documents\VLizard`.
- Tabular input data is in `.tsv` _(human or Excel readable)_.    
- Config is in `.yaml` _(human readable)_.
- Output or intermediate data is in `.json` _(meant as machine-only)_.
