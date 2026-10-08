"""Scatter plot of IMDb vs MyAnimeList scores for anime movies.

Reads data/batch*.json, keeps titles with both scores, writes scores.png.
"""
import glob
import json
import sys

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

rows = []
for f in sorted(glob.glob("data/batch*.json")):
    rows += json.load(open(f))
rows = [r for r in rows if r.get("imdb_score") is not None and r.get("mal_score") is not None]
if len(rows) < 3:
    sys.exit(f"only {len(rows)} titles with both scores")

x = np.array([r["imdb_score"] for r in rows])
y = np.array([r["mal_score"] for r in rows])
r = np.corrcoef(x, y)[0, 1]
m, b = np.polyfit(x, y, 1)

fig, ax = plt.subplots(figsize=(8, 6))
ax.scatter(x, y, s=50, color="#2a6fdb", zorder=3)
xs = np.linspace(x.min() - 0.2, x.max() + 0.2, 2)
ax.plot(xs, m * xs + b, color="#888", ls="--", lw=1, label=f"fit  (Pearson r = {r:.2f}, n = {len(rows)})")
for row, xi, yi in zip(rows, x, y):
    ax.annotate(row["title"].split(":")[0], (xi, yi), xytext=(5, 4), textcoords="offset points", fontsize=8)
ax.set_xlabel("IMDb score")
ax.set_ylabel("MyAnimeList score")
ax.set_title("Anime movies: IMDb vs MyAnimeList")
ax.grid(alpha=0.3, zorder=0)
ax.legend(loc="lower right")
fig.text(0.01, 0.01, "Scores taken from search snippets/mirrors, not the site pages (unverified).", fontsize=7, color="#666")
fig.tight_layout(rect=(0, 0.02, 1, 1))
fig.savefig("scores.png", dpi=150)
print(f"n={len(rows)} r={r:.3f} slope={m:.2f}")
