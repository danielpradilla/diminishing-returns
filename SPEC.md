# A Gallery of Diminishing Returns

## Assignment

Build a single-page gallery called **A Gallery of Diminishing Returns**, with the subtitle **When is good good enough?**

The gallery uses ten research-backed examples to help people understand what the next increment of time, money, effort, or resources buys them. Each entry has one main chart, a short explanation, and a link to the paper. Clicking the chart opens a larger view with supporting detail.

Implement the page and reconstruct its charts. This document is the build brief, not a request for another proposal. Use English. Build locally and provide a working preview; deployment is outside this assignment unless separately requested.

## Design references

Use the **danielpradilla-app-style** skill. Read its current `SKILL.md` before implementation. On Daniel's machine it is exposed at:

`/Users/dpradilla/.codex/skills/danielpradilla-app-style/SKILL.md`

Canonical references:

- `/Users/dpradilla/dev/danielpradilla-app-style/GUIDE.md`
- `/Users/dpradilla/dev/danielpradilla-app-style/styles.css`
- `/Users/dpradilla/dev/danielpradilla-app-style/index.html`
- The skill's `references/house-style.md`.

Honor the actual current references if they differ from the summary below. If unavailable, use these captured defaults and report the missing reference:

| Element | Direction |
| --- | --- |
| Page background | `rgb(255, 253, 249)` |
| Primary text | `#000000` |
| Supporting text | `#39414d` |
| Secondary text | `#6d6d6d` |
| Rules | `#d1d1d1`; subtle rules `#e5e5e5` |
| Main blue | `#2f5f7f` |
| Pale blue | `#d1dfe4` |
| Warning | `#7a6100` |
| Negative outcome | `#a12a2a` |
| Typography | System sans, light headings, normal letter spacing |
| Shapes | Square panels and controls, hairline borders |
| Layout | Compact, calm, readable; no shadows or decorative gradients |

Charts are the content. Avoid a large marketing hero, stock imagery, ornamental illustrations, nested cards, oversized metrics, or pill-shaped badges. Use comfortable body-text weight and sufficient contrast even where headings are light.

## Editorial premise

Suggested introduction:

> More can help. But the next hour, dollar, or unit of effort often buys less than the last. These studies show where gains shrink, where they flatten, and why deciding when to stop depends on what you value.

Distinguish these concepts in the writing:

- **Diminishing gains:** the outcome continues improving, but each equal increment of input produces less improvement.
- **Plateau:** additional improvement is small or difficult to distinguish from uncertainty.
- **Reversal:** additional input worsens the measured outcome.
- **Cost-dependent optimum:** a stopping point depends on prices, costs, goals, or alternatives.

Do not imply that every example establishes a universal threshold. A curve's visual bend alone does not establish an optimum. For some entries, the honest answer is “No single stopping point established.”

Research productivity over time, theoretical bottlenecks, and experimental comparisons are related examples, but are not interchangeable estimates of a marginal production function. Explain each on its own terms.

## Page and entry structure

Use one scrolling page with a compact title and introduction, followed by ten entries in the order below. Use two columns on desktop and one on mobile, with a maximum content width around 1280–1440 px. Show actual gallery content in the first desktop viewport. Do not add search, pagination, accounts, or category filters for ten entries.

Each entry contains:

1. A short title communicating the finding.
2. A sentence naming the input and measured outcome.
3. One prominent chart with readable axes and units.
4. A concrete comparison or annotation explaining the diminishing gain.
5. A short, visible qualification.
6. Authors, year, study type, and a separate **Read the paper** link.
7. An accessible **Enlarge chart** action, also available by clicking the chart.

Use the same chart renderer and data for the thumbnail and expanded version. Additional detail can appear at the larger size, but values must not change.

### Expanded view

Use an accessible dialog, nearly full-screen on mobile. Include:

- The enlarged chart and its title.
- A short explanation of the finding and why it matters.
- Study population, setting, and method.
- The important limitation and what the study does not establish.
- Full paper title and citation.
- Links to the paper and data when available.
- Original figure/table/equation reference and reconstruction method.
- Only the optional controls specified for that entry.

Provide a visible close button, Escape dismissal, focus containment, focus restoration, and preserved page scroll. Essential information must not require hover. Tooltips, if used, must work with touch and keyboard.

Give every entry a stable fragment URL such as `#fuel-economy`. Direct links should at least scroll to the corresponding entry. Do not require a router just for fragments.

## Chart rules

- Use SVG for crisp scaling. Reuse the existing chart library if the project already has one; otherwise choose the smallest suitable implementation.
- One finding per chart. Direct labels are preferable to legends when readable.
- Label units, outcome direction, reference groups, and non-linear scales explicitly.
- Use blue for the principal relationship, gray for comparisons, and light bands for uncertainty. Do not use color alone to identify series.
- Preserve confidence intervals or standard errors and label which they are. Do not convert one to the other silently.
- Distinguish measurements, fitted curves, and theoretical calculations in both the chart caption and source record.
- Do not invent data points, confidence bands, participant observations, or an “optimal” threshold.
- Do not extrapolate beyond the supported range without an explicit label and justification.
- Do not draw a smooth dose-response curve through two experimental conditions.
- Explain changes to the original axis scale. Do not transform hazard ratios into absolute risk reductions.
- Where supported, annotate two equal input increments to show unequal gains. Do not force this device onto unsuitable studies.
- Make charts understandable without animation. Respect reduced-motion preferences.
- Include accessible chart descriptions and a compact data table or equivalent text alternative.

## Source and reconstruction workflow

The paper selection below has been researched, but the chart datasets have not yet been extracted or independently reproduced. Verify each source and exact figure version before implementation.

Use this order of preference:

1. Public data and analysis code.
2. Published numerical tables and equations.
3. Coordinates digitized from the published figure, labelled approximate.

When digitizing, calibrate the actual axis scales, preserve the observed domain, and compare the reconstructed plot against the original. Record the method and limitations. Do not invent uncertainty if it cannot be recovered.

If a source is inaccessible, try an author or institutional copy. If faithful reconstruction remains impossible, report that entry as blocked rather than substitute a plausible-looking curve. Complete the other entries.

Replot numerical evidence with attribution; do not simply recolor screenshots. Check relevant data and figure reuse terms, particularly before adapting an existing graphic. Keep the source version and any reuse restrictions in the provenance record.

## The ten entries

### 1. Fuel economy

**Suggested title:** The same MPG gain saves less fuel later

- **Paper:** Richard P. Larrick and Jack B. Soll (2008), *The MPG Illusion*, Science.
- **Source:** https://pdodds.w3.uvm.edu/files/papers/others/2008/larrick2008a.pdf
- **Study type:** Behavioral experiments plus an exact arithmetic relationship.
- **Main chart:** First-page fuel-consumption graph. X: miles per US gallon. Y: US gallons consumed over 10,000 miles.
- **Data:** Calculate `10000 / mpg` over the source's range, approximately 10–60 MPG. Label this as a calculation, not experimental observations.
- **Annotation:** 12→14 MPG saves about 119 gallons; 28→40 MPG saves about 107 gallons over the same distance.
- **Human misunderstanding:** In the framing experiment, correct choices increased from 25% to 64% when gallons-per-distance information was added. Explain this in text rather than adding a second main chart.
- **Qualification:** Fixed driving distance; this does not measure the engineering cost of increasing MPG.
- **Optional interaction:** Select starting and ending MPG to calculate fuel saved, within the displayed range.

### 2. Working hours

**Suggested title:** Extra hours stop producing proportional output

- **Paper:** John Pencavel (2015), *The Productivity of Working Hours*, The Economic Journal.
- **Accessible 2014 working-paper version:** https://epflicht.ulb.uni-bonn.de/download/pdf/149173
- **Study type:** Historical observational production data.
- **Main chart:** Figure 4 in that working-paper version: weekly hours against fitted weekly output.
- **Data:** Reconstruct from the spline specification and Table 4 coefficients, verifying the output baseline and worker-group intercept. Keep figure numbering tied to the version actually used.
- **Finding:** In this analysis, output rises approximately proportionally below 49 hours, then at a decreasing rate. Fitted output at 70 hours differs little from output at 56.
- **Qualification:** British munitions workers, largely women; not a universal modern office-work threshold. The high-hours downturn is model-dependent.
- **Annotation:** Compare 56 and 70 hours without presenting either as a general recommended workweek.

### 3. Daily steps

**Suggested title:** The mortality association flattens at higher step counts

- **Paper:** Amanda E. Paluch et al. (2022), *Daily steps and all-cause mortality: a meta-analysis of 15 international cohorts*, The Lancet Public Health.
- **Source:** https://discovery.ucl.ac.uk/id/eprint/10170017/1/1-s2.0-S2468266721003029-main.pdf
- **Study type:** Meta-analysis of observational cohorts; 47,471 adults and 3,013 deaths.
- **Main chart:** Figure 3. X: steps/day. Y: adjusted mortality hazard ratio with 95% confidence bands.
- **Finding:** Flattening around 6,000–8,000 steps for adults ≥60 and 8,000–10,000 for younger adults.
- **Important axis detail:** The original uses a logarithmic Y axis and different reference counts: 3,000 steps for the older group and 5,000 for the younger group. Preserve and explain these references.
- **Interaction:** Switch between the age groups; show one group at a time by default to avoid misleading comparisons of curve heights.
- **Data:** Meta-level data/code require an approved request. Use disclosed approximate digitization if public numerical data cannot be found. Do not contact authors without authorization.
- **Qualification:** Association, not causal proof; residual confounding and reverse causality remain possible. Mortality is only one health outcome.
- **Related reading:** https://www.sciencedirect.com/science/article/pii/S2468266725001641

### 4. Practice and retention

**Suggested title:** Extra practice in one sitting did not improve later recall

- **Paper:** Doug Rohrer and Kelli Taylor (2006), *The Effects of Overlearning and Distributed Practice on the Retention of Mathematics Knowledge*, Applied Cognitive Psychology.
- **Source:** https://files.eric.ed.gov/fulltext/ED505642.pdf
- **Study type:** Randomized learning experiments; 216 students across two experiments.
- **Main chart:** Figure 1D, the second experiment: test accuracy after one and four weeks, comparing three versus nine practice problems.
- **Data:** Published means and standard errors. Verify group assignments against the original figure before transcription.
- **Presentation:** Grouped points and error bars; categorical experimental conditions, not an invented continuous learning curve.
- **Finding:** No statistically detectable retention advantage from the extra immediate practice in this experiment.
- **Qualification:** A specific mathematical procedure and student sample. A nonsignificant difference does not establish equivalence or a universal three-repetition rule.
- **Supporting text:** The separate spacing experiment illustrates that changing when practice happens can matter more than adding repetitions immediately.

### 5. Protein and resistance training

**Suggested title:** The protein plateau is an estimate, not a hard ceiling

- **Paper:** Robert W. Morton et al. (2018), *A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength in healthy adults*, British Journal of Sports Medicine.
- **Source:** https://breathe-edu-downloads.s3.amazonaws.com/Morton-2018.pdf
- **DOI:** https://doi.org/10.1136/bjsports-2017-097608
- **Study type:** Review of 49 trials/1,863 participants; breakpoint analysis of 42 study arms/723 participants.
- **Main chart:** Figure 5. X: total protein intake, g/kg body mass/day. Y: change in fat-free mass, kg.
- **Data:** Manuscript and supplements; otherwise disclosed digitization. Retain study-arm scatter and fitted relationship.
- **Finding:** Estimated breakpoint 1.62 g/kg/day, with 95% interval 1.03–2.20.
- **Required visible qualification:** The breakpoint analysis reports p = 0.079. Do not present 1.62 as a statistically established universal ceiling or individual dietary prescription.
- **Annotation:** Show the broad breakpoint interval. Do not imply the entire review rests on this one analysis.

### 6. Income and well-being

**Suggested title:** Smaller gains per dollar do not imply one happiness ceiling

- **Paper:** Matthew A. Killingsworth, Daniel Kahneman, and Barbara Mellers (2023), *Income and emotional well-being: A conflict resolved*, PNAS.
- **Source:** https://www.pnas.org/doi/10.1073/pnas.2208661120
- **Data:** https://osf.io/qye4a/
- **Study type:** Observational experience-sampling reanalysis; 33,391 employed US adults.
- **Main chart:** Figure 2, well-being quantiles across annual pre-tax household income categories.
- **Interaction:** Linear/logarithmic income toggle. Start with linear dollar spacing; explain that this changes the display, not the fitted model or data.
- **Finding:** The overall relationship rises approximately with log income. Flattening above about $100,000 appears in the least-happy portion of the distribution, while other portions continue rising.
- **Qualification:** Selective sample, weak overall association, historical dollar values, no causal claim about an individual's pay rise. Quantile curves are not longitudinal trajectories of fixed groups of people.
- **Required related-reading note:** A later reanalysis changes the breakpoint assumptions and finds evidence of a higher plateau: https://arxiv.org/html/2401.05347v2

### 7. Nitrogen fertilizer

**Suggested title:** Deeper fertilizer cuts cost progressively more yield

- **Paper:** Mitchell E. Baum et al. (2025), *The optimum nitrogen fertilizer rate for maize in the US Midwest is increasing*, Nature Communications.
- **Source:** https://www.nature.com/articles/s41467-024-55314-7
- **Data/code repository cited by authors:** https://doi.org/10.5281/zenodo.14037090
- **Study type:** Field-experiment synthesis and modelling; 379 long-term and 176 short-term cases.
- **Main chart:** Figure 5. X: nitrogen reduction from the economic toward the environmental optimum, kg N/ha. Y: grain yield loss, percent. Identify the crop rotations and preserve uncertainty.
- **Data:** Inspect the repository before claiming reconstruction from raw data; its contents have not yet been verified for this build.
- **Explanation:** This displays diminishing returns in reverse: deeper cuts sacrifice progressively more yield. Maximum yield, maximum farm profit, and an optimum including environmental costs are different objectives.
- **Qualification:** Environmental losses are partly simulated; assigned costs, weather, location, and rotation affect the optimum.
- **Do not:** Present the conceptual inset in Figure 1 as an empirical dose-response measurement.

### 8. Parallel computing

**Suggested title:** More processors cannot remove the serial bottleneck

- **Paper:** Gene M. Amdahl (1967), *Validity of the Single Processor Approach to Achieving Large Scale Computing Capabilities*, AFIPS Conference Proceedings.
- **Source:** https://www.cs.cmu.edu/~18742/papers/Amdahl1967.pdf
- **Study type:** Theoretical argument.
- **Main chart:** A new explanatory reconstruction of conventional Amdahl's law, explicitly not a reproduction of the paper's original Figure 1.
- **Equation:** `speedup = 1 / (s + (1 - s) / N)`, with serial fraction `s` and processor count `N`.
- **Default:** `s = 0.10`, `N = 1..100`; 10 processors yield about 5.26×, 100 yield 9.17×, asymptotic limit 10×.
- **Interaction:** Serial-fraction control, with the default and assumptions clearly labelled. Avoid a zero serial fraction if displaying `1/s` as a finite limit.
- **Qualification:** Fixed workload, ideal parallelization, omitted communication overhead. Label the curve theoretical and the chosen serial fraction illustrative.

### 9. AI training

**Suggested title:** More training compute buys smaller loss reductions

- **Paper:** Jared Kaplan et al. (2020), *Scaling Laws for Neural Language Models*, arXiv.
- **Source/version:** https://arxiv.org/html/2001.08361v1
- **Study type:** Computational experiments and fitted scaling relationships.
- **Main chart:** Adjusted compute–loss fit associated with Figure 13 and Equation 1.3.
- **Equation:** `L = (3.1e8 / C_min)^0.050`, with `C_min` expressed in PF-days, subject to the paper's conditions and observed range. Verify these details in the source before plotting.
- **Data:** Equation-derived curve labelled as a published fit. Do not invent experimental scatter. The adjusted compute quantity is not simply observed wall-clock training time.
- **Annotation:** Under this fit, doubling compute reduces loss by roughly 3.4%.
- **Interaction:** Clearly labelled linear/logarithmic axis views, retaining the same data and domain.
- **Qualification:** Loss is not usefulness or economic value. This is a historical fit, not a forecast of all current AI systems.
- **Related reading:** Later compute-allocation work: https://arxiv.org/abs/2203.15556

### 10. Research productivity

**Suggested title:** Sustaining the same growth took much more research effort

- **Paper:** Nicholas Bloom, Charles I. Jones, John Van Reenen, and Michael Webb (2020), *Are Ideas Getting Harder to Find?*, American Economic Review.
- **Source:** https://web.stanford.edu/~chadj/IdeaPF.pdf
- **Replication package:** https://www.openicpsr.org/openicpsr/project/111743/version/V2/view
- **Study type:** Historical economic measurement across several domains.
- **Main chart:** Adapt Figure 4's semiconductor example into one figure with two vertically aligned panels sharing a time axis: effective research effort and chip-density growth. This is an intentional exception to a single plotting panel; do not use dual Y axes.
- **Finding:** Estimated effort rises roughly 18-fold while proportional chip-density improvement remains approximately steady.
- **Data:** Prefer the replication package and preserve the baseline year for indexed effort.
- **Qualification:** Effective researchers are estimated from spending and wages. This shows declining measured research productivity over time, not the causal marginal effect of hiring another scientist. Measurement and spillovers matter.

## Data and content organization

Keep the ten entries in a small structured content file and their chart data in inspectable files. Use a shared entry template and a shared dialog; no generic CMS or chart-builder framework is needed.

For each entry retain:

- Stable ID, display title, summary, concrete comparison, visible caveat.
- Authors, year, full title, publication, paper URL, data URL.
- Study design, population/setting, sample size when applicable.
- Source version, figure/table/equation, and page where useful.
- Reconstruction type: data, table, equation, or digitized figure.
- Axis units, scales, references, and uncertainty type.
- Data transformations, approximate-value flags, and source verification date.
- Related reading, interpretation limits, and data/figure reuse notes.

A normalized source note should be visible in the enlarged view, for example: “Replotted from published coefficients; Figure 4, 2014 working-paper version.”

## Implementation scope

Inspect the existing project before choosing architecture. Preserve it if suitable. For a new project, prefer static HTML/CSS/JavaScript or the lightest existing setup. Keep rendering local; do not depend on live publisher requests for the gallery to work.

Use semantic HTML, responsive SVG, and a small amount of JavaScript for dialogs and the specified controls. Do not add a database, authentication, backend API, analytics, or external font dependency.

Include a brief methodology note explaining reconstruction labels, uncertainty, and the difference between smaller gains and a recommended stopping point.

## Verification and acceptance criteria

- All ten entries appear in the agreed order with one main figure each.
- Every numerical claim is traceable to a source, equation, or explicit calculation.
- Every chart has accurate units, references, scale labels, and provenance.
- Published fits, digitized values, and theoretical examples are distinguishable.
- No unsupported thresholds, fabricated data, or missing material caveats.
- Chart values match between compact and expanded views.
- Paper links work; unavailable links have been replaced with verified equivalents where possible.
- The house style is recognizable and the first viewport contains gallery content.
- Desktop and mobile checks show legible charts, no overlapping labels, and no accidental page-wide horizontal scrolling.
- All controls work with keyboard and touch; dialogs close with Escape and restore focus.
- Deep links reach the correct entries.
- Browser checks show no runtime errors.
- Verify arithmetic examples, equation domains, and source-data transformations. Do not add a large test suite for static content.

## Handoff

Deliver the working source, chart datasets, provenance notes, a short README explaining preview/update steps, and a local preview URL or artifact. Report which charts were reconstructed from data, equations, tables, or digitization, and identify any unresolved evidence or access issues.

Do not describe an entry as fully reproduced if it is only an illustrative reconstruction. Do not deploy publicly without separate authorization.
