# A Gallery of Diminishing Returns

A single-page gallery of ten research-backed examples of diminishing returns, built from the brief in
`SPEC.md`. The subtitle is *When is good good enough?* Each entry has one chart, a short finding, a
visible caveat, study metadata and a link to the paper. The chart opens an expanded view with the study
setting, limitation, source record, data table and CSV.

The page chrome follows the compact project-page site bar from `danielpradilla-app-style`: the
uppercase **Daniel Pradilla** wordmark links to `/projects/`, followed by the project tabs, Blog and
GitHub. The footer uses the standard Projects / Blog / GitHub row. Typography follows the Daniel
Pradilla project chrome: system sans, a 0.8rem/400 uppercase wordmark and 0.8rem/300 navigation
links, matching the compact project-page site bar.

Every card uses the same 360px chart area. On desktop the two-column grid makes all cards the same
height, so chart baselines and the per-card author/footer row stay aligned.

The page is static HTML, CSS and JavaScript. It loads no external fonts, analytics or publisher
requests at runtime.

## Published

- Gallery: <https://www.danielpradilla.info/projects/diminishing-returns/>
- Source: <https://github.com/danielpradilla/diminishing-returns>
- Catalog entry: maintained in
  <https://github.com/danielpradilla/danielpradilla-projects>

## Preview

From this directory:

```bash
python3 -m http.server 8137
```

Then open <http://127.0.0.1:8137/>.

The page must be served over HTTP rather than opened as a `file://` path because it uses ES modules.

The static app is deployed from this directory to
`~/danielpradilla.info/projects/diminishing-returns/` on DreamHost. Only `index.html`, `styles.css`,
`js/` and `data/` are published. The catalog card and screenshot live in the separate
`danielpradilla-projects` repository.

## Files

| Path | Contents |
| --- | --- |
| `index.html` | Page shell, masthead, method section, dialog element |
| `styles.css` | House-style tokens, gallery grid, chart text, controls, dialog |
| `js/app.js` | Renders entries, controls, expanded dialog, deep links, CSV links |
| `js/charts.js` | Small SVG chart renderer (linear/log axes, bands, points, annotations, panels) |
| `data/entries.js` | Entry copy, citations, provenance records, chart specifications and tables |
| `data/chart-data.js` | Numeric series generated from the sources |
| `sources/build_data.py` | Reconstruction script for the Killingsworth and Baum data, plus the recorded digitization constants (requires Python 3 and `openpyxl`) |
| `sources/bmpread.py` | Small BMP reader used while digitizing PDF figures; not needed to run the page |
| `sources/` | Research copies of the source PDFs and data workbooks; not loaded by the page |
| `SPEC.md` | The build brief |

The page does not depend on `sources/`. That directory is kept so the numerical work can be checked
and repeated.

## Reconstruction methods

| Entry | Method | Source |
| --- | --- | --- |
| Fuel economy | Equation | `10,000 ÷ MPG`; Larrick & Soll (2008) |
| Working hours | Published coefficients | Table 4, column (ii), 2014 working paper; baseline from Figure 4 |
| Daily steps | Digitized figure (approximate) | Figure 3, Paluch et al. (2022) |
| Practice and retention | Published means; digitized standard errors | Figure 1D, Rohrer & Taylor (2006) |
| Protein and resistance training | Digitized scatter; published segmental fit | Figure 5, Morton et al. (2018) |
| Income and well-being | Published data, recomputed quantiles | OSF `qye4a`, 33,391 rows; Killingsworth et al. (2023) |
| Nitrogen fertilizer | Published data, recomputed OLS quadratics | Zenodo record 14037090, Figure 5 tab; Baum et al. (2025) |
| Parallel computing | Equation | Conventional Amdahl's law; a new reconstruction, not the paper's Figure 1 |
| AI training | Equation | Equation 1.3 and Figure 13, Kaplan et al. (2020) |
| Research productivity | Digitized figure (approximate) | Figure 4 green series, Bloom et al. (2020); growth drawn as the paper's constant 35% |

Full per-entry notes, calibration values and unresolved issues are in `PROVENANCE.md` and in the
expanded source record on the page.

## Updating

- Edit entry text, citations or chart specifications in `data/entries.js`.
- Edit numeric series in `data/chart-data.js`. If the source data changes, update and rerun
  `python3 sources/build_data.py`; it regenerates that file from the OSF CSV and the Baum workbook.
- If a cached stylesheet or module is a problem during development, bump the `?v=` query on the CSS
  link or serve on a fresh port.

## Verification performed

- 1440 × 900 and 390 × 844 viewports checked in Chromium.
- All ten card charts use the same 360px frame; at desktop widths the two-column grid gives every
  card the same height. Title blocks and chart starts are aligned per row by matching the title and
  header heights, and the author / Read the paper footer row has a consistent 47px height.
- The compact site bar follows the sibling project-page pattern: Daniel Pradilla → `/projects/`,
  project tabs, Blog, GitHub, with a native details menu below 620px. The footer uses the standard
  Projects / Blog / GitHub row.
- No page-wide horizontal scroll at either width.
- No JavaScript errors; axe-core run reports 0 violations and one manual-review item for SVG text
  contrast. The chart text uses `#6d6d6d` on `#fffdf9` (contrast ≈ 5.1:1), which passes AA for normal
  text; the audit cannot infer the SVG background.
- Expanded dialogs close with Escape, trap focus, restore focus to the trigger and preserve page
  scroll.
- Deep links such as `#nitrogen-fertilizer` scroll to the entry after the page renders.
- Controls update both the card and the expanded view. The steps table updates with the age group;
  the Amdahl table and CSV update with the serial fraction.
- Paper and data links were checked on 26 October 2026. A few publisher pages return 403 to
  command-line clients but open in browsers; where a direct PDF or repository copy exists, that copy is
  linked.

## Known limitations and unresolved evidence

- **Daily steps:** the meta-level data require an approved request. The two curves and their bands are
  digitized from Figure 3, not re-estimated. Values are approximate and the band overlap in the
  original makes some CI limits uncertain.
- **Protein:** 39 of the 42 study arms are separately visible in Figure 5; overlapping circles are not
  recoverable. The breakpoint is not statistically significant at 0.05 (`p = 0.079`).
- **Research productivity:** the year-by-year effective-researcher series is not printed in the
  article and was digitized from Figure 4. The growth panel is the paper's constant 35%, not annual
  observations.
- **Working hours:** group intercepts are not separately recovered. The plotted curve uses the pooled
  baseline read from Figure 4 and the column (ii) coefficients.
- **Income:** the page recomputes category quantiles from the OSF person-level CSV and displays them in
  one panel. The published Figure 2 uses five stacked panels and piecewise quantile regressions; the
  slopes are reported in the dialog, but the regression lines are not replotted.
- **Nitrogen:** the environmental optimum depends partly on simulated nitrogen losses and assigned
  costs. The quadratic fits are descriptive.
- **Practice:** the means are printed labels; the standard errors were read from the error bars because
  the paper does not print them.

No publisher figure is embedded or recolored. All charts are new SVG drawings.

## Reuse

The PDFs and workbooks in `sources/` are local research copies used to verify values and digitize
figures. They are ignored by Git and are not part of the public repository or deployment. See
`sources/README.md` for the download links. Check the publisher's terms before redistributing those
files or adapting an original figure.
