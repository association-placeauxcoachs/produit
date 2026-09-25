# Démarche produit — comment on décide de ce qu'on construit

Ce document décrit **l'amont** du développement : comment une idée exprimée par un entraîneur devient une fonctionnalité spécifiée, prête à être implémentée. La réalisation elle-même est suivie dans le dépôt de code, sous forme de changes OpenSpec.

```
idée d'un entraîneur  →  besoin formulé  →  priorisation  →  change OpenSpec  →  code
                         (assistant produit)   (à deux)       (développeur)
      └──────────── ce dépôt : issues et tableau ────────────┘  └── dépôt de code ──┘
```

## Qui fait quoi

Le produit se construit à deux, et l'association tranche :

| | Rôle |
|---|---|
| **Référent métier** — issu du comité départemental de handball | Apporte la **valeur d'usage** : ce dont les entraîneurs ont besoin sur le terrain, et ce qui compte le plus. Il pose la valeur de chaque sujet, de 1 à 5. Il n'a pas à entrer dans la technique. |
| **Développeur** — Jérôme Roux | Décide **comment** construire, et dit ce que ça coûte. Il arbitre au fil de l'eau, dans le cadre de la feuille de route. |
| **Bureau de l'association** | Arrête les orientations : il adopte une feuille de route à chaque réunion ordinaire, avec ses axes et ses critères de priorisation. |

Le référent priorise avec nous ; l'association tranche. Aucune structure extérieure, qu'elle soutienne financièrement l'association ou non, n'a de droit de décision ni de veto sur les évolutions ([règlement intérieur, article 10](https://github.com/association-placeauxcoachs/association/tree/main/statuts)).

**Rythme : un point tous les quinze jours**, où l'on priorise.

## D'où viennent les idées

- **Le référent métier** — le canal structuré, qui produit le gros des demandes. Étiquette `source:referent`.
- **Les entraîneurs eux-mêmes** — directement dans les issues de ce dépôt, par email ou via le bouton de retour de l'application. Étiquette `source:entraineur`.
- **La mesure d'usage** — ce que montrent les chiffres de fréquentation. Étiquette `source:usage`.
- **Le développeur** — ses propres idées et les études de design. Étiquette `source:developpeur`.

Un retour spontané d'entraîneur est plus rare mais plus précieux : il vient de quelqu'un qui utilise l'outil sans avoir de rôle dans le projet. Il est instruit avec le même sérieux qu'une demande du référent.

## Le chemin d'une idée

**1. Une idée, ou une gêne, est exprimée** dans une issue « Fonctionnalité », avec le formulaire. Seul le problème est obligatoire : les autres rubriques peuvent rester vides. Le titre nomme le sujet, sans préfixe. Colonne **À instruire**.

**2. Le besoin est instruit en commentaire.** Le référent métier, ou toute autre personne, complète l'issue par un commentaire, avec le [guide de travail](guide-de-travail.md) et l'[assistant produit](assistant-produit.md) : fonctionnalité proposée, user stories, critères d'acceptation. Le développeur reporte ensuite ce qui est validé dans les rubriques de l'issue, qui reste la référence. Colonne **Instruit**.

**3. On priorise ensemble** au point des quinze jours. Le référent pose la **Valeur** (1 à 5), le développeur l'**Effort** (S, M, L), tous deux dans les champs du tableau. La valeur indiquée dans le formulaire n'est qu'un avis de la personne qui dépose l'idée. Colonne **Priorisé**.

**4. Le développement démarre.** Une fonctionnalité trop grosse est découpée en sous-issues `technique`, chacune correspondant à un change OpenSpec. Colonnes **En cours** puis **En revue**.

**5. La fonctionnalité est livrée**, et l'issue indique quoi tester. Colonne **Livré**.

**Un bug** suit un chemin plus court : il n'a pas à être instruit. Il est confirmé, puis priorisé au point suivant, ou corrigé tout de suite s'il empêche d'utiliser l'application.

**Les décisions** qui gouvernent la priorisation, comme l'arbitrage ci-dessous, sont des issues épinglées. Elles ne figurent pas au tableau.

**Pas de brouillon dans le tableau.** Le bouton « + » des colonnes crée une fiche qui n'existe que dans le tableau et ne passe par aucun formulaire. Toute idée, tout bug passe par une issue de ce dépôt, créée avec le formulaire correspondant. Un brouillon trouvé dans le tableau est converti en issue et remis au format, ou supprimé.

## Étiquettes

| Axe | Étiquettes |
|---|---|
| Type | `fonctionnalite`, `bug`, `technique` |
| Source | `source:referent`, `source:entraineur`, `source:usage`, `source:developpeur` |
| Thème | `editeur`, `organisation`, `bibliotheque`, `communaute` |
| Priorité | `prise-en-main` |

Une issue porte **un type, une source et un thème**. `prise-en-main` s'ajoute au thème lorsque le sujet aide un nouvel entraîneur à créer son premier entraînement : c'est ce qui le fait examiner en premier.

## Le principe qui gouverne les arbitrages

Le relevé d'usage du 2 septembre 2026 a établi un fait qui prime sur toutes les demandes de fonctionnalités : **une inscription sur deux ne débouche sur aucun entraînement créé**. Les personnes concernées confirment leur compte, se connectent, puis décrochent à la prise en main.

Tant que ce point n'est pas corrigé, toute fonctionnalité qui amène davantage d'utilisateurs amène surtout davantage de personnes qui repartent. **La prise en main passe donc avant l'enrichissement** — c'est le seul arbitrage déjà tranché.
