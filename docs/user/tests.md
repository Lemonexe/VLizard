## Overview of thermodynamic consistency tests

[Back to User manual](manual.md)

VLizard offers a wide range of tests for checking the thermodynamic consistency of your experimental VLE data.
This is not to be confused with generic _statistical analysis_, which is provided by many other software tools.
On the other hand, thermodynamic _(TD)_ consistency examines compliance of experimental data with fundamental laws of thermodynamics.

Most of these tests are based on the Gibbs-Duhem equation _(G-D)_, which, however, is mathematically difficult to be applied directly in its general form.
A multitude of testing procedures have been proposed by various authors, each using a different approach to simplify or approximate G-D.
That means there can be no single test to guarantee the correctness of your data, but a combination of several tests, each with different scope and limitations, can help you identify systematic errors in your data.

This document covers only practical aspects of individual tests.
Theory is briefly explained in [Theoretical background](test_theory.md) document, but for more detailed information, please refer to literature, such as a comprehensive
[2017 review by J. Wisniak et al.](https://doi.org/10.1016/j.jct.2016.10.038)
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

A simple quick check if the VLE data aligns with vapor pressure models.
Does not check thermodynamic consistency.
- Can be done as first step, or to diagnose why other tests fail.
- Has conventional criteria to formally accept or reject the data.
- Can only be used if there are enough data points near pure compositions!

### Redlich-Kister test

- Has conventional criteria to formally accept or reject the data.
- Can be reliably used for **isothermal data**.
- For **isobaric data** it is a gross approximation.
  - Should be used **only to reject the data** when result is negative, but has **no meaning** when positive!
- Can only be used when whole range of $x_1$ is covered!

### Herington test

- **Deprecated**. Use only if you are specifically required to!
- Similar to Redlich-Kister test.

### Slope test

- Evaluates individual points.
- For internal use only.
  - No conventional criteria at all, only visual inspection of outlying points.
- Very sensitive to random errors, but then gives no information on thermodynamic consistency.
  - Particularly prone to errors near edges of measured range.
