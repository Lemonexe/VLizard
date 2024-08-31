## VLE models

[Back to User manual](manual.md)

Functions of $(\gamma_1, \gamma_2) = \mathrm{f}(x_1, T)$, where $\gamma_i$ is activity coefficient  
$x_1$ is mole fraction of component 1,
$T$ is temperature [K] and $t$ is temperature [°C].

#### Content
1. [Margules](#margules)
2. [van Laar](#van-laar)
3. [NRTL (extended)](#nrtl-extended)
4. [UNIQUAC (extended)](#uniquac-extended)

### Margules

```math
    \ln \gamma_1 = x_2^2 \left( A_{12} + 2 x_1 (A_{21}-A_{12}) \right)
```
```math
    \ln \gamma_2 = x_1^2 \left( A_{21} + 2 x_2 (A_{12}-A_{21}) \right)
```

Both parameters $A_{12}$ and $A_{21}$ are symmetric and dimensionless.

### van Laar

```math
    \ln \gamma_1 = A_{12} \left( \frac{A_{21} x_2}{A_{12} x_1 + A_{21} x_2} \right)^2
```
```math
    \ln \gamma_2 = A_{21} \left( \frac{A_{12} x_1}{A_{12} x_1 + A_{21} x_2} \right)^2
```

Both parameters $A_{12}$ and $A_{21}$ are symmetric and dimensionless.

### NRTL (extended)

The basic NRTL is the same, but with only first 5 parameters $a_{12} a_{21} b_{12} b_{21} c_{12}$, the rest are zero. 

```math
    \ln \gamma_1 = x_2^2 \left( \tau_{21} \left( \frac{G_{21}}{x_1 + x_2 G_{21}} \right)^2 + \frac{\tau_{12} G_{12}}{(x_2 + x_1 G_{12})^2} \right)
```
```math
    \ln \gamma_2 = x_1^2 \left( \tau_{12} \left( \frac{G_{12}}{x_2 + x_1 G_{12}} \right)^2 + \frac{\tau_{21} G_{21}}{(x_1 + x_2 G_{21})^2} \right)
```

Where $G_{ij}$ and $\tau_{ij}$ are intermediately calculated as:
```math
    G_{12} = e^{-\alpha_{12} \tau_{12}}
```
```math
    G_{21} = e^{-\alpha_{21} \tau_{21}}
```
```math
    \tau_{12} = a_{12} + b_{12}/T + e_{12} \ln T + f_{12} T
```
```math
    \tau_{21} = a_{21} + b_{21}/T + e_{21} \ln T + f_{21} T
```
```math
    \alpha_{21} = \alpha_{12} = c_{12} + d_{12} t
```

#### Params table

| _symbol_ | $a_{12}$ | $a_{21}$ | $b_{12}$ | $b_{21}$ | $c_{12}$ | $d_{12}$ | $e_{12}$ | $e_{21}$ | $f_{12}$ | $f_{21}$ |
|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
| _UoM_    | 1        | 1        | K        | K        | 1        | 1/°C     | 1        | 1        | 1/K      | 1/K      |

Note: $c$ and $d$ are symmetric, the rest are not.

### UNIQUAC (extended)

The basic UNIQUAC is the same, but with only first 8 parameters $q_1 q_2 r_1 r_2 a_{12} a_{21} b_{12} b_{21}$, the rest are zero.

```math
    \ln \gamma_1 = \ln \gamma_1^\mathrm{C} + \ln \gamma_1^\mathrm{R}
```
```math
    \ln \gamma_2 = \ln \gamma_2^\mathrm{C} + \ln \gamma_2^\mathrm{R}
```

Where C stands for combinatorial part, and R for residual part:

```math
    \ln \gamma_1^\mathrm{C} = l_1 + \ln J_1 + 5 q_1 \ln \frac{L_1}{J_1} - J_1 \overline{l}
```
```math
    \ln \gamma_2^\mathrm{C} = l_2 + \ln J_2 + 5 q_2 \ln \frac{L_2}{J_2} - J_2 \overline{l}
```

```math
    \ln \gamma_1^\mathrm{R} = q_1 \left( 1 - \ln s_1 - \frac{\theta_1}{s_1} - \frac{\theta_2 \tau_{12}}{s_2} \right)
```
```math
    \ln \gamma_2^\mathrm{R} = q_2 \left( 1 - \ln s_2 - \frac{\theta_1 \tau_{21}}{s_1} - \frac{\theta_2}{s_2} \right)
```

Parameter $q_i$ means dimensionless surface areas, while $r_i$ means numbers of segments (or dimensionless volumes).
Other parameters are binary interaction parameters.
$l_i$ are coordination numbers:
```math
    l_i = 5 (r_i-q_i) + 1 - r_i
```
```math
    \overline{l} = x_1 l_1 + x_2 l_2
```

$\phi_i$ is segment volume fraction, $J_i$ is just without $x_i$ to avoid division by zero when $x_i=0$:
```math
    \phi_i = \frac{ r_i x_i }{ x_1 r_1 + x_2 r_2 }
```
```math
    J_i = \frac{ r_i }{ x_1 r_1 + x_2 r_2 }
```

Same for surface are fraction $\theta_i$ and $L_i$:
```math
    \theta_i = \frac{ q_i x_i }{ x_1 q_1 + x_2 q_2 }
```
```math
    L_i = \frac{ q_i }{ x_1 q_1 + x_2 q_2 }
```

Binary interaction terms are calculated as follows:
```math
    \ln \tau_{12} = a_{12} + b_{12}/T + c_{12} \ln T + d_{12} T + e_{12} T^2
```
```math
    \ln \tau_{21} = a_{21} + b_{21}/T + c_{21} \ln T + d_{21} T + e_{12} T^2
```
```math
    s_1 = \theta_1 + \theta_2 \tau_{21}
```
```math
    s_2 = \theta_1 \tau_{12} + \theta_2
```

#### Params table

| _symbol_ | $q_1$ | $q_2$ | $r_1$ | $r_2$ | $a_{12}$ | $a_{21}$ | $b_{12}$ | $b_{21}$ | $c_{12}$ | $c_{21}$ | $d_{12}$ | $d_{21}$ | $e_{12}$ |
|----------|-------|-------|-------|-------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
| _UoM_    | 1     | 1     | 1     | 1     | 1        | 1        | K        | K        | 1        | 1        | 1/K      | 1/K      | K^-2     |
