# Démarche produit — comment on décide de ce qu'on construit

Ce document décrit **l'amont** du développement : comment une idée exprimée par un entraîneur devient une fonctionnalité spécifiée, prête à être implémentée. La réalisation elle-même est suivie dans le dépôt de code, sous forme de changes OpenSpec.

```
idée d'un entraîneur  →  besoin formulé  →  priorisation  →  change OpenSpec  →  code
                         (assistant produit)   (à deux)       (développeur)
      └──────────── ce dépôt : issues et tableau ────────────┘  └── dépôt de code ──┘
```

## Le binôme

Le produit se décide à deux, et la répartition est explicite :

| | Rôle |
|---|---|
| **Référent métier** — issu du comité départemental de handball | Décide **quoi** construire et dans quel ordre, à partir de ce dont les entraîneurs ont besoin sur le terrain. Il n'a pas à entrer dans la technique. |
| **Développeur** — Jérôme Roux | Décide **comment** le construire, et dit ce que ça coûte. Il ne décide pas seul des priorités. |

**Rythme : un point tous les quinze jours**, où l'on priorise.

## D'où viennent les idées

- **Le référent métier** — le canal structuré, qui produit le gros des demandes. Étiquette `source:thomas`.
- **Les entraîneurs eux-mêmes** — directement dans les issues de ce dépôt, par email ou via le bouton de retour de l'application. Étiquette `source:entraineur`.
- **La mesure d'usage** — ce que montrent les chiffres de fréquentation. Étiquette `source:usage`.

Un retour spontané d'entraîneur est plus rare mais plus précieux : il vient de quelqu'un qui utilise l'outil sans avoir de rôle dans le projet. Il est instruit avec le même sérieux qu'une demande du référent.

## Le chemin d'une idée

**1. Une idée, ou une gêne, est exprimée** dans une issue « Fonctionnalité ». Aucune mise en forme n'est attendue à ce stade. Colonne **À instruire**.

**2. Le besoin est mis en forme** avec le [guide de travail](guide-de-travail.md) et l'[assistant produit](assistant-produit.md) : problème reformulé, user stories, critères d'acceptation, valeur de 1 à 5. Colonne **Instruit**.

**3. On priorise ensemble** au point des quinze jours. Le développeur renseigne l'effort (S, M, L), le référent la valeur. Colonne **Priorisé**.

**4. Le développement démarre.** Une fonctionnalité trop grosse est découpée en sous-issues `technique`, chacune correspondant à un change OpenSpec. Colonnes **En cours** puis **En revue**.

**5. La fonctionnalité est livrée**, et l'issue indique quoi tester. Colonne **Livré**.

## Étiquettes

| Axe | Étiquettes |
|---|---|
| Type | `fonctionnalite`, `bug`, `technique` |
| Source | `source:thomas`, `source:entraineur`, `source:usage` |
| Thème | `editeur`, `organisation`, `bibliotheque`, `communaute`, `prise-en-main` |

## Le principe qui gouverne les arbitrages

Le relevé d'usage du 2 septembre 2026 a établi un fait qui prime sur toutes les demandes de fonctionnalités : **une inscription sur deux ne débouche sur aucun entraînement créé**. Les personnes concernées confirment leur compte, se connectent, puis décrochent à la prise en main.

Tant que ce point n'est pas corrigé, toute fonctionnalité qui amène davantage d'utilisateurs amène surtout davantage de personnes qui repartent. **La prise en main passe donc avant l'enrichissement** — c'est le seul arbitrage déjà tranché.
