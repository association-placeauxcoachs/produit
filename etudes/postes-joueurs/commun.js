/* Étude « Placer et orienter les joueurs par poste » — moteur de la maquette.
 *
 * Le terrain est décrit en mètres, vu comme sur le téléphone tenu droit : le but de référence est
 * en haut. x est la distance à la ligne de but de ce but, l la distance à la touche de gauche.
 * À plat (tablette couchée, ordinateur), le même monde tourne d'un quart de tour : le but de
 * référence passe à gauche, comme dans l'éditeur, et les postes restent droits.
 *
 * Le geste retenu : toucher le terrain y pose un « + » ; le toucher ouvre la mise en place.
 */
(() => {
'use strict';

const NS = 'http://www.w3.org/2000/svg';
const LONG = { demi: 25, entier: 40 };
const SOL = '#3796C4', ZONE = '#D1994B', BLANC = '#FFFFFF', ORANGE = '#EB5D21';
const COULEUR = { att: '#FF0000', def: '#000000', gb: '#FFFF00' };
const PALETTE = [['#000000', 'Noir'], ['#FF0000', 'Rouge'], ['#FFFFFF', 'Blanc'], ['#00FF00', 'Vert'], ['#FFFF00', 'Jaune']];

/* Les quatre formats, relevés sur l'éditeur le 7 octobre 2026. K : px par mètre. */
const FORMATS = {
  telephone:  { w: 390,  h: 844,  champ: { x: 0,   y: 64,  w: 390,  h: 665 }, K: 15.3,  plat: false, souris: false },
  tablette:   { w: 768,  h: 1024, champ: { x: 0,   y: 64,  w: 768,  h: 902 }, K: 19.25, plat: false, souris: false },
  couchee:    { w: 1024, h: 768,  champ: { x: 84,  y: 64,  w: 868,  h: 648 }, K: 18.5,  plat: true,  souris: false },
  ordinateur: { w: 1440, h: 900,  champ: { x: 374, y: 254, w: 1004, h: 476 }, K: 21.4,  plat: true,  souris: true },
};

/* Le placement de référence, devant le but du haut. La 0-6 se tient à 6,6 m des poteaux, presque
 * collée à la zone ; le demi-centre et les arrières à 14 m du centre du but, les arrières
 * écartés vers la touche ; le pivot sur la même ligne, entre le 2 et le 3 de gauche, dos au but. */
const POSTES = {
  ALG: { label: 'ALG', nom: 'ailier gauche',  camp: 'att', l: 0.9,   x: 1.1 },
  ARG: { label: 'ARG', nom: 'arrière gauche', camp: 'att', l: 2.0,   x: 11.5 },
  DC:  { label: 'DC',  nom: 'demi-centre',    camp: 'att', l: 10,    x: 14 },
  ARD: { label: 'ARD', nom: 'arrière droit',  camp: 'att', l: 18.0,  x: 11.5 },
  ALD: { label: 'ALD', nom: 'ailier droit',   camp: 'att', l: 19.1,  x: 1.1 },
  PVT: { label: 'PVT', nom: 'pivot',          camp: 'att', l: 6.46,  x: 6.28, dos: true },
  D1G: { label: '1', nom: 'défenseur 1', camp: 'def', l: 2.57,  x: 2.89 },
  D2G: { label: '2', nom: 'défenseur 2', camp: 'def', l: 4.81,  x: 5.47 },
  D3G: { label: '3', nom: 'défenseur 3', camp: 'def', l: 8.27,  x: 6.60 },
  D3D: { label: '3', nom: 'défenseur 3', camp: 'def', l: 11.73, x: 6.60 },
  D2D: { label: '2', nom: 'défenseur 2', camp: 'def', l: 15.19, x: 5.47 },
  D1D: { label: '1', nom: 'défenseur 1', camp: 'def', l: 17.43, x: 2.89 },
  GB:  { label: 'GB', nom: 'gardien', camp: 'gb', l: 10, x: 1.0 },
};
const ATTAQUE = ['ALG', 'ARG', 'DC', 'ARD', 'ALD', 'PVT'];
const DEFENSE = ['D1G', 'D2G', 'D3G', 'D3D', 'D2D', 'D1D'];

/* Les outils de l'éditeur, dans l'ordre du rail, avec leur raccourci clavier. */
const OUTILS = [
  ['', 'Sélection', 'selection', 'Esc'], ['joueur', 'Joueur', 'joueur', 'J'], ['ballon', 'Balle', 'balle', 'B'],
  ['plot', 'Plot', 'plot', 'P'], ['coupelle', 'Coupelle', 'coupelle', 'C'], ['cerceau', 'Cerceau', 'cerceau', 'O'],
  ['latte', 'Latte', 'latte', 'L'], ['trajectoire', 'Trajectoire', 'trajectoire', 'T', true], ['texte', 'Texte', 'texte', 'X', true],
  ['separation', 'Séparation', 'separation', 'S', true], ['carre', 'Carré', 'carre', 'C', true], ['echelle', 'Echelle', 'echelle', 'E'],
  ['haie', 'Haie', 'haie', 'H'],
];

/* ------------------------------------------------------------------ icônes (Lucide, MIT) */
const ICONES = {
  retour: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  crayon: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
  lecture: '<polygon points="6 3 20 12 6 21 6 3"/>',
  annuler: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/>',
  retablir: '<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13"/>',
  enregistrer: '<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/>',
  selection: '<path d="M12.586 12.586 19 19"/><path d="M3.688 3.037a.497.497 0 0 0-.651.651l6.5 15.999a.501.501 0 0 0 .947-.062l1.569-6.083a2 2 0 0 1 1.448-1.479l6.124-1.579a.5.5 0 0 0 .063-.947z"/>',
  joueur: '<circle cx="12" cy="5" r="1"/><path d="m9 20 3-6 3 6"/><path d="m6 8 6 2 6-2"/><path d="M12 10v4"/>',
  balle: '<path d="M11.1 7.1a16.55 16.55 0 0 1 10.9 4"/><path d="M12 12a12.6 12.6 0 0 1-8.7 5"/><path d="M16.8 13.6a16.55 16.55 0 0 1-9 7.5"/><path d="M20.7 17a12.8 12.8 0 0 0-8.7-5 13.3 13.3 0 0 1 0-10"/><path d="M6.3 3.8a16.55 16.55 0 0 0 1.9 11.5"/><circle cx="12" cy="12" r="10"/>',
  plot: '<path d="M16.05 10.966a5 2.5 0 0 1-8.1 0"/><path d="m16.923 14.049 4.48 2.04a1 1 0 0 1 .001 1.831l-8.574 3.9a2 2 0 0 1-1.66 0l-8.574-3.91a1 1 0 0 1 0-1.83l4.484-2.04"/><path d="M16.949 14.14a5 2.5 0 1 1-9.9 0L10.063 3.5a2 2 0 0 1 3.874 0z"/><path d="M9.194 6.57a5 2.5 0 0 0 5.61 0"/>',
  plus: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  ampoule: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  loupe: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  dupliquer: '<line x1="15" x2="15" y1="12" y2="18"/><line x1="12" x2="18" y1="15" y2="15"/><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  supprimer: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
  reglages: '<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>',
  fermer: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  boussole: '<path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"/><circle cx="12" cy="12" r="10"/>',
  retourner: '<path d="M4 14a8 8 0 0 1 15.5-2.8"/><path d="m20.5 6.5-.9 4.9-4.9-.9"/><path d="M12 22v-4"/>',
  latte: '<rect width="20" height="10" x="2" y="7" rx="2"/>',
  coupelle: '<ellipse cx="12" cy="13" rx="9" ry="6"/><ellipse cx="12" cy="12" rx="3" ry="2"/>',
  cerceau: '<circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/>',
  echelle: '<path d="M7 3v18M17 3v18M7 7h10M7 12h10M7 17h10"/>',
  haie: '<path d="M4 19h16M7 19V8M17 19V8M7 10h10"/>',
  separation: '<path d="M3 12h3M10 12h4M18 12h3M12 2v6M9 5l3 3 3-3M12 22v-6M9 19l3-3 3 3"/>',
  trajectoire: '<path d="M4 20c1-7 5-11 12-11"/><path d="m13 5 4 4-4 4"/>',
  texte: '<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/>',
  carre: '<rect width="18" height="18" x="3" y="3" rx="1"/>',
  effacer: '<path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/>',
  aide: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
  pleinEcran: '<polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" x2="14" y1="3" y2="10"/><line x1="3" x2="10" y1="21" y2="14"/>',
  menu: '<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>',
  invite: '<path d="M14 4.1 12 6"/><path d="m5.1 8-2.9-.8"/><path d="m6 12-1.9 2"/><path d="M7.2 2.2 8 5.1"/><path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z"/>',
  telecharger: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
  presenter: '<path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/>',
  copie: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  ajoutRond: '<circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/>',
  panneau: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/>',
  diese: '<line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/>',
  ajout: '<path d="M5 12h14"/><path d="M12 5v14"/>',
};
const ic = (nom, cls = 'ic') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONES[nom]}</svg>`;

/* ------------------------------------------------------------------ géométrie */
const deg = (r) => r * 180 / Math.PI;
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const clair = (hex) => ['#FFFFFF', '#FFFF00', '#00FF00'].includes(hex.toUpperCase());

function placement(cle, but) {
  const p = POSTES[cle];
  return but === 'bas' ? { l: 20 - p.l, x: 40 - p.x } : { l: p.l, x: p.x };
}
function campDe(j) { return j.poste ? POSTES[j.poste].camp : 'att'; }
/** Angle (0 = regarde le but de référence) qui tourne le joueur vers le centre de son but. */
function angleVersLeBut(j) {
  const gx = j.but === 'bas' ? 40 : 0;
  return deg(Math.atan2(10 - j.l, -(gx - j.x)));
}
/** Le regard par défaut : l'attaquant vers le but, sauf le pivot, dos au but ; le défenseur et le gardien vers l'attaque. */
function regard(j) {
  const dosParPoste = j.poste && POSTES[j.poste].dos;
  return angleVersLeBut(j) + (campDe(j) === 'att' ? 0 : 180) + (dosParPoste ? 180 : 0) + (j.dos ? 180 : 0);
}
/** Le chemin le plus court d'un angle à l'autre, pour qu'un joueur ne tourne pas sur lui-même. */
function versAngle(ancien, cible) {
  const d = ((cible - ancien) % 360 + 540) % 360 - 180;
  return ancien + d;
}
function butLePlusProche(x, terrain) { return terrain === 'entier' && x > 20 ? 'bas' : 'haut'; }
/** Le passage du monde (vu du but de référence en haut) à la vue à plat, but à gauche. */
const MONDE_A_PLAT = 'translate(0 20) rotate(-90)';

/* ------------------------------------------------------------------ dessin du terrain */
const ZONE_HAUT = 'M2.5,0 A6,6 0 0 0 8.5,6 L11.5,6 A6,6 0 0 0 17.5,0 Z';
const ZONE_BAS = 'M2.5,40 A6,6 0 0 1 8.5,34 L11.5,34 A6,6 0 0 1 17.5,40 Z';
function terrainSVG(terrain) {
  const L = LONG[terrain];
  const t = `stroke="${BLANC}" stroke-width=".08" fill="none"`;
  let s = `<rect x="0" y="0" width="20" height="${L}" fill="${SOL}"/>`;
  s += `<line x1="0" y1="20" x2="20" y2="20" ${t}/><circle cx="10" cy="20" r="2" ${t}/>`;
  s += `<path d="${ZONE_HAUT}" fill="${ZONE}" stroke="${BLANC}" stroke-width=".08"/>`;
  s += `<path d="M0,2.96 A9,9 0 0 0 8.5,9 L11.5,9 A9,9 0 0 0 20,2.96" ${t} stroke-dasharray=".39 .39"/>`;
  s += `<line x1="9.5" y1="7" x2="10.5" y2="7" ${t}/>`;
  s += `<rect x="8.5" y="0" width="3" height=".5" stroke="${BLANC}" stroke-width=".12" fill="none"/>`;
  if (terrain === 'entier') {
    s += `<path d="${ZONE_BAS}" fill="${ZONE}" stroke="${BLANC}" stroke-width=".08"/>`;
    s += `<path d="M0,37.04 A9,9 0 0 1 8.5,31 L11.5,31 A9,9 0 0 1 20,37.04" ${t} stroke-dasharray=".39 .39"/>`;
    s += `<line x1="9.5" y1="33" x2="10.5" y2="33" ${t}/>`;
    s += `<rect x="8.5" y="39.5" width="3" height=".5" stroke="${BLANC}" stroke-width=".12" fill="none"/>`;
  }
  s += `<rect x="0" y="0" width="20" height="${L}" ${t}/>`;
  return s;
}

/**
 * Les règles du placement, dessinées sur le terrain : la ligne de la 0-6 à 6,6 m et l'arc des
 * 14 m où se tiennent le demi-centre et les arrières. Pour le schéma de référence seulement.
 */
function reperesSVG() {
  const trait = 'fill="none" stroke="#F4AD8E" stroke-width=".08" stroke-dasharray=".22 .16"';
  const texte = (l, x, t, tour) => `<text x="0" y="0" transform="translate(${l} ${x}) rotate(${tour})" font-size=".56" fill="#FFE3D3" style="${STYLE_ETIQUETTE};font-weight:600;letter-spacing:0">${t}</text>`;
  const devant = (tour) => `<path d="M2.06,1.43 A6.6,6.6 0 0 0 8.5,6.6 L11.5,6.6 A6.6,6.6 0 0 0 17.94,1.43" ${trait}/>`
    + `<path d="M0,9.8 A14,14 0 0 0 20,9.8" ${trait}/>`
    + texte(14.6, 7.5, '0-6 à 6,6 m', tour) + texte(6.6, 14.7, '14 m', tour);
  return `<g class="reperes">${devant(0)}</g>`;
}

/* ------------------------------------------------------------------ la bulle et le ballon */
/**
 * Le joueur de l'éditeur (`Joueur.tsx`), à l'échelle : l'arc des bras `M -20,20 C -20 -18, 20 -18, 20 20`
 * de 6 px et la tête de 12 px de rayon, à 0,0395 m le px. Le monde regarde vers le haut, l'arc est
 * donc retourné. La tête grandit légèrement (14 px de rayon au lieu de 12), les bras non, pour que
 * le poste s'y lise ; même forme, même taille, avec ou sans poste.
 */
const BRAS = 'M -0.79,-0.79 C -0.79,0.71 0.79,0.71 0.79,-0.79';
const contourSi = (couleur, epaisseur) => (couleur.toUpperCase() === '#FFFFFF' ? ` stroke="rgba(28,23,38,.35)" stroke-width="${epaisseur}"` : '');
function corpsSVG(couleur, filtre = '') {
  return `<g${filtre}><path d="${BRAS}" fill="none" stroke="${couleur}" stroke-width=".236" stroke-linecap="round"/><circle class="tete" r=".56" fill="${couleur}"${contourSi(couleur, '.05')}/></g>`;
}
const STYLE_ETIQUETTE = 'font-family:Inter,system-ui,sans-serif;font-weight:700;text-anchor:middle;dominant-baseline:central;letter-spacing:-.04em';
function etiquetteSVG(label, couleur) {
  const taille = label.length >= 3 ? 0.48 : label.length === 2 ? 0.55 : 0.72;
  return `<text class="poste" x="0" y=".02" font-size="${taille}" fill="${clair(couleur) ? '#1C1726' : '#FFFFFF'}" style="${STYLE_ETIQUETTE}">${label}</text>`;
}
/** Le ballon : le dessin de l'application, simplifié — un disque et ses coutures. */
function ballonSVG(couleur, filtre = '') {
  return `<g${filtre}><circle r=".32" fill="${couleur}" stroke="rgba(28,23,38,.55)" stroke-width=".04"/>`
    + `<path d="M -.3,-.08 C -.1,-.02 .1,-.02 .3,-.08 M -.12,-.3 C -.02,-.1 -.02,.1 -.12,.3 M .14,-.29 C .06,-.1 .06,.1 .14,.29" fill="none" stroke="rgba(255,255,255,.85)" stroke-width=".045"/></g>`;
}
/** Une bulle autonome, pour les illustrations ; sans label, la bulle vide. */
function bulle(label, couleur, px = 30, angle = 0) {
  return `<svg viewBox="-1.25 -1.25 2.5 2.5" width="${px}" height="${px}" aria-hidden="true" style="overflow:visible">`
    + `<g transform="rotate(${angle})">${corpsSVG(couleur)}</g>${label ? etiquetteSVG(label, couleur) : ''}</svg>`;
}
/** La pastille d'un bouton : un bouton se lit avant de se regarder, le poste y est écrit en grand. */
function pastille(label, couleur, px = 32) {
  const taille = label.length >= 3 ? .66 : label.length === 2 ? .78 : 1;
  const contour = clair(couleur) ? ' stroke="rgba(28,23,38,.4)" stroke-width=".06"' : '';
  return `<svg viewBox="-1 -1 2 2" width="${px}" height="${px}" aria-hidden="true"><circle r=".96" fill="${couleur}"${contour}/>`
    + `<text x="0" y=".03" font-size="${taille}" fill="${clair(couleur) ? '#1C1726' : '#FFFFFF'}" style="${STYLE_ETIQUETTE}">${label}</text></svg>`;
}

/* Les vignettes du menu : le haut d'un demi-terrain et les places de la pose, ou ce qui se pose ici. */
function diagramme(type) {
  const cles = type === 'att' ? ATTAQUE : type === 'def' ? DEFENSE : [...ATTAQUE, ...DEFENSE];
  const t = `stroke="${BLANC}" stroke-width=".3" fill="none"`;
  let s = `<svg class="dia" viewBox="-1.5 0 23 15.4" aria-hidden="true"><rect x="-1.5" width="23" height="15.4" fill="${SOL}"/><path d="${ZONE_HAUT}" fill="${ZONE}"/>`
    + `<path d="M0,2.96 A9,9 0 0 0 8.5,9 L11.5,9 A9,9 0 0 0 20,2.96" ${t} stroke-dasharray=".8 .8"/>`;
  for (const c of cles) {
    const p = POSTES[c];
    s += `<circle cx="${p.l}" cy="${p.x}" r="1.05" fill="${COULEUR[p.camp]}" stroke="${BLANC}" stroke-width=".25"/>`;
  }
  return s + '</svg>';
}
function vignettePose(type) {
  const fond = `<rect width="20" height="13" fill="${SOL}"/>`;
  if (type === 'colonne') {
    const joueurs = [4.5, 10, 15.5].map((l) => `<g transform="translate(${l} 8) scale(1.75)">${corpsSVG(COULEUR.att)}<g transform="translate(.98 -1.02)">${ballonSVG(COULEUR.att)}</g></g>`).join('');
    return `<svg class="dia" viewBox="0 0 20 13" aria-hidden="true">${fond}${joueurs}</svg>`;
  }
  const ballons = DECALAGES_TAS.map(([dl, dx]) => `<g transform="translate(${10 + dl * 2.6} ${6.4 + dx * 2.6}) scale(2.6)">${ballonSVG(COULEUR.att)}</g>`).join('');
  return `<svg class="dia" viewBox="0 0 20 13" aria-hidden="true">${fond}${ballons}</svg>`;
}
function miniTerrain(terrain) {
  const L = LONG[terrain];
  return `<svg viewBox="-1 -1 ${L + 2} 22" aria-hidden="true"><rect x="0" y="0" width="${L}" height="20" fill="${SOL}"/>`
    + `<path d="M0,2.5 A6,6 0 0 1 6,8.5 L6,11.5 A6,6 0 0 1 0,17.5 Z" fill="${ZONE}"/>`
    + (terrain === 'entier' ? `<path d="M40,2.5 A6,6 0 0 0 34,8.5 L34,11.5 A6,6 0 0 0 40,17.5 Z" fill="${ZONE}"/>` : '')
    + `<line x1="20" y1="0" x2="20" y2="20" stroke="#fff" stroke-width=".3"/></svg>`;
}

/* La mise en place : cinq entrées, sans options ni groupe, chacune avec ce qu'elle pose. */
const DECALAGES_TAS = [[0, 0], [.6, .18], [-.5, .38], [.18, -.55], [-.36, -.4], [.42, .66]];
const MISES_EN_PLACE = [
  ['def', () => diagramme('def'), 'Défense <span class="nw">0-6</span>', 'but', 'Six défenseurs : 1, 2, 3, 3, 2, 1'],
  ['att', () => diagramme('att'), 'Attaque placée', 'but', 'ALG, ARG, DC, ARD, ALD et PVT'],
  ['deux', () => diagramme('deux'), 'Attaque contre <span class="nw">0-6</span>', 'but', 'Les douze, face à face'],
  ['colonne', () => vignettePose('colonne'), 'Colonne de joueurs', 'ici', 'Trois en file, ballon en main'],
  ['tas', () => vignettePose('tas'), 'Tas de ballons', 'ici', 'Six ballons serrés'],
];

/**
 * Les mots du geste, par pointeur, repris de la ligne d'aide de l'éditeur (`aideDuMoment`) : seule
 * la mise en place s'y ajoute. Au doigt, elle se fait en deux touches, le vide puis le « + » ; à la
 * souris, le clic droit l'ouvre d'un coup.
 */
const GESTES = {
  tactile: {
    zoomer: 'pince pour zoomer',
    poser: 'touche le terrain pour poser',
    regler: 'Touche une pièce pour la régler',
    mettre: (point) => point ? 'touche le + pour mettre en place' : 'touche le vide pour mettre en place',
    fermer: 'touche ailleurs pour fermer',
  },
  souris: {
    zoomer: 'Ctrl + molette pour zoomer',
    poser: 'clique sur le terrain pour poser',
    regler: 'Clique sur une pièce pour la régler',
    mettre: () => 'clic droit pour mettre en place',
    fermer: 'clique ailleurs pour fermer',
  },
};

/* ------------------------------------------------------------------ l'appareil */
let compteur = 0;

class Appareil {
  constructor(hote, cfg) {
    this.uid = ++compteur;
    this.cfg = cfg;
    this.format = cfg.format || 'telephone';
    this.f = FORMATS[this.format];
    this.interactif = cfg.interactif !== false;
    this.anime = this.interactif && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.racine = document.createElement('div');
    this.racine.className = 'tel' + (this.interactif ? '' : ' statique');
    this.racine.dataset.format = this.format;
    this.racine.style.width = `${this.f.w}px`;
    this.racine.style.height = `${this.f.h}px`;
    if (!this.interactif) this.racine.setAttribute('aria-hidden', 'true');
    const c = this.f.champ;
    this.racine.innerHTML = `
      <div class="a-page"></div>
      <div class="t-haut"></div>
      <div class="t-champ" style="left:${c.x}px;top:${c.y}px;width:${c.w}px;height:${c.h}px"><svg class="terrain" xmlns="${NS}" role="img" aria-label="Terrain de handball" style="width:${c.w}px;height:${c.h}px">
        <defs><filter id="halo-${this.uid}" x="-1" y="-1" width="3" height="3"><feDropShadow dx="0" dy="0" stdDeviation=".32" flood-color="${ORANGE}" flood-opacity="1"/></filter></defs>
        <g class="monde"${this.f.plat ? ` transform="${MONDE_A_PLAT}"` : ''}><g class="sol"></g><g class="points"></g><g class="regards"></g><g class="joueurs"></g></g>
      </svg></div>
      <div class="t-surcouche"></div>
      <div class="t-rangee"></div>
      <div class="t-dock"></div>
      <div class="a-rail-g"></div>
      <div class="a-rail-d"></div>
      <div class="a-temps"></div>
      <div class="t-couche"></div>`;
    hote.appendChild(this.racine);
    const $ = (s) => this.racine.querySelector(s);
    this.el = {
      page: $('.a-page'), haut: $('.t-haut'), champ: $('.t-champ'), svg: $('svg.terrain'), sol: $('.sol'), points: $('.points'),
      regards: $('.regards'), joueurs: $('.joueurs'), surcouche: $('.t-surcouche'), rangee: $('.t-rangee'), dock: $('.t-dock'),
      railG: $('.a-rail-g'), railD: $('.a-rail-d'), temps: $('.a-temps'), couche: $('.t-couche'),
    };
    this.reinitialise();
    if (this.interactif) this.ecoute();
  }

  reinitialise() {
    const anime = this.anime;
    this.anime = false;
    this.etat = Object.assign({ terrain: 'demi', outil: null, joueurs: [], selection: null, feuille: null, point: null, menuPoint: false }, structuredClone(this.cfg.etat || {}));
    this.n = this.etat.joueurs.reduce((m, j) => Math.max(m, parseInt(String(j.id).slice(1), 10) || 0), 0);
    this.terrainDessine = null;
    this.el.joueurs.replaceChildren();
    this.rend();
    (this.cfg.prepare || (() => {}))(this);
    this.rend();
    this.anime = anime;
  }

  get selection() { return this.etat.joueurs.find((j) => j.id === this.etat.selection) || null; }
  joueurDuPoste(cle) { return this.etat.joueurs.find((j) => j.poste === cle); }
  /** Les mots du geste, selon le pointeur : on touche une tablette, on clique à l'ordinateur. */
  get mots() {
    return this.f.souris
      ? { Toucher: 'Clique sur', toucher: 'clique sur', zoom: 'Ctrl + molette pour zoomer' }
      : { Toucher: 'Touche', toucher: 'touche', zoom: 'pince pour zoomer' };
  }

  /* --------------------------------------------------------------- poses */
  nouveauJoueur(props) {
    // orientationAuto : cochée par le choix d'un poste, jamais d'office ; la rotation à la poignée la décoche.
    const j = { id: `j${++this.n}`, type: 'joueur', poste: null, couleur: COULEUR.att, dos: false, orientationAuto: !!props.poste, ...props };
    j.angle = regard(j);
    return j;
  }
  /** Une équipe devant un but : chaque poste à sa place de référence, jamais en double. */
  poser(cles, but = 'haut') {
    const nouveaux = [];
    for (const cle of cles) {
      if (this.etat.joueurs.some((j) => j.poste === cle && j.but === but)) continue;
      nouveaux.push(this.nouveauJoueur({ poste: cle, couleur: COULEUR[POSTES[cle].camp], ...placement(cle, but), but }));
    }
    this.finPose(nouveaux, but === 'bas' ? { l: 10, x: 39.6 } : { l: 10, x: 0.4 });
  }
  /** Un joueur sans poste posé à la main, tourné vers le but le plus proche. */
  poserSans(l, x) {
    this.finPose([this.nouveauJoueur({ l, x, but: butLePlusProche(x, this.etat.terrain) })], { l, x });
  }
  /** Trois joueurs en file vers le but le plus proche, ballon en main droite. */
  poserColonne(l, x) {
    const but = butLePlusProche(x, this.etat.terrain);
    const gx = but === 'bas' ? 40 : 0;
    const d = Math.hypot(10 - l, gx - x) || 1;
    const v = { l: (10 - l) / d, x: (gx - x) / d };
    const nouveaux = [];
    for (let i = -1; i <= 1; i++) {
      const j = this.nouveauJoueur({ l: l + v.l * i * 2.5, x: x + v.x * i * 2.5, but });
      const a = j.angle * Math.PI / 180;
      // la main droite, au bout de l'arc des bras : (0,98 ; -1,02) dans le repère du joueur
      nouveaux.push({ id: `b${++this.n}`, type: 'ballon', couleur: COULEUR.att, l: j.l + .98 * Math.cos(a) + 1.02 * Math.sin(a), x: j.x + .98 * Math.sin(a) - 1.02 * Math.cos(a), angle: 0 });
      nouveaux.push(j);
    }
    this.finPose(nouveaux, { l, x });
  }
  poserTas(l, x) {
    this.finPose(DECALAGES_TAS.map(([dl, dx]) => ({ id: `b${++this.n}`, type: 'ballon', couleur: COULEUR.att, l: l + dl, x: x + dx, angle: 0 })), { l, x });
  }
  finPose(nouveaux, depuis) {
    this.etat.joueurs.push(...nouveaux);
    Object.assign(this.etat, { menuPoint: false, point: null, feuille: null });
    this.rend({ nouveaux: nouveaux.map((j) => j.id), depuis });
  }
  /** La mise en place choisie, au point de pose ; sans point, à sa place par défaut (scènes de la page). */
  mettreEnPlace(quoi, point) {
    const e = this.etat;
    const ici = quoi === 'colonne' || quoi === 'tas';
    const pt = point || (ici ? { l: 10, x: Math.min(LONG[e.terrain], 26) / 2 + 2 } : { l: 10, x: 6.6 });
    if (quoi === 'colonne') return this.poserColonne(pt.l, pt.x);
    if (quoi === 'tas') return this.poserTas(pt.l, pt.x);
    this.poser(quoi === 'att' ? ATTAQUE : quoi === 'def' ? DEFENSE : [...ATTAQUE, ...DEFENSE], butLePlusProche(pt.x, e.terrain));
  }

  /* --------------------------------------------------------------- pièces */
  selectionne(id) {
    Object.assign(this.etat, { selection: id || null, feuille: null });
    // Un geste sur une pièce désarme l'outil (change « L'outil reste armé jusqu'au premier geste »).
    if (id) Object.assign(this.etat, { outil: null, point: null, menuPoint: false });
    this.rend();
  }
  deplace(cle, l, x) {
    const j = POSTES[cle] ? this.joueurDuPoste(cle) : this.etat.joueurs.find((k) => k.id === cle);
    if (!j) return;
    j.l = l; j.x = x;
    if (j.type === 'joueur' && j.orientationAuto) j.angle = versAngle(j.angle, regard(j));
    this.rend();
  }
  assigne(cle) {
    const j = this.selection;
    if (!j) return;
    j.poste = cle || null;
    // Choisir un poste règle le joueur d'un coup : la couleur de son camp et l'orientation auto.
    if (cle) Object.assign(j, { couleur: COULEUR[POSTES[cle].camp], orientationAuto: true });
    if (j.orientationAuto) j.angle = versAngle(j.angle, regard(j));
    this.etat.feuille = null;
    this.rend();
  }
  retourne() {
    const j = this.selection;
    if (!j) return;
    j.dos = !j.dos;
    j.angle = j.orientationAuto ? versAngle(j.angle, regard(j)) : j.angle + 180;
    this.rend();
  }
  /** Cocher l'option tourne le joueur vers le jeu : l'attaquant vers le but, le défenseur vers l'attaque, à l'envers s'il est retourné. La décocher le laisse où il regarde. */
  basculeOrientationAuto() {
    const j = this.selection;
    if (!j || j.type !== 'joueur') return;
    j.orientationAuto = !j.orientationAuto;
    if (j.orientationAuto) j.angle = versAngle(j.angle, regard(j));
    this.rend();
  }

  /* --------------------------------------------------------------- repères */
  cadrage() {
    const f = this.f, L = LONG[this.etat.terrain];
    const w = f.champ.w / f.K, h = f.champ.h / f.K;
    const larg = f.plat ? L : 20, haut = f.plat ? 20 : L;
    return { x: -(w - larg) / 2, y: -(h - haut) / 2, w, h };
  }
  versVue(l, x) { return this.f.plat ? { u: x, v: 20 - l } : { u: l, v: x }; }
  depuisVue(u, v) { return this.f.plat ? { l: 20 - v, x: u } : { l: u, x: v }; }
  /** Position, en px dans la zone du terrain, d'un point du monde. */
  enPixels(l, x) {
    const v = this.cadrage(), p = this.versVue(l, x);
    return { left: (p.u - v.x) * this.f.K, top: (p.v - v.y) * this.f.K };
  }
  versTerrain(cx, cy) {
    const r = this.el.svg.getBoundingClientRect();
    const v = this.cadrage();
    return this.depuisVue(v.x + (cx - r.left) / r.width * v.w, v.y + (cy - r.top) / r.height * v.h);
  }

  /* --------------------------------------------------------------- rendu */
  rend(opts = {}) {
    const e = this.etat;
    if (this.terrainDessine !== e.terrain) {
      const v = this.cadrage();
      this.el.svg.setAttribute('viewBox', `${v.x} ${v.y} ${v.w} ${v.h}`);
      this.el.sol.innerHTML = terrainSVG(e.terrain);
      this.terrainDessine = e.terrain;
    }
    this.rendPage();
    this.rendHaut();
    this.rendJoueurs(opts);
    this.rendPoint();
    this.rendMenuPose();
    this.rendRangee();
    this.rendOutils();
    this.rendCouche();
  }

  /* L'ordinateur : l'éditeur dans la page de l'entraînement, telle qu'elle est. */
  rendPage() {
    if (this.format !== 'ordinateur') return;
    this.el.page.innerHTML = `
      <header class="p-entete"><span class="p-retour">${ic('retour')}Retour aux entraînements</span><span class="esp"></span>
        <span class="p-statut"><i></i>Brouillon</span><span class="p-btn">${ic('presenter')}Présenter</span><span class="p-btn">${ic('telecharger')}Télécharger le PDF</span><span class="p-btn primaire">${ic('enregistrer')}Enregistrer</span></header>
      <aside class="p-sommaire"><div class="p-som-titre"><span>Sommaire</span>${ic('panneau')}</div>
        <p class="p-item">Présentation</p><p class="p-item actif"><i>01</i>Attaque placée contre 0-6</p>
        <span class="p-ajout">${ic('ajoutRond')}Ajouter une situation</span></aside>
      <section class="p-carte" style="height:770px">
        <div class="p-carte-tete"><span class="p-num">01</span><h4>Attaque placée contre 0-6</h4><span class="esp"></span>${ic('copie')}${ic('supprimer')}</div>
        <p class="p-mots">${ic('diese')}Mots-clés</p>
      </section>
      <div class="p-editeur" style="height:584px"></div>
      <span class="p-ajout-schema" style="top:796px">${ic('ajoutRond')}Ajouter un schéma</span>`;
  }

  onglets(libelles) {
    return libelles
      ? `<span class="t-onglets libelles"><span class="actif">${ic('crayon')}Dessiner</span><span>${ic('lecture')}Animer</span></span>`
      : `<span class="t-onglets"><span class="actif">${ic('crayon')}</span><span>${ic('lecture')}</span></span>`;
  }

  rendHaut() {
    const j = this.selection;
    const puce = j ? `<button class="t-puce" data-action="deselectionne" aria-label="Désélectionner">${j.poste ? POSTES[j.poste].label : ic(j.type === 'ballon' ? 'balle' : 'joueur')}${ic('fermer')}</button>` : '';
    const aide = `<p class="t-aide">${ic('ampoule')}${this.aide()}</p>`;
    const zoom = `<span class="t-zoom">${ic('loupe')}×1</span>`;
    if (this.format === 'telephone') {
      this.el.haut.innerHTML = `<span class="ib">${ic('retour')}</span>${this.onglets(false)}${puce}<span class="esp"></span>
        <span class="ib">${ic('annuler')}</span><span class="ib">${ic('retablir')}</span><span class="ib enreg">${ic('enregistrer')}</span>`;
      return;
    }
    if (this.format === 'ordinateur') {
      this.el.haut.innerHTML = `${this.onglets(!j)}${puce}${aide}${zoom}<span class="ib">${ic('aide')}</span>
        <span class="ib">${ic('annuler')}</span><span class="ib">${ic('retablir')}</span><span class="ib">${ic('pleinEcran')}</span><span class="ib">${ic('menu')}</span>`;
      return;
    }
    const enregistrer = this.format === 'couchee'
      ? `<span class="enreg-libelle">${ic('enregistrer')}Enregistrer</span>`
      : `<span class="ib enreg">${ic('enregistrer')}</span>`;
    this.el.haut.innerHTML = `<span class="ib">${ic('retour')}</span>${this.onglets(!j)}${puce}${aide}${zoom}
      <span class="ib">${ic('annuler')}</span><span class="ib">${ic('retablir')}</span>${enregistrer}`;
  }

  rendJoueurs({ nouveaux = [], depuis = null } = {}) {
    const calque = this.el.joueurs;
    const vus = new Set();
    const ordre = [...this.etat.joueurs].sort((a, b) => (a.id === this.etat.selection) - (b.id === this.etat.selection));
    let rang = 0, place = 0;
    for (const j of ordre) {
      vus.add(j.id);
      let g = calque.querySelector(`[data-id="${j.id}"]`);
      const neuf = !g;
      if (neuf) {
        g = document.createElementNS(NS, 'g');
        g.classList.add('joueur');
        g.dataset.id = j.id;
        g.setAttribute('role', 'button');
        if (this.interactif) g.setAttribute('tabindex', '0');
        // À plat, le monde a tourné d'un quart de tour : l'étiquette le défait pour rester droite.
        g.innerHTML = `<circle class="cible" r="${j.type === 'ballon' ? .7 : 1.25}" fill="transparent"/><g class="corps"></g><g class="etiquette"${this.f.plat ? ' transform="rotate(90)"' : ''}></g>`;
      }
      // Ne déplacer un nœud que s'il n'est pas à sa place : le réinsérer couperait sa transition.
      if (calque.children[place] !== g) calque.insertBefore(g, calque.children[place] || null);
      place++;
      const sel = this.etat.selection === j.id;
      const corps = g.querySelector('.corps');
      const filtre = sel ? ` filter="url(#halo-${this.uid})"` : '';
      if (j.type === 'ballon') {
        corps.innerHTML = ballonSVG(j.couleur, filtre) + (sel ? this.cadreSelection(.6) : '');
        g.querySelector('.etiquette').innerHTML = '';
        g.setAttribute('aria-label', 'Balle');
      } else {
        corps.innerHTML = corpsSVG(j.couleur, filtre) + (sel ? this.cadreSelection(1.05) : '');
        g.querySelector('.etiquette').innerHTML = j.poste ? etiquetteSVG(POSTES[j.poste].label, j.couleur) : '';
        g.setAttribute('aria-label', j.poste ? cap(POSTES[j.poste].nom) : 'Joueur');
      }
      g.setAttribute('aria-pressed', sel ? 'true' : 'false');
      const final = `translate(${j.l}px, ${j.x}px)`;
      if (neuf && depuis && this.anime && nouveaux.includes(j.id)) {
        g.classList.add('glisse');
        g.style.transform = `translate(${depuis.l}px, ${depuis.x}px)`;
        g.style.opacity = '0';
        corps.style.transform = `rotate(${j.angle}deg)`;
        g.getBoundingClientRect();
        const delai = rang++ * 55;
        requestAnimationFrame(() => {
          g.classList.remove('glisse');
          g.style.transition = `transform .55s cubic-bezier(.2,.8,.2,1) ${delai}ms, opacity .25s ${delai}ms`;
          g.style.transform = final;
          g.style.opacity = '1';
          setTimeout(() => { g.style.transition = ''; }, 600 + delai);
        });
      } else {
        g.style.transform = final;
        g.style.opacity = '1';
        corps.style.transform = `rotate(${j.angle}deg)`;
      }
    }
    for (const g of [...calque.children]) if (!vus.has(g.dataset.id)) g.remove();
  }

  cadreSelection(c) {
    const poignee = (x, y) => `<circle cx="${x}" cy="${y}" r=".3" fill="#fff" stroke="${ORANGE}" stroke-width=".07"/>`;
    return `<g pointer-events="none"><rect x="${-c}" y="${-c}" width="${2 * c}" height="${2 * c}" fill="none" stroke="${ORANGE}" stroke-width=".08"/>`
      + poignee(-c, -c) + poignee(c, -c) + poignee(-c, c) + poignee(c, c)
      + `<line x1="${c}" y1="0" x2="${c + .45}" y2="0" stroke="${ORANGE}" stroke-width=".08"/>`
      + `<g class="poignee-rot" pointer-events="all" role="button" aria-label="Tourner"><circle cx="${c + .9}" cy="0" r=".75" fill="transparent"/><circle cx="${c + .9}" cy="0" r=".45" fill="#fff" stroke="${ORANGE}" stroke-width=".08"/>`
      + `<path d="M ${c + .68},-.12 A .24 .24 0 1 0 ${c + 1.1},.1" fill="none" stroke="${ORANGE}" stroke-width=".07"/></g></g>`;
  }

  /** Où se trouve le « + » : devant le but sur un schéma vide, puis là où l'on a touché. */
  get pointDePose() {
    const e = this.etat;
    if (e.selection || e.outil) return null;
    if (e.point) return e.point;
    return e.joueurs.length === 0 ? { l: 10, x: 6.6 } : null;
  }

  rendPoint() {
    const pt = this.pointDePose;
    // Le « + » n'apparaît en fondu que lorsqu'il change de place : c'est la réponse au toucher.
    const cle = pt ? `${pt.l.toFixed(2)},${pt.x.toFixed(2)}` : '';
    const fixe = cle === this.dernierPoint ? ' fixe' : '';
    this.dernierPoint = cle;
    this.el.points.innerHTML = pt
      ? `<g class="point-pose${this.etat.menuPoint ? ' ouvert' : ''}${fixe}" transform="translate(${pt.l} ${pt.x})" role="button" aria-label="Mettre en place ici"${this.interactif ? ' tabindex="0"' : ''}>
          <circle class="halo-point" r="1.15" fill="rgba(235,93,33,.22)"/><circle r=".72" fill="${ORANGE}" stroke="#fff" stroke-width=".1"/>
          <path d="M-.34 0h.68M0 -.34v.68" stroke="#fff" stroke-width=".14" stroke-linecap="round"/></g>`
      : '';
  }

  /**
   * Le menu de mise en place, ancré au « + », du côté où il a la place. Il dit comment il marche :
   * où chaque entrée arrive, vers où regardent les joueurs, et que rien n'est groupé ensuite.
   */
  rendMenuPose() {
    const e = this.etat, pt = this.pointDePose;
    if (!e.menuPoint || !pt) { this.el.surcouche.innerHTML = ''; return; }
    const but = butLePlusProche(pt.x, e.terrain);
    const nomBut = e.terrain === 'entier' ? ` ${this.f.plat ? (but === 'bas' ? 'de droite' : 'de gauche') : (but === 'bas' ? 'du bas' : 'du haut')}` : '';
    const entree = ([v, dessin, nom, , detail]) => `<button role="menuitem" data-action="mettre" data-valeur="${v}">${dessin()}<span class="t-menu-nom"><span>${nom}</span><small>${detail}</small></span></button>`;
    const entrees = (ou) => MISES_EN_PLACE.filter((m) => m[3] === ou).map(entree).join('');
    this.el.surcouche.innerHTML = `<div class="t-menu-pose" style="visibility:hidden" role="menu" aria-label="Mettre en place ici">
      <p class="t-menu-titre">Devant le but${nomBut}</p>
      <p class="t-menu-explique">Chacun à son poste : les attaquants face au but, sauf le pivot, dos au but ; les défenseurs face à l’attaque. Jamais un poste en double.</p>
      ${entrees('but')}
      <p class="t-menu-titre">À cet endroit</p>
      <p class="t-menu-explique">Au +, tournés vers le but le plus proche.</p>
      ${entrees('ici')}
      <p class="t-menu-pied">Rien n’est groupé : tout se règle ensuite.</p>
    </div>`;
    // Le menu se mesure avant de se placer : sa hauteur dépend de ses textes. Il peut couvrir
    // les barres de l'éditeur, comme tout menu, mais jamais sortir de l'écran.
    const menu = this.el.surcouche.firstElementChild;
    const c = this.f.champ, q = this.enPixels(pt.l, pt.x), p = { left: c.x + q.left, top: c.y + q.top };
    const W = menu.offsetWidth || 272, cw = this.f.w, ch = this.f.h, marge = 8;
    let H = menu.offsetHeight || 360;
    let left = p.left + 22, top = p.top - 60;
    if (left + W > cw - marge) left = p.left - 22 - W;
    if (left < marge) {
      // Ni à droite ni à gauche : dessous, ou dessus, du côté qui a le plus de place. S'il en
      // manque, le menu défile plutôt que de cacher le « + ».
      left = Math.min(Math.max(p.left - W / 2, marge), cw - W - marge);
      const dessous = ch - marge - (p.top + 24), dessus = p.top - 24 - marge;
      if (H > dessous && dessus > dessous) { H = Math.min(H, dessus); top = p.top - 24 - H; } else { H = Math.min(H, dessous); top = p.top + 24; }
      menu.style.maxHeight = `${H}px`;
    }
    top = Math.min(Math.max(top, marge), ch - H - marge);
    Object.assign(menu.style, { left: `${left}px`, top: `${top}px`, visibility: '' });
  }

  rendRangee() {
    this.el.rangee.innerHTML = this.format === 'telephone'
      ? `<p class="t-aide">${ic('ampoule')}${this.aide()}</p><span class="t-zoom">${ic('loupe')}×1</span>`
      : '';
  }

  /** La ligne d'aide de l'éditeur, mot pour mot, plus le geste de la mise en place. */
  aide() {
    const e = this.etat, j = this.selection, g = GESTES[this.f.souris ? 'souris' : 'tactile'];
    if (j) {
      const nom = j.type === 'ballon' ? 'Balle' : j.poste ? cap(POSTES[j.poste].nom) : 'Joueur';
      return `${nom} : glisse pour déplacer · ${g.zoomer}`;
    }
    const outil = e.outil ? OUTILS.find(([v]) => v === e.outil) : null;
    if (outil && outil[4]) return `${outil[1]} : annotation visible à tous les temps, jamais animée · ${g.poser}`;
    if (outil) return `${outil[1]} : ${g.poser} · ${g.zoomer}`;
    if (e.menuPoint) return `Choisis ce qui se met en place ici · ${g.fermer}`;
    return `${g.regler} · ${g.mettre(this.pointDePose)} · ${g.zoomer}`;
  }

  /* --------------------------------------------------------------- outils et actions */
  boutonOutil([val, nom, icone, raccourci, annot]) {
    const raccourciVu = this.f.souris ? `<i aria-hidden="true">${raccourci}</i>` : '';
    const clavier = this.f.souris ? ` aria-keyshortcuts="${raccourci === 'Esc' ? 'Escape' : raccourci}"` : '';
    return `<button class="${annot ? 'annot' : ''}" data-action="outil" data-valeur="${val}" aria-label="${nom}"${clavier} aria-pressed="${(this.etat.outil || '') === val}">${ic(icone)}${nom}${raccourciVu}</button>`;
  }
  boutonPlusOutils() { return `<button data-action="plus" aria-haspopup="dialog" aria-label="Plus d'outils">${ic('plus')}Plus</button>`; }

  /**
   * Les actions de la pièce choisie. Au téléphone, les cinq du dock ; ailleurs, la liste complète
   * de la bande ou du rail. Un joueur commence par son poste et Retourner ; un ballon n'a ni l'un ni l'autre.
   */
  actionsSelection(complet) {
    const j = this.selection;
    const autres = PALETTE.filter(([v]) => v.toUpperCase() !== j.couleur.toUpperCase()).slice(0, 2);
    const teintes = autres.map(([v, nom]) => `<button data-action="couleur" data-valeur="${v}" aria-label="${nom}, recolorer"><span class="pastille" style="background:${v}"></span>${nom}</button>`).join('');
    const dupliquer = `<button data-action="dupliquer">${ic('dupliquer')}Dupliquer</button>`;
    const supprimer = `<button class="danger" data-action="supprimer">${ic('supprimer')}Supprimer</button>`;
    const plus = `<button data-action="reglages" aria-haspopup="dialog">${ic('reglages')}Plus</button>`;
    const tailles = `<button class="taille petit">${ic('joueur')}Petit</button><button class="taille actif">${ic('joueur')}Normal</button><button class="taille grand">${ic('joueur')}Grand</button>`;
    if (j.type === 'ballon') return teintes + dupliquer + supprimer + plus;
    const vide = `<svg viewBox="-1.25 -1.25 2.5 2.5" width="24" height="24" aria-hidden="true">${corpsSVG(j.couleur)}</svg>`;
    const poste = `<button data-action="choisir-poste" aria-haspopup="dialog"><span class="mini">${j.poste ? pastille(POSTES[j.poste].label, j.couleur, 24) : vide}</span>Poste</button>`;
    const retourner = `<button data-action="retourner">${ic('retourner')}Retourner</button>`;
    const versLeBut = `<button data-action="orientation-auto" aria-pressed="${!!j.orientationAuto}">${ic('boussole')}Orientation auto</button>`;
    // Au téléphone, l'option passe dans Plus : le dock garde ses cinq places.
    return complet ? poste + retourner + versLeBut + tailles + teintes + dupliquer + supprimer + plus : poste + retourner + dupliquer + supprimer + plus;
  }

  rendOutils() {
    const j = this.selection;
    const vide = (el) => { el.innerHTML = ''; };
    if (this.format === 'couchee') {
      vide(this.el.dock);
      this.el.railG.innerHTML = OUTILS.map((o) => this.boutonOutil(o)).join('') + this.boutonPlusOutils();
      this.el.temps.innerHTML = `<span class="a-t0">T0</span><span class="a-tplus">${ic('ajout')}</span>`;
      this.el.railD.innerHTML = j
        ? `<div class="a-rail-actions">${this.actionsSelection(true)}</div>`
        : `<div class="a-invite">${ic('invite')}<p>${this.mots.Toucher} une pièce pour la régler</p></div>`;
      return;
    }
    [this.el.railG, this.el.railD, this.el.temps].forEach(vide);
    if (j) { this.el.dock.innerHTML = this.actionsSelection(this.format !== 'telephone'); return; }
    const garde = { telephone: ['', 'joueur', 'ballon', 'plot'], tablette: OUTILS.map(([v]) => v).filter((v) => !['carre', 'echelle', 'haie'].includes(v)) }[this.format];
    const outils = garde ? OUTILS.filter(([v]) => garde.includes(v)) : OUTILS;
    this.el.dock.innerHTML = outils.map((o) => this.boutonOutil(o)).join('') + this.boutonPlusOutils();
  }

  /* --------------------------------------------------------------- feuilles et menus ancrés */
  /** Plein écran au téléphone et à la tablette tenue droite : une feuille. Ailleurs, un menu ancré. */
  get ancre() { return this.format === 'couchee' || this.format === 'ordinateur'; }

  rendCouche() {
    const e = this.etat, sel = this.selection;
    if (!e.feuille) { this.el.couche.innerHTML = ''; return; }
    const nomPiece = sel && sel.type === 'ballon' ? 'Balle' : sel && sel.poste ? cap(POSTES[sel.poste].nom) : 'Joueur';
    if (this.ancre) {
      const corps = { outils: () => this.disposition(true), reglages: () => this.reglages(), poste: () => `<h5 class="premier">Poste du joueur</h5>${this.choixDuPoste()}` }[e.feuille]();
      this.el.couche.innerHTML = `<div class="t-voile transparent" data-action="fermer"></div><div class="t-menu-ancre" data-menu="${e.feuille}" role="dialog" aria-label="${e.feuille === 'outils' ? 'Plus d’outils' : nomPiece}">${corps}</div>`;
      return;
    }
    const titre = (t) => `<div class="titre"><h4>${t}</h4><button data-action="fermer" aria-label="Fermer">${ic('fermer')}</button></div>`;
    const corps = {
      outils: () => titre('Tous les outils') + this.toutLeMateriel() + this.disposition(false),
      reglages: () => titre(nomPiece) + this.reglages(),
      poste: () => titre('Poste du joueur') + this.choixDuPoste(),
    }[e.feuille]();
    this.el.couche.innerHTML = `<div class="t-voile" data-action="fermer"></div><div class="t-feuille" role="dialog" aria-modal="true">${corps}</div>`;
  }

  /**
   * Plus n'a plus de section Mise en place : elle passe par le terrain. Tout effacer rejoint la
   * section Terrain, qui accueillera aussi les terrains à venir (beach, 3D du gardien).
   */
  disposition(premier) {
    const e = this.etat;
    return `<h5${premier ? ' class="premier"' : ''}>Terrain</h5><div class="t-dispo">
        <button data-action="terrain" data-valeur="entier" aria-pressed="${e.terrain === 'entier'}" aria-label="Terrain entier">${miniTerrain('entier')}</button>
        <button data-action="terrain" data-valeur="demi" aria-pressed="${e.terrain === 'demi'}" aria-label="Demi-terrain">${miniTerrain('demi')}</button>
      </div>
      <button class="t-effacer" data-action="effacer">${ic('effacer')}Tout effacer</button>`;
  }
  toutLeMateriel() {
    const cas = (nom, icone, cls = '') => `<span class="t-case ${cls}">${ic(icone)}${nom}</span>`;
    return `<h5>Matériel</h5><div class="t-grille">${cas('Joueur', 'joueur')}${cas('Plot', 'plot')}${cas('Balle', 'balle')}${cas('Latte', 'latte')}${cas('Coupelle', 'coupelle')}${cas('Cerceau', 'cerceau')}${cas('Echelle', 'echelle')}${cas('Haie', 'haie')}</div>
      <h5>Annotations</h5><div class="t-grille">${cas('Séparation', 'separation', 'annot')}${cas('Trajectoire', 'trajectoire', 'annot')}${cas('Texte', 'texte', 'annot')}${cas('Carré', 'carre', 'annot')}</div>`;
  }
  reglages() {
    const j = this.selection;
    if (!j) return '';
    const couleurs = `<div class="t-couleurs">${PALETTE.slice(0, 4).map(([v]) => `<span class="${v === j.couleur.toUpperCase() ? 'actif' : ''}" style="background:${v}"></span>`).join('')}</div>`;
    const tailles = `<div class="t-tailles"><span>${ic('joueur')}</span><span class="actif">${ic('joueur')}</span><span>${ic('joueur')}</span></div>`;
    if (this.ancre) {
      return `<h5 class="premier">Couleur</h5>${couleurs}<h5>Actions</h5><div class="t-tailles"><span>${ic('dupliquer')}</span><span>${ic('supprimer')}</span></div><h5>Taille</h5>${tailles}`;
    }
    return `<div style="display:grid;grid-template-columns:auto 1fr;gap:0 28px"><div><h5>Couleur</h5>${couleurs}</div><div><h5>Taille</h5>${tailles}</div></div>`
      + (this.format === 'telephone' && j.type === 'joueur'
        ? `<button class="t-interrupteur" role="switch" aria-checked="${!!j.orientationAuto}" data-action="orientation-auto"><span><b>${ic('boussole')}Orientation auto</b><small>L'attaquant regarde le but, le défenseur l'attaque, même quand on le glisse. Cochée par le choix d'un poste ; une rotation à la main la décoche.</small></span><i aria-hidden="true"></i></button>`
        : '');
  }

  /** Le poste se choisit sur un petit terrain, là où le joueur joue, vu comme la scène. */
  choixDuPoste() {
    const j = this.selection;
    if (!j) return '';
    const l = j.but === 'bas' ? 20 - j.l : j.l, x = j.but === 'bas' ? 40 - j.x : j.x;
    const cles = [...ATTAQUE, ...DEFENSE, 'GB'];
    let proche = null, dmin = Infinity;
    for (const c of cles) { const p = POSTES[c]; const d = Math.hypot(p.l - l, p.x - x); if (d < dmin) { dmin = d; proche = c; } }
    const plat = this.f.plat;
    const t = `stroke="#fff" stroke-width=".1" fill="none"`;
    let monde = `<rect x="0" y="0" width="20" height="15.6" fill="${SOL}"/>
      <path d="${ZONE_HAUT}" fill="${ZONE}" stroke="#fff" stroke-width=".08"/>
      <path d="M0,2.96 A9,9 0 0 0 8.5,9 L11.5,9 A9,9 0 0 0 20,2.96" ${t} stroke-dasharray=".39 .39"/>
      <rect x="8.5" y="0" width="3" height=".5" ${t}/>`;
    for (const c of cles) {
      const p = POSTES[c];
      const actuel = j.poste === c;
      const couleur = COULEUR[p.camp];
      monde += `<g class="spot" data-action="assigne" data-valeur="${c}" role="button" tabindex="0" aria-label="${cap(p.nom)}${c === proche ? ', le plus près' : ''}" transform="translate(${p.l} ${p.x})">
        ${c === proche ? `<circle r="1.32" fill="none" stroke="#F4AD8E" stroke-width=".26"/>` : ''}
        <circle class="fond" r=".92" fill="${actuel ? couleur : 'rgba(255,255,255,.9)'}" stroke="${couleur === '#FFFF00' ? '#1C1726' : couleur}" stroke-width=".14"/>
        <text x="0" y=".03"${plat ? ' transform="rotate(90)"' : ''} font-size="${p.label.length > 2 ? .58 : .7}" fill="${actuel && !clair(couleur) ? '#fff' : '#1C1726'}" style="${STYLE_ETIQUETTE}">${p.label}</text></g>`;
    }
    const svg = plat
      ? `<svg class="t-carte-postes a-plat" viewBox="-0.6 -0.6 16.8 21.2" role="group" aria-label="Postes"><g transform="${MONDE_A_PLAT}">${monde}</g></svg>`
      : `<svg class="t-carte-postes" viewBox="-0.6 -0.6 21.2 16.4" role="group" aria-label="Postes">${monde}</svg>`;
    return `<p class="sous">${this.mots.Toucher} la place où il joue.</p>${svg}
      <p class="t-suggestion"><i></i>Le plus près de sa place : ${cap(POSTES[proche].nom)}</p>
      <button class="t-sans" data-action="assigne" data-valeur="">Sans poste</button>`;
  }

  /* --------------------------------------------------------------- gestes */
  ouvreLeMenu(point) {
    Object.assign(this.etat, { selection: null, outil: null, feuille: null, point: point || this.pointDePose, menuPoint: true });
    this.rend();
  }

  ecoute() {
    const r = this.racine;
    r.addEventListener('click', (ev) => {
      const cible = ev.target.closest('[data-action]');
      if (!cible || !r.contains(cible)) return;
      this.action(cible.dataset.action, cible.dataset.valeur);
    });
    r.addEventListener('keydown', (ev) => {
      if (ev.key !== 'Enter' && ev.key !== ' ') return;
      const g = ev.target.closest('.joueur'), spot = ev.target.closest('.spot');
      if (ev.target.closest('.point-pose')) { ev.preventDefault(); this.ouvreLeMenu(); }
      else if (g) { ev.preventDefault(); this.selectionne(g.dataset.id); }
      else if (spot) { ev.preventDefault(); this.assigne(spot.dataset.valeur); }
    });

    // Le clic droit ouvre la mise en place tout de suite, à l'endroit cliqué.
    const svg = this.el.svg;
    svg.addEventListener('contextmenu', (ev) => {
      ev.preventDefault();
      this.ouvreLeMenu(this.versTerrain(ev.clientX, ev.clientY));
    });

    // Toucher une pièce la choisit, la glisser la déplace ; toucher le « + » ouvre le menu ;
    // toucher le vide y déplace le « + », ou pose un joueur si l'outil Joueur est armé.
    let geste = null;
    svg.addEventListener('pointerdown', (ev) => {
      if (ev.button === 2) return;
      const rot = ev.target.closest('.poignee-rot');
      if (rot) {
        geste = { cx: ev.clientX, cy: ev.clientY, bouge: false, rotation: true, id: rot.closest('.joueur').dataset.id };
        svg.setPointerCapture(ev.pointerId);
        return;
      }
      if (ev.target.closest('.point-pose')) { geste = { cx: ev.clientX, cy: ev.clientY, bouge: false, point: true }; return; }
      const g = ev.target.closest('.joueur');
      const p = this.versTerrain(ev.clientX, ev.clientY);
      geste = { cx: ev.clientX, cy: ev.clientY, bouge: false, id: g ? g.dataset.id : null, depart: p };
      if (g) {
        const j = this.etat.joueurs.find((k) => k.id === g.dataset.id);
        geste.decalage = { l: j.l - p.l, x: j.x - p.x };
      }
      svg.setPointerCapture(ev.pointerId);
    });
    svg.addEventListener('pointermove', (ev) => {
      if (!geste) return;
      if (!geste.bouge && Math.hypot(ev.clientX - geste.cx, ev.clientY - geste.cy) < 6) return;
      geste.bouge = true;
      if (!geste.id) return;
      const j = this.etat.joueurs.find((k) => k.id === geste.id);
      const p = this.versTerrain(ev.clientX, ev.clientY);
      const g0 = this.el.joueurs.querySelector(`[data-id="${j.id}"]`);
      if (geste.rotation) {
        // Tourner à la poignée décoche « Orientation auto » : le joueur garde l'angle donné.
        j.angle = deg(Math.atan2(p.x - j.x, p.l - j.l));
        j.orientationAuto = false;
        g0.querySelector('.corps').style.transform = `rotate(${j.angle}deg)`;
        return;
      }
      this.etat.outil = null;
      j.l = Math.max(-1, Math.min(21, p.l + geste.decalage.l));
      j.x = Math.max(-1, Math.min(LONG[this.etat.terrain] + 1, p.x + geste.decalage.x));
      const g = this.el.joueurs.querySelector(`[data-id="${j.id}"]`);
      g.classList.add('glisse');
      g.style.transform = `translate(${j.l}px, ${j.x}px)`;
      if (j.type !== 'joueur' || !j.orientationAuto) return;
      // Avec « Orientation auto », le regard suit : le trait pointillé montre ce que le joueur regarde.
      j.angle = versAngle(j.angle, regard(j));
      g.querySelector('.corps').style.transform = `rotate(${j.angle}deg)`;
      this.el.regards.innerHTML = `<line class="regard" x1="${j.l}" y1="${j.x}" x2="10" y2="${j.but === 'bas' ? 40 : 0}"/>`;
    });
    const fin = (ev) => {
      if (!geste) return;
      const g = geste;
      geste = null;
      this.el.regards.innerHTML = '';
      if (g.point) {
        if (!g.bouge) {
          if (this.etat.menuPoint) { this.etat.menuPoint = false; this.rend(); } else this.ouvreLeMenu();
        }
        return;
      }
      if (g.rotation) { this.rend(); return; }
      if (g.id) {
        this.el.joueurs.querySelector(`[data-id="${g.id}"]`)?.classList.remove('glisse');
        if (!g.bouge) this.selectionne(this.etat.selection === g.id ? null : g.id);
        else this.rend();
        return;
      }
      if (!g.bouge && ev.type === 'pointerup') this.toucheTerrain(g.depart);
    };
    svg.addEventListener('pointerup', fin);
    svg.addEventListener('pointercancel', fin);
  }

  toucheTerrain(p) {
    const e = this.etat;
    const dedans = p.l > -0.5 && p.l < 20.5 && p.x > -0.5 && p.x < LONG[e.terrain] + .5;
    if (e.outil === 'joueur') { if (dedans) this.poserSans(p.l, p.x); return; }
    if (e.outil) return;
    // Toucher le vide ne pose rien : il déplace le « + », et ferme le menu s'il était ouvert.
    if (e.menuPoint) { e.menuPoint = false; this.rend(); return; }
    // Une pièce choisie : l'appui sur le vide la lâche, sans poser ni déplacer le « + ».
    if (e.selection) { this.selectionne(null); return; }
    Object.assign(e, { selection: null, point: dedans ? p : null });
    this.rend();
  }

  action(nom, val) {
    const e = this.etat;
    switch (nom) {
      case 'outil': Object.assign(e, { outil: val || null, selection: null, feuille: null, menuPoint: false }); this.rend(); break;
      case 'plus': Object.assign(e, { feuille: e.feuille === 'outils' ? null : 'outils', menuPoint: false }); this.rend(); break;
      case 'fermer': e.feuille = null; this.rend(); break;
      case 'deselectionne': this.selectionne(null); break;
      case 'mettre': this.mettreEnPlace(val, this.pointDePose); break;
      // Dans l'éditeur, derrière sa confirmation, comme aujourd'hui.
      case 'effacer': Object.assign(e, { joueurs: [], selection: null, feuille: null, point: null, menuPoint: false }); this.rend(); break;
      case 'assigne': this.assigne(val); break;
      case 'choisir-poste': e.feuille = e.feuille === 'poste' ? null : 'poste'; this.rend(); break;
      case 'reglages': e.feuille = e.feuille === 'reglages' ? null : 'reglages'; this.rend(); break;
      case 'retourner': this.retourne(); break;
      case 'orientation-auto': this.basculeOrientationAuto(); break;
      case 'couleur': if (this.selection) { this.selection.couleur = val; this.rend(); } break;
      case 'dupliquer': {
        const j = this.selection;
        if (!j) break;
        const k = { ...j, id: `${j.type === 'ballon' ? 'b' : 'j'}${++this.n}`, poste: null, l: j.l + 1.6, x: j.x + 1.6 };
        e.joueurs.push(k);
        e.selection = k.id;
        this.rend();
        break;
      }
      case 'supprimer': e.joueurs = e.joueurs.filter((j) => j.id !== e.selection); e.selection = null; this.rend(); break;
      case 'terrain':
        e.terrain = val;
        e.joueurs = e.joueurs.filter((j) => j.x <= LONG[val] + 1);
        if (val === 'demi') e.joueurs.forEach((j) => { j.but = 'haut'; });
        Object.assign(e, { feuille: null, point: null, menuPoint: false });
        this.rend();
        break;
      default: break;
    }
  }
}

/* ------------------------------------------------------------------ page */
function themes() {
  const boutons = document.querySelectorAll('[data-theme-choix]');
  const applique = (t) => {
    document.documentElement.dataset.theme = t;
    boutons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.themeChoix === t)));
    try { localStorage.setItem('etude-theme', t); } catch (_) { /* stockage indisponible */ }
  };
  let t = null;
  try { t = localStorage.getItem('etude-theme'); } catch (_) { /* stockage indisponible */ }
  applique(t || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  boutons.forEach((b) => b.addEventListener('click', () => applique(b.dataset.themeChoix)));
}

/** Les appareils se réduisent pour tenir dans leur colonne, sans jamais dépasser leur échelle. */
function ajuste() {
  // Une mise à l'échelle par transform et non par zoom : sous zoom, Chrome recalcule les
  // translations en px des pièces du SVG, et certaines se retrouvaient hors de leur place.
  document.querySelectorAll('.porte-tel').forEach((p) => {
    const w = +p.dataset.w, h = +p.dataset.h;
    const max = parseFloat(p.dataset.echelle || '1');
    const dispo = p.parentElement.getBoundingClientRect().width;
    let k = Math.min(max, dispo / w);
    if (p.dataset.ecran === '1') k = Math.min(k, Math.max(.4, (innerHeight - 150) / h));
    p.style.width = `${w * k}px`;
    p.style.height = `${h * k}px`;
    p.firstElementChild.style.transform = k === 1 ? '' : `scale(${k})`;
  });
}

function appareil(hote, cfg = {}) {
  const f = FORMATS[cfg.format || 'telephone'];
  const porte = document.createElement('div');
  porte.className = 'porte-tel';
  porte.dataset.echelle = String(cfg.echelle || 1);
  porte.dataset.w = String(f.w);
  porte.dataset.h = String(f.h);
  if (cfg.ecran) porte.dataset.ecran = '1';
  hote.appendChild(porte);
  const t = new Appareil(porte, cfg);
  ajuste();
  return t;
}

/**
 * Le banc d'essai : l'appareil interactif, le choix de l'appareil et du terrain, et Recommencer.
 * Changer d'appareil garde le schéma : on voit la même scène ailleurs.
 */
function banc() {
  const hote = document.getElementById('essai');
  const section = hote.closest('.banc');
  const boutonsTerrain = document.querySelectorAll('[data-terrain]');
  const boutonsFormat = document.querySelectorAll('[data-choix-format]');
  let courant = null, format = 'telephone';
  const marque = () => {
    boutonsTerrain.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.terrain === courant.etat.terrain)));
    boutonsFormat.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.choixFormat === format)));
  };
  const cree = (etat) => {
    hote.replaceChildren();
    section.dataset.format = format;
    hote.style.width = format === 'telephone' ? '390px' : '100%';
    courant = appareil(hote, { format, ecran: true, etat: etat && { ...etat, feuille: null, menuPoint: false } });
    new MutationObserver(marque).observe(courant.racine, { subtree: true, childList: true });
    marque();
  };
  cree(null);
  boutonsTerrain.forEach((b) => b.addEventListener('click', () => { courant.action('terrain', b.dataset.terrain); marque(); }));
  boutonsFormat.forEach((b) => b.addEventListener('click', () => { format = b.dataset.choixFormat; cree(courant.etat); }));
  document.querySelector('[data-rejouer]')?.addEventListener('click', () => cree(null));
}

addEventListener('resize', ajuste);
window.Etude = {
  appareil, banc, themes, ajuste, bulle, corpsSVG, etiquetteSVG, terrainSVG, reperesSVG, regard,
  POSTES, ATTAQUE, DEFENSE, COULEUR,
};
})();
