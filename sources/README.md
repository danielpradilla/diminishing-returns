# Source inputs

The generated chart data in `data/chart-data.js` is committed. The original PDFs and data workbooks
are kept locally for verification but are not committed or deployed.

To rerun `build_data.py`, download:

- Killingsworth, Kahneman and Mellers (2023), OSF project `qye4a`, file
  `Income_and_emotional_wellbeing_a_conflict_resolved.csv`:
  <https://osf.io/qye4a/>
- Baum et al. (2025), Source Data workbook on Zenodo record 14037090:
  <https://zenodo.org/records/14037090>

Place them in this directory as `killingsworth.csv` and `baum_source.xlsx`, then run:

```sh
python3 sources/build_data.py
```

The PDFs used for the other digitized figures are listed in `PROVENANCE.md`. They are research copies,
not part of the public repository.
