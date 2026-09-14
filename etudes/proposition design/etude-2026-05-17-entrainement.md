# Étude UX/UI — Section Entraînement (desktop + mobile)

_Date : 2026-05-17_
_Périmètre : `/entrainements` (liste) et `/entrainements/[id]` (éditeur)_

## 1. Méthode

Navigation logguée (compte du mainteneur) sur `localhost:3000` :
- Liste des entraînements (viewport 1024 et 390 px)
- Éditeur d'entraînement complet (cover, situations, bandeaux pédagogiques, schémas Konva)
- Captures conservées dans `entrainements-desktop.png`, `editeur-desktop-*.png`, `editeur-mobile-*.png` à la racine du repo

## 2. Diagnostic

### Ce qui fonctionne
- Palette violet/indigo cohérente, terrain Konva lisible
- Sémantique couleur des bandeaux pédagogiques (À FAIRE / À VÉRIFIER / À DIRE / FAIRE ÉVOLUER)
- Bottom-nav mobile clair

### Points faibles

| # | Constat | Impact |
|---|---------|--------|
| 1 | Hiérarchie typographique molle, un seul poids dominant | Difficulté à scanner |
| 2 | En-tête entraînement = carte grise type "formulaire désactivé" | L'identité de la séance est invisible |
| 3 | Page = scroll monolithique (~9000 px) sans ancre ni rythme | On perd le fil entre les 7 situations |
| 4 | 4 icônes blanches en top-bar sans hiérarchie claire | L'action principale (Enregistrer) ne ressort pas |
| 5 | Bandeaux pédagogiques répétitifs (4 blocs pastels empilés) | Fatigue visuelle, surtout mobile |
| 6 | Liste d'entraînements : 1 carte XXL sur 1000 px, FAB "+" minuscule | Densité incohérente |
| 7 | Mobile : titre H1 violet 28pt sur 4 lignes, FAB sommaire qui chevauche | Confort réduit |
| 8 | Footer "Template next-saas-stripe-starter" affiché en prod | Crédibilité |
| 9 | Aucune motion / feedback de sauvegarde | Manque de polish |
| 10 | Onglets contexte (Mes entraînements / Comité Gironde / Hbc Izon / Communauté) trop emphatiques | Confusion navigation vs filtre |

## 3. Direction esthétique proposée : « Carnet d'entraîneur éditorial »

Traiter l'entraînement comme un **playbook imprimé**, pas un formulaire SaaS.
Références : magazines sportifs, tactic books papier, Notion, Linear.

### 3.1 Typographie
- **Display** : Fraunces ou Instrument Serif (italique pour accents) → titres entraînement + situation
- **Body** : Geist ou Söhne — pas Inter
- **Mono** : JetBrains Mono pour chips durée / effectif / horodatage
- 3 niveaux clairs : H1 40/48, H2 24/28 serif italique, body 15/24

### 3.2 Couleur & atmosphère
- Indigo `#6D4AFF` **confiné aux CTA et accents**, plus pour les titres
- Encre titres : `#11131A`
- Fond papier `#FAF8F4` avec grain CSS très léger sur les zones "carnet"
- Bandeaux sectionnels : filet 3px à gauche + icône en outline, plutôt que pavés pastels pleins

### 3.3 En-tête entraînement (cover)
- Numéro de séance en chiffre fantôme arrière-plan (`#04` opacité 8 %)
- Date format `MER 8 MAI · 17:30 · 1H30` en mono small-caps
- Catégories en chips angulaires
- Statut "Terminé" intégré, pas un bouton vert isolé
- Objectif en italique serif large, façon citation

### 3.4 Architecture éditeur (desktop)
Passer du scroll-monolithe à **2 colonnes : sommaire 280px sticky + flux fluide**.
- Sommaire vertical : miniature terrain par situation + temps cumulé (`0:00 → 0:15`)
- Le FAB sommaire actuel disparaît
- Scroll-spy actif

### 3.5 Carte situation
- Bandeau : numéro géant (01, 02…), titre serif, mots-clés en small-caps
- Terrain Konva à gauche (40 %), texte à droite (au lieu de l'un sous l'autre)
- 4 sections pédagogiques en **grille 2×2 desktop** / **tabs swipables mobile**

### 3.6 Top bar
- "Enregistrer" en bouton avec label, pas icône seule
- Indicateur `Sauvegardé il y a 3 s` en mono small
- Statut "Terminé" sort de la barre d'action (c'est une métadonnée)

### 3.7 Liste d'entraînements
- Grille 2 col desktop / 1 col mobile, hauteur courte
- Chaque carte : 3 miniatures terrain max + chips mots-clés + barre de progression statut
- Filtres en chips horizontales (au lieu du bouton "Filtrer" central)
- CTA "Nouvel entraînement" en haut à droite, label visible

### 3.8 Mobile
- H1 22pt max, 2 lignes, ellipsis
- Cover collapsible en sticky compacte au scroll
- Sommaire via un 5ᵉ onglet bottom-nav "Plan"
- Sections pédagogiques en tabs swipables
- Terrain Konva tappable → modal zoom

### 3.9 Motion
- Page-load staggered : cover → meta → situations (delay 60 ms)
- Scroll-spy souligne situation visible
- Sauvegarde : checkmark SVG dessiné (200 ms) — un seul moment de joie

## 4. Quick wins (≤ 1 jour chacun)

1. Retirer le footer "Template next-saas-stripe-starter" en mode connecté
2. Ajouter label "Enregistrer" sur le bouton violet de la top-bar
3. Remplacer le bouton "Filtrer" central par des chips horizontales
4. Réduire le H1 mobile (22pt) et clamper à 2 lignes
5. Décaler le FAB sommaire mobile au-dessus de la safe-area + bottom-nav
6. Indicateur "Sauvegardé il y a Xs" sous le bouton Enregistrer

## 5. Prochaine étape

Prototyper la direction "Carnet éditorial" sur une route `/playground/entrainement-carnet` :
- Cover éditoriale
- 1 carte situation refondue (terrain + texte côte à côte, sections en grille 2×2)
- Sommaire sticky scroll-spy

Cela permettra de valider la direction esthétique avant de toucher au vrai éditeur.
