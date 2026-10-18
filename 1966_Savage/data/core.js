// Registro de escenas, géneros y movimientos de 1966 según Jon Savage. Cada fichero de capítulo (data/NN-*.js,
// escritos a mano leyendo el libro) llama a SAVAGE.chapter({...}) y SAVAGE.add([...], n).
// Los datos se fusionan por id: los arrays se unen y cada capítulo puede añadir
// discos, citas (refs) y una nota propia sobre una escena ya definida en otro.
window.SAVAGE = (function () {
  const genres = new Map();
  const chapters = [];

  const FAMILIES = {
    beat:       { name: 'Beat británico, mod y freakbeat', color: '#ef4444' },
    garage:     { name: 'Garage y punk americano', color: '#f97316' },
    folk:       { name: 'Folk rock y canción protesta', color: '#a3e635' },
    psico:      { name: 'Psicodelia, LSD y raga rock', color: '#c084fc' },
    pop:        { name: 'Pop de estudio: Spector, Beach Boys, Meek', color: '#38bdf8' },
    soul:       { name: 'Soul, Motown, R&B y ska', color: '#facc15' },
    vanguardia: { name: 'Vanguardia: Warhol, Velvet, free jazz, arte', color: '#e5e7eb' },
    juventud:   { name: 'Juventud, moda y medios: Swinging London, radio pirata', color: '#f472b6' },
    politica:   { name: 'Política: CND, Vietnam, derechos civiles, feminismo, gays', color: '#22d3ee' },
  };

  const key = (t) => (t.a + '|' + t.t).toLowerCase();

  function mergeArr(a = [], b = [], k = (x) => (typeof x === 'string' ? x.toLowerCase() : JSON.stringify(x))) {
    const seen = new Set(a.map(k));
    const out = a.slice();
    for (const x of b) if (!seen.has(k(x))) { seen.add(k(x)); out.push(x); }
    return out;
  }

  // Anota en cada disco los capítulos que lo citan.
  function cite(tracks, t, ch) {
    const m = tracks.find((x) => key(x) === key(t));
    if (m && ch != null) m.chs = mergeArr(m.chs, [ch]);
  }

  function add(list, chapter) {
    for (const g of list) {
      let cur = genres.get(g.id);
      if (!cur) {
        cur = { id: g.id, aka: [], influences: [], artists: [], tracks: [], labels: [], refs: [], notes: [], chapters: [] };
        genres.set(g.id, cur);
      }
      for (const f of ['aka', 'influences', 'artists', 'labels']) cur[f] = mergeArr(cur[f], g[f]);
      cur.tracks = mergeArr(cur.tracks, (g.tracks || []).map((t) => ({ ...t })), key);
      for (const t of g.tracks || []) {
        if (t.ess) { const m = cur.tracks.find((x) => key(x) === key(t)); if (m) m.ess = 1; }
        cite(cur.tracks, t, chapter);
      }
      cur.refs = mergeArr(cur.refs, (g.refs || []).map((r) => ({ ch: chapter, ...r })), (r) => r.q);
      for (const f of ['name', 'family', 'start', 'end', 'place', 'desc']) if (g[f] != null && cur[f] == null) cur[f] = g[f];
      if (g.desc != null) cur.descCh = cur.descCh ?? chapter;
      if (g.note) cur.notes.push({ ch: chapter, text: g.note });
      if (chapter != null && !cur.chapters.includes(chapter)) cur.chapters.push(chapter);
    }
  }

  return {
    FAMILIES,
    chapters,
    genres,
    chapter(meta) { chapters.push(meta); },
    add,
  };
})();
