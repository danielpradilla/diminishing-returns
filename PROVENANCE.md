# Provenance notes

Sources checked 26 October 2026. These notes record how each plotted series was produced, what was
approximated, and what remains unresolved. The page itself repeats the short version in each expanded
source record.

The PDFs and workbooks in `sources/` are research copies. They are not loaded by the page and are not
part of a deployment. Check the publisher's terms before redistributing them.

## 1. Fuel economy

- **Paper:** Richard P. Larrick and Jack B. Soll (2008), “The MPG Illusion,” *Science* 320(5883):
  1593–1594. <https://pdodds.w3.uvm.edu/files/papers/others/2008/larrick2008a.pdf>
- **Figure:** first-page graph, p. 1593.
- **Reconstruction:** equation. `gallons = 10,000 / MPG`, plotted from 10 to 60 MPG.
- **Checks:** 12→14 MPG saves 119.0 gallons per 10,000 miles; 28→30 saves 23.8; 28→40 saves 107.1.
- **Not plotted:** the framing experiment (25% choosing the efficient option under MPG versus 64% under
  gallons per 100 miles) is reported in the text. It is not a second main chart.
- **Limit:** fixed distance; no engineering cost, upstream emissions or driving behavior.

## 2. Working hours

- **Paper:** John Pencavel (2015), “The Productivity of Working Hours,” *The Economic Journal*
  125(589): 2052–2076. The accessible version used here is the 2014 working paper:
  <https://epflicht.ulb.uni-bonn.de/download/pdf/149173>.
- **Figure/table:** Figure 4, p. 46, and Table 4, column (ii), p. 37 of the working-paper version.
- **Reconstruction:** published coefficients. For weekly hours `H`:

  ```text
  output = 2,900 + 126.089 × (H − 24)                      for H ≤ 49
  output = 2,900 + 126.089 × 25 − 4.533 × (H − 49)²       for H > 49
  ```

  The baseline 2,900 at 24 hours was read from Figure 4. The slope in the second regime is the
  derivative at the 49-hour knot.
- **Checks:** 49 h = 6,052; 56 h = 6,713; 63 h = 6,929; 70 h = 6,701; 72 h = 6,554. The fitted maximum
  is at about 63 hours. Output at 56 and 70 differs by 12 units, or 0.17%.
- **Unresolved:** the four worker-group intercepts are not separately recoverable from the published
  table. The page plots one pooled baseline. The alternative quadratic specification (column i) is
  nearly identical in the source figure and is not separately reconstructed.
- **Limit:** 122 weekly observations from British munitions workers, 1914–1918; the high-hours decline
  is model-dependent.

## 3. Daily steps

- **Paper:** Amanda E. Paluch et al. (2022), “Daily steps and all-cause mortality: a meta-analysis of
  15 international cohorts,” *The Lancet Public Health* 7(3): e219–e228.
  <https://discovery.ucl.ac.uk/id/eprint/10170017/1/1-s2.0-S2468266721003029-main.pdf>
- **Figure:** Figure 3, p. e224.
- **Reconstruction:** digitized figure (approximate). The source PDF was rendered at 300 dpi. Axis
  calibration: hazard ratio 1.0 at pixel row 253.5, 514 pixels per decade on the log y axis; 0 steps at
  column 130.5, 70.44 pixels per 1,000 steps. The blue (≥60) and red (<60) curves were segmented by
  color. Values were sampled at 1,000-step intervals.
- **Reading error:** central line about ±0.02 hazard ratio; band limits about ±0.05. Overlap of the two
  shaded bands makes some limits uncertain where the bands cross. The 0-step endpoints are approximate
  and partly clipped by the published axis. Reference values are set to exactly 1.0 by definition
  (3,000 steps for ≥60, 5,000 for <60).
- **Unresolved:** meta-level data and code require an approved request and were not obtained.
- **Limit:** observational association; residual confounding, reverse causality and device differences
  remain possible.

## 4. Practice and retention

- **Paper:** Doug Rohrer and Kelli Taylor (2006), “The Effects of Overlearning and Distributed Practice
  on the Retention of Mathematics Knowledge,” *Applied Cognitive Psychology* 20(9): 1209–1224.
  <https://files.eric.ed.gov/fulltext/ED505642.pdf>
- **Figure:** Figure 1D, p. 13 of the ERIC version (Experiment 2).
- **Reconstruction:** the means are the printed labels 69%, 67%, 28%, 27%. The paper does not print the
  standard errors, so they were read from the error-bar caps at 400 dpi: approximately 7.0, 7.5, 7.0
  and 7.3 percentage points. These are approximate and should not be treated as exact.
- **Checks:** 100 students began Experiment 2; 88 were analyzed after excluding scores of 0 or 1 on the
  initial three problems. The spacing comparison cited in the text (64% versus 32% at four weeks) is
  from Experiment 1, Figure 1B, and is not plotted.
- **Limit:** one mathematical procedure and an undergraduate sample. A nonsignificant difference does
  not establish equivalence.

## 5. Protein and resistance training

- **Paper:** Robert W. Morton et al. (2018), “A systematic review, meta-analysis and meta-regression of
  the effect of protein supplementation on resistance training-induced gains in muscle mass and strength
  in healthy adults,” *British Journal of Sports Medicine* 52(6): 376–384.
  <https://breathe-edu-downloads.s3.amazonaws.com/Morton-2018.pdf>
- **Figure:** Figure 5, p. 376.
- **Reconstruction:** the scatter is an approximate digitization of the visible open circles at 400 dpi.
  Axis calibration: x = 0.8 at column 570.5, 610 pixels per g/kg/day; y = 0 at row 543, 114 pixels per
  kg. 39 of the 42 arms are separately visible; overlapping circles cannot be separated. Reading error
  about ±0.01 g/kg/day horizontally and ±0.05 kg vertically.
- **Published fit:** segmental linear regression with slope 1.75, R² 0.19, df 36, breakpoint 1.62 g/kg/day
  (95% CI 1.03–2.20), p = 0.079. The plotted line is
  `−1.235 + 1.75 × min(protein, 1.62)`, with the intercept calibrated so the flat segment sits at about
  1.60 kg in Figure 5.
- **Not plotted:** the review's overall supplementation effect (0.30 kg FFM, 95% CI 0.09–0.52) is a
  separate result and is described in the text.
- **Limit:** the breakpoint is model-based and not statistically significant at 0.05. It is not a
  universal ceiling or an individual prescription.

## 6. Income and well-being

- **Paper:** Matthew A. Killingsworth, Daniel Kahneman and Barbara Mellers (2023), “Income and emotional
  well-being: A conflict resolved,” *PNAS* 120(10): e2208661120.
  <https://www.pnas.org/doi/10.1073/pnas.2208661120>
- **Data:** OSF project `qye4a`, file `Income_and_emotional_wellbeing_a_conflict_resolved.csv`,
  33,391 person-level rows. <https://osf.io/qye4a/>
- **Reconstruction:** published data. Income categories are the 15 midpoints in the file
  ($15,000 through $625,000). For each category, the 15th, 30th, 50th, 70th and 85th percentiles of the
  person-level `wellbeing` variable were computed with linear interpolation.
- **Checks:** the 15th percentile rises from 48.76 at $15,000 to 52.09 at $95,000 and 52.59 at $625,000.
  The 85th rises from 73.98 to 76.06 and 78.47 over the same points. Published piecewise slopes
  (Table 1): 15th 1.90 below $100k and 0.34 above; 85th 0.78 and 1.99.
- **Display difference:** the published Figure 2 uses five stacked panels, a log income axis, and
  piecewise quantile regressions. This page plots the category quantiles in one panel, starts with
  linear dollar spacing, and reports the slopes in the dialog. Values are the category quantiles, not
  a re-estimated quantile regression. Switching to log dollars changes the display only.
- **Related reading:** a later reanalysis finds a higher plateau under different breakpoint assumptions:
  <https://arxiv.org/html/2401.05347v2>.
- **Limit:** observational, cross-sectional, selected employed sample, historical dollars, weak overall
  association; no causal claim.

## 7. Nitrogen fertilizer

- **Paper:** Mitchell E. Baum et al. (2025), “The optimum nitrogen fertilizer rate for maize in the US
  Midwest is increasing,” *Nature Communications* 16: 404.
  <https://www.nature.com/articles/s41467-024-55314-7>
- **Data:** Source Data workbook on Zenodo record 14037090, tab “Fig 5” (379 rows):
  <https://zenodo.org/records/14037090>.
- **Reconstruction:** published data and recomputed OLS quadratics by rotation. `x` = EONR − EnvONR
  (kg N/ha); `y` = `pct_yield`, the percentage yield change at the environmental optimum relative to the
  economic optimum (negative = loss).
- **Fits:** continuous maize `y = 0.235968 − 0.144720x − 0.00047274x²`, n = 189, R² = 0.837; maize–soybean
  `y = 0.266877 − 0.100217x − 0.00023550x²`, n = 190, R² = 0.884. These reproduce the published rounded
  coefficients (−0.0005, −0.14, 0.24 and −0.0002, −0.10, 0.27). Bands are 95% confidence intervals for
  the mean response.
- **Checks:** a 100 kg N/ha reduction gives −18.96% in continuous maize and −12.11% in maize–soybean;
  the first 50 kg/ha costs 7.9% and the second 50 another 10.8% in continuous maize.
- **Limit:** the environmental optimum depends partly on simulated nitrogen losses and assigned costs;
  weather, location and rotation change the field-level optimum. The quadratics are descriptive.

## 8. Parallel computing

- **Paper:** Gene M. Amdahl (1967), “Validity of the Single Processor Approach to Achieving Large Scale
  Computing Capabilities,” *AFIPS Conference Proceedings* 30: 483–485.
  <https://www.cs.cmu.edu/~18742/papers/Amdahl1967.pdf>
- **Reconstruction:** equation. `speedup(N, s) = 1 / (s + (1 − s)/N)`. Default `s = 0.10`, `N = 1..100`.
  At `s = 0.10`: 10 processors = 5.26×, 100 = 9.17×, limit = 10×. The control allows `s = 0.05..0.50`.
- **Note:** this is a new explanatory reconstruction of the conventional law, not a reproduction of the
  1967 paper's Figure 1, which plots the fraction of instructions that permit parallelism.
- **Limit:** theoretical; fixed workload, ideal parallelization, no communication or scheduling overhead.
  The serial fraction is illustrative.

## 9. AI training

- **Paper:** Jared Kaplan et al. (2020), “Scaling Laws for Neural Language Models,” arXiv:2001.08361v1.
  <https://arxiv.org/html/2001.08361v1>
- **Figure/equation:** Equation 1.3 and Figure 13.
- **Reconstruction:** equation. `L(C_min) = (3.1×10⁸ / C_min)^0.050`, with `C_min` in PF-days. Plotted
  from 10⁻⁸ to 1 PF-day. The curve is a published fit, not experimental scatter.
- **Checks:** each doubling multiplies loss by `2^−0.050 = 0.966`, a 3.4% reduction. At 1 PF-day the fit
  gives 2.658; at 0.5 PF-day, 2.721.
- **Version detail:** the adjusted fit drawn in the paper's Figure 13 uses `C_c = 2.3×10⁸` rather than
  the Equation 1.3 value `3.1×10⁸`. The difference in loss is about 1.5% (`(3.1/2.3)^0.050`). The
  optional linear compute view changes the x-axis display only; the values and domain are unchanged.
- **Limit:** loss is not usefulness or economic value; the fit is historical and conditional on the
  paper's models, data and training assumptions; `C_min` is adjusted compute, not wall-clock time.

## 10. Research productivity

- **Paper:** Nicholas Bloom, Charles I. Jones, John Van Reenen and Michael Webb (2020), “Are Ideas
  Getting Harder to Find?,” *American Economic Review* 110(4): 1104–1144.
  <https://web.stanford.edu/~chadj/IdeaPF.pdf>
- **Figure/table:** Figure 4, p. 1118; Table 1 baseline.
- **Reconstruction:** the green effective-researcher series was digitized from Figure 4 at 300 dpi at
  one-year intervals. Calibration: 1970 at column 71.5, 2015 at column 1083; factor 0 at row 664.5,
  factor 20 at row 70. Reading error about ±0.1 on the index. Endpoint 18.14, consistent with the
  paper's 18-fold statement. Table 1 gives −6.8% per year and a 10.3-year half-life.
- **Growth panel:** the paper's Figure 4 draws the chip-density growth rate as a constant 35% line, not
  as annual observations. The page reproduces that constant and labels it. The source figure uses dual
  y axes; the page splits the two series into stacked panels sharing a time axis, so no panel carries
  two y axes.
- **Data/code:** replication package at
  <https://www.openicpsr.org/openicpsr/project/111743/version/V2/view>.
- **Limit:** effective researchers are estimated by deflating R&D spending by high-skilled wages, not by
  counting people. The result is not the causal marginal effect of hiring one more scientist.

## Global checks

- All ten entries appear in the specified order and have one main chart.
- Every numeric claim is tied to an equation, a published coefficient, a published data file or a
  recorded digitization.
- Confidence intervals or standard errors are preserved where the source reports them. Where the source
  does not report uncertainty, none is drawn.
- The page has no publisher requests at runtime and no embedded publisher figures.
- Browser checks on 26 October 2026: 1440 × 900 and 390 × 844, no JavaScript errors, no page-wide
  horizontal overflow, dialog focus and Escape behavior verified, deep links verified.
