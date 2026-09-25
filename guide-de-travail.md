# Guide de travail produit — PlaceAuxCoachs

Ce document sert de **référence commune** entre le **référent métier** et le **développeur**.

Son objectif est simple :
- aider à **exprimer clairement les besoins métier** ;
- structurer les idées en **fonctionnalités** et **user stories** ;
- préparer le travail de développement **sans entrer dans la technique**.

Il peut être utilisé **en autonomie**, notamment avec l'aide d'une IA et de la consigne [`assistant-produit.md`](assistant-produit.md).

---

## 1. Règle fondamentale

**Le référent métier apporte la valeur, les usages et l'ordre d'importance des besoins.
Le développeur décide de la solution technique et de l'implémentation.
Le bureau de l'association arrête les orientations, dans une feuille de route.**

Ce document ne sert **pas** à :
- parler de technologie ;
- décrire des écrans ou du code ;
- organiser le travail technique.

Il sert à :
- clarifier les besoins réels ;
- prioriser ce qui compte ;
- éviter les malentendus.

---

## 2. Vocabulaire essentiel

### Problème utilisateur

Une difficulté réelle vécue par un entraîneur.

> « Je perds du temps à recréer des exercices que j'ai déjà faits. »

### Attente produit

Ce que l'utilisateur **devrait pouvoir faire plus facilement**.

> « L'utilisateur devrait pouvoir réutiliser facilement un exercice existant. »

### Fonctionnalité

Une **capacité claire du produit**, visible par l'utilisateur, qui répond à une attente. Elle est courte, compréhensible et orientée usage.

Exemples PlaceAuxCoachs :
- Dupliquer une situation
- Partager un entraînement avec un groupe de travail
- Rechercher par mots-clés

### User story

Une **petite histoire d'usage**, racontée du point de vue de l'utilisateur :

> « En tant que [type d'utilisateur], je veux [action] afin de [bénéfice]. »

Exemple : « En tant qu'entraîneur U11, je veux dupliquer une situation afin de gagner du temps lors de la préparation. »

Une user story **ne décrit jamais la solution technique**.

---

## 3. Processus de travail

Ce processus transforme une idée ou un problème en issue prête pour le développement.

### Étape 1 — Identifier un problème utilisateur

- Qu'est-ce qui est difficile aujourd'hui ?
- À quel moment l'utilisateur perd du temps ou s'agace ?
- Qui est concerné, quel type d'entraîneur ?

👉 1 à 3 phrases décrivant le problème, côté utilisateur.

### Étape 2 — Définir l'attente produit

- Qu'est-ce qui devrait être plus simple ? Plus rapide ? Plus évident ?

👉 Une phrase commençant par « L'utilisateur devrait pouvoir… »

### Étape 3 — Définir la fonctionnalité

- Quelle capacité du produit répond à cette attente ?
- Comment la nommer simplement ?

👉 Une fonctionnalité nommée et une phrase explicative.

> **Fonctionnalité : Dupliquer une situation**
> Permet de copier une situation complète pour la réutiliser ailleurs.

### Étape 4 — Écrire les user stories

- Qui utilise cette fonctionnalité ? Que veut-il faire concrètement ? Pourquoi ?
- 2 à 5 user stories maximum, une action par user story.

> - En tant qu'entraîneur, je veux copier une situation afin de la coller dans un autre entraînement.
> - En tant qu'entraîneur, je veux que la situation copiée conserve tous ses schémas.

### Étape 5 — Définir les critères de réussite

Pour chaque fonctionnalité, compléter « C'est réussi si… » :

> - la copie prend moins de 10 secondes ;
> - aucun contenu n'est perdu ;
> - la modification n'affecte pas l'original.

Ces critères servent à valider que le besoin est couvert et à éviter les incompréhensions. **Sans eux, une issue ne peut pas être développée.**

---

## 4. Ce que le référent métier porte, et ce qui revient au développeur

| Le référent porte | Le développeur porte |
|---|---|
| les problèmes prioritaires | les écrans ou boutons précis |
| les fonctionnalités à construire | la structure des données |
| les user stories | la faisabilité technique |
| les critères de réussite | les choix d'implémentation |

---

## 5. Exemple complet

**Problème** — Recréer des exercices similaires prend trop de temps.

**Attente** — L'utilisateur devrait pouvoir réutiliser facilement un exercice existant.

**Fonctionnalité** — Dupliquer une situation.

**User stories**
- En tant qu'entraîneur, je veux copier une situation afin de la coller dans un autre entraînement.
- En tant qu'entraîneur, je veux modifier la situation copiée sans impacter l'originale.

**Réussi si**
- la duplication est rapide ;
- tout le contenu est conservé ;
- l'original reste intact.

---

## 6. Utiliser une IA

Une IA (Claude, ChatGPT, Gemini…) peut aider à :
- reformuler un problème flou ;
- écrire des user stories claires ;
- vérifier qu'une fonctionnalité est bien définie ;
- challenger un périmètre trop large.

Donnez-lui le contenu de [`assistant-produit.md`](assistant-produit.md) en début de conversation, puis décrivez votre idée. Sa réponse suit les rubriques du formulaire « Fonctionnalité » :

- **pour une nouvelle idée**, collez-la dans le formulaire ;
- **pour une idée déjà déposée**, collez-la en **commentaire** de l'issue. Le développeur reporte ensuite dans l'issue ce qui est validé.

---

## 7. Checklist avant de passer une issue en « Instruit »

- [ ] Le problème est clair et réel
- [ ] La fonctionnalité est compréhensible sans contexte
- [ ] Les user stories parlent d'usage, pas de solution
- [ ] Les critères de réussite sont définis
- [ ] Aucune décision technique n'est incluse

---

**Message clé** — On n'écrit pas de la technique. On raconte comment les entraîneurs utilisent PlaceAuxCoachs, et on décide de ce qui a vraiment de la valeur pour eux.
