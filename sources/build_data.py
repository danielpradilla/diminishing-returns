"""Generate data/chart-data.js from the downloaded sources.

Run from the repository root:
    python3 sources/build_data.py

This script is documentation of the reconstruction, not part of the page.
It reads the Killingsworth OSF CSV and the Baum et al. Source Data workbook.
The Paluch, Rohrer, Morton and Bloom series are transcribed from the
digitization values recorded in this script (see comments and SPEC.md).
"""
import csv
import json
import math
import statistics
from collections import defaultdict
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "sources"


def js(value):
    return json.dumps(value, separators=(",", ":"))


def fuel():
    return [[round(mpg, 1), round(10000 / mpg, 1)] for mpg in [x / 2 for x in range(20, 121)]]


def hours():
    out = []
    for i in range(48, 145):
        h = i / 2
        value = 2900 + 126.089 * (h - 24)
        if h > 49:
            value -= 4.533 * (h - 49) ** 2
        out.append([h, round(value, 1)])
    return out


# Figure 3 of Paluch et al. (2022), digitized at 300 dpi from the UCL copy.
# y-axis is logarithmic; tick calibration: HR 1.0 at row 253.5, 514 px per
# decade. x-axis: 0 steps at column 130.5, 70.44 px per 1000 steps.
# Values below are the central lines and the visible 95% CI band limits.
STEPS = {
    "older": {
        "ref": 3000,
        "plateau": [6000, 8000],
        "hr": [[0, 2.000], [1000, 1.622], [2000, 1.268], [3000, 1.000], [4000, 0.789],
               [5000, 0.626], [6000, 0.539], [7000, 0.494], [8000, 0.472],
               [9000, 0.458], [10000, 0.443], [11000, 0.430], [12000, 0.417],
               [13000, 0.404], [14000, 0.391], [15000, 0.379], [16000, 0.367]],
        "band": [[0, 2.150, 1.850], [1000, 1.893, 1.409], [2000, 1.384, 1.194], [3000, 1.000, 1.000],
                 [4000, 0.849, 0.736], [5000, 0.723, 0.550], [6000, 0.637, 0.454],
                 [7000, 0.588, 0.415], [8000, 0.562, 0.402], [9000, 0.538, 0.389],
                 [10000, 0.531, 0.374], [11000, 0.523, 0.356], [12000, 0.516, 0.337],
                 [13000, 0.516, 0.317], [14000, 0.516, 0.298], [15000, 0.516, 0.280],
                 [16000, 0.516, 0.261]],
    },
    "younger": {
        "ref": 5000,
        "plateau": [8000, 10000],
        "hr": [[0, 2.280], [1000, 2.240], [2000, 2.039], [3000, 1.622], [4000, 1.288],
               [5000, 1.000], [6000, 0.807], [7000, 0.652], [8000, 0.567],
               [9000, 0.543], [10000, 0.543], [11000, 0.551], [12000, 0.562],
               [13000, 0.575], [14000, 0.585], [15000, 0.600], [16000, 0.615]],
        # The red curve is defined at 1000 = 2.039; the central value at 3000
        # was read from the crossing of the two published curves. The band at
        # the 5000 reference pinches to 1.0 by construction.
        "band": [[0, 2.400, 1.600], [1000, 2.285, 1.396], [2000, 2.285, 1.288], [3000, 2.166, 1.188],
                 [4000, 1.480, 1.091], [5000, 1.000, 1.000], [6000, 0.920, 0.688],
                 [7000, 0.857, 0.501], [8000, 0.808, 0.397], [9000, 0.787, 0.369],
                 [10000, 0.790, 0.371], [11000, 0.805, 0.379], [12000, 0.830, 0.384],
                 [13000, 0.868, 0.383], [14000, 0.916, 0.377], [15000, 0.976, 0.371],
                 [16000, 1.043, 0.361]],
    },
}

PRACTICE = {
    "hi": {"label": "9 problems", "points": [[1, 69, 7.0], [2, 28, 7.0]]},
    "lo": {"label": "3 problems", "points": [[1, 67, 7.5], [2, 27, 7.3]]},
}

# Figure 5 of Morton et al. (2018), digitized at 400 dpi. x: 0.8 at column
# 570.5, 610 px per g/kg/day. y: 0 at row 543, 114 px per kg. A relocated
# response caught 39 of the 42 plotted arms; overlapping circles are not
# separately recoverable. Values rounded to 0.01.
PROTEIN_ARMS = [
    [0.89, 0.88], [0.90, 1.01], [0.95, -0.39], [0.97, 0.68], [1.01, 1.07],
    [1.06, 0.68], [1.10, 0.10], [1.10, 0.58], [1.10, 0.69], [1.13, -0.59],
    [1.20, 1.21], [1.20, -1.07], [1.20, 0.78], [1.23, 2.14], [1.24, 1.84],
    [1.24, 0.10], [1.25, -0.39], [1.27, 1.65], [1.30, 0.58], [1.30, 1.55],
    [1.35, 1.84], [1.40, 0.10], [1.45, 0.39], [1.54, 2.43], [1.59, 2.33],
    [1.60, 0.68], [1.60, 2.23], [1.62, 2.72], [1.64, 2.33], [1.70, 0.58],
    [1.80, 0.48], [1.82, 3.79], [1.90, 2.33], [2.00, 1.36], [2.10, 0.29],
    [2.10, -0.11], [2.12, 1.17], [2.20, 1.75], [2.25, 2.04],
]


def protein():
    fit = []
    for i in range(17, 49):
        x = i / 20  # 0.85 to 2.40
        y = -1.235 + 1.75 * min(x, 1.62)
        fit.append([round(x, 2), round(y, 2)])
    return {"arms": PROTEIN_ARMS, "fit": fit, "breakpoint": 1.62, "ci": [1.03, 2.20]}


def income():
    rows = list(csv.DictReader(open(SRC / "killingsworth.csv")))
    by = defaultdict(list)
    for row in rows:
        by[int(float(row["income"]))].append(float(row["wellbeing"]))

    def quantile(values, p):
        values = sorted(values)
        k = (len(values) - 1) * p
        lo = int(k)
        hi = min(lo + 1, len(values) - 1)
        return values[lo] + (values[hi] - values[lo]) * (k - lo)

    cats = sorted(by)
    percentiles = [15, 30, 50, 70, 85]
    series = {str(p): [[c, round(quantile(by[c], p / 100), 2)] for c in cats] for p in percentiles}
    return {"categories": cats, "percentiles": percentiles, "series": series, "n": len(rows)}


def nitrogen():
    wb = openpyxl.load_workbook(SRC / "baum_source.xlsx", read_only=True, data_only=True)
    rows = list(wb["Fig 5"].iter_rows(values_only=True))[1:]
    out = {}
    for key, label in [("continuous", "Continuous Maize"), ("soybean", "Maize-Soybean")]:
        sub = [r for r in rows if r[1] == label]
        xs = [float(r[3]) for r in sub]
        ys = [float(r[2]) for r in sub]
        n = len(xs)
        X = [[1.0, x, x * x] for x in xs]
        # normal equations
        XtX = [[sum(X[i][a] * X[i][b] for i in range(n)) for b in range(3)] for a in range(3)]
        Xty = [sum(X[i][a] * ys[i] for i in range(n)) for a in range(3)]
        # gaussian elimination
        M = [row[:] + [Xty[i]] for i, row in enumerate(XtX)]
        for col in range(3):
            piv = max(range(col, 3), key=lambda r: abs(M[r][col]))
            M[col], M[piv] = M[piv], M[col]
            for r in range(col + 1, 3):
                f = M[r][col] / M[col][col]
                for c in range(col, 4):
                    M[r][c] -= f * M[col][c]
        beta = [0.0, 0.0, 0.0]
        for r in reversed(range(3)):
            beta[r] = (M[r][3] - sum(M[r][c] * beta[c] for c in range(r + 1, 3))) / M[r][r]
        fitted = [beta[0] + beta[1] * x + beta[2] * x * x for x in xs]
        dof = n - 3
        sigma2 = sum((ys[i] - fitted[i]) ** 2 for i in range(n)) / dof
        # inverse of XtX
        A = [row[:] + [1.0 if i == j else 0.0 for j in range(3)] for i, row in enumerate(XtX)]
        for col in range(3):
            piv = max(range(col, 3), key=lambda r: abs(A[r][col]))
            A[col], A[piv] = A[piv], A[col]
            d = A[col][col]
            A[col] = [v / d for v in A[col]]
            for r in range(3):
                if r != col:
                    f = A[r][col]
                    A[r] = [A[r][c] - f * A[col][c] for c in range(6)]
        inv = [row[3:] for row in A]
        t = 1.972  # ~97.5th percentile, df > 100
        maxx = max(xs)
        curve = []
        step = 2.5
        x = 0.0
        while x <= maxx + 0.01:
            a = [1.0, x, x * x]
            mean = beta[0] + beta[1] * x + beta[2] * x * x
            var = sum(a[i] * inv[i][j] * a[j] for i in range(3) for j in range(3))
            half = t * math.sqrt(sigma2 * var)
            curve.append([round(x, 1), round(mean, 2), round(mean - half, 2), round(mean + half, 2)])
            x += step
        out[key] = {
            "label": label,
            "coef": [round(v, 6) for v in beta],
            "n": n,
            "maxX": round(maxx, 1),
            "scatter": [[round(xs[i], 2), round(ys[i], 2)] for i in range(n)],
            "curve": curve,
        }
    return out


# Figure 4 of Bloom et al. (2020), digitized from the green line at 300 dpi.
# Right axis 0-20, 1971 = 1. Values rounded to 0.01.
RESEARCH = [
    [1971, 1.01], [1972, 1.16], [1973, 1.36], [1974, 1.53], [1975, 1.53],
    [1976, 1.61], [1977, 1.85], [1978, 2.07], [1979, 2.14], [1980, 2.39],
    [1981, 2.54], [1982, 2.98], [1983, 3.43], [1984, 4.14], [1985, 4.12],
    [1986, 4.46], [1987, 5.00], [1988, 5.13], [1989, 4.93], [1990, 5.47],
    [1991, 5.90], [1992, 6.02], [1993, 5.84], [1994, 6.29], [1995, 6.98],
    [1996, 7.28], [1997, 7.59], [1998, 7.75], [1999, 8.09], [2000, 9.64],
    [2001, 9.62], [2002, 9.84], [2003, 10.24], [2004, 10.66], [2005, 10.63],
    [2006, 12.70], [2007, 12.43], [2008, 13.15], [2009, 12.55], [2010, 13.94],
    [2011, 15.24], [2012, 16.37], [2013, 17.28], [2014, 18.14],
]

SCALING = [[round(10 ** (e / 20), 8), round((3.1e8 / 10 ** (e / 20)) ** 0.05, 4)]
           for e in range(-160, 1, 2)]


def main():
    data = {
        "fuel": fuel(),
        "hours": hours(),
        "steps": STEPS,
        "practice": PRACTICE,
        "protein": protein(),
        "income": income(),
        "nitrogen": nitrogen(),
        "research": RESEARCH,
        "scaling": SCALING,
    }
    lines = [
        "// Generated by sources/build_data.py. Edit that script, not this file.",
        "// Values are described in the source record of each entry.",
        "",
    ]
    for key, value in data.items():
        lines.append(f"export const {key} = {js(value)};")
        lines.append("")
    (ROOT / "data").mkdir(exist_ok=True)
    (ROOT / "data" / "chart-data.js").write_text("\n".join(lines))
    print("wrote data/chart-data.js")
    print("income n", data["income"]["n"])
    print("nitrogen", {k: (v["n"], v["coef"]) for k, v in data["nitrogen"].items()})


if __name__ == "__main__":
    main()
