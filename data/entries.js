import {
  fuel,
  hours,
  steps,
  practice,
  protein,
  income,
  nitrogen,
  research,
  scaling,
} from "./chart-data.js?v=3";

const GALLERY_URL = "https://www.pnas.org/doi/10.1073/pnas.2208661120";

const number = (value) => value.toLocaleString("en-US");
const oneDecimal = (value) => value.toFixed(1);
const integer = (value) => Math.round(value).toLocaleString("en-US");

function speedup(n, s) {
  return 1 / (s + (1 - s) / n);
}

function amdahlSpec(state) {
  const s = state.s;
  const limit = 1 / s;
  const yMax = Math.max(6, Math.ceil((limit * 1.1) / 2) * 2);
  const tickStep = yMax <= 8 ? 1 : yMax <= 12 ? 2 : 5;
  const yTicks = [];
  for (let v = 0; v <= yMax; v += tickStep) yTicks.push(v);
  const data = [];
  for (let n = 1; n <= 100; n += 1) data.push([n, speedup(n, s)]);
  return {
    title: "Speedup over one processor",
    subtitle: `Theoretical model: speedup = 1 / (s + (1 − s) / N). Current serial fraction s = ${s.toFixed(2)}.`,
    description: `Line chart of theoretical speedup against processor count for a serial fraction of ${s.toFixed(2)}. The limit is ${limit.toFixed(2)} times.`,
    x: {
      domain: [1, 100],
      ticks: [1, 10, 25, 50, 75, 100],
      smallTicks: [1, 10, 50, 100],
      label: "Number of processors, N",
    },
    y: {
      domain: [0, yMax],
      ticks: yTicks,
      label: "Speedup over one processor",
      format: "integer",
    },
    series: [
      {
        data,
        type: "line",
        color: "blue",
        width: 2.2,
      },
    ],
    refs: [
      {
        y: limit,
        label: `limit = 1/s = ${limit.toFixed(1)}×`,
        labelAnchor: "end",
      },
    ],
    annotations: [
      {
        x: 10,
        y: speedup(10, s),
        text: `${speedup(10, s).toFixed(2)}× at 10`,
        dx: -6,
        dy: -8,
        anchor: "end",
        marker: true,
        color: "accent",
      },
      {
        x: 100,
        y: speedup(100, s),
        text: `${speedup(100, s).toFixed(2)}× at 100`,
        dx: -6,
        dy: 14,
        anchor: "end",
        marker: true,
        color: "accent",
      },
    ],
  };
}

function stepsSpec(state) {
  const group = state.group === "younger" ? "younger" : "older";
  const d = steps[group];
  const label = group === "older" ? "60 and older" : "under 60";
  return {
    title: `Hazard ratio by daily steps, ${label}`,
    subtitle: `Reference = ${number(d.ref)} steps/day (hazard ratio 1.0). Shaded band: 95% CI, digitized.`,
    description: `Line chart with a 95% confidence band showing all-cause mortality hazard ratio against daily steps for adults ${label}. The curve flattens after about ${d.plateau[0].toLocaleString()} to ${d.plateau[1].toLocaleString()} steps.`,
    x: {
      domain: [0, 16000],
      ticks: [0, 2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000],
      smallTicks: [0, 4000, 8000, 12000, 16000],
      label: "Steps per day",
      format: "integer",
    },
    y: {
      domain: [0.2, 2.2],
      ticks: [0.2, 0.3, 0.5, 0.7, 1, 1.5, 2],
      scale: "log",
      label: "Hazard ratio (log scale)",
      format: "oneDecimal",
    },
    bands: [{ data: d.band, color: "blue" }],
    highlights: [
      {
        x0: d.plateau[0],
        x1: d.plateau[1],
        label: "authors' plateau range",
      },
    ],
    refs: [
      { y: 1, label: "reference = 1.0" },
      { x: d.ref, label: `${number(d.ref)} steps reference`, labelY: "bottom" },
    ],
    series: [
      { data: d.hr, type: "line", color: "blue", width: 2.3 },
    ],
    annotations: [
      {
        x: 16000,
        y: d.hr[d.hr.length - 1][1],
        text: `HR ≈ ${d.hr[d.hr.length - 1][1].toFixed(2)}`,
        dx: -4,
        dy: 14,
        anchor: "end",
        marker: true,
        color: "accent",
      },
    ],
  };
}

function incomeSpec(state) {
  const log = state.scale === "log";
  const series = income.percentiles.map((p) => {
    const data = income.series[String(p)];
    const isEdge = p === 15 || p === 85;
    return {
      data,
      type: "line",
      color: isEdge ? "blue" : "gray",
      width: isEdge ? 2.2 : 1.2,
      label: {
        x: 625000,
        y: data[data.length - 1][1],
        text: `${p}th`,
        dx: 5,
        dy: p === 15 ? 4 : 3,
        anchor: "start",
        accent: isEdge,
      },
    };
  });
  return {
    title: "Happiness by income category and quantile",
    subtitle: "Axis shown 45–82. Quantiles within 15 income categories; $100k marked.",
    description: "Five quantile curves of self-reported happiness against annual household income. The 15th percentile flattens above $100,000 while the 85th percentile continues to rise.",
    right: log ? 42 : 46,
    x: {
      domain: log ? [10000, 700000] : [0, 660000],
      scale: log ? "log" : "linear",
      ticks: log
        ? [10000, 20000, 50000, 100000, 200000, 500000]
        : [0, 100000, 200000, 300000, 400000, 500000, 600000],
      smallTicks: log
        ? [10000, 50000, 100000, 300000, 700000]
        : [0, 200000, 400000, 600000],
      label: log ? "Household income (log scale)" : "Household income (linear scale)",
      format: "currencyK",
    },
    y: {
      domain: [45, 82],
      ticks: [50, 60, 70, 80],
      label: "Happiness (0–100)",
      format: "integer",
    },
    refs: [{ x: 100000 }],
    series,
    annotations: [
      {
        x: 170000,
        y: 55.4,
        text: "15th percentile: flat above $100k",
        dx: 0,
        dy: 0,
        anchor: "start",
        color: "accent",
      },
      {
        x: 180000,
        y: 80.2,
        text: "85th percentile: still rising",
        dx: 0,
        dy: 0,
        anchor: "start",
        color: "accent",
      },
    ],
  };
}

function nitrogenSpec() {
  const c = nitrogen.continuous;
  const s = nitrogen.soybean;
  return {
    title: "Yield change as nitrogen is cut below the economic optimum",
    subtitle: "Negative values are yield losses. Quadratic fits with 95% confidence bands; dots are 379 site-years.",
    description: "Scatter and quadratic fits showing that each additional kilogram of nitrogen reduction costs progressively more maize yield. Continuous maize loses more yield than maize-soybean at the same reduction.",
    right: 92,
    x: {
      domain: [0, 250],
      ticks: [0, 50, 100, 150, 200, 250],
      label: "N reduction toward environmental optimum (kg/ha)",
      format: "integer",
    },
    y: {
      domain: [-100, 5],
      ticks: [-100, -75, -50, -25, 0],
      label: "Grain yield change (%)",
      format: "percent",
    },
    bands: [
      { data: c.curve.map(([x, , lo, hi]) => [x, lo, hi]), color: "blue", opacity: 0.45 },
      { data: s.curve.map(([x, , lo, hi]) => [x, lo, hi]), color: "gray", opacity: 0.5 },
    ],
    series: [
      { data: c.scatter, type: "scatter", color: "blue", radius: 1.7, opacity: 0.22 },
      { data: s.scatter, type: "scatter", color: "gray", radius: 1.7, opacity: 0.22 },
      {
        data: c.curve.map(([x, mean]) => [x, mean]),
        type: "line",
        color: "blue",
        width: 2.2,
        label: { x: 242.5, y: -62.66, text: "Continuous maize", dx: -5, dy: 15, anchor: "end", accent: true },
      },
      {
        data: s.curve.map(([x, mean]) => [x, mean]),
        type: "line",
        color: "gray",
        width: 1.9,
        label: { x: 150, y: -20.06, text: "Maize–soybean", dx: -5, dy: -8, anchor: "end" },
      },
    ],
    annotations: [
      {
        x: 8,
        y: -3,
        text: "100 kg N/ha less: −19% vs −12%",
        dx: 0,
        dy: 0,
        anchor: "start",
      },
    ],
  };
}

function scalingSpec(state) {
  const log = state.scale === "log";
  return {
    title: "Test loss against adjusted training compute",
    subtitle: "Published power-law fit L = (3.1×10⁸ / C_min)^0.050, C_min in PF-days. The line is a fit, not scattered observations.",
    description: "Line chart of the published power-law fit between adjusted training compute and test loss. Loss falls steeply at first and then more slowly; each doubling of compute lowers loss by about 3.4 percent.",
    x: {
      domain: log ? [1e-8, 1] : [0, 1],
      scale: log ? "log" : "linear",
      ticks: log ? [1e-8, 1e-6, 1e-4, 1e-2, 1] : [0, 0.25, 0.5, 0.75, 1],
      label: log ? "Adjusted compute (PF-days; log)" : "Adjusted compute (PF-days; linear)",
      format: log ? "sciShort" : (value) => (value === 0 ? "0" : value === 1 ? "1" : String(value)),
    },
    y: {
      domain: [0, 8],
      ticks: [0, 2, 4, 6, 8],
      label: "Test loss",
      format: "oneDecimal",
    },
    series: [
      { data: scaling, type: "line", color: "blue", width: 2.2 },
    ],
    annotations: [
      {
        x: 1,
        y: 2.658,
        text: "1 PF-day: 2.66",
        dx: -4,
        dy: 18,
        anchor: "end",
        marker: true,
        color: "accent",
      },
    ],
    brackets: log
      ? [
          {
            x0: 0.01,
            x1: 0.02,
            y: 4.3,
            text: "−3.4% per doubling",
          },
        ]
      : [],
  };
}

function researchSpec() {
  return {
    title: "Research effort and chip-density growth, 1971–2014",
    subtitle: "Top: effective researchers, indexed to 1971. Bottom: annual growth rate of chip density, drawn as the paper's constant 35%.",
    description: "Two stacked panels sharing a year axis. Effective semiconductor research effort rises about 18-fold from 1971 to 2014, while chip-density growth remains at about 35 percent per year.",
    panelGap: 20,
    x: {
      domain: [1970, 2015],
      ticks: [1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015],
      smallTicks: [1970, 1980, 1990, 2000, 2010, 2015],
      label: "Year",
      format: "year",
    },
    panels: [
      {
        label: "Effective number of researchers (1971 = 1)",
        y: {
          domain: [0, 20],
          ticks: [0, 5, 10, 15, 20],
          label: "Index (1971 = 1)",
          format: "integer",
        },
        series: [{ data: research, type: "line", color: "blue", width: 2.1 }],
        annotations: [
          { x: 1971, y: 1.01, text: "1.0", dx: 3, dy: -6, anchor: "start", marker: true, color: "accent" },
          { x: 2014, y: 18.14, text: "≈18", dx: -4, dy: -8, anchor: "end", marker: true, color: "accent" },
        ],
      },
      {
        label: "Chip-density growth rate",
        y: {
          domain: [0, 40],
          ticks: [0, 10, 20, 30, 40],
          label: "Growth (%/year)",
          format: "percent",
        },
        series: [
          { data: [[1970, 35], [2015, 35]], type: "line", color: "blue", width: 2.1 },
        ],
        annotations: [
          {
            x: 1972,
            y: 35,
            text: "35%/year",
            dx: 0,
            dy: -7,
            anchor: "start",
            color: "accent",
          },
        ],
      },
    ],
  };
}

export const entries = [
  {
    id: "fuel-economy",
    index: 1,
    section: "Fuel economy",
    title: "The same MPG gain saves less fuel later",
    dek: "Input: fuel economy in miles per US gallon. Outcome: gasoline burned over a fixed 10,000 miles.",
    finding:
      "A car at 12 MPG burns 833 gallons per 10,000 miles; at 14 MPG it burns 714. That 2 MPG gain saves 119 gallons. The same 2 MPG gain at 28→30 saves 24 gallons, and a much larger 12 MPG gain at 28→40 saves 107.",
    comparison:
      "A 2 MPG improvement at the inefficient end saves about five times as much fuel as the same 2 MPG improvement at the efficient end. Gallons per mile, not miles per gallon, is the quantity that matters.",
    caveat:
      "The calculation fixes distance at 10,000 miles and ignores the engineering cost of raising MPG, upstream emissions and how the car is driven.",
    authors: "Richard P. Larrick and Jack B. Soll",
    year: 2008,
    studyType: "Behavioral experiments plus an exact arithmetic relationship",
    paperTitle: "The MPG Illusion",
    journal: "Science 320(5883): 1593–1594",
    paperUrl: "https://pdodds.w3.uvm.edu/files/papers/others/2008/larrick2008a.pdf",
    dataUrl: null,
    related: null,
    population:
      "Five studies with college students and a national online sample. The graph itself is arithmetic and does not depend on the experiments.",
    setting: "Hypothetical vehicle choice and a town fleet replacement decision.",
    method:
      "Participants ranked or chose vehicle pairs by MPG or by gallons per 100 miles. The curve is computed as 10,000 ÷ MPG.",
    limitation:
      "The fuel-burn relationship is exact for a fixed distance. The experiments measure perception, not driving behavior, vehicle markets or the cost of efficiency.",
    notEstablished:
      "No MPG threshold at which further improvement stops mattering. The value of an increment depends on the starting MPG and on the cost of the upgrade.",
    stopping:
      "No single stopping point. At low MPG, small gains save more fuel; the right stopping point depends on what the improvement costs.",
    provenance: {
      figure: "First-page graph, Science, 20 June 2008, p. 1593",
      reconstruction: "Equation",
      baseline: "None; direct calculation.",
      verified: "26 October 2026",
      reuse: "Replotted; no original artwork used.",
      note: "The framing result, 25% choosing the efficient option under MPG versus 64% under gallons per 100 miles, is reported in the text and is not plotted.",
    },
    chart(state) {
      const start = state.start;
      const end = state.end;
      const valid = end > start;
      const saved = valid ? 10000 / start - 10000 / end : 0;
      const startGal = Math.round(10000 / start);
      const endGal = Math.round(10000 / end);
      const readout = valid
        ? `${start}→${end} = ${Math.round(saved)} gal`
        : "Choose ending MPG above starting MPG";
      return {
        title: "Gallons burned over 10,000 miles",
        subtitle: "Exact calculation: 10,000 ÷ fuel economy. The shaded band is your selected interval.",
        description: valid
          ? `A convex curve showing that fuel burned falls steeply at low MPG and slowly at high MPG. The selected interval from ${start} to ${end} MPG saves about ${Math.round(saved)} gallons per 10,000 miles.`
          : "A convex curve showing that fuel burned falls steeply at low MPG and slowly at high MPG. The selected interval is invalid because the ending MPG is not higher than the starting MPG.",
        right: 26,
        x: {
          domain: [10, 60],
          ticks: [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
          smallTicks: [10, 20, 30, 40, 50, 60],
          label: "Fuel economy (miles per US gallon)",
          format: "integer",
        },
        y: {
          domain: [0, 1000],
          ticks: [0, 200, 400, 600, 800, 1000],
          label: "Gallons / 10,000 miles",
          format: "integer",
        },
        highlights: valid
          ? [{ x0: start, x1: end, color: "rgba(47,95,127,0.12)", edges: true }]
          : [],
        series: [{ data: fuel, type: "line", color: "blue", width: 2.2 }],
        brackets: [
          { x0: 28, x1: 30, y: 210, text: "28→30: 24 gal" },
          { x0: 28, x1: 40, y: 450, text: "28→40: 107 gal" },
        ],
        annotations: [
          {
            x: 60,
            y: 960,
            text: readout,
            dx: -4,
            dy: 0,
            anchor: "end",
            color: valid ? "accent" : "warning",
          },
          { x: 40, y: 250, text: "250 gal", dx: 5, dy: -8, anchor: "start", marker: true },
        ],
      };
    },
    controlsHtml(state, prefix = "card-") {
      const options = (selected) =>
        Array.from({ length: 51 }, (_, i) => i + 10)
          .map((mpg) => `<option value="${mpg}"${mpg === selected ? " selected" : ""}>${mpg} MPG</option>`)
          .join("");
      return `
        <div class="control">
          <label for="${prefix}fuel-start-${this.id}">Starting MPG</label>
          <select id="${prefix}fuel-start-${this.id}" data-entry="${this.id}" data-control="fuel-start">${options(state.start)}</select>
        </div>
        <div class="control">
          <label for="${prefix}fuel-end-${this.id}">Ending MPG</label>
          <select id="${prefix}fuel-end-${this.id}" data-entry="${this.id}" data-control="fuel-end">${options(state.end)}</select>
        </div>
        <div class="control">
          <span class="control-label">Preset</span>
          <button type="button" class="text-button" data-entry="${this.id}" data-action="fuel-preset">Compare 28→40 MPG</button>
        </div>
      `;
    },
    outputHtml(state) {
      const saved = 10000 / state.start - 10000 / state.end;
      const pct = (saved / (10000 / state.start)) * 100;
      if (state.end <= state.start) {
        return `<span class="control-output" data-output="${this.id}"><strong>Ending MPG must be higher than starting MPG.</strong></span>`;
      }
      return `<span class="control-output" data-output="${this.id}"><strong>${Math.round(saved)} gallons saved</strong> per 10,000 miles (${pct.toFixed(1)}% less fuel).</span>`;
    },
    table() {
      const rows = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map((mpg) => [
        `${mpg} MPG`,
        Math.round(10000 / mpg).toLocaleString("en-US"),
      ]);
      return { columns: ["Fuel economy", "Gallons / 10k mi"], rows };
    },
    csv() {
      return {
        filename: "fuel-economy.csv",
        rows: [["mpg", "gallons_per_10000_miles"], ...fuel.map(([mpg, gal]) => [mpg, gal])],
      };
    },
  },

  {
    id: "working-hours",
    index: 2,
    section: "Working hours",
    title: "Extra hours stop producing proportional output",
    dek: "Input: weekly hours worked. Outcome: fitted weekly output in the munitions factories studied.",
    finding:
      "In the fitted spline, output rises roughly in proportion to hours up to 49 hours, then flattens. Fitted output is about 6,713 units at 56 hours and 6,701 at 70 hours, a difference of 0.2%.",
    comparison:
      "The first 7 hours beyond the 49-hour knot add about 660 units of fitted output. The last 7 hours, from 63 to 70, add none and slightly reduce it.",
    caveat:
      "The data are weekly observations from British munitions workers in 1914–1918, mostly women. The fitted decline at very long hours depends on the quadratic specification and is not a modern office-work threshold.",
    authors: "John Pencavel",
    year: 2015,
    studyType: "Historical observational production data",
    paperTitle: "The Productivity of Working Hours",
    journal: "The Economic Journal 125(589): 2052–2076",
    paperUrl: "https://epflicht.ulb.uni-bonn.de/download/pdf/149173",
    dataUrl: null,
    related: null,
    population:
      "122 weekly observations from four groups: 100 women in moderately heavy labor, 40 women in light labor, 56 men in heavy labor, and 15 youths in light labor.",
    setting: "British munitions factories during the First World War.",
    method:
      "Least-squares spline with a knot at 49 hours: linear in hours below 49 and quadratic above, with group intercepts. Coefficients are from Table 4 column (ii); the fitted output at 24 hours is read from Figure 4.",
    limitation:
      "Output is measured in one historical production setting. The high-hours downturn is model-dependent; the paper notes that a cubic spline gave implausible implications at very short and very long hours.",
    notEstablished:
      "No universal weekly-hours cutoff. The fitted maximum near 63 hours is specific to this sample and should not be read as a recommended workweek.",
    stopping:
      "No general stopping point. The fitted curve peaks near 63 hours in this sample, but the decline is model-dependent and the setting is historical.",
    provenance: {
      figure: "Figure 4, 2014 working-paper version, p. 46; Table 4, column (ii), p. 37",
      reconstruction: "Published coefficients",
      baseline: "Output at 24 hours set to 2,900 from Figure 4; group intercepts are not separately recovered.",
      verified: "26 October 2026",
      reuse: "Replotted from published coefficients.",
      note: "The solid curve uses the linear-in-shorter-hours specification (column ii). The source figure's alternative quadratic specification is nearly identical and is not separately reconstructed.",
    },
    chart() {
      return {
        title: "Fitted weekly output against weekly hours",
        subtitle: "Spline with a knot at 49 hours (Table 4, column ii); baseline output at 24 hours = 2,900.",
        description: "A fitted curve rising linearly to 49 weekly hours, then flattening. Fitted output at 56 hours is about 6,713 units and at 70 hours about 6,701.",
        x: {
          domain: [24, 72],
          ticks: [24, 30, 35, 40, 45, 49, 55, 60, 65, 70, 72],
          smallTicks: [24, 35, 49, 60, 72],
          label: "Weekly hours",
          format: "integer",
        },
        y: {
          domain: [2400, 7400],
          ticks: [2400, 3400, 4400, 5400, 6400, 7400],
          label: "Fitted output (units)",
          format: "integer",
        },
        refs: [{ x: 49, label: "49 h knot" }],
        series: [{ data: hours, type: "line", color: "blue", width: 2.2 }],
        annotations: [
          {
            x: 56,
            y: 6712.7,
            text: "56 h: 6,713",
            dx: 6,
            dy: -9,
            anchor: "start",
            marker: true,
            color: "accent",
          },
          {
            x: 70,
            y: 6701,
            text: "70 h: 6,701",
            dx: -6,
            dy: 15,
            anchor: "end",
            marker: true,
            color: "accent",
          },
        ],
      };
    },
    controlsHtml() {
      return "";
    },
    outputHtml() {
      return "";
    },
    table() {
      const values = [24, 30, 35, 40, 45, 49, 56, 63, 70, 72];
      return {
        columns: ["Weekly hours", "Fitted output"],
        rows: values.map((h) => {
          let v = 2900 + 126.089 * (h - 24);
          if (h > 49) v -= 4.533 * (h - 49) ** 2;
          return [String(h), Math.round(v).toLocaleString("en-US")];
        }),
      };
    },
    csv() {
      return {
        filename: "working-hours.csv",
        rows: [["weekly_hours", "fitted_output"], ...hours.map(([h, v]) => [h, v])],
      };
    },
  },

  {
    id: "daily-steps",
    index: 3,
    section: "Daily steps",
    title: "The mortality association flattens at higher step counts",
    dek: "Input: steps per day. Outcome: adjusted hazard ratio for all-cause mortality, with 95% confidence bands.",
    finding:
      "In the pooled spline, the mortality hazard falls steeply at low step counts and then flattens. The authors place the plateau at about 6,000–8,000 steps per day for adults 60 and older and 8,000–10,000 for younger adults.",
    comparison:
      "For adults 60 and older, moving from 3,000 steps (the reference) to 5,000 steps is associated with a hazard ratio near 0.63. Moving from 11,000 to 13,000 changes it only from about 0.43 to 0.40.",
    caveat:
      "Observational cohorts, not a randomized trial. Residual confounding, reverse causality (illness reduces steps) and differences in device wear remain possible. Mortality is only one outcome.",
    authors: "Amanda E. Paluch et al.",
    year: 2022,
    studyType: "Meta-analysis of 15 prospective cohorts; 47,471 adults, 3,013 deaths",
    paperTitle: "Daily steps and all-cause mortality: a meta-analysis of 15 international cohorts",
    journal: "The Lancet Public Health 7(3): e219–e228",
    paperUrl: "https://discovery.ucl.ac.uk/id/eprint/10170017/1/1-s2.0-S2468266721003029-main.pdf",
    dataUrl: null,
    related: "https://www.sciencedirect.com/science/article/pii/S2468266725001641",
    relatedLabel: "Related: later step-count evidence",
    population: "47,471 adults from 15 cohorts in Asia, Australia, Europe and the United States.",
    setting: "Accelerometer-measured daily steps and all-cause mortality, followed for a median of 7.1 years.",
    method:
      "Pooled dose-response spline across 14 cohorts, adjusted for age, device wear, race and ethnicity, sex, education or income, body-mass index, and study-specific risk factors. Reference at the median of the lowest quartile: 3,000 steps for adults 60 and older and 5,000 for younger adults.",
    limitation:
      "The published curves are meta-analytic associations, and the confidence bands are wide at high step counts. Meta-level data require an approved request, so the curves shown here are digitized approximations.",
    notEstablished:
      "No causal step target and no sharp threshold. The plateau is a broad range, and the confidence bands do not exclude continued small declines.",
    stopping:
      "No single stopping point established. The association flattens over a broad range; individual targets depend on baseline activity, health and what else the time could buy.",
    provenance: {
      figure: "Figure 3, p. e224",
      reconstruction: "Digitized figure (approximate)",
      baseline: "Hazard ratio 1.0 at the stated reference count.",
      verified: "26 October 2026",
      reuse: "Replotted; no original artwork used.",
      note: "Central lines read to ±0.02 hazard ratio; band limits to ±0.05. Values are sampled at 1,000-step intervals. The 0-step endpoints are approximate and partly clipped by the published axis. The reference values are set to hazard ratio 1.0 by definition.",
    },
    chart(state) {
      return stepsSpec(state);
    },
    controlsHtml(state) {
      const pressed = (value) => (state.group === value ? "true" : "false");
      return `
        <div class="control">
          <span class="control-label">Age group</span>
          <div class="segmented" role="group" aria-label="Age group">
            <button type="button" data-entry="${this.id}" data-control="steps-group" data-value="older" aria-pressed="${pressed("older")}">60 and older</button>
            <button type="button" data-entry="${this.id}" data-control="steps-group" data-value="younger" aria-pressed="${pressed("younger")}">Under 60</button>
          </div>
        </div>
      `;
    },
    outputHtml() {
      return "";
    },
    table(state) {
      const group = state.group === "younger" ? "younger" : "older";
      return {
        columns: ["Steps/day", "HR", "Lower 95%", "Upper 95%"],
        rows: steps[group].band.map(([x, lo, hi], i) => [
          x.toLocaleString("en-US"),
          steps[group].hr[i][1].toFixed(3),
          lo.toFixed(3),
          hi.toFixed(3),
        ]),
      };
    },
    csv(state) {
      const group = state.group === "younger" ? "younger" : "older";
      return {
        filename: `daily-steps-${group}.csv`,
        rows: [
          ["steps_per_day", "hazard_ratio", "ci_lower", "ci_upper"],
          ...steps[group].band.map(([x, lo, hi], i) => [x, steps[group].hr[i][1], lo, hi]),
        ],
      };
    },
  },

  {
    id: "practice-retention",
    index: 4,
    section: "Practice and retention",
    title: "Extra practice in one sitting did not improve later recall",
    dek: "Input: practice problems solved in one session, 3 or 9. Outcome: test accuracy one and four weeks later.",
    finding:
      "Students who solved 9 problems averaged 69% correct after one week and 28% after four weeks. Students who solved 3 averaged 67% and 27%. The extra six problems produced no detectable retention advantage.",
    comparison:
      "The 2-point and 1-point differences are smaller than the plotted standard errors. In the separate spacing experiment, distributing the same 10 problems across two sessions raised four-week accuracy from 32% to 64%.",
    caveat:
      "One mathematical procedure and 88 analyzed undergraduates. A nonsignificant difference does not establish equivalence, and the result does not create a universal three-repetition rule.",
    authors: "Doug Rohrer and Kelli Taylor",
    year: 2006,
    studyType: "Two randomized learning experiments; 216 students",
    paperTitle: "The Effects of Overlearning and Distributed Practice on the Retention of Mathematics Knowledge",
    journal: "Applied Cognitive Psychology 20(9): 1209–1224",
    paperUrl: "https://files.eric.ed.gov/fulltext/ED505642.pdf",
    dataUrl: null,
    related: null,
    population:
      "Experiment 2 began with 100 undergraduates; 88 were analyzed after excluding students who scored 0 or 1 on the initial three problems.",
    setting: "University of South Florida laboratory; one learning session and a test one or four weeks later.",
    method:
      "Random assignment to 3 or 9 practice problems and to a 1- or 4-week retention interval. The test had five problems of the same type.",
    limitation:
      "The test measured one procedure, and the sample was undergraduate volunteers. Error bars are ±1 standard error and were digitized from Figure 1D.",
    notEstablished:
      "No evidence that six extra problems helped here, and no proof that 3 is optimal. The spacing comparison is a separate experiment with a different manipulation.",
    stopping:
      "No additional-retention benefit was detected from 3 to 9 problems in this experiment. The efficient stopping point may be near mastery, but one study cannot set it.",
    provenance: {
      figure: "Figure 1D, p. 13 of the ERIC version",
      reconstruction: "Published labels and digitized standard errors",
      baseline: "None; accuracy is plotted directly.",
      verified: "26 October 2026",
      reuse: "Replotted; no original artwork used.",
      note: "Means are the printed labels 69%, 67%, 28% and 27%. Standard errors are approximately 7 percentage points, read from the error bars, because the paper does not print the values.",
    },
    chart() {
      return {
        title: "Test accuracy after massed practice",
        subtitle: "Means with ±1 standard error. Two retention intervals, two practice amounts; no line is drawn between conditions.",
        description: "Four points with error bars comparing 9 and 3 practice problems at one-week and four-week tests. The two practice amounts differ by 2 percentage points at one week and 1 point at four weeks.",
        right: 78,
        x: {
          domain: [0.4, 2.6],
          ticks: [1, 2],
          tickLabels: ["1 week", "4 weeks"],
          label: "Retention interval",
        },
        y: {
          domain: [0, 100],
          ticks: [0, 25, 50, 75, 100],
          label: "Test accuracy (%)",
          format: "percent",
        },
        series: [
          {
            data: practice.hi.points,
            type: "points",
            color: "blue",
            offsetX: -0.055,
            error: true,
            label: { x: 2.055, y: 28, text: "9 problems", dx: 9, dy: 4, anchor: "start" },
          },
          {
            data: practice.lo.points,
            type: "points",
            color: "gray",
            offsetX: 0.055,
            error: true,
            label: { x: 2.055, y: 27, text: "3 problems", dx: 9, dy: 17, anchor: "start" },
          },
        ],
        annotations: [
          { x: 0.945, y: 69, text: "69%", dx: -7, dy: -7, anchor: "end" },
          { x: 1.055, y: 67, text: "67%", dx: -7, dy: 13, anchor: "end" },
          { x: 1.945, y: 28, text: "28%", dx: -7, dy: -7, anchor: "end" },
          { x: 2.055, y: 27, text: "27%", dx: -7, dy: 13, anchor: "end" },
        ],
      };
    },
    controlsHtml() {
      return "";
    },
    outputHtml() {
      return "";
    },
    table() {
      return {
        columns: ["Practice amount", "1 week", "4 weeks"],
        rows: [
          ["9 problems", "69% (SE 7.0)", "28% (SE 7.0)"],
          ["3 problems", "67% (SE 7.5)", "27% (SE 7.3)"],
        ],
      };
    },
    csv() {
      return {
        filename: "practice-retention.csv",
        rows: [
          ["problems", "retention_weeks", "accuracy_percent", "se_percent"],
          [9, 1, 69, 7.0],
          [9, 4, 28, 7.0],
          [3, 1, 67, 7.5],
          [3, 4, 27, 7.3],
        ],
      };
    },
  },

  {
    id: "protein-training",
    index: 5,
    section: "Protein and resistance training",
    title: "The protein plateau is an estimate, not a hard ceiling",
    dek: "Input: total protein intake. Outcome: change in fat-free mass during resistance training.",
    finding:
      "The segmental meta-regression estimates a breakpoint at 1.62 g/kg/day (95% CI 1.03–2.20). Below it, each additional g/kg/day is associated with about 1.75 kg more fat-free mass; above it, the fitted line is flat.",
    comparison:
      "The breakpoint interval spans more than a twofold range of intakes. The analysis reports p = 0.079, so the breakpoint is not statistically significant at the conventional 0.05 level.",
    caveat:
      "The breakpoint comes from 42 study arms and 723 participants, a subset of the 49 trials and 1,863 participants in the review. It is not a universal ceiling or an individual prescription.",
    authors: "Robert W. Morton et al.",
    year: 2018,
    studyType: "Systematic review and meta-analysis of 49 trials; breakpoint analysis of 42 arms",
    studyTypeShort: "Systematic review and meta-analysis",
    paperTitle:
      "A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength in healthy adults",
    journal: "British Journal of Sports Medicine 52(6): 376–384",
    paperUrl: "https://breathe-edu-downloads.s3.amazonaws.com/Morton-2018.pdf",
    dataUrl: null,
    related: null,
    population:
      "Healthy adults undertaking resistance training in 49 trials; the breakpoint subset covers 723 participants in 42 study arms.",
    setting: "Controlled supplementation trials lasting weeks, with fat-free mass measured by dual-energy X-ray absorptiometry.",
    method:
      "Biphasic segmental linear regression of change in fat-free mass on total protein intake. The fitted slope below the breakpoint is 1.75 kg per g/kg/day; the breakpoint is 1.62 g/kg/day.",
    limitation:
      "The breakpoint is model-based and not conventionally significant (p = 0.079). Protein intake is correlated with supplementation dose and total energy, and the review cannot separate all of these.",
    notEstablished:
      "No universal protein ceiling. The estimate does not establish an individual target, and the review's overall supplementation benefit is a separate result.",
    stopping:
      "A model-based plateau, not a hard stopping point. Requirements and costs vary, and the 95% interval is wide.",
    provenance: {
      figure: "Figure 5, p. 376",
      reconstruction: "Digitized scatter and published fit",
      baseline: "Fat-free mass change in kg; zero is no change.",
      verified: "26 October 2026",
      reuse: "Replotted; no original artwork used.",
      note: "The published regression is slope 1.75, R² 0.19, df 36, breakpoint 1.62 (95% CI 1.03–2.20), p = 0.079. The scatter is an approximate digitization: 39 of 42 arms are separately visible; overlapping circles are not recoverable. Reading error about ±0.01 g/kg/day horizontally and ±0.05 kg vertically.",
    },
    chart() {
      return {
        title: "Fat-free mass change against total protein intake",
        subtitle: "Segmental linear fit (slope 1.75). Shaded band: 95% CI for the breakpoint. Dots: 39 visible study arms.",
        description: "Scatter plot with a rising fitted line that flattens at a protein intake of 1.62 grams per kilogram per day. The 95 percent interval for the breakpoint runs from 1.03 to 2.20.",
        right: 34,
        x: {
          domain: [0.7, 2.5],
          ticks: [0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4],
          smallTicks: [0.8, 1.2, 1.6, 2.0, 2.4],
          label: "Total protein intake (g/kg body mass/day)",
          format: "oneDecimal",
        },
        y: {
          domain: [-2, 4],
          ticks: [-2, -1, 0, 1, 2, 3, 4],
          label: "Change in FFM (kg)",
          format: "integer",
        },
        highlights: [
          { x0: 1.03, x1: 2.20, color: "rgba(122,97,0,0.07)" },
        ],
        series: [
          { data: protein.arms, type: "scatter", color: "gray", radius: 3, strokeWidth: 1, opacity: 0.8 },
          { data: protein.fit, type: "line", color: "blue", width: 2.1 },
        ],
        annotations: [
          {
            x: 1.62,
            y: 1.6,
            text: "fitted plateau",
            dx: 7,
            dy: -8,
            anchor: "start",
            color: "accent",
          },
          {
            x: 0.72,
            y: 3.72,
            text: "Breakpoint 1.62; p = 0.079",
            dx: 0,
            dy: 0,
            anchor: "start",
            color: "warning",
          },
          {
            x: 0.72,
            y: 3.4,
            text: "95% CI 1.03–2.20",
            dx: 0,
            dy: 0,
            anchor: "start",
            color: "warning",
          },
        ],
      };
    },
    controlsHtml() {
      return "";
    },
    outputHtml() {
      return "";
    },
    table() {
      const rows = [0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4].map((x) => [
        x.toFixed(1),
        (-1.235 + 1.75 * Math.min(x, 1.62)).toFixed(2),
      ]);
      return { columns: ["Protein (g/kg/day)", "Fitted ΔFFM (kg)"], rows };
    },
    csv() {
      return {
        filename: "protein-training.csv",
        rows: [
          ["series", "protein_g_per_kg_day", "ffm_change_kg"],
          ...protein.arms.map(([x, y]) => ["observed_arm", x, y]),
          ...protein.fit.map(([x, y]) => ["published_segmental_fit", x, y]),
        ],
      };
    },
  },

  {
    id: "income-wellbeing",
    index: 6,
    section: "Income and well-being",
    title: "Smaller gains per dollar do not imply one happiness ceiling",
    dek: "Input: annual pre-tax household income. Outcome: self-reported emotional well-being on a 0–100 scale, by quantile.",
    finding:
      "Across 33,391 employed US adults, well-being rises with log income. Above about $100,000, the least-happy 15% is nearly flat while the happiest 85% continues to rise. The middle quantiles also continue upward, more slowly.",
    comparison:
      "From $15,000 to $95,000, the 15th percentile rises about 3.3 points; from $112,500 to $625,000 it rises less than 1 point. Over the same upper range, the 85th percentile rises about 2.4 points.",
    caveat:
      "Observational and cross-sectional. The sample is employed US adults with incomes above $10,000; the overall association is weak; dollars are historical; quantile curves are not the trajectories of fixed individuals.",
    authors: "Matthew A. Killingsworth, Daniel Kahneman and Barbara Mellers",
    year: 2023,
    studyType: "Observational experience-sampling reanalysis; 33,391 employed US adults",
    studyTypeShort: "Experience-sampling reanalysis",
    paperTitle: "Income and emotional well-being: A conflict resolved",
    journal: "PNAS 120(10): e2208661120",
    paperUrl: GALLERY_URL,
    dataUrl: "https://osf.io/qye4a/",
    related: "https://arxiv.org/html/2401.05347v2",
    relatedLabel: "Related: later reanalysis finding a higher plateau",
    population:
      "33,391 employed US adults aged 18–65 with household income of at least $10,000, sampled between 2009 and 2015.",
    setting: "Smartphone experience sampling of momentary well-being; income measured at intake on a separate occasion.",
    method:
      "Person-level mean happiness within 15 income categories. The 15th, 30th, 50th, 70th and 85th quantiles are computed within each category; the published figure fits piecewise quantile regressions at $100,000.",
    limitation:
      "Selective sample, weak overall association, historical dollar values and no causal identification. The quantile curves describe people in income categories, not the same people followed over time.",
    notEstablished:
      "No single happiness ceiling. The flattening is confined to the least-happy group; other quantiles rise, and a later reanalysis in a different specification finds a higher plateau.",
    stopping:
      "No single income stopping point. The answer differs by quantile and by what the money is expected to buy.",
    provenance: {
      figure: "Figure 2; data from OSF project qye4a",
      reconstruction: "Published data",
      baseline: "Happiness on the study's 0–100 scale; axis shown from 45 to 82.",
      verified: "26 October 2026",
      reuse: "Recomputed from the authors' CSV; no original artwork used.",
      note: "33,391 person-level rows and 15 income midpoints. Quantiles use linear interpolation. The source figure uses five stacked panels, a log income axis and piecewise quantile regressions; this page plots the category quantiles in one panel, starts with linear dollar spacing and reports the published slopes in the text. Switching to log dollars changes the display only, not the values.",
    },
    chart(state) {
      return incomeSpec(state);
    },
    controlsHtml(state) {
      const pressed = (value) => (state.scale === value ? "true" : "false");
      return `
        <div class="control">
          <span class="control-label">Income axis</span>
          <div class="segmented" role="group" aria-label="Income axis scale">
            <button type="button" data-entry="${this.id}" data-control="income-scale" data-value="linear" aria-pressed="${pressed("linear")}">Linear dollars</button>
            <button type="button" data-entry="${this.id}" data-control="income-scale" data-value="log" aria-pressed="${pressed("log")}">Log dollars</button>
          </div>
        </div>
      `;
    },
    outputHtml() {
      return "";
    },
    table() {
      return {
        columns: ["Income", "15th", "30th", "50th", "70th", "85th"],
        rows: income.categories.map((c) => [
          `$${c.toLocaleString("en-US")}`,
          ...income.percentiles.map((p) => income.series[String(p)].find(([x]) => x === c)[1].toFixed(2)),
        ]),
      };
    },
    csv() {
      return {
        filename: "income-wellbeing-quantiles.csv",
        rows: [
          ["income", "p15", "p30", "p50", "p70", "p85"],
          ...income.categories.map((c) => [
            c,
            ...income.percentiles.map((p) => income.series[String(p)].find(([x]) => x === c)[1]),
          ]),
        ],
      };
    },
  },

  {
    id: "nitrogen-fertilizer",
    index: 7,
    section: "Nitrogen fertilizer",
    title: "Deeper fertilizer cuts cost progressively more yield",
    dek: "Input: reduction in nitrogen rate from the economic optimum toward the environmental optimum. Outcome: change in grain yield.",
    finding:
      "Each additional kg N/ha cut costs progressively more yield. Cutting 100 kg N/ha below the economic optimum is associated with about a 19% yield loss in continuous maize and 12% in maize–soybean.",
    comparison:
      "The first 50 kg N/ha of reduction costs about 8% in continuous maize; the next 50 costs about 11% more. The curve steepens rather than flattening.",
    caveat:
      "Environmental losses are partly simulated; the environmental optimum depends on assigned costs of leaching and emissions, weather, location and rotation. The quadratics are descriptive.",
    authors: "Mitchell E. Baum et al.",
    year: 2025,
    studyType: "Synthesis of long-term field experiments and modeling; 379 site-years",
    paperTitle: "The optimum nitrogen fertilizer rate for maize in the US Midwest is increasing",
    journal: "Nature Communications 16: 404",
    paperUrl: "https://www.nature.com/articles/s41467-024-55314-7",
    dataUrl: "https://zenodo.org/records/14037090",
    related: null,
    population:
      "379 long-term site-years from 14 experiments in Iowa and Illinois, plus 176 short-term cases in the wider study. The plotted Source Data tab has 379 rows.",
    setting: "Maize and maize–soybean rotations with multiple nitrogen rates.",
    method:
      "Quadratic regression of percent grain yield change on the difference between the economic and environmental optimum nitrogen rates, by rotation. We recomputed ordinary least squares from the authors' Source Data.",
    limitation:
      "The environmental optimum is derived partly from simulated nitrogen losses and assigned costs. Field-level optima vary with weather, soil and rotation, and the quadratics are descriptive summaries.",
    notEstablished:
      "No single optimal nitrogen rate. Maximum yield, maximum farm profit and an environmental-cost optimum are different objectives.",
    stopping:
      "Cost-dependent. The stopping point is the economic optimum, the environmental optimum or a policy-weighted compromise; the chart does not choose one.",
    provenance: {
      figure: "Figure 5, p. 4",
      reconstruction: "Published data and recomputed quadratic fits",
      baseline: "Yield at the economic optimum; negative values are losses.",
      verified: "26 October 2026",
      reuse: "Recomputed from the authors' Source Data; no original artwork used.",
      note: "OLS reproduces the published coefficients: continuous maize −0.00047x² − 0.145x + 0.236; maize–soybean −0.00024x² − 0.100x + 0.267. Bands are 95% confidence intervals for the mean response.",
    },
    chart() {
      return nitrogenSpec();
    },
    controlsHtml() {
      return "";
    },
    outputHtml() {
      return "";
    },
    table() {
      const xs = [0, 50, 100, 150, 200, 250];
      const val = (coef, x) => coef[0] + coef[1] * x + coef[2] * x * x;
      return {
        columns: ["N reduction (kg/ha)", "Continuous maize", "Maize–soybean"],
        rows: xs.map((x) => [
          String(x),
          val(nitrogen.continuous.coef, x).toFixed(1) + "%",
          x <= nitrogen.soybean.maxX ? val(nitrogen.soybean.coef, x).toFixed(1) + "%" : "—",
        ]),
      };
    },
    csv() {
      return {
        filename: "nitrogen-fertilizer.csv",
        rows: [
          ["series", "n_reduction_kg_ha", "yield_change_percent", "ci_lower", "ci_upper"],
          ...nitrogen.continuous.curve.map(([x, m, lo, hi]) => ["continuous_maize_fit", x, m, lo, hi]),
          ...nitrogen.soybean.curve.map(([x, m, lo, hi]) => ["maize_soybean_fit", x, m, lo, hi]),
        ],
      };
    },
  },

  {
    id: "parallel-computing",
    index: 8,
    section: "Parallel computing",
    title: "More processors cannot remove the serial bottleneck",
    dek: "Input: number of processors. Outcome: speedup over one processor for a fixed workload with serial fraction s.",
    finding:
      "With 10% of the workload serial (the default), 10 processors give about 5.26× speedup and 100 give 9.17×. The limit is 10×, no matter how many processors are added.",
    comparison:
      "At that default, going from 1 to 10 processors recovers 5.26 of the 10× ceiling. Going from 10 to 100 recovers only another 3.91×, despite ten times the hardware.",
    caveat:
      "A theoretical model with fixed workload, ideal parallelization and no communication or scheduling overhead. The serial fraction is illustrative; real workloads change with problem size.",
    authors: "Gene M. Amdahl",
    year: 1967,
    studyType: "Theoretical argument",
    paperTitle:
      "Validity of the Single Processor Approach to Achieving Large Scale Computing Capabilities",
    journal: "AFIPS Conference Proceedings 30: 483–485",
    paperUrl: "https://www.cs.cmu.edu/~18742/papers/Amdahl1967.pdf",
    dataUrl: null,
    related: null,
    population: "Not applicable; a theoretical argument rather than a sample.",
    setting: "Single-processor versus multiprocessor computer architecture.",
    method:
      "Amdahl's law: speedup = 1 / (s + (1 − s) / N). The curve is a new explanatory reconstruction of the conventional formula; the 1967 paper's Figure 1 plots instruction-level parallelism, not this serial-fraction curve.",
    limitation:
      "No measured system, no communication overhead and a fixed problem size. The serial fraction is a modeling choice, not an estimate from the paper.",
    notEstablished:
      "No universal processor count. The limit is set by the serial fraction; as s approaches zero, the finite limit disappears.",
    stopping:
      "The practical stopping point is cost-dependent. Each additional processor buys a smaller speedup, and hardware and energy costs are outside the model.",
    provenance: {
      figure: "Equation reconstruction, not the paper's Figure 1",
      reconstruction: "Equation",
      baseline: "Speedup = 1 at N = 1.",
      verified: "26 October 2026",
      reuse: "Original computation; no figure reused.",
      note: "The default serial fraction is 0.10 and N runs from 1 to 100. The control allows s from 0.05 to 0.50. The original paper's Figure 1 uses a different quantity, the fraction of instructions that permit parallelism.",
    },
    chart(state) {
      return amdahlSpec(state);
    },
    controlsHtml(state, prefix = "card-") {
      return `
        <div class="control">
          <label for="${prefix}amdahl-s-${this.id}">Serial fraction, s = <span data-value="${this.id}">${state.s.toFixed(2)}</span></label>
          <input id="${prefix}amdahl-s-${this.id}" type="range" min="0.05" max="0.50" step="0.01" value="${state.s}" data-entry="${this.id}" data-control="amdahl-s">
        </div>
      `;
    },
    outputHtml(state) {
      return `<span class="control-output" data-output="${this.id}">10 processors: ${speedup(10, state.s).toFixed(2)}× · 100 processors: ${speedup(100, state.s).toFixed(2)}× · limit ${(1 / state.s).toFixed(1)}×</span>`;
    },
    table(state) {
      return {
        columns: ["Processors", "Speedup", "Share of limit"],
        rows: [1, 2, 5, 10, 25, 50, 100].map((n) => [
          String(n),
          speedup(n, state.s).toFixed(2) + "×",
          Math.round((speedup(n, state.s) / (1 / state.s)) * 100) + "%",
        ]),
      };
    },
    csv(state) {
      const rows = [["processors", "speedup", "serial_fraction"]];
      for (let n = 1; n <= 100; n += 1) rows.push([n, speedup(n, state.s).toFixed(4), state.s]);
      return { filename: `amdahl-s${state.s.toFixed(2)}.csv`, rows };
    },
  },

  {
    id: "ai-training",
    index: 9,
    section: "AI training",
    title: "More training compute buys smaller loss reductions",
    dek: "Input: adjusted training compute in PF-days. Outcome: test loss on a language-modeling task.",
    finding:
      "The published fit L = (3.1×10⁸ / C_min)^0.050 implies that each doubling of compute lowers loss by about 3.4%. At 1 PF-day the fit gives a loss of about 2.66; at 0.5 PF-day, about 2.72.",
    comparison:
      "A 100-fold increase in compute lowers the fitted loss by about 21%; a 1,000-fold increase lowers it by about 29%. The exponent is small, so large compute increases buy modest loss reductions.",
    caveat:
      "Loss is not usefulness, revenue or safety. The fit is historical and conditional on the paper's architectures, data and training assumptions. Adjusted compute C_min is not wall-clock training time.",
    authors: "Jared Kaplan et al.",
    year: 2020,
    studyType: "Computational experiments and fitted scaling relationships",
    paperTitle: "Scaling Laws for Neural Language Models",
    journal: "arXiv:2001.08361v1",
    paperUrl: "https://arxiv.org/html/2001.08361v1",
    dataUrl: null,
    related: "https://arxiv.org/abs/2203.15556",
    relatedLabel: "Related: compute-optimal training",
    population:
      "Transformer language models trained on WebText, with the compute fit spanning more than eight orders of magnitude of C_min.",
    setting: "Language-model pretraining; no human participants.",
    method:
      "Power-law fit of test loss on adjusted compute: L(C_min) = (C_c / C_min)^α with C_c = 3.1×10⁸ PF-days and α = 0.050. The curve is Equation 1.3, not a scatter of experimental runs.",
    limitation:
      "The fit is not a forecast for all current systems and omits architecture changes, data quality and inference cost. The figure's displayed adjusted fit uses 2.3×10⁸ rather than 3.1×10⁸, a difference of about 1.5% in loss.",
    notEstablished:
      "No optimal compute budget and no point at which more compute is useless. The fitted curve continues to decline within the observed range.",
    stopping:
      "No stopping point from this fit alone. The decision depends on the value of lower loss versus the cost of compute.",
    provenance: {
      figure: "Equation 1.3 and Figure 13",
      reconstruction: "Equation",
      baseline: "Loss is the model's test loss; C_min is in PF-days.",
      verified: "26 October 2026",
      reuse: "Original computation from the published fit; no figure reused.",
      note: "Plotted from C_min = 10⁻⁸ to 1 PF-day, the range shown in Figure 13. The annotation uses the exact doubling factor 2^−0.050 = 0.966, a 3.4% reduction. The linear compute view changes the x-axis display only; the values and domain are unchanged.",
    },
    chart(state) {
      return scalingSpec(state);
    },
    controlsHtml(state) {
      const pressed = (value) => (state.scale === value ? "true" : "false");
      return `
        <div class="control">
          <span class="control-label">Compute axis</span>
          <div class="segmented" role="group" aria-label="Compute axis scale">
            <button type="button" data-entry="${this.id}" data-control="scaling-scale" data-value="log" aria-pressed="${pressed("log")}">Log compute</button>
            <button type="button" data-entry="${this.id}" data-control="scaling-scale" data-value="linear" aria-pressed="${pressed("linear")}">Linear compute</button>
          </div>
        </div>
      `;
    },
    outputHtml() {
      return "";
    },
    table() {
      const values = [1e-8, 1e-7, 1e-6, 1e-5, 1e-4, 1e-3, 1e-2, 1e-1, 1];
      return {
        columns: ["C_min (PF-days)", "Fitted loss"],
        rows: values.map((c) => [
          c === 1 ? "1" : `1e${Math.round(Math.log10(c))}`,
          ((3.1e8 / c) ** 0.05).toFixed(3),
        ]),
      };
    },
    csv() {
      return {
        filename: "ai-training-fit.csv",
        rows: [["c_min_pf_days", "test_loss"], ...scaling.map(([c, l]) => [c, l])],
      };
    },
  },

  {
    id: "research-productivity",
    index: 10,
    section: "Research productivity",
    title: "Sustaining the same growth took much more research effort",
    dek: "Input: year. Outcomes: effective number of semiconductor researchers and the annual growth rate of chip density.",
    finding:
      "Effective research effort rose about 18-fold from 1971 to 2014 while chip-density growth stayed near 35% per year. The paper's implied research productivity fell by the same factor of 18, or about 6.8% per year.",
    comparison:
      "In 1971, one unit of effective research effort was associated with 35% annual density growth. By 2014, 18 units were associated with the same 35%.",
    caveat:
      "Effective researchers are estimated by deflating R&D spending by high-skilled wages, not by counting people. Measurement, spillovers and composition changes matter. The flat growth line is the paper's constant 35% assumption, not a year-by-year series.",
    authors: "Nicholas Bloom, Charles I. Jones, John Van Reenen and Michael Webb",
    year: 2020,
    studyType: "Historical economic measurement across several domains",
    paperTitle: "Are Ideas Getting Harder to Find?",
    journal: "American Economic Review 110(4): 1104–1144",
    paperUrl: "https://web.stanford.edu/~chadj/IdeaPF.pdf",
    dataUrl: "https://www.openicpsr.org/openicpsr/project/111743/version/V2/view",
    related: null,
    population:
      "Semiconductor firms and equipment manufacturers in the R&D series; the article covers 1971–2014 for this example.",
    setting: "Moore's Law and the semiconductor industry.",
    method:
      "Effective research effort is nominal R&D deflated by the wage of high-skilled workers, normalized to 1 in 1971. Idea output is a constant 35% annual chip-density growth. The researchers series is digitized from Figure 4.",
    limitation:
      "The year-by-year researchers series is not printed in the article, so the top panel is an approximate digitization. The growth panel is a constant by construction.",
    notEstablished:
      "Not the causal effect of hiring one more scientist, and not a case for stopping research. It measures declining research productivity at the aggregate level.",
    stopping:
      "No stopping point. The result describes how much effort is needed to sustain a constant growth rate, not whether the research should continue.",
    provenance: {
      figure: "Figure 4, p. 1118; Table 1 baseline",
      reconstruction: "Digitized figure",
      baseline: "Effective researchers = 1 in 1971; growth rate = 35% per year.",
      verified: "26 October 2026",
      reuse: "Replotted; no original artwork used.",
      note: "The green line was digitized at 300 dpi at one-year intervals, with ±0.1 reading error on the index. The endpoint is about 18.1, consistent with the paper's 18-fold statement. The growth line is the paper's constant, not annual data. The source figure uses dual y axes; this page splits the two series into stacked panels sharing a time axis, so no panel has two y axes.",
    },
    chart() {
      return researchSpec();
    },
    controlsHtml() {
      return "";
    },
    outputHtml() {
      return "";
    },
    table() {
      const picks = [1971, 1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2014];
      return {
        columns: ["Year", "Effective researchers (1971 = 1)", "Chip-density growth"],
        rows: picks.map((year) => {
          const found = research.find(([y]) => y === year);
          return [String(year), found ? found[1].toFixed(2) : "—", "35%/year"];
        }),
      };
    },
    csv() {
      return {
        filename: "research-productivity.csv",
        rows: [["year", "effective_researchers_index", "chip_density_growth_percent"], ...research.map(([y, v]) => [y, v, 35])],
      };
    },
  },
];

export const methodOrder = entries.map((entry) => ({
  id: entry.id,
  section: entry.section,
  year: entry.year,
  figure: entry.provenance.figure,
  reconstruction: entry.provenance.reconstruction,
  paperTitle: entry.paperTitle,
}));
