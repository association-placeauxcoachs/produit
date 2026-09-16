/* Étude « éditeur de schéma sur mobile » — rendu du terrain et icônes partagés.
   Repère : un terrain entier fait 400 × 200 (10 unités = 1 m), buts aux petits côtés.
   En portrait, le repère est tourné de 90° : l'abscisse du terrain descend l'écran. */
(function () {
  const ICONES = {
    curseur: '<path d="M4 3l7.5 17 2.4-6.6L20.5 11z"/>',
    joueur: '<circle cx="12" cy="5" r="2.6"/><path d="M6 21l3-8h6l3 8M9 13l-3-4 6-2 6 2-3 4"/>',
    ballon: '<circle cx="12" cy="12" r="9"/><path d="M12 3c2 3 2 15 0 18M3 12c3-2 15-2 18 0M5.5 6.5c3 2 10 2 13 0M5.5 17.5c3-2 10-2 13 0"/>',
    plot: '<path d="M9.5 3h5l4 15H5.5zM4 21h16"/><path d="M7.5 11h9"/>',
    coupelle: '<path d="M4 14h16l-2 5H6z"/><path d="M8 14V9h8v5"/>',
    cerceau: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="5"/>',
    latte: '<rect x="3" y="9" width="18" height="6" rx="1"/>',
    echelle: '<path d="M6 3v18M18 3v18M6 8h12M6 13h12M6 18h12"/>',
    haie: '<path d="M4 20V8h16v12M4 12h16M9 8V5M15 8V5"/>',
    trajectoire: '<path d="M4 19c4-10 8-10 12-4"/><path d="M14 9l4 6 2-7z"/>',
    separation: '<path d="M12 3v18M6 8l6-4 6 4M6 16l6 4 6-4"/>',
    texte: '<path d="M5 6V4h14v2M12 4v16M9 20h6"/>',
    carre: '<rect x="4" y="4" width="16" height="16" rx="2"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    grille: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    undo: '<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',
    redo: '<path d="M15 14l5-5-5-5"/><path d="M20 9H10a6 6 0 0 0 0 12h3"/>',
    plusv: '<circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/>',
    retour: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
    croix: '<path d="M6 6l12 12M18 6L6 18"/>',
    corbeille: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    dupliquer: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
    palette: '<circle cx="12" cy="12" r="9"/><circle cx="8.5" cy="10" r="1.4" fill="currentColor"/><circle cx="12" cy="7.5" r="1.4" fill="currentColor"/><circle cx="15.5" cy="10" r="1.4" fill="currentColor"/><path d="M12 21c-1.5-2-.5-4 1.5-4s3-2 1.5-4"/>',
    rotation: '<path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4v5h-5"/>',
    lire: '<path d="M7 4l13 8-13 8z" fill="currentColor" stroke="none"/>',
    pause: '<rect x="6" y="4" width="4" height="16" fill="currentColor" stroke="none"/><rect x="14" y="4" width="4" height="16" fill="currentColor" stroke="none"/>',
    precedent: '<path d="M18 5v14L8 12z" fill="currentColor" stroke="none"/><path d="M6 5v14"/>',
    suivant: '<path d="M6 5v14l10-7z" fill="currentColor" stroke="none"/><path d="M18 5v14"/>',
    check: '<path d="M5 12l5 5L20 7"/>',
    chevron: '<path d="M9 6l6 6-6 6"/>',
    crayon: '<path d="M4 20l4-1L19 8l-3-3L5 16z"/>',
    main: '<path d="M8 13V5a1.5 1.5 0 0 1 3 0v6m0-3a1.5 1.5 0 0 1 3 0v3m0-1a1.5 1.5 0 0 1 3 0v6a6 6 0 0 1-12 0v-3l-2-3a1.5 1.5 0 0 1 2.5-1.5L8 13"/>',
    lasso: '<path d="M4 12c0-3.9 3.6-7 8-7s8 3.1 8 7-3.6 7-8 7c-1 0-2-.2-2.9-.5"/><path d="M8 16c-1 1-1.5 2.5-1 4"/>',
    aide: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7M12 17h.01"/>',
    terrain: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M12 5v14M3 9h3v6H3M21 9h-3v6h3"/>',
    plein: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    sauvegarde: '<path d="M5 4h11l3 3v13H5z"/><path d="M8 4v5h7V4M8 20v-6h8v6"/>',
    tourner: '<path d="M12 3v3M12 18v3M3 12h3M18 12h3"/><path d="M17.5 6.5A8 8 0 0 1 20 12"/><path d="M20 8v4h-4"/>',
  };

  function ic(nom, taille) {
    const t = taille ? ` width="${taille}" height="${taille}"` : '';
    return `<svg viewBox="0 0 24 24"${t} fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONES[nom] || ''}</svg>`;
  }

  /* Un demi-terrain vu d'un but : zone 6 m, ligne 9 m, ligne 7 m, but.
     Dessiné dans le repère paysage, but à x = 0. */
  function moitie(miroir) {
    const t = miroir ? 'translate(400 0) scale(-1 1)' : '';
    return `<g transform="${t}">
      <path d="M0 40 A60 60 0 0 1 60 100 L60 100 A60 60 0 0 1 0 160 Z" fill="var(--terrain-zone)"/>
      <path d="M0 40 A60 60 0 0 1 60 100 A60 60 0 0 1 0 160" fill="none" stroke="var(--ligne)" stroke-width="1.6"/>
      <path d="M0 10 A90 90 0 0 1 90 100 A90 90 0 0 1 0 190" fill="none" stroke="var(--ligne)" stroke-width="1.4" stroke-dasharray="5 4"/>
      <path d="M70 94v12" stroke="var(--ligne)" stroke-width="1.6"/>
      <rect x="-6" y="85" width="6" height="30" fill="none" stroke="var(--ligne)" stroke-width="2"/>
    </g>`;
  }

  /* Terrain complet en repère paysage (400 × 200). `enfants` : éléments à poser dans ce repère. */
  function corps(enfants, demi) {
    const largeur = demi ? 250 : 400;
    return `<rect x="0" y="0" width="${largeur}" height="200" fill="var(--terrain)"/>
      ${moitie(false)}${demi ? '' : moitie(true)}
      ${demi ? '' : '<path d="M200 0v200" stroke="var(--ligne)" stroke-width="1.6"/><circle cx="200" cy="100" r="18" fill="none" stroke="var(--ligne)" stroke-width="1.4"/>'}
      ${enfants || ''}`;
  }

  /* orientation : 'portrait' (terrain tourné, vertical) ou 'paysage'. */
  function terrain(opts) {
    const o = Object.assign({ orientation: 'paysage', enfants: '', demi: false, classe: 'terrain', marge: 8, viewBox: null }, opts || {});
    const L = o.demi ? 250 : 400;
    const m = o.marge;
    if (o.orientation === 'portrait') {
      const vb = o.viewBox || `${-m} ${-m} ${200 + 2 * m} ${L + 2 * m}`;
      return `<svg class="${o.classe}" viewBox="${vb}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <g transform="rotate(90) translate(0 -200)">${corps(o.enfants, o.demi)}</g></svg>`;
    }
    return `<svg class="${o.classe}" viewBox="${-m} ${-m} ${L + 2 * m} ${200 + 2 * m}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${corps(o.enfants, o.demi)}</svg>`;
  }

  /* Éléments, aux sprites et à l'échelle de l'application.
     La scène Konva fait 1190 × 565 pour un terrain qui en occupe 90 % ; ici le terrain fait 400 de long,
     d'où un facteur 400 / 1071 ≈ 0,37 appliqué aux dimensions réelles des sprites.
     En portrait, les pièces sont contre-tournées : le terrain tourne sous elles, elles restent droites. */
  let PORTRAIT = false;
  const K = 400 / 1071;
  function droit(x, y) { return PORTRAIT ? ` rotate(-90 ${x} ${y})` : ''; }
  function texteDroit(x, y, contenu, attrs) {
    return `<text x="${x}" y="${y}" ${attrs || ''} transform="${droit(x, y).trim()}">${contenu}</text>`;
  }
  /* Joueur : arc « M -20,20 C -20 -18, 20 -18, 20 20 » (trait 6) + disque r 12, couleur unie (Joueur.tsx). */
  function joueur(x, y, couleur, _label, opts) {
    const o = Object.assign({ selection: false, fantome: false, halo: false, echelle: 1 }, opts || {});
    const sc = K * o.echelle;
    const r = 12 * sc, R = 20 * sc;
    const op = o.fantome ? ' opacity=".35"' : '';
    const halo = o.halo ? `<circle cx="${x}" cy="${y}" r="${R + 10}" fill="none" stroke="var(--orange)" stroke-width="1.5" stroke-dasharray="4 3"/>` : '';
    const sel = o.selection ? `<circle cx="${x}" cy="${y}" r="${R + 4}" fill="rgba(235,93,33,.16)" stroke="var(--orange)" stroke-width="2"/>` : '';
    return `<g${op}>${halo}${sel}<g transform="translate(${x} ${y})${droit(0, 0)} scale(${sc})">
      <path d="M -20,20 C -20 -18, 20 -18, 20 20" fill="none" stroke="${couleur}" stroke-width="6" stroke-linecap="round"/>
      <circle cx="0" cy="0" r="12" fill="${couleur}"/></g></g>`;
  }
  /* Balle : ballon.svg, 16 × 16 (Ballon.tsx). */
  function ballon(x, y, opts) {
    const o = Object.assign({ fantome: false }, opts || {});
    const w = 16 * K;
    return `<image href="ballon.svg" x="${x - w / 2}" y="${y - w / 2}" width="${w}" height="${w}" transform="${droit(x, y).trim()}"${o.fantome ? ' opacity=".35"' : ''}/>`;
  }
  /* Plot : plot.svg, 25,6 × 38,4 (Plot.tsx). */
  function plot(x, y, opts) {
    const o = Object.assign({ fantome: false }, opts || {});
    const w = 25.6 * K, h = 38.4 * K;
    return `<image href="plot.svg" x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" transform="${droit(x, y).trim()}"${o.fantome ? ' opacity=".35"' : ''}/>`;
  }
  /* Trajectoire : points en repère terrain ; style 'course' (pointillé) ou 'passe' (plein). */
  function traj(points, style, opts) {
    const o = Object.assign({ numero: null, couleur: '#1C1726', poignees: false }, opts || {});
    const d = points.map((p, i) => (i ? 'L' : 'M') + p[0] + ' ' + p[1]).join(' ');
    const dash = style === 'course' ? ' stroke-dasharray="6 4"' : '';
    const fin = points[points.length - 1], av = points[points.length - 2];
    const a = Math.atan2(fin[1] - av[1], fin[0] - av[0]) * 180 / Math.PI;
    let s = `<path d="${d}" fill="none" stroke="${o.couleur}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"${dash}/>
      <path d="M-9 -5 L0 0 L-9 5" fill="none" stroke="${o.couleur}" stroke-width="2.4" stroke-linecap="round" transform="translate(${fin[0]} ${fin[1]}) rotate(${a})"/>`;
    if (o.poignees) {
      s += points.slice(1, -1).map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="7" fill="#fff" stroke="var(--orange)" stroke-width="2"/>`).join('');
    }
    if (o.numero !== null) {
      const mx = points[Math.floor(points.length / 2)];
      s += `<circle cx="${mx[0]}" cy="${mx[1] - 10}" r="7" fill="var(--orange)"/>` + texteDroit(mx[0], mx[1] - 7, o.numero, 'text-anchor="middle" font-size="8" font-weight="700" fill="#fff" font-family="Inter,system-ui,sans-serif"');
    }
    return s;
  }
  function setPortrait(v) { PORTRAIT = !!v; }

  window.M = { ic, terrain, joueur, ballon, plot, traj, setPortrait };
})();
