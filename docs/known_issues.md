# Unresolved known issues

## NRTL shooting off to infinity

Tabulation of gamma1(x1=0) or gamma2(x2=0) for NRTL regression sometimes shoots off to infinity for some reason.  
Can be replicated with NRTL on CHOL-CHF, 10kPa, 25kPa, 40kPa

**Params:**

| a_12 | a_21 | b_12 | b_21 | c_12 |
|------|------|------|------|------|
| -2.3 | 4.5  | 1103 | 7907 | 0.3  |

**Const params:** a_21, c_12

High a_21 is the culprit: 4 is good, but >= 4.5 breaks.  
This was found because the regression naturally found a_21 = 28 xD
