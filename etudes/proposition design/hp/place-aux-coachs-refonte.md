# Refonte Landing Page — Place aux Coachs
> Généré le 03/03/2026 · Session de design avec Claude

---

## 🎯 Contexte

**Site :** https://www.placeauxcoachs.fr/  
**Type :** Landing page one-page (Next.js, template next-saas-stripe-starter)  
**Cible :** Coachs bénévoles de handball passionnés  
**Objectif :** Présenter la plateforme et convertir à l'inscription gratuite  

### Structure actuelle
- Nav : Logo + bouton "Soutenir"
- Hero : Titre "Ne coachez plus jamais seul" + texte storytelling + CTA "Rejoindre le collectif"
- Section Valeurs (5 cartes : Entraide, Passion, Créativité, Collectif, Accessibilité)
- Section Features (6 fonctionnalités en grille)
- Section "Comment ça marche" (3 étapes)
- Section Soutien Tipeee
- CTA final
- Footer minimaliste

### Problèmes identifiés
- Design 100% template générique SaaS, aucune identité handball
- Pas d'éléments visuels du produit (aucun screenshot, aucun aperçu)
- Pas de preuve sociale (0 témoignage, 0 stat communauté)
- Navigation très pauvre (1 seul lien)
- Espaces blancs excessifs entre les sections
- Mockup features absent → visiteur ne voit jamais le produit

---

## 🔁 Prompt pour refaire une session similaire

```
Tu es un expert en UI/UX design et développement web.

Analyse la landing page du site [URL] et propose-moi 4 refontes complètes dans 4 onglets séparés du navigateur.

Pour chaque onglet :
1. Navigue sur [URL] et injecte le HTML/CSS complet via JavaScript (document.documentElement.innerHTML = `...`)
2. Garde le même contenu textuel mais redesigne entièrement le layout, la typographie, les couleurs et les composants
3. Les liens CTA doivent pointer vers les vraies URL du site
4. Chaque proposition doit avoir une identité visuelle distincte

Les 4 directions à explorer :
- Proposition 1 : Design sportif/immersif avec la couleur dominante du sport concerné, hero split-screen avec visuel produit à droite, stats communauté dans le hero
- Proposition 2 : Dark mode premium avec dégradés, bento grid pour les features, storytelling visuel dans le hero
- Proposition 3 : Orientation "Social proof & Communauté" — formulaire email dans le hero, feed d'exercices populaires, témoignages avec avatars, bande de stats
- Proposition 4 : Design "Sport Premium" — layout asymétrique, marquee défilant, sections features alternées gauche/droite, hero 2 colonnes contrasté

Pour chaque proposition, inclure :
- Une navbar complète avec liens de navigation et boutons Connexion/Inscription
- Un hero fort avec CTA principal et secondaire
- Les stats de la communauté (même si fictives/estimées)
- Toutes les sections du site original restructurées
- Un footer
- Des animations CSS simples (hover, transitions)

Nomme chaque onglet avec un emoji et le nom de la proposition (ex: "🏐 Refonte 1 — Terrain de Jeu").
```

---

## 📐 Propositions de refonte

---

### 🏐 Proposition 1 — "Terrain de Jeu"

**Concept :** Plonger le visiteur dans l'univers handball dès la première seconde.

**Palette :**
- Fond : `#0f1f3d` (bleu marine) → `#1a3a6b`
- Accent : `#f97316` (orange vif)
- Texte clair : blanc
- Section fond : `#f1f5f9` (gris très clair)

**Layout Hero :** Split-screen 50/50
- Gauche : badge "🏆 Pour les coachs bénévoles", H1 "Ne coachez plus jamais **seul**" (seul en orange), description, 2 CTAs (orange plein + ghost), stats (500+ coachs / 1 200+ exercices / 100% gratuit)
- Droite : carte glassmorphism avec terrain de handball SVG animé (joueurs numérotés en orange, adversaires en bleu, trajectoires en tirets, plots triangulaires en jaune) + tags "Attaque pivot · U13 · 20 min · 47 likes"

**Sections :**
- **Valeurs** : grille 3×2 sur fond gris, cartes blanches avec bordure orange au hover, 6e carte en navy
- **Features** : liste à gauche avec icônes navy + description, mockup app à droite (navy avec terrain vert)
- **Steps** : 3 colonnes sur fond navy, numéros en cercle orange
- **Soutien** : centré, bouton Tipeee orange (#ff6b35)
- **CTA final** : gradient orange, bouton blanc

**Nav :** Sticky navy, logo avec icône orange, liens blancs transparents, bouton CTA orange

---

### 🌙 Proposition 2 — "Dark Immersif"

**Concept :** Expérience premium dark avec storytelling visuel et bento grid.

**Palette :**
- Fond : `#08090a` (noir profond)
- Surface : `#111214` / `#1a1b1e`
- Accent : `#8b5cf6` (violet) + `#ec4899` (rose)
- Texte : `#f8fafc` / `#6b7280`

**Layout Hero :** Centré, full viewport
- Halos lumineux (radial-gradient violet + rose en arrière-plan)
- Badge avec point vert pulsant "Communauté active"
- H1 en gradient violet→rose (background-clip: text)
- Encart storytelling "18h03 · Ce soir, entraînement U13" sur fond surface avec curseur clignotant animé
- 2 CTAs (gradient violet-rose + outline)
- Barre de stats glassmorphism (3 colonnes séparées par des bordures)

**Sections :**
- **Features** : Bento grid 3 colonnes (cartes tall, wide et normales), tags colorés (violet/vert/rose), mini-terrain dans la carte éditeur
- **Valeurs** : 5 cartes en rangée horizontale, fond surface, hover surface2
- **Steps** : Timeline horizontale "→ → →" sur 3 colonnes
- **Soutien** : Card avec gradient violet/rose à 10% d'opacité, bordure violet
- **CTA** : Centré, titre en gradient

**Nav :** Fixed, blur backdrop, logo gradient, bouton gradient

---

### 🤝 Proposition 3 — "Communauté & Social Proof"

**Concept :** Preuve sociale au premier plan — montrer que la plateforme est vivante.

**Palette :**
- Primaire : `#7c3aed` (violet)
- Accent : `#0ea5e9` (bleu ciel)
- Succès : `#16a34a` (vert)
- Fond : `#f8fafc` (gris très clair)
- Blanc : `#ffffff`

**Layout Hero :** Centré, blanc
- Point vert pulsant "Communauté active · 500+ coachs"
- H1 "Le carnet de jeu des **coachs bénévoles**" (em en violet)
- Formulaire email inline (champ + bouton dans une seule ligne stylée)
- Perks : ✅ Gratuit pour toujours · ✅ Sans publicité · ✅ Accès immédiat

**Bande de stats** : fond violet clair, 4 métriques (500+ coachs / 1 200+ exercices / 48 clubs / 4.9/5)

**Sections exclusives :**
- **Feed "Exercices populaires"** : grille 3 cartes avec miniature terrain vert, level badge, tag "NOUVEAU", auteur avec avatar coloré + club, compteur de likes
- **Témoignages** : 3 cartes avec ★★★★★, citation, avatar gradient violet-bleu + nom + rôle
- **Comment ça marche** : grille 2 colonnes — étapes numérotées à gauche, mockup app sombre à droite
- **Soutien** : carte en 2 colonnes (texte + coeur emoji géant)
- **CTA final** : card full-width gradient violet→bleu

**Nav :** Logo gradient, nav centrale (Fonctionnalités / Exercices / Communauté), boutons Connexion (outline) + S'inscrire (solid)

---

### ✨ Proposition 4 — "Sport Premium"

**Concept :** Design éditorial sport haut de gamme, asymétrique, typographie forte.

**Palette :**
- Encre : `#0a0a0f` (noir profond)
- Or : `#f59e0b`
- Lime : `#84cc16`
- Fond : `#ffffff`
- Gris : `#f4f4f6`

**Éléments distinctifs :**
- **Bandeau annonce** : barre noire en haut "🏆 Place aux Coachs est 100% gratuit, pour toujours. [Soutenir →]" (lien en or)
- **Nav** : 3 colonnes (logo / liens centrés / actions), nav très propre blanc

**Layout Hero :** Asymétrique strict 54%/46%
- Gauche (blanc) : catégorie en uppercase spaced "HANDBALL · COACHS BÉNÉVOLES · FRANCE", H1 en 4 lignes avec "Ensemble" en outline (-webkit-text-stroke), 2 CTAs empilés (noir plein + outline noir), tags pill
- Droite (noir profond) : compteur géant "1.2k" exercices partagés, carte terrain SVG avec lignes de jeu, joueurs numérotés, trajectoires en tirets orange

**Éléments exclusifs :**
- **Marquee défilant** : barre noire animée "✦ HANDBALL ✦ BÉNÉVOLES ✦ ENTRAIDE ✦ CRÉATIVITÉ..." (animation CSS 22s)
- **Grid stats** sur fond noir : 4 métriques avec chiffres géants blancs + accent or/lime
- **Features alternées** : sections gauche/droite qui s'alternent (texte + visuel), avec label en uppercase + tiret, liste de bullet "→ item"
- **Process horizontal** : tableau 3 colonnes avec bordures, numéros "01 / 02 / 03" en uppercase
- **CTA final** : carte noire avec radial-gradient or en décoration, bouton doré + bouton outline blanc

---

## ⚙️ Technique d'injection

La méthode utilisée pour appliquer les refontes sur le site en production sans modifier le code source :

```javascript
// Dans la console DevTools ou via l'outil javascript_tool
document.title = "🏐 Refonte 1 — Terrain de Jeu";
document.documentElement.innerHTML = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <style>/* CSS complet ici */</style>
</head>
<body>
  <!-- HTML complet ici -->
</body>
</html>`;
```

**Avantages :** Permet de visualiser le rendu réel dans le navigateur sans déploiement.  
**Limites :** La page est perdue si on recharge. Utiliser uniquement pour prototypage/présentation.

---

## 📦 Éléments réutilisables

### SVG Terrain de Handball
```svg
<svg viewBox="0 0 380 240" xmlns="http://www.w3.org/2000/svg">
  <!-- Pelouse -->
  <rect width="380" height="240" rx="8" fill="#1a4f2a"/>
  <!-- Bordure -->
  <rect x="10" y="10" width="360" height="220" rx="4" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="1.5"/>
  <!-- Ligne médiane -->
  <line x1="190" y1="10" x2="190" y2="230" stroke="rgba(255,255,255,.25)" stroke-width="1"/>
  <!-- Cercle central -->
  <circle cx="190" cy="120" r="30" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="1"/>
  <!-- But gauche -->
  <rect x="10" y="95" width="18" height="50" rx="2" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="1.5"/>
  <!-- But droit -->
  <rect x="352" y="95" width="18" height="50" rx="2" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="1.5"/>
  <!-- Zone 6m gauche -->
  <path d="M10 72 Q78 72 78 120 Q78 168 10 168" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="1"/>
  <!-- Zone 6m droite -->
  <path d="M370 72 Q302 72 302 120 Q302 168 370 168" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="1"/>
  <!-- Joueurs orange -->
  <circle cx="100" cy="78" r="11" fill="#f97316" stroke="white" stroke-width="1.5"/>
  <text x="100" y="83" text-anchor="middle" fill="white" font-size="9" font-weight="bold">1</text>
  <!-- Joueurs bleus (adversaires) -->
  <circle cx="245" cy="88" r="11" fill="#1d4ed8" stroke="white" stroke-width="1.5"/>
  <!-- Plots jaunes -->
  <polygon points="128,58 134,70 122,70" fill="#fbbf24"/>
  <!-- Trajectoire orange (passe) -->
  <path d="M100 78 Q132 64 170 98" fill="none" stroke="#f97316" stroke-width="2.5" stroke-dasharray="5,3"/>
</svg>
```

### Animation marquee CSS
```css
.marquee { 
  display: flex; 
  white-space: nowrap; 
  animation: scroll 22s linear infinite; 
}
@keyframes scroll { 
  from { transform: translateX(0); } 
  to { transform: translateX(-50%); } 
}
```

### Point live pulsant
```css
.live-dot { 
  width: 8px; height: 8px; border-radius: 50%; 
  background: #22c55e; 
  animation: pulse 2s infinite; 
}
@keyframes pulse { 
  0%, 100% { box-shadow: 0 0 0 0 rgba(22,163,74,.4); } 
  50% { box-shadow: 0 0 0 6px rgba(22,163,74,0); } 
}
```

### Texte gradient CSS
```css
.gradient-text {
  background: linear-gradient(135deg, #f8fafc 25%, #a78bfa 65%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Texte outline (hollow)
```css
.outline-text {
  -webkit-text-stroke: 2px #0a0a0f;
  color: transparent;
}
```

---

*Fin du document · Place aux Coachs Design System*
