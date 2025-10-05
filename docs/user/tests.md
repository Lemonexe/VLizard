## Overview of thermodynamic consistency tests

[Back to User manual](manual.md)

VLizard offers a wide range of tests for checking the thermodynamic consistency of your experimental VLE data (both isobaric and isothermal).
This is not to be confused with generic _statistical analysis_, which is provided by many other software tools,
while thermodynamic consistency examines compliance of experimental data with fundamental laws of thermodynamics.
Most of these procedures are based on the Gibbs-Duhem equation _(G-D)_, with different approaches to its simplification or approximation
(the partial differential equation is inconvenient for direct application).
That means there can be no single test to guarantee the correctness of your data, but a combination of several tests, each with different scope and limitations, can help you identify systematic errors in your data.

This document covers only practical aspects of individual tests.
Theory is briefly explained in [Theoretical background](test_theory.md) document.
Alternatively, see [all literary sources](../references.md) for VLizard.

## Which test to choose?

### Fredenslund test

The most versatile test, it should always be performed.
- Can evaluate the dataset **as a whole**
  - Has conventional metrics for $\overline{\delta p}$, $\overline{\Delta y}$ to formally accept or reject the data.
- Can evaluate **individual points**
  - The distribution of the residuals shows outlying points.
- You may also look at the distribution of the residuals, which should be random, with no trends.
  - If there are visible trends, there is a systematic error _(though if metrics are within acceptable limits, the error is also small)_.
- Cannot be used for small number of data points, 5 is the absolute minimum, but more are recommended.
- It is well theoretically supported.

### van Ness test

While all other tests examine only VLE dataset & vapor pressure models to see if they internally comply with G-D,  
the van Ness test also needs a **fitted thermodynamic model**.
It then examines if G-D is valid **between data & model**.
- You have to perform a fitting first, or import the parameters from elsewhere.
- **Particularly** useful to evaluate a fitted model that you will use for further work, _e.g. process simulation_!
- Assigns a conventional index from 1 to 10, where 1 is perfect and 10 is unacceptable.
- Can evaluate the dataset as a whole.
- Can evaluate individual points.
  - The distribution of the residuals shows outlying points.
  - _Randomness of distribution can be evaluated only if the model fits one set of isothermal data!_
- It is well theoretically supported.

### Gamma offset test

[A novel procedure](https://doi.org/10.1021/acsomega.5c04650) based on activity coefficient definition rather than G-D,
which detects if the VLE data aligns with vapor pressure models (a necessary condition for thermodynamic consistency).
- Can be done as first step, or to diagnose why other tests fail.
- Has conventional criteria to formally accept or reject the data.
- Provides two partial results for both near-pure compositions
  - Those are valid only if there are enough points in the near-pure regions.
- Support for either ideal gas or non-ideal gas EOS.

### Redlich-Kister test

One of the oldest and most well-known tests based on G-D in an integral form.
- Has conventional criteria to formally accept or reject the data.
- Can be reliably used for **isothermal data**.
- For **isobaric data** it is a gross approximation.
  - Should be used **only to reject the data** when result is negative, but has **no meaning** when positive!
- Can only be used when whole range of $x_1$ is covered!

### Herington test

An empirical extension of the Redlich-Kister test.
- **Deprecated**. Use only if you are specifically required to!
- Very similar to Redlich-Kister test.
- No support for isothermal data.

### Slope test

- Evaluates individual points.
- Suitable only for internal research.
  - No conventional criteria are available, only visual inspection of outlying points.
- Very sensitive to random errors (obscures the information on thermodynamic consistency).
  - Particularly prone to errors near edges of measured range.
