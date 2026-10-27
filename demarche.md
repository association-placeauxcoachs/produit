# Démarche produit — comment on décide de ce qu'on construit

Ce document décrit **l'amont** du développement : comment une idée exprimée par un entraîneur devient une fonctionnalité spécifiée, prête à être implémentée. La réalisation elle-même est suivie dans le dépôt de code, sous forme de changes OpenSpec.

<figure class="parcours" aria-label="D'une idée au code">
  <div class="parcours-zone">
    <p class="parcours-lieu">Ce dépôt · issues et tableau</p>
    <ol>
      <li><strong>Idée</strong><span>d'un entraîneur, par un avis, une issue ou un e-mail</span></li>
      <li><strong>Besoin formulé</strong><span>avec l'assistant produit</span></li>
      <li><strong>Priorisation</strong><span>par le responsable du développement, dans la feuille de route</span></li>
    </ol>
  </div>
  <div class="parcours-zone code">
    <p class="parcours-lieu">Dépôt de code</p>
    <ol start="4">
      <li><strong>Change OpenSpec</strong><span>la fonctionnalité spécifiée</span></li>
      <li><strong>Code</strong><span>livré dans l'application</span></li>
    </ol>
  </div>
</figure>

## Qui décide quoi

Le règlement intérieur fixe les rôles ([article 10](https://association.placeauxcoachs.fr/association/statuts/reglement-interieur.html)) :

| | Rôle |
|---|---|
| **Bureau de l'association** | Arrête les évolutions de l'application. À chaque réunion ordinaire, au moins deux fois par an, il adopte une **feuille de route** : axes de travail, critères de priorisation, enveloppe de dépense. |
| **Responsable du développement** — membre du bureau ([article 5](https://association.placeauxcoachs.fr/association/statuts/reglement-interieur.html)) | Exerce la délégation du bureau dans le cadre de la feuille de route : il instruit les demandes, les priorise, arbitre et livre. Il décide **comment** construire et dit ce que ça coûte. |
| **Référent métier** — issu du comité départemental de handball | Apporte la **valeur d'usage** : ce dont les entraîneurs ont besoin sur le terrain, et ce qui compte le plus. Il propose la valeur de chaque sujet, de 1 à 5. Il n'a pas à entrer dans la technique. |

Le référent, les clubs et les entraîneurs **éclairent** les choix ; aucun ne les arrête. Aucune structure extérieure, qu'elle soutienne financièrement l'association ou non, n'a de droit de décision, de veto ni de priorité sur ses propres demandes.

**Ce qui remonte au bureau.** Une évolution qui touche à un principe des statuts (gratuité, absence de publicité, maîtrise de ses données, export en format ouvert), qui sort de la feuille de route, qui engage une dépense hors budget ou dont un membre du bureau demande le réexamen. En cas de doute, le responsable saisit le bureau avant d'engager le travail.

**Compte rendu.** À chaque réunion ordinaire, le responsable rend compte au bureau des évolutions livrées et des demandes écartées, avec leur motif. Le bureau en rend compte à l'assemblée générale ordinaire ([article 12](https://association.placeauxcoachs.fr/association/statuts/reglement-interieur.html)).

**Rythme : un point tous les quinze jours** avec le référent métier, où l'on priorise.

## La feuille de route en vigueur

La [feuille de route n° 1](https://association.placeauxcoachs.fr/association/decisions/2026-10-17-feuille-de-route-n1.html), adoptée le 17 octobre 2026, vaut jusqu'à la réunion ordinaire du bureau de mars 2027. Elle part d'un constat : **une inscription sur deux ne débouche sur aucune séance** (relevé du 2 septembre 2026).

Ses trois axes :

1. **Encourager la création de séances** — qu'un entraîneur qui s'inscrit crée et termine sa première séance. C'est l'axe principal.
2. **Mettre en avant le contenu de qualité et structurer la consultation** — qu'un entraîneur trouve vite des séances qui valent la peine d'être reprises.
3. **Chantier technique** — sécurité, performance, passage à l'association, continuité. Ces travaux ne passent pas par les critères : ils se font.

Ses critères de priorisation, dans cet ordre :

1. **La création de séances avant l'enrichissement.**
2. **Le mesuré avant le supposé.**
3. **La valeur rapportée à l'effort**, tels que le tableau les porte.
4. **La portée avant le volume** : une fonction utile à huit entraîneurs passe avant une fonction très utilisée par deux.

Les enrichissements (bibliothèque de séances existantes, fichiers PDF, séances de gardiens de but, beach handball, commentaires en formation) attendent que l'axe 1 ait produit un effet mesurable.

## D'où viennent les idées

- **Le référent métier** — les besoins remontés par les structures du handball aux points réguliers. Étiquette `source:referent`.
- **Les entraîneurs eux-mêmes** — par le lien « Donner mon avis » du site et de l'application, sans compte ; par une issue de ce dépôt, avec un compte GitHub ; ou par e-mail à [support@placeauxcoachs.fr](mailto:support@placeauxcoachs.fr). Un avis ou un e-mail qui propose une évolution est recopié en issue. Étiquette `source:entraineur`.
- **La mesure d'usage** — ce que montrent les chiffres de fréquentation. Étiquette `source:usage`.
- **Le responsable du développement** — ses propres idées et les études de design. Étiquette `source:developpeur`.

Un retour spontané d'entraîneur est plus rare mais plus précieux : il vient de quelqu'un qui utilise l'outil sans avoir de rôle dans le projet. Il est instruit avec le même sérieux qu'une demande du référent.

## Le chemin d'une idée

**1. Une idée, ou une gêne, est déposée** dans une issue « Fonctionnalité », avec le formulaire. Seul le problème est obligatoire : les autres rubriques peuvent rester vides. Le titre nomme le sujet, sans préfixe. L'issue arrive d'elle-même dans la colonne **Idées en vrac**.

**2. Le besoin est clarifié en commentaire.** Le référent métier, ou toute autre personne, complète l'issue par un commentaire, avec le [guide de travail](guide-de-travail.md) et l'[assistant produit](assistant-produit.md) : fonctionnalité proposée, user stories, critères d'acceptation. Le responsable du développement reporte ensuite ce qui est validé dans les rubriques de l'issue, qui reste la référence.

**3. Le référent pose la Valeur** (1 à 5) et le responsable du développement l'**Effort** (S, M, L), dans les champs du tableau, depuis la page de l'issue (bloc « Projects »). Quand le problème est clair et la valeur posée, l'issue passe en **À prioriser**, où les fiches sont triées par valeur.

**4. Au point des quinze jours**, on remplit la colonne **Quinzaine** : ce qu'on s'engage à faire d'ici le point suivant, pris en haut de « À prioriser » selon l'effort. Ce qui n'est pas fini reste en place.

**5. Le développement démarre.** Une fonctionnalité trop grosse est découpée en sous-issues `technique`, chacune correspondant à un change OpenSpec. Colonne **En cours**.

**6. La fonctionnalité est livrée aux bêta-testeurs**, réservée à quelques comptes ; l'issue reste ouverte et indique quoi tester. Colonne **Bêta**. Une correction simple peut sauter cette étape.

**7. Elle est ouverte à tous.** Colonne **Livré** : l'issue se ferme d'elle-même, et inversement une issue fermée passe en « Livré ». Quatorze jours après, elle quitte le tableau ; elle reste consultable dans les archives du projet.

Au point, on commence par « Livré » et « Bêta » : c'est le bilan de la quinzaine.

**Un bug** suit un chemin plus court : il va directement en « À prioriser », ou en « Quinzaine » s'il empêche d'utiliser l'application.

**Les décisions** qui précisent la priorisation dans le cadre de la feuille de route sont des issues épinglées. Elles ne figurent pas au tableau.

**Pas de brouillon dans le tableau.** Le bouton « + » des colonnes crée une fiche qui n'existe que dans le tableau et ne passe par aucun formulaire. Toute idée, tout bug passe par une issue de ce dépôt, créée avec le formulaire correspondant. Un brouillon trouvé dans le tableau est converti en issue et remis au format, ou supprimé.

## Étiquettes

| Axe | Étiquettes |
|---|---|
| Type | `fonctionnalite`, `bug`, `technique` |
| Source | `source:referent`, `source:entraineur`, `source:usage`, `source:developpeur` |
| Thème | `editeur`, `organisation`, `bibliotheque`, `communaute` |
| Priorité | `prise-en-main` |

Une issue porte **un type, une source et un thème**. `prise-en-main` s'ajoute au thème lorsque le sujet aide un nouvel entraîneur à créer son premier entraînement : c'est ce qui le fait examiner en premier.
