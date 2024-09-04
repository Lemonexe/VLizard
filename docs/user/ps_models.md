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

The basic Antoine is the same, but with only first 3 parameters $A B C$, the rest are zero.

#### Params table

|       | $A$    | $B$      | $C$ | $D$ | $E$           | $F$           | $G$ |
|-------|--------|----------|-----|-----|---------------|---------------|-----|
| _UoM_ | ln kPa | ln kPa·K | K   | 1/K | ln kPa / ln K | ln kPa · K^-G | 1   |

#### Antoine parameters conversion

When importing parameters from external source, it is imperative to carefully check the formula they use!  
Unfortunately, there is no single convention for the equation format, so here's how to transform the $A,B,C$ parameters for the most common variants of basic Antoine.
The extended form complies with Aspen Plus, different variants might be incompatible.

- If $B$ or $C$ are presented with a minus sign in the formula, switch their sign accordingly.
- In case of different log base ( $\log_{10} p = A' + B'/(T + C)$ ):
  - $A = A' \cdot \ln 10$
  - $B = B' \cdot \ln 10$
  - $C$ is identical
- In case of different pressure units, for example [Pa]:
  - $A = A' + \ln 1000$
    - For different UoM, substitute $\mathrm{kPa}/\mathrm{UoM}$ for 1000
  - $B$ is identical
  - $C$ is identical
- In case of different temperature units, for example [°C]:
  - $A$ is identical
  - $B$ is identical
  - $C = C' + 273.15$ 


### Wagner

```math
    \ln p = \ln p_c + \frac{A \tau + B \tau^{1.5} + C \tau^{2.5} + D \tau^5}{1-\tau}
```

Where $\tau = 1 - T/T_c$.  
Note that $p_c$ is critical pressure [kPa] and $T_c$ is critical temperature [K].  
Those **must** be provided, and won't be optimized.

#### Params table

| _symbol_ | $A$ | $B$ | $C$ | $D$ | $p_c$ | $T_c$ |
|----------|-----|-----|-----|-----|-------|-------|
| _UoM_    | 1   | 1   | 1   | 1   | kPa   | K     |
