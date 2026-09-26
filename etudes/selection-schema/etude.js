/* Étude « sélection dans les schémas » — cadres interactifs qui copient l'éditeur.
   Repère du terrain : 400 × 200 (10 unités = 1 m). Les sprites sont à l'échelle de
   l'application (facteur K = 400 / 1071, voir commun.js). */
(function () {
  const K = 400 / 1071;
  const ic = M.ic;
  const rad = (d) => d * Math.PI / 180;
  /* Scène tournée (téléphone et tablette tenus droits) : le terrain tourne, les pièces restent droites. */
  let PORTRAIT = false;
  /* Seules les pièces sans direction (plot, balle) sont contre-tournées ; un joueur, une latte, un
     carré ont un sens et tournent avec le terrain — c'est la règle de `rotationStockeeDUnePiece`. */
  const SANS_DIRECTION = { plot: true, ballon: true };
  const contre = (p) => (PORTRAIT && (!p || SANS_DIRECTION[p.type]) ? -90 : 0);

  /* ——— Pièces, dessinées comme dans l'application ——— */
  function joueur(p) {
    const s = K * (p.e || 1);
    const sx = s * (p.sx || 1), sy = s * (p.sy || 1);
    return `<g data-id="${p.id}" transform="translate(${p.x} ${p.y}) rotate(${(p.rot || 0) + contre(p)}) scale(${sx} ${sy})" class="${p.fantome ? 'fantome' : ''}${p.ombre ? ' ombre-bleue' : ''}">
      <path d="M -20,20 C -20 -18, 20 -18, 20 20" fill="none" stroke="${p.fill}" stroke-width="6" stroke-linecap="round"/>
      <circle r="12" fill="${p.fill}"/>
      <circle r="24" fill="transparent" style="cursor:move"/></g>`;
  }
  function plot(p) {
    const w = 25.6 * K * (p.e || 1), h = 38.4 * K * (p.e || 1);
    return `<image data-id="${p.id}" href="plot.svg" x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" transform="translate(${p.x} ${p.y}) rotate(${(p.rot || 0) + contre(p)})"/>`;
  }
  function ballon(p) {
    const w = 16 * K * (p.e || 1);
    return `<image data-id="${p.id}" href="ballon.svg" x="${-w / 2}" y="${-w / 2}" width="${w}" height="${w}" transform="translate(${p.x} ${p.y})"/>`;
  }
  /* Latte : une règle plate, longueur réglable. */
  function latte(p) {
    const L = p.len || 60, h = 6;
    return `<g data-id="${p.id}" transform="translate(${p.x} ${p.y}) rotate(${(p.rot || 0) + contre(p)})">
      <rect x="${-L / 2}" y="${-h / 2}" width="${L}" height="${h}" rx="1" fill="${p.fill}" stroke="rgba(0,0,0,.35)" stroke-width=".6"/>
      <rect x="${-L / 2}" y="${-h / 2 - 3}" width="${L}" height="${h + 6}" fill="transparent" style="cursor:move"/></g>`;
  }
  /* Carré : 100 × 100 px dans la scène, blanc, bordure noire de 2. */
  function carre(p) {
    const w = (p.w || 100) * K, h = (p.h || 100) * K;
    return `<g data-id="${p.id}" transform="translate(${p.x} ${p.y}) rotate(${(p.rot || 0) + contre(p)})">
      <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="#fff" stroke="#000" stroke-width=".75" style="cursor:move"/></g>`;
  }
  const DESSIN = { joueur, plot, ballon, latte, carre };

  /* Boîte englobante d'une pièce, en unités, hors rotation. */
  function boite(p) {
    if (p.type === 'joueur') { const s = K * (p.e || 1); return { w: 2 * 23 * s * (p.sx || 1), h: 2 * 23 * s * (p.sy || 1) }; }
    if (p.type === 'plot') return { w: 25.6 * K * (p.e || 1), h: 38.4 * K * (p.e || 1) };
    if (p.type === 'ballon') return { w: 16 * K * (p.e || 1), h: 16 * K * (p.e || 1) };
    if (p.type === 'latte') return { w: p.len || 60, h: 6 };
    if (p.type === 'carre') return { w: (p.w || 100) * K, h: (p.h || 100) * K };
    return { w: 10, h: 10 };
  }

  /* ——— Surcouches de sélection ——— */
  const POIGNEE = 5.4;   /* 10 px à l'écran */
  const MARGE = 15 / 1.85; /* padding 15 px du Transformer */

  /* L'existant : le Transformer de Konva, huit ancres carrées et une ancre de rotation. */
  function transformer(p) {
    const b = boite(p), w = b.w + 2 * MARGE, h = b.h + 2 * MARGE, x0 = -w / 2, y0 = -h / 2;
    const pts = [[x0, y0, 'nw'], [0, y0, 'n'], [w / 2, y0, 'ne'], [w / 2, 0, 'e'], [w / 2, h / 2, 'se'], [0, h / 2, 's'], [x0, h / 2, 'sw'], [x0, 0, 'w']];
    return `<g transform="translate(${p.x} ${p.y}) rotate(${p.rot || 0})">
      <rect x="${x0}" y="${y0}" width="${w}" height="${h}" class="cadre-sel"/>
      <line x1="0" y1="${y0}" x2="0" y2="${y0 - 14}" class="tige"/>
      <rect x="${-POIGNEE / 2}" y="${y0 - 14 - POIGNEE / 2}" width="${POIGNEE}" height="${POIGNEE}" class="poignee" data-drag="rot" style="cursor:crosshair"/>
      ${pts.map(([x, y, n]) => `<rect x="${x - POIGNEE / 2}" y="${y - POIGNEE / 2}" width="${POIGNEE}" height="${POIGNEE}" class="poignee" data-drag="ancre-${n}" style="cursor:${/n|s/.test(n) && n.length === 1 ? 'ns' : /e|w/.test(n) && n.length === 1 ? 'ew' : 'nwse'}-resize"/>`).join('')}
    </g>`;
  }
  /* Le même Transformer, réglé par ses seules options : couleur de la marque, ancres rondes,
     quatre coins seulement (keepRatio), rotation sans tige, aimantée. */
  function transformerRegle(p, opts) {
    const o = Object.assign({ coins: true, rotation: true }, opts || {});
    const b = boite(p), w = b.w + 2 * MARGE, h = b.h + 2 * MARGE, x0 = -w / 2, y0 = -h / 2, r = POIGNEE / 2;
    let s = `<g transform="translate(${p.x} ${p.y}) rotate(${p.rot || 0})"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" class="cadre-sel"/>`;
    if (o.coins) s += [[x0, y0, 'nw'], [w / 2, y0, 'ne'], [w / 2, h / 2, 'se'], [x0, h / 2, 'sw']].map(([x, y, n]) => `<circle cx="${x}" cy="${y}" r="${r}" class="poignee-ronde" data-drag="ancre-${n}" style="cursor:nwse-resize"/>`).join('');
    if (o.rotation) s += `<circle cy="${y0 - 12}" r="${r + .6}" class="poignee-ronde" data-drag="rot" style="cursor:crosshair"/><path d="M-1.6 .4a2 2 0 1 1 1.2 1.4" transform="translate(0 ${y0 - 12})" fill="none" stroke="var(--selection)" stroke-width=".6"/>`;
    return s + '</g>';
  }
  /* ——— La sélection retenue : Transformer à quatre coins, rotation reliée, compteur ——— */
  function boiteDe(pieces) {
    if (pieces.length === 1) { const p = pieces[0], b = boite(p); return { cx: p.x, cy: p.y, w: b.w + 2 * MARGE, h: b.h + 2 * MARGE, rot: p.rot || 0 }; }
    const m = Math.max(...pieces.map(rayon)) + MARGE;
    const xs = pieces.map(p => p.x), ys = pieces.map(p => p.y);
    const x0 = Math.min(...xs) - m, x1 = Math.max(...xs) + m, y0 = Math.min(...ys) - m, y1 = Math.max(...ys) + m;
    return { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0, rot: 0 };
  }
  function transformerRetenu(pieces, opts) {
    const o = Object.assign({ rotation: true, coins: true, compteur: null, guide: undefined }, opts || {});
    const B = boiteDe(pieces), x0 = -B.w / 2, y0 = -B.h / 2, r = POIGNEE / 2;
    let s = `<g transform="translate(${B.cx} ${B.cy}) rotate(${B.rot + (pieces.every(p => SANS_DIRECTION[p.type]) ? contre() : 0)})"><rect x="${x0}" y="${y0}" width="${B.w}" height="${B.h}" rx="1" class="cadre-retenu"/>`;
    if (o.coins) s += [[x0, y0, 'nw'], [B.w / 2, y0, 'ne'], [B.w / 2, B.h / 2, 'se'], [x0, B.h / 2, 'sw']].map(([x, y, n]) => `<g data-drag="ancre-${n}" style="cursor:nwse-resize"><circle cx="${x}" cy="${y}" r="${r + 2.5}" fill="transparent"/><circle cx="${x}" cy="${y}" r="${r}" class="ancre-retenue"/></g>`).join('');
    if (o.rotation) {
      const yr = y0 - 13;
      s += `<line x1="0" y1="${y0}" x2="0" y2="${yr + r + .8}" class="trait-rotation"/>
        <g data-drag="rot" style="cursor:grab"><circle cy="${yr}" r="${r + 3}" fill="transparent"/><circle cy="${yr}" r="${r + .8}" class="ancre-retenue"/>
        <path d="M-1.7 .3a2 2 0 1 1 .8 1.6" fill="none" stroke="var(--orange)" stroke-width=".7" transform="translate(0 ${yr})"/><path d="M-2.4 -.4l.7 1 1-.6" fill="none" stroke="var(--orange)" stroke-width=".7" transform="translate(0 ${yr})"/></g>`;
    }
    s += '</g>';
    const R = Math.max(B.w, B.h) / 2;
    if (o.compteur) s += `<g transform="translate(${B.cx} ${B.cy}) rotate(${contre()})">${etiquette(x0 + (o.compteur.length * 3.2 + 6) / 2 - 1, y0 - 1, o.compteur)}</g>`;
    if (o.guide !== undefined) s += `<g transform="translate(${B.cx} ${B.cy}) rotate(${contre()})"><circle r="${R + 8}" class="guide"/>${etiquette(0, -R - 17, o.guide)}</g>`;
    return s;
  }
  function marquee(x0, y0, x1, y1) { return `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" class="marquee"/>`; }
  /* Transformer autour de plusieurs pièces : une seule boîte. */
  function transformerGroupe(pieces) {
    const xs = pieces.map(p => p.x), ys = pieces.map(p => p.y);
    const x0 = Math.min(...xs) - 12, x1 = Math.max(...xs) + 12, y0 = Math.min(...ys) - 12, y1 = Math.max(...ys) + 12;
    const w = x1 - x0, h = y1 - y0, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    return transformer({ type: '_', x: cx, y: cy, _w: w, _h: h }).replace(/<rect x="[^"]*" y="[^"]*" width="[^"]*" height="[^"]*" class="cadre-sel"\/>/, `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" class="cadre-sel"/>`);
  }

  /* ——— Le visage de la sélection : un halo au sol, des pastilles orange, une enveloppe pour le groupe ——— */
  const DEFS = `<defs><filter id="flou" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.8"/></filter></defs>`;
  const rond = (p) => p.type === 'joueur' || p.type === 'ballon' || p.type === 'plot';
  function rayon(p) { const b = boite(p); return Math.max(b.w, b.h) / 2; }

  /* Le halo : un disque orange flou sous la pièce, comme une lumière au sol. Rien d'autre.
     Il est dessiné AVANT la pièce (couche `sous`) pour ne rien recouvrir. */
  function halo(p) {
    const r = rayon(p) + 5;
    if (rond(p)) return `<g transform="translate(${p.x} ${p.y})"><circle r="${r + 3}" class="halo-flou"/></g>`;
    const b = boite(p);
    return `<g transform="translate(${p.x} ${p.y}) rotate(${p.rot || 0})"><rect x="${-b.w / 2 - 7}" y="${-b.h / 2 - 7}" width="${b.w + 14}" height="${b.h + 14}" rx="4" class="halo-flou"/></g>`;
  }
  /* Une pastille orange : tout ce qui se saisit a cette forme. `icone` : 'tourner' | 'bout' | 'coin' | 'ecart'. */
  function pastille(x, y, drag, icone, curseur) {
    const ICO = {
      tourner: '<path d="M-1.7 .3a2 2 0 1 1 .8 1.6" fill="none" stroke="#fff" stroke-width=".7"/><path d="M-2.4 -.4l.7 1 1-.6" fill="none" stroke="#fff" stroke-width=".7"/>',
      bout: '<path d="M-1.6 0h3.2M-.6 -1l-1 1 1 1M.6 -1l1 1-1 1" fill="none" stroke="#fff" stroke-width=".7"/>',
      coin: '<path d="M-1.5 -1.5l3 3M.2 1.5h1.3v-1.3M-1.5 -.2v-1.3h1.3" fill="none" stroke="#fff" stroke-width=".7"/>',
      ecart: '<path d="M-1.8 0h3.6M-.8 -1.1l-1 1.1 1 1.1M.8 -1.1l1 1.1-1 1.1" fill="none" stroke="#fff" stroke-width=".7"/>',
      point: '<circle r=".9" fill="#fff"/>',
    };
    return `<g transform="translate(${x} ${y})" data-drag="${drag}" style="cursor:${curseur || 'grab'}"><circle r="5.2" fill="transparent"/><circle r="3.6" class="pastille-orange"/>${ICO[icone] || ''}</g>`;
  }
  /* Un guide de rotation pendant le geste : cercle pointillé et angle en étiquette. */
  function guideRotation(p, angle) {
    const r = rayon(p) + 16;
    return `<g transform="translate(${p.x} ${p.y})"><circle r="${r}" class="guide"/>${etiquette(0, -r - 9, angle)}</g>`;
  }
  function etiquette(x, y, texte) {
    const w = texte.length * 3.2 + 6;
    return `<g transform="translate(${x} ${y})"><rect x="${-w / 2}" y="-4.2" width="${w}" height="8.4" rx="4.2" class="etiquette"/><text y="1.9" text-anchor="middle" class="etiq-texte">${texte}</text></g>`;
  }

  /* Poignées d'une pièce seule, dessinées APRÈS la pièce. */
  function anneau(p, opts) {
    const o = opts || {};
    const b = boite(p), r = rayon(p) + 5;
    let s = '';
    if (o.lollipop) {
      const y0 = rond(p) ? -r : -b.h / 2 - 4;
      s += `<g transform="translate(${p.x} ${p.y}) rotate(${p.rot || 0})">${pastille(0, y0 - 10, 'rot', 'tourner')}</g>`;
    }
    if (o.bouts) {
      s += `<g transform="translate(${p.x} ${p.y}) rotate(${p.rot || 0})">${pastille(-b.w / 2 - 6, 0, 'bout-g', 'bout', 'ew-resize')}${pastille(b.w / 2 + 6, 0, 'bout-d', 'bout', 'ew-resize')}</g>`;
    }
    if (o.coins) {
      s += `<g transform="translate(${p.x} ${p.y}) rotate(${p.rot || 0})">` + [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([i, j]) => pastille(i * (b.w / 2 + 4), j * (b.h / 2 + 4), `coin-${i}-${j}`, 'point', 'nwse-resize')).join('') + '</g>';
    }
    if (o.unique) {
      const d = (rond(p) ? r : Math.hypot(b.w / 2 + 4, b.h / 2 + 4)) + 4;
      s += `<g transform="translate(${p.x} ${p.y}) rotate(${p.rot || 0})">${pastille(d * .707, d * .707, 'unique', 'coin', 'grab')}</g>`;
    }
    if (o.guide !== undefined) s += guideRotation(p, o.guide);
    return s;
  }

  /* Le groupe : une enveloppe arrondie qui suit les pièces, un compteur, une seule pastille. */
  function enveloppe(pieces, opts) {
    const o = Object.assign({ poignee: true, nom: `${pieces.length} pièces` }, opts || {});
    const xs = pieces.map(p => p.x), ys = pieces.map(p => p.y);
    const m = Math.max(...pieces.map(rayon)) + 9;
    const x0 = Math.min(...xs) - m, x1 = Math.max(...xs) + m, y0 = Math.min(...ys) - m, y1 = Math.max(...ys) + m;
    let s = `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" rx="9" class="enveloppe"/>`;
    s += etiquette(x0 + (o.nom.length * 3.2 + 6) / 2 + 2, y0 - 1, o.nom);
    if (o.poignee) s += pastille(x1, y1, 'groupe', 'ecart');
    return s;
  }
  /* Le lasso en cours de tracé. */
  function lasso(x0, y0, x1, y1) { return `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" rx="3" class="lasso"/>`; }
  /* Survol : un liseré discret, sans halo. */
  function survol(p) { const r = rayon(p) + 4; return `<circle cx="${p.x}" cy="${p.y}" r="${r}" class="survol"/>`; }

  /* ——— Le cadre ——— */
  const OUTILS = [['curseur', 'Sélection', 'Esc'], ['joueur', 'Joueur', 'J'], ['ballon', 'Balle', 'B'], ['plot', 'Plot', 'P'], ['coupelle', 'Coupelle', 'C'], ['cerceau', 'Cerceau', 'O'], ['latte', 'Latte', 'L'], ['trajectoire', 'Trajectoire', '', 1], ['texte', 'Texte', '', 1], ['separation', 'Séparation', '', 1], ['carre', 'Carré', '', 1], ['echelle', 'Échelle', 'E'], ['haie', 'Haie', 'H'], ['grille', 'Plus', '']];
  const NOMS = { joueur: 'Joueur', plot: 'Plot', ballon: 'Balle', latte: 'Latte', carre: 'Carré' };

  function barre(nomPiece, aide) {
    const puce = nomPiece ? `<span class="puce">${ic(nomPiece.icone)}${nomPiece.nom}<span class="x">${ic('croix')}</span></span>` : '';
    return `<div class="barre">
      <span class="ib">${ic('retour')}</span>
      <span class="onglets"><span class="onglet actif">${ic('crayon')}${nomPiece ? '' : 'Dessiner'}</span><span class="onglet">${ic('lire')}${nomPiece ? '' : 'Animer'}</span></span>
      ${puce}
      <span class="aide">${ic('aide')}${aide}</span>
      <span class="zoom"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>×1</span><span class="ib">${ic('aide')}</span><span class="ib">${ic('undo')}</span><span class="ib">${ic('redo')}</span>
      <span class="enregistrer">${ic('sauvegarde')}Enregistrer</span></div>`;
  }
  function railGauche(compact) {
    const outils = compact ? OUTILS.slice(0, 7).concat([OUTILS[OUTILS.length - 1]]) : OUTILS;
    return `<div class="rail gauche">${outils.map(([i, n, k, a], idx) => `<span class="slot${idx === 0 ? ' actif' : ''}${a ? ' annot' : ''}">${k ? `<span class="k">${k}</span>` : ''}${ic(i)}${n}</span>`).join('')}</div>`;
  }
  const SLOTS_COMMUNS = `<span class="slot"><span class="pastille" style="background:#000"></span>Noir</span>
    <span class="slot"><span class="pastille" style="background:#fff"></span>Blanc</span>
    <span class="slot">${ic('dupliquer')}Dupliquer</span>
    <span class="slot danger">${ic('corbeille')}Supprimer</span>
    <span class="slot">${ic('plusv')}Plus</span>`;

  /* La barre haute du téléphone tenu droit : onglets en icônes, puce, Annuler, Rétablir, Enregistrer en icône. */
  function barreTelephone(nomPiece) {
    const puce = nomPiece ? `<span class="puce">${ic(nomPiece.icone)}${nomPiece.nom}<span class="x">${ic('croix')}</span></span>` : '';
    return `<div class="barre">
      <span class="ib">${ic('retour')}</span>
      <span class="onglets"><span class="onglet actif">${ic('crayon')}</span><span class="onglet">${ic('lire')}</span></span>${puce}
      <span class="aide"></span><span class="ib">${ic('undo')}</span><span class="ib">${ic('redo')}</span>
      <span class="enregistrer icone">${ic('sauvegarde')}</span></div>`;
  }
  const AIDE_FLOTTANTE = (aide) => `<div class="aide-flottante"><span>${ic('aide')}${aide}</span><span class="zoom"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>×1</span></div>`;

  /* spec : { id, pieces, selection:[ids], overlay(state) → svg, rail(state) → html, aide, nom, notes:[{x,y,cls,html}], onDrag(state, mode, pt, start) } */
  function cadre(el, spec) {
    const state = { pieces: spec.pieces.map(p => Object.assign({}, p)), sel: spec.selection.slice(), angle: 0 };
    spec.state = state;
    const disposition = spec.disposition || 'tout-visible';
    const portrait = disposition === 'onglets' || disposition === 'bande';
    function rendu() {
      PORTRAIT = portrait;
      const enfants = DEFS + (spec.sous ? spec.sous(state) : '') + state.pieces.map(p => DESSIN[p.type](p)).join('') + (spec.overlay ? spec.overlay(state) : '');
      const selNom = spec.nom ? spec.nom(state) : null;
      el.className = 'app ' + disposition + (spec.classe ? ' ' + spec.classe : '');
      const aide = spec.aide || 'Clique sur une pièce pour la régler · Ctrl + molette pour zoomer';
      const notes = (spec.notes || []).map(n => `<div class="note-terrain ${n.cls || ''}" style="${n.style}">${n.html}</div>`).join('');
      const terrain = M.terrain({ enfants, marge: 6, orientation: portrait ? 'portrait' : 'paysage' });
      const contenu = spec.rail ? spec.rail(state) : `<div class="invite">${ic('curseur')}Clique sur une pièce pour la régler</div>`;
      if (disposition === 'onglets') {
        el.innerHTML = barreTelephone(selNom)
          + `<div class="champ">${terrain}${AIDE_FLOTTANTE(aide)}${notes}</div>`
          + `<div class="dock">${contenu}</div>` + (spec.feuille ? spec.feuille(state) : '');
      } else if (disposition === 'rail-droit') {
        el.innerHTML = barre(selNom, aide)
          + `<div class="champ">${terrain}${notes}</div>`
          + `<div class="rail droit">${contenu}</div>` + (spec.feuille ? spec.feuille(state) : '');
      } else if (disposition === 'bande') {
        el.innerHTML = barre(selNom, aide)
          + `<div class="champ">${terrain}${notes}</div>`
          + `<div class="bande">${contenu}</div>`;
      } else {
        el.innerHTML = barre(selNom, aide)
          + railGauche(el.closest('.duo') !== null)
          + `<div class="champ">${terrain}${notes}</div>`
          + `<div class="rail droit">${contenu}</div>`
          + `<div class="pied"><span class="temps">T0</span><span class="ajout">${ic('plus')}</span><span class="note">${spec.pied || ''}</span></div>`;
      }
      PORTRAIT = false;
      if (spec.apresRendu) spec.apresRendu(el, state, rendu);
    }
    rendu();

    /* Glissers : sur les poignées portant data-drag. */
    let drag = null;
    el.addEventListener('pointerdown', (ev) => {
      const cible = ev.target.closest('[data-drag]');
      if (!cible || !spec.onDrag) return;
      const svg = el.querySelector('svg.terrain');
      drag = { mode: cible.dataset.drag, svg, depart: point(svg, ev, portrait), etat0: JSON.parse(JSON.stringify(state)) };
      cible.setPointerCapture && cible.setPointerCapture(ev.pointerId);
      ev.preventDefault();
    });
    el.addEventListener('pointermove', (ev) => {
      if (!drag) return;
      spec.onDrag(state, drag.mode, point(drag.svg, ev, portrait), drag.depart, drag.etat0);
      rendu();
    });
    const fin = () => { if (drag && spec.finDrag) { spec.finDrag(state); rendu(); } drag = null; };
    el.addEventListener('pointerup', fin);
    el.addEventListener('pointercancel', fin);
    /* Boutons du rail : data-action. */
    el.addEventListener('click', (ev) => {
      const b = ev.target.closest('[data-action]');
      if (!b || !spec.onAction) return;
      spec.onAction(state, b.dataset.action, b.dataset.valeur);
      rendu();
    });
    return state;
  }
  function point(svg, ev, portrait) {
    const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM().inverse());
    /* En portrait, le terrain est dessiné par rotate(90) translate(0 -200) : écran (sx, sy) = (200 − y, x). */
    return portrait ? { x: p.y, y: 200 - p.x } : p;
  }
  const piece = (state, id) => state.pieces.find(p => p.id === id);
  const angleVers = (p, pt) => Math.atan2(pt.y - p.y, pt.x - p.x) * 180 / Math.PI + 90;
  const arrondi15 = (a) => Math.round(a / 15) * 15;

  window.Etude = { transformerRetenu, boiteDe, halo, pastille, enveloppe, lasso, survol, etiquette, guideRotation, transformerRegle, marquee, cadre, piece, angleVers, arrondi15, transformer, transformerGroupe, anneau, boite, ic, SLOTS_COMMUNS, NOMS, K };
})();
