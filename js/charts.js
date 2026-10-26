const NS = "http://www.w3.org/2000/svg";

const COLORS = {
  blue: "#2f5f7f",
  blueSoft: "#d1dfe4",
  gray: "#8a939d",
  graySoft: "#e9e9e6",
  warning: "#7a6100",
  warningSoft: "#f1e7bd",
  rule: "#d1d1d1",
  ruleSoft: "#e9e9e6",
  ink: "#000000",
  muted: "#39414d",
  secondary: "#6d6d6d",
  page: "#fffdf9",
};

let chartCounter = 0;

function svgEl(name, attrs = {}, parent = null) {
  const node = document.createElementNS(NS, name);
  for (const [key, value] of Object.entries(attrs)) {
    if (value !== undefined && value !== null) node.setAttribute(key, String(value));
  }
  if (parent) parent.appendChild(node);
  return node;
}

function svgText(parent, x, y, value, cls, attrs = {}) {
  const node = svgEl("text", { x, y, class: cls, ...attrs }, parent);
  node.textContent = value;
  return node;
}

function makeScale(domain, range, type = "linear") {
  if (type === "log") {
    const d0 = Math.log10(domain[0]);
    const d1 = Math.log10(domain[1]);
    return (value) => {
      const t = (Math.log10(value) - d0) / (d1 - d0);
      return range[0] + t * (range[1] - range[0]);
    };
  }
  return (value) => {
    const t = (value - domain[0]) / (domain[1] - domain[0]);
    return range[0] + t * (range[1] - range[0]);
  };
}

function formatNumber(value, fmt) {
  if (fmt === "percent") return `${value}%`;
  if (fmt === "year") return String(Math.round(value));
  if (fmt === "currencyK") {
    if (value === 0) return "$0";
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}m`;
    return `$${Math.round(value / 1000)}k`;
  }
  if (fmt === "sci") {
    if (value === 0) return "0";
    const exp = Math.round(Math.log10(Math.abs(value)));
    const mantissa = value / 10 ** exp;
    const base = Math.abs(mantissa - 1) < 1e-9 ? "10" : `${mantissa.toFixed(1)}×10`;
    return `${base}${superscript(exp)}`;
  }
  if (fmt === "pow10") {
    const exp = Math.round(Math.log10(value));
    return `10${superscript(exp)}`;
  }
  if (fmt === "sciShort") {
    if (value === 1) return "1";
    return `1e${Math.round(Math.log10(value))}`;
  }
  if (fmt === "integer") return Math.round(value).toLocaleString("en-US");
  if (fmt === "oneDecimal") return value.toFixed(1);
  if (typeof fmt === "function") return fmt(value);
  if (Math.abs(value) >= 10_000) return Math.round(value).toLocaleString("en-US");
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(1);
}

function superscript(n) {
  const map = { "-": "−", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
  return String(n).split("").map((c) => map[c] ?? c).join("");
}

function linePath(data, xScale, yScale) {
  let d = "";
  let started = false;
  for (const point of data) {
    if (!point || point.length < 2 || point[0] == null || point[1] == null) {
      started = false;
      continue;
    }
    const x = xScale(point[0]);
    const y = yScale(point[1]);
    d += `${started ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`;
    started = true;
  }
  return d;
}

function bandPath(data, xScale, yScale) {
  if (!data.length) return "";
  let d = "";
  for (let i = 0; i < data.length; i += 1) {
    const [x, , hi] = data[i];
    d += `${i === 0 ? "M" : "L"}${xScale(x).toFixed(2)},${yScale(hi).toFixed(2)}`;
  }
  for (let i = data.length - 1; i >= 0; i -= 1) {
    const [x, lo] = data[i];
    d += `L${xScale(x).toFixed(2)},${yScale(lo).toFixed(2)}`;
  }
  return `${d}Z`;
}

function normalize(spec) {
  if (Array.isArray(spec.panels) && spec.panels.length) {
    return {
      ...spec,
      panels: spec.panels.map((panel) => ({
        series: [],
        bands: [],
        refs: [],
        highlights: [],
        annotations: [],
        brackets: [],
        ...panel,
      })),
    };
  }
  return {
    ...spec,
    panels: [
      {
        y: spec.y,
        label: spec.panelLabel,
        series: spec.series || [],
        bands: spec.bands || [],
        refs: spec.refs || [],
        highlights: spec.highlights || [],
        annotations: spec.annotations || [],
        brackets: spec.brackets || [],
      },
    ],
  };
}

function colorFor(name) {
  if (name === "gray") return COLORS.gray;
  if (name === "warning") return COLORS.warning;
  if (name === "secondary") return COLORS.secondary;
  return COLORS.blue;
}

function softFor(name) {
  if (name === "gray") return COLORS.graySoft;
  if (name === "warning") return COLORS.warningSoft;
  return COLORS.blueSoft;
}

function wrapText(value, maxChars) {
  const words = String(value).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (test.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

/**
 * Render a chart into a host element.
 * spec: see data/entries.js. opts: { width, height }
 */
export function renderChart(host, spec, opts = {}) {
  if (!host) return;
  const width = Math.max(260, Math.round(opts.width || host.clientWidth || 560));
  const height = Math.max(190, Math.round(opts.height || width * 0.58));
  const s = normalize(spec);
  const uid = `chart-${chartCounter++}`;
  const small = width < 470;

  host.replaceChildren();
  host.setAttribute("role", "img");
  host.setAttribute("aria-label", spec.description || `${spec.title}. ${spec.subtitle || ""}`.trim());

  const svg = svgEl("svg", {
    viewBox: `0 0 ${width} ${height}`,
    width,
    height,
    preserveAspectRatio: "xMinYMin meet",
    "aria-hidden": "true",
    focusable: "false",
  });
  host.appendChild(svg);

  const titleLines = spec.title
    ? wrapText(spec.title, Math.max(18, Math.floor((width - 8) / (12.5 * 0.55))))
    : [];
  const subtitleLines = spec.subtitle
    ? wrapText(spec.subtitle, Math.max(24, Math.floor((width - 8) / (10.5 * 0.52))))
    : [];
  const headerHeight =
    (titleLines.length ? titleLines.length * 14 : 0) +
    (subtitleLines.length ? subtitleLines.length * 11.5 + 3 : 0) +
    10;

  const margin = {
    left: small ? 54 : 58,
    right: spec.right || (small ? 16 : 20),
    top: Math.max(46, headerHeight),
    bottom: 30,
  };
  const left = margin.left;
  const right = width - margin.right;
  const panelCount = s.panels.length;
  const gap = panelCount > 1 ? (spec.panelGap ?? 26) : 0;
  const available = height - margin.top - margin.bottom;
  const panelHeight = (available - gap * (panelCount - 1)) / panelCount;

  let headerY = 14;
  for (const line of titleLines) {
    svgText(svg, 0, headerY, line, "chart-title");
    headerY += 14;
  }
  if (subtitleLines.length) {
    headerY += 2;
    for (const line of subtitleLines) {
      svgText(svg, 0, headerY, line, "chart-subtitle");
      headerY += 11.5;
    }
  }

  const defs = svgEl("defs", {}, svg);

  s.panels.forEach((panel, index) => {
    const isLast = index === panelCount - 1;
    const panelTop = margin.top + index * (panelHeight + gap);
    const labelHeight = panel.label ? 15 : 0;
    const bottomRoom = isLast ? 32 : 5;
    const plotTop = panelTop + labelHeight;
    const plotBottom = panelTop + panelHeight - bottomRoom;
    const plotHeight = Math.max(40, plotBottom - plotTop);

    if (panel.label) {
      svgText(svg, left, panelTop + 1, panel.label, "panel-label");
    }

    const clipId = `${uid}-p${index}`;
    const clip = svgEl("clipPath", { id: clipId }, defs);
    svgEl("rect", { x: left, y: plotTop, width: Math.max(1, right - left), height: Math.max(1, plotHeight) }, clip);

    const xScale = makeScale(s.x.domain, [left, right], s.x.scale || "linear");
    const yScale = makeScale(panel.y.domain, [plotBottom, plotTop], panel.y.scale || "linear");

    // Horizontal gridlines and y ticks
    const yTicks = panel.y.ticks || [];
    for (const tick of yTicks) {
      const y = yScale(tick);
      if (y < plotTop - 0.5 || y > plotBottom + 0.5) continue;
      svgEl("line", {
        x1: left,
        x2: right,
        y1: y,
        y2: y,
        stroke: COLORS.ruleSoft,
        "stroke-width": 1,
      }, svg);
      svgText(
        svg,
        left - 6,
        y + 3.2,
        formatNumber(tick, panel.y.format),
        "tick-label",
        { "text-anchor": "end" },
      );
    }

    // Axis frames
    svgEl("line", { x1: left, x2: left, y1: plotTop, y2: plotBottom, stroke: COLORS.rule, "stroke-width": 1 }, svg);
    svgEl("line", { x1: left, x2: right, y1: plotBottom, y2: plotBottom, stroke: COLORS.rule, "stroke-width": 1 }, svg);

    // Y axis label
    if (panel.y.label) {
      const yLabelX = small ? 10 : 12;
      svgText(
        svg,
        yLabelX,
        (plotTop + plotBottom) / 2,
        panel.y.label,
        "axis-label",
        { transform: `rotate(-90 ${yLabelX} ${(plotTop + plotBottom) / 2})`, "text-anchor": "middle" },
      );
    }

    // X ticks and labels
    const xTicks = small && s.x.smallTicks ? s.x.smallTicks : s.x.ticks || [];
    xTicks.forEach((tick, i) => {
      const x = xScale(tick);
      if (x < left - 0.5 || x > right + 0.5) return;
      svgEl("line", { x1: x, x2: x, y1: plotBottom, y2: plotBottom + 4, stroke: COLORS.rule, "stroke-width": 1 }, svg);
      if (isLast) {
        const label = s.x.tickLabels ? s.x.tickLabels[i] : formatNumber(tick, s.x.format);
        svgText(svg, x, plotBottom + 16, label, "tick-label", { "text-anchor": "middle" });
      }
    });

    if (isLast && s.x.label) {
      svgText(svg, (left + right) / 2, plotBottom + 30, s.x.label, "axis-label", { "text-anchor": "middle" });
    }

    // Highlights behind everything
    for (const highlight of panel.highlights) {
      const x0 = xScale(highlight.x0);
      const x1 = xScale(highlight.x1);
      svgEl("rect", {
        x: Math.min(x0, x1),
        y: plotTop,
        width: Math.abs(x1 - x0),
        height: plotHeight,
        fill: highlight.color || "rgba(47,95,127,0.06)",
      }, svg);
      if (highlight.edges) {
        for (const edge of [x0, x1]) {
          svgEl("line", {
            x1: edge,
            x2: edge,
            y1: plotTop,
            y2: plotBottom,
            stroke: "rgba(47,95,127,0.45)",
            "stroke-width": 1,
            "stroke-dasharray": "3 3",
          }, svg);
        }
      }
      if (highlight.label) {
        svgText(
          svg,
          Math.min(x0, x1) + 4,
          plotTop + 12,
          highlight.label,
          "annotation",
          { "text-anchor": "start" },
        );
      }
    }

    const clipped = svgEl("g", { "clip-path": `url(#${clipId})` }, svg);

    // Uncertainty bands
    for (const band of panel.bands) {
      svgEl("path", {
        d: bandPath(band.data, xScale, yScale),
        fill: softFor(band.color),
        opacity: band.opacity ?? 0.72,
        stroke: "none",
      }, clipped);
    }

    // Reference lines
    for (const ref of panel.refs) {
      const color = ref.color === "warning" ? COLORS.warning : "#9aa3ad";
      if (ref.x != null) {
        const x = xScale(ref.x);
        svgEl("line", {
          x1: x,
          x2: x,
          y1: plotTop,
          y2: plotBottom,
          stroke: color,
          "stroke-width": 1,
          "stroke-dasharray": "3 3",
        }, clipped);
        if (ref.label) {
          const y = ref.labelY === "bottom" ? plotBottom - 4 : plotTop + 11;
          svgText(svg, x + 3, y, ref.label, "annotation halo", { "text-anchor": "start" });
        }
      }
      if (ref.y != null) {
        const y = yScale(ref.y);
        svgEl("line", {
          x1: left,
          x2: right,
          y1: y,
          y2: y,
          stroke: color,
          "stroke-width": 1,
          "stroke-dasharray": "3 3",
        }, clipped);
        if (ref.label) {
          const anchor = ref.labelAnchor || "start";
          const tx = anchor === "end" ? right - 4 : left + 4;
          svgText(svg, tx, y - 4, ref.label, "annotation halo", { "text-anchor": anchor });
        }
      }
    }

    // Series
    for (const series of panel.series) {
      const color = colorFor(series.color);
      if (series.type === "scatter") {
        for (const point of series.data) {
          svgEl("circle", {
            cx: xScale(point[0]),
            cy: yScale(point[1]),
            r: series.radius ?? 2.1,
            fill: series.fill || "none",
            stroke: color,
            "stroke-width": series.strokeWidth ?? 1,
            opacity: series.opacity ?? 0.55,
          }, clipped);
        }
        continue;
      }

      if (series.type === "points") {
        const offsetX = series.offsetX || 0;
        for (const point of series.data) {
          const [rawX, y, se] = point;
          const x = xScale(rawX + offsetX);
          if (series.error && se != null) {
            const yTop = yScale(y + se);
            const yBottom = yScale(y - se);
            svgEl("line", { x1: x, x2: x, y1: yTop, y2: yBottom, stroke: color, "stroke-width": 1.1 }, clipped);
            svgEl("line", { x1: x - 3.5, x2: x + 3.5, y1: yTop, y2: yTop, stroke: color, "stroke-width": 1.1 }, clipped);
            svgEl("line", { x1: x - 3.5, x2: x + 3.5, y1: yBottom, y2: yBottom, stroke: color, "stroke-width": 1.1 }, clipped);
          }
          svgEl("circle", {
            cx: x,
            cy: yScale(y),
            r: series.radius ?? 3.4,
            fill: series.fill === "solid" ? color : COLORS.page,
            stroke: color,
            "stroke-width": 1.4,
          }, clipped);
        }
        continue;
      }

      // line
      svgEl("path", {
        d: linePath(series.data, xScale, yScale),
        fill: "none",
        stroke: color,
        "stroke-width": series.width ?? (series.emphasize ? 2.3 : 1.8),
        "stroke-linejoin": "round",
        "stroke-linecap": "round",
        "stroke-dasharray": series.dash || "none",
        opacity: series.opacity ?? 1,
      }, clipped);
    }

    // Brackets
    for (const bracket of panel.brackets) {
      const x0 = xScale(bracket.x0);
      const x1 = xScale(bracket.x1);
      const y = yScale(bracket.y);
      const cap = 5;
      const color = bracket.color === "warning" ? COLORS.warning : COLORS.blue;
      svgEl("path", {
        d: `M${x0.toFixed(2)},${(y + cap).toFixed(2)}L${x0.toFixed(2)},${y.toFixed(2)}L${x1.toFixed(2)},${y.toFixed(2)}L${x1.toFixed(2)},${(y + cap).toFixed(2)}`,
        fill: "none",
        stroke: color,
        "stroke-width": 1.1,
      }, svg);
      if (bracket.text) {
        svgText(
          svg,
          (x0 + x1) / 2,
          y - 5,
          bracket.text,
          "annotation accent halo",
          { "text-anchor": "middle" },
        );
      }
    }

    // Annotations
    for (const note of panel.annotations) {
      const x = xScale(note.x);
      const y = yScale(note.y);
      const tx = x + (note.dx || 0);
      const ty = y + (note.dy || 0);
      if (note.marker) {
        svgEl("circle", {
          cx: x,
          cy: y,
          r: 2.6,
          fill: note.color === "warning" ? COLORS.warning : COLORS.blue,
          stroke: COLORS.page,
          "stroke-width": 1,
        }, svg);
      }
      if (note.leader) {
        svgEl("line", {
          x1: x,
          y1: y,
          x2: tx,
          y2: ty - 3,
          stroke: COLORS.gray,
          "stroke-width": 0.8,
        }, svg);
      }
      const cls = `annotation halo${note.color === "accent" ? " accent" : ""}${note.color === "warning" ? " warn" : ""}`;
      svgText(svg, tx, ty, note.text, cls, { "text-anchor": note.anchor || "start" });
    }

    // Direct series labels
    for (const series of panel.series) {
      if (!series.label) continue;
      let lx;
      let ly;
      if (series.label.x != null) {
        lx = xScale(series.label.x);
        ly = yScale(series.label.y);
      } else if (series.data && series.data.length) {
        const last = series.data[series.data.length - 1];
        lx = xScale(last[0] + (series.offsetX || 0));
        ly = yScale(last[1]);
      } else {
        continue;
      }
      const anchor = series.label.anchor || "start";
      const dx = series.label.dx ?? 5;
      const dy = series.label.dy ?? 3;
      const cls = `series-label halo${series.label.accent ? " accent" : ""}`;
      svgText(svg, lx + dx, ly + dy, series.label.text, cls, { "text-anchor": anchor });
    }
  });

  return { width, height };
}

export { COLORS };
