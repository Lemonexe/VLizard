## Theoretical background for thermodynamic consistency tests

[Back to User manual](manual.md)

This is just quick reference for the theoretical background of testing procedures.
See [Overview](tests.md) document for practical aspects of the tests.
For more detailed theoretical explanation, please refer to literature, such as a comprehensive
[2017 review by J. Wisniak et al.](https://doi.org/10.1016/j.jct.2016.10.038)
Alternatively, see [all literary sources](../references.md) for VLizard.

### Basis

The Gibbs-Duhem equation _(G-D)_ is used for most of the tests.
This is the most general form:
```math
    \sum_i x_i \mathrm{d} \ln \gamma_i = \frac{V_m^\mathrm{E}}{R T} \mathrm{d} p - \frac{H_m^\mathrm{E}}{R T^2} \mathrm{d} T
```

We can use definition of excess Gibbs energy in dimensionless form (divided by $RT$), and enumerate for binary system:
```math
    \mathrm{d} g^\mathrm{E} = \frac{V_m^\mathrm{E}}{R T} \mathrm{d} p - \frac{H_m^\mathrm{E}}{R T^2} \mathrm{d} T + \ln \frac{\gamma_1}{\gamma_2} \mathrm{d} x_1
```

### Fredenslund test

The idea here is that VLE data ($p$, $T$, $x$, $y$) together with vapor pressure models is an overdetermined system in its nature.
In Fredenslund test, the data is fitted with a model, but not directly – the data is first reduced using $g^\mathrm{E}$.
The model is then following:

```math
    g^\mathrm{E} = x_1 (1 - x_1) \sum_{k=0}^n a_k L_k(x_1)
```
Where $L_k$ is the Legendre polynomial of order $k$ (see [wikipedia](https://en.wikipedia.org/wiki/Legendre_polynomials\#Shifted_Legendre_polynomials)).

You may choose $n$, the number of polynomials (model params):
- $n=4$ **most usually**
- $n=3$ if you have very few data points
- $n=5$ if you expect highly non-ideal system and have many data points.

This model has no thermodynamic meaning, but suitable mathematical properties for the analysis _(orthogonality)_.

Using the $g^\mathrm{E}$ calculated from model, the activity coefficients are recalculated as:
```math
    \ln \gamma_1^\mathrm{cal} = g^\mathrm{E}_\mathrm{cal} + x_2 \tfrac{\mathrm{d} g^\mathrm{E}_\mathrm{cal}}{\mathrm{d} x_1}
```
```math
    \ln \gamma_2^\mathrm{cal} = g^\mathrm{E}_\mathrm{cal} - x_1 \tfrac{\mathrm{d} g^\mathrm{E}_\mathrm{cal}}{\mathrm{d} x_1}
```

$p$ and $y_1$ are then calculated using Raoult-Dalton's Law.

Then, the residuals between calculated and experimental values of $p$ and $y_1$ are evaluated.

Finally, following metrics are calculated _(average relative, resp. absolute error)_: 

```math
    \overline{\delta p} = \sum_{j=1}^N \frac{1}{N} \frac{|p_j^\mathrm{exp} - p_j^\mathrm{cal}|}{p_j^\mathrm{exp}}
```

```math
    \overline{\Delta y_1} = \sum_{j=1}^N \frac{1}{N} |y_j^\mathrm{exp} - y_j^\mathrm{cal}|
```

The same is done for $y_2$ as for $y_1$.

All must be within acceptable limits, which is 1 %.

### van Ness test

By deriving $g^\mathrm{E}$ and substituting G-D we get:

```math
    \frac{\mathrm{d} g^\mathrm{E}}{\mathrm{d} x_1} = \ln \frac{\gamma_1}{\gamma_2}
```

The idea of van Ness test is to subtract that equation for `calculated - experimental`, like this:

```math
    \frac{\mathrm{d} g^\mathrm{E}_\mathrm{cal}}{\mathrm{d} x_1} - \frac{\mathrm{d} g^\mathrm{E}_\mathrm{exp}}{\mathrm{d} x_1} = \ln \frac{\gamma_1^\mathrm{cal}}{\gamma_2^\mathrm{cal}} - \ln \frac{\gamma_1^\mathrm{exp}}{\gamma_2^\mathrm{exp}}
```

The left-side is zero – but only if the model was fitted for $\gamma$ or $g^\mathrm{E}$.
That means when the residual function, which was optimized to zero, is calculated using residuals of those.
You may use a model fitted in VLizard, which uses $\gamma$ for optimization.

⚠ You may use model params obtained elsewhere, but **do not** use such model for van Ness test, if it was optimized for $T$, $x$ or $y$!  
It will make the test mathematically invalid.

The left-side should be zero, so a residual from zero can be calculated:

```math
    \Delta_j = \ln \frac{\gamma_{1j}^\mathrm{cal}}{\gamma_{2j}^\mathrm{cal}} - \ln \frac{\gamma_{1j}^\mathrm{exp}}{\gamma_{2j}^\mathrm{exp}}
```

Finally, the root mean square of the residuals is calculated:

```math
    RMS = \sqrt{ \tfrac{1}{n} \textstyle\sum_j^n \Delta_j^2 }
```

Instead of a single threshold to formally accept or reject the data, the van Ness test assigns a conventional index from 1 to 10, where 1 is perfect, 5 is doubtful and 10 is unacceptable, for a more nuanced evaluation.

### Gamma offset test

The gamma offset test does examine thermodynamic consistency, though not using G-D, but only the _definition of activity_.  
The activity coefficients must always be 1 for pure components, so it is just a simple check to see if $\gamma_i(x_i = 1) = 1$.  
If that's not the case, then the VLE data does not align with the vapor pressure models for pure components.

A modified van Laar equation is used, which includes the error, or "offset" parameter $E_i$:

```math
    \ln \gamma_1 = A_{12} \left(\frac{A_{21} x_2}{A_{12} x_1 + A_{21} x_2}\right)^2 + E_1
```
```math
    \ln \gamma_2 = A_{21} \left(\frac{A_{12} x_1}{A_{12} x_1 + A_{21} x_2}\right)^2 + E_2
```

Both residuals are respectively weighted by $x_1$, $x_2$, so that both $E_1$ and $E_2$ are biased towards the pure regions, and accurately reflect them.

Conventional criterion is then used to formally accept or reject the data: $\Delta \gamma_i < 1.5 %$, where $\Delta \gamma_i = \delta \gamma_i = e^{E_i} - 1$.

### Redlich-Kister test

This test uses G-D in integral form, while disregarding $V_m^\mathrm{E}$ and $H_m^\mathrm{E}$ (the pressure and temperature dependence):

```math
    \int_{x_1=0}^{x_1=1} \ln \frac{\gamma_1}{\gamma_2} \mathrm{d} x_1 = 0
```

The curve $\ln \gamma_1 / \gamma_2$ forms two areas $A$ and $B$, one above and one below the x-axis.  
This is why Redlich-Kister & Herington tests are also generally called _"area tests"_.

Conventional criterion is used to formally accept or reject the data: $D < 10$.

```math
    D = 100 \frac{|A - B|}{A+B}
```

Usually, $V_m^\mathrm{E}$ is very small, so for isothermal data, the test is reliable.

But $H_m^\mathrm{E}$ is usually not negligible, so for isobaric data, the test is a gross approximation.

That's why it should be used only to reject the data when result is negative, but it has no meaning when positive, as per J. Wisniak.

### Herington test

A variation of Redlich-Kister test for isobaric data, which aims to replace the temperature dependence with an empirical parameter: 

```math
    J = 150 \frac{T_\mathrm{max} - T_\mathrm{min}}{T_\mathrm{min}}
```

The conventional criterion is then $|D-J| < 10$.

Empirical parameter $J$ is not theoretically founded, and according to J. Wisniak, many systems do not conform to it.
The test is therefore deprecated. 

### Slope test

At first glance, this is the most mathematically straightforward test.
Just like the Redlich-Kister test, the pressure and temperature dependence is disregarded.
G-D is used in _derived_ form:

```math
    x_1 \frac{\mathrm{d} \ln \gamma_1}{\mathrm{d} x_1} + x_2 \frac{\mathrm{d} \ln \gamma_2}{\mathrm{d} x_1} = 0
```

For each point the residual from zero is calculated.
Outlying points with particularly high residuals are then considered suspicious, but no formal criterion has been established.

However, the apparent simplicity is deceptive – problem lies in numerical calculation of the derivatives, which is generally unreliable, and makes the test seldom usable.
VLizard uses a derivation formula using _all_ points from the non-equidistant grid, which helps smooth out the sensitivity to random error, but it is often still too noisy to give meaningful information on thermodynamic consistency.
