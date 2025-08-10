## Vapor pressure models

[Back to User manual](manual.md)

Functions of $p=\mathrm{f}(T)$  
where $p$ is vapor pressure [kPa] and $T$ is temperature [K].

#### Content
1. [Antoine](#antoine-extended)
2. [Wagner](#wagner)

### Antoine (extended)

```math
    \ln p = A + \frac{B}{T + C} + D T + E \ln T + F T^G
```

The basic Antoine is the same, but with only first 3 parameters $A,B,C$, the rest are zero.

#### Params table

|       | $A$    | $B$      | $C$ | $D$ | $E$           | $F$           | $G$ |
|-------|--------|----------|-----|-----|---------------|---------------|-----|
| _UoM_ | ln kPa | ln kPa·K | K   | 1/K | ln kPa / ln K | ln kPa · K^-G | 1   |

#### Antoine parameters conversion

When importing parameters from external source, it is imperative to carefully check the formula they use!  
Unfortunately, there is no single convention for the equation format, various software and literature sources use different definitions.
Therefore, a guide on the most common $A,B,C$ parameter transformations might come in handy.  
Only the basic parameters are covered; the extended form complies with Aspen Plus v14.5, and you'd have to transform the $D,E,F,G$ parameters yourself if it is in different format.

Examples of common transformations:

- $\ln (p/\mathrm{kPa}) = A + B/(t + C')$  
  (temperature in [°C])
  - $A = A$
  - $B = B$
  - $C = C' + 273.15$
- If $B$ or $C$ are presented with a minus sign in the formula, just switch their sign accordingly.
- $\log_{10} (p/\mathrm{kPa}) = A' + B'/(T + C)$  
  (different log base, in this case 10)
  - $A = A' \cdot \ln 10$
  - $B = B' \cdot \ln 10$
  - $C = C$
- $\ln (p/\mathrm{Pa}) = A' + B/(T + C)$  
  (pressure in [Pa])
  - $A = A' + \ln 0.001$ 
    - Note: in this case $0.001 = \mathrm{UoM}/\mathrm{kPa}$
  - $B = B$
  - $C = C$

If multiple transformations are needed, apply them in the order as listed above. For example:
- $\log_{10} (p/\mathrm{bar}) = A' + B'/(T + C)$
  - $A = A' \cdot \ln 10 + \ln 100$
  - $B = B' \cdot \ln 10 + \ln 100$
  - $C = C$

### Wagner

```math
    \ln p = \ln p_c + \frac{A \tau + B \tau^{1.5} + C \tau^{2.5} + D \tau^5}{1-\tau}
```

Where $\tau = 1 - T/T_c$.  
Note that $p_c$ is critical pressure [kPa] and $T_c$ is critical temperature [K].  
If you want to use parameter optimization on experimental data, the critical values **must** be provided and won't be optimized.

#### Params table

|          | $A$ | $B$ | $C$ | $D$ | $p_c$ | $T_c$ |
|----------|-----|-----|-----|-----|-------|-------|
| _UoM_    | 1   | 1   | 1   | 1   | kPa   | K     |
