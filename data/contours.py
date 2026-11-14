"""Courbes de niveau du hero : relief synthétique (somme de collines
gaussiennes, graine fixe), tracé par marching squares en Python pur.
Sortie : deux fragments de tracé SVG (courbes normales, courbes maîtresses
toutes les 5), dans un repère 1000 x 640. Relancer : python3 contours.py <dossier data>."""
import math, random, sys, os
W, H, NX, NY = 1000, 640, 125, 80
random.seed(41)
hills = [(random.uniform(-.1, 1.1), random.uniform(-.1, 1.1), random.uniform(.10, .30), random.uniform(.4, 1.0)) for _ in range(11)]
hills += [(.72, .40, .16, 1.5), (.30, .72, .20, 1.1)]
def z(u, v):
    s = 0.0
    for cx, cy, r, a in hills:
        s += a * math.exp(-((u - cx) ** 2 + ((v - cy) * H / W) ** 2) / (2 * r * r))
    return s + .25 * u
g = [[z(i / NX, j / NY) for i in range(NX + 1)] for j in range(NY + 1)]
lo = min(map(min, g)); hi = max(map(max, g))
N = 20
levels = [lo + (hi - lo) * (k + .5) / N for k in range(N)]
dx, dy = W / NX, H / NY
def interp(p, q, a, b, lv):
    t = (lv - a) / (b - a)
    return (round(p[0] + (q[0] - p[0]) * t, 1), round(p[1] + (q[1] - p[1]) * t, 1))
def segs(lv):
    out = []
    for j in range(NY):
        for i in range(NX):
            c = [(i * dx, j * dy), ((i + 1) * dx, j * dy), ((i + 1) * dx, (j + 1) * dy), (i * dx, (j + 1) * dy)]
            v = [g[j][i], g[j][i + 1], g[j + 1][i + 1], g[j + 1][i]]
            pts = []
            for a in range(4):
                b = (a + 1) % 4
                if (v[a] < lv) != (v[b] < lv):
                    pts.append(interp(c[a], c[b], v[a], v[b], lv))
            if len(pts) == 2: out.append((pts[0], pts[1]))
            elif len(pts) == 4: out += [(pts[0], pts[1]), (pts[2], pts[3])]
    return out
def chain(ss):
    adj = {}
    for a, b in ss:
        if a == b: continue
        adj.setdefault(a, []).append(b); adj.setdefault(b, []).append(a)
    used = set(); lines = []
    def walk(start):
        line = [start]; cur = start
        while True:
            nxt = next((n for n in adj[cur] if (cur, n) not in used), None)
            if nxt is None: break
            used.add((cur, nxt)); used.add((nxt, cur)); line.append(nxt); cur = nxt
        return line
    for p in [p for p in adj if len(adj[p]) == 1] + list(adj):
        if any((p, n) not in used for n in adj[p]):
            l = walk(p)
            if len(l) > 6: lines.append(l)
    return lines
def d(lines):
    parts = []
    for l in lines:
        l = l[::2] + ([l[-1]] if len(l) % 2 == 0 else [])
        parts.append("M" + " ".join("%g %g" % p for p in l))
    return "".join(parts)
norm, idx = [], []
for k, lv in enumerate(levels):
    (idx if k % 5 == 2 else norm).extend(chain(segs(lv)))
out = sys.argv[1]
open(os.path.join(out, "hero-contours.path"), "w").write(d(norm))
open(os.path.join(out, "hero-contours-index.path"), "w").write(d(idx))
print(len(d(norm)), len(d(idx)))
