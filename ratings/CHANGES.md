# Corrections apportées

## Cohérence persistance / domaine
- `EntityStats` persiste désormais les listes `liked_users` et `disliked_users` sous forme de `List<UUID>`, ce qui correspond à la représentation `UUID[]` côté PostgreSQL. La logique métier convertit ces listes en ensembles pour appliquer les règles métier sans doublon.
- Une migration Flyway (`V2__entity_stats_primary_key_fix.sql`) ajuste la clé primaire de `entity_stats` pour qu'elle corresponde à l'utilisation de `entity_id` dans le code.
- Ajout d'un codec R2DBC dédié (`PostgresCodecConfig`) pour mapper correctement l'enum Java `EntityType` sur le type Postgres `entity_type`.
- Migration V3 : conversion des colonnes `entity_type` en `TEXT` avec contrainte `CHECK` (listant les valeurs de `EntityType`), et suppression du type enum Postgres pour éviter les erreurs de codec R2DBC.
- Migration V4 : ajout des colonnes `like_count` et `dislike_count` manquantes dans `ratings` pour aligner le schéma avec le modèle.
- Modèle `Ratings`: suppression de l'initialisation automatique de l'UUID pour laisser R2DBC insérer plutôt que tenter un update inexistant.
- `rate-application` attend désormais `entityId` (et `entityType`, par défaut `APPLICATION`) dans les paramètres pour peupler `ratings.entity_id`/`entity_type` et éviter les contraintes NOT NULL.
- `EntityStats` implémente `Persistable<UUID>` avec un flag `markNew()` afin de forcer l'insert (sinon R2DBC tentait un update et échouait avec "Row with Id ... does not exist").
- `CommentReply` implémente `Persistable<UUID>` et est marqué `isNew` lors de la création pour forcer l'insert et éviter les erreurs "Row with Id ... does not exist" sur `comment_replies`.
- Les timestamps de `CommentReply` sont en `OffsetDateTime` (lecture/écriture R2DBC) pour éviter les erreurs de conversion `OffsetDateTime -> java.util.Date`.
- Nettoyage du code : injection par constructeur pour `CommentReplyController` et `CommentReplyService`, suppression du code mort dans `RatingService`, initialisation unique des dates de réponse.

## API & configuration
- Suppression des annotations `@CrossOrigin` redondantes : la configuration globale WebFlux gère désormais l’ensemble des règles CORS.
- Le point d’entrée `GET /api/comments/` a été remplacé par `GET /api/comments/by-entity` pour éviter les ambiguïtés de routage tout en conservant la récupération via `?entityId=...`.

## Tests automatisés
- Ajout de tests unitaires WebFlux (avec `reactor-test`) pour `CommentService`, `CommentReplyService` et `RatingService` afin de couvrir les scénarios critiques (création, suppression, logique de like/dislike, upsert des ratings).

## Validation
- Les nouveaux tests s’exécutent via `mvn test` et garantissent que la logique réactive fonctionne comme attendu sans dépendre d’une base de données.
