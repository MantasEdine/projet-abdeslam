# Regiis Security — site + back-office

Site vitrine et espace d'administration pour une société de sécurité privée.
**Next.js 15** (App Router), **PostgreSQL** via **Prisma**, **TypeScript**.

- **Site public** — accueil, une page par service, blog, contact, mentions légales.
- **Back-office `/admin`** — tableau de bord d'audience, demandes de devis, services,
  articles, administrateurs et coordonnées.
- **Mesure d'audience intégrée** — first-party, sans cookie ni traceur tiers, avec suivi
  des campagnes publicitaires (UTM et Google Ads).

---

## Démarrage rapide

```bash
npm install
cp .env.example .env        # puis renseignez DATABASE_URL et AUTH_SECRET
npm run db:push             # crée les tables
npm run db:seed             # contenu initial + premier compte admin
npm run dev                 # http://localhost:3000
```

Connexion au back-office : `http://localhost:3000/admin`
avec les identifiants `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` du fichier `.env`.
**Changez ce mot de passe dès la première connexion** (Administrateurs → votre compte).

### Variables d'environnement

| Variable | Obligatoire | Rôle |
|---|---|---|
| `DATABASE_URL` | oui | Connexion PostgreSQL |
| `AUTH_SECRET` | oui | Signature des sessions admin — `openssl rand -base64 32` |
| `NEXT_PUBLIC_SITE_URL` | recommandé | Adresse publique (liens, sitemap, Open Graph) |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | au 1ᵉʳ lancement | Premier compte administrateur |
| `RESEND_API_KEY`, `LEAD_NOTIFY_TO`, `LEAD_NOTIFY_FROM` | non | Notification e-mail des demandes de devis |

---

## Mise en ligne sur Vercel

1. **Créez une base PostgreSQL.** Le plus simple : dans le projet Vercel, onglet
   *Storage → Create Database → Postgres* (ou un compte gratuit sur [Neon](https://neon.tech)).
   Copiez l'URL de connexion.
2. **Renseignez les variables** dans *Settings → Environment Variables* :
   `DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`.
3. **Déployez.** Next.js est détecté automatiquement — aucun réglage de
   *Root Directory* ni d'*Output Directory* n'est nécessaire.
4. **Initialisez la base**, une seule fois, depuis votre machine :

   ```bash
   DATABASE_URL="<url-de-production>" npx prisma db push
   DATABASE_URL="<url-de-production>" SEED_ADMIN_EMAIL="vous@domaine.fr" \
     SEED_ADMIN_PASSWORD="UnMotDePasseSolide" npx tsx prisma/seed.ts
   ```

Le `postinstall` lance `prisma generate` : le client Prisma est donc toujours à jour au
moment du build.

---

## Le back-office

| Écran | Ce qu'il permet |
|---|---|
| **Tableau de bord** | Visiteurs, pages vues, demandes, taux de conversion, courbe de trafic, origines, pages populaires, appareils, **performance par campagne publicitaire**. Filtres 7 j / 30 j / 90 j / 12 mois. |
| **Demandes de devis** | Chaque formulaire reçu, avec origine (campagne ou référent), statut (Nouveau → Contacté → Devis envoyé → Gagné/Perdu), notes de suivi et suppression. |
| **Services** | Création, modification, suppression, ordre d'affichage, publication. Tout est éditable : textes, images, prestations, formules, FAQ, SEO. |
| **Articles** | Blog complet — brouillon/publication, étiquettes, image de couverture, SEO, compteur de lectures. |
| **Médias** | Inventaire des images disponibles et leur chemin à copier. |
| **Administrateurs** | Ajout, modification, suppression. Deux rôles : **Propriétaire** (accès complet) et **Éditeur** (contenu uniquement). |
| **Coordonnées** | Téléphone, numéro WhatsApp et e-mail — appliqués partout sur le site. |

### Rôles

- **Propriétaire** — tout, y compris les administrateurs et les coordonnées.
- **Éditeur** — services, articles, médias et demandes de devis.

Garde-fous : on ne peut ni supprimer son propre compte, ni retirer ses propres droits,
ni supprimer le dernier propriétaire.

---

## Mesure d'audience et campagnes publicitaires

Chaque page vue est enregistrée dans votre base (`/api/track`) : page, origine, appareil,
pays, visiteur et session anonymes. **Aucun cookie, aucun traceur tiers, aucune donnée
envoyée à une régie** — la page « Mentions légales » le documente.

### Suivre vos annonces

Balisez les URL de vos annonces :

```
https://regiis-security.com/?utm_source=google&utm_medium=cpc&utm_campaign=rondes-oise
```

Le tableau **Performance des campagnes** affiche alors, par campagne, les visiteurs, les
demandes de devis reçues et le taux de conversion. Un clic Google Ads portant un `gclid`
est reconnu automatiquement, même sans paramètres UTM.

L'origine de la campagne est également enregistrée sur chaque demande de devis : vous
savez quelle annonce a produit quel client.

### Couleurs des graphiques

La palette du tableau de bord est validée pour le daltonisme et le contraste sur fond
sombre : ambre `#c98500`, bleu `#3987e5`, aqua `#199e70`, orange `#d95926`. L'or de la
marque (`#E9B44C`) reste réservé à l'interface — trop clair pour servir de couleur de
série. Chaque valeur est toujours affichée en toutes lettres à côté de sa barre :
l'information ne repose jamais sur la seule couleur.

---

## Demandes de devis par e-mail

Sans configuration, les demandes sont enregistrées et consultables dans `/admin/devis`.

Pour recevoir un e-mail à chaque demande, créez un compte sur
[Resend](https://resend.com), vérifiez votre domaine, puis renseignez `RESEND_API_KEY`,
`LEAD_NOTIFY_TO` et `LEAD_NOTIFY_FROM`. L'e-mail contient toutes les informations du
formulaire, permet de répondre directement au client et propose un lien vers le
back-office.

---

## Contenu et médias

### Ajouter une image

Déposez le fichier dans `public/assets/img/`, puis référencez-le par son chemin
(`/assets/img/mon-image.jpg`) dans un service ou un article. Il apparaît aussitôt dans
l'écran **Médias**.

Pour un envoi depuis le navigateur, activez [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
(`npm i @vercel/blob`) et branchez-le sur l'écran Médias.

### Formules et FAQ des services

Ces deux champs se saisissent en JSON dans le formulaire d'un service :

```json
[{ "label": "ESSENTIEL", "title": "2 passages / nuit", "text": "Description…" }]
[{ "q": "Une question ?", "a": "La réponse." }]
```

Le formulaire refuse un JSON mal formé et indique l'erreur, sans rien écraser.

---

## Statistiques de démonstration

Pour visualiser le tableau de bord avant d'avoir du trafic réel :

```bash
npx tsx --env-file=.env prisma/demo-analytics.ts           # génère 90 jours de données
npx tsx --env-file=.env prisma/demo-analytics.ts --reset   # efface tout
```

**À n'utiliser qu'en local** — le script remplace le contenu des tables `Pageview` et `Lead`.

---

## Structure

```
app/
  (site)/            Site public — accueil, services, articles, contact, mentions légales
  admin/             Back-office (protégé par middleware.ts)
    actions.ts       Server Actions : connexion, CRUD, réglages
  api/track          Enregistrement des pages vues
  api/leads          Réception du formulaire de devis
components/          Composants partagés (site + admin)
lib/
  auth.ts            Sessions JWT (cookie httpOnly), bcrypt
  analytics.ts       Agrégations du tableau de bord
  db.ts, mail.ts, settings.ts, site.ts
prisma/
  schema.prisma      Modèles
  seed.ts            Contenu initial
  demo-analytics.ts  Données de démonstration (local uniquement)
public/assets/img/   Photographies (JPG + WebP)
```

---

## Technique

- **Sécurité** — sessions JWT signées en cookie `httpOnly`/`SameSite=Lax`, mots de passe
  hachés en bcrypt (coût 12), `/admin` filtré par middleware, validation Zod sur toutes
  les entrées, pot de miel anti-spam sur le formulaire, `/admin` et `/api` exclus de
  `robots.txt` et désindexés.
- **SEO** — métadonnées par page, Open Graph, `sitemap.xml` et `robots.txt` générés,
  données structurées JSON-LD (`SecurityService` et `Article`).
- **Accessibilité** — repères ARIA, navigation clavier, contrastes élevés,
  `prefers-reduced-motion` respecté.
- **Conversion** — barre d'action fixe sur mobile (Appeler / Devis) et bulle WhatsApp,
  pensées pour le trafic publicitaire.

### Coordonnées

Téléphone et WhatsApp : **+33 6 52 92 03 87**. Modifiables sans toucher au code depuis
**Administration → Coordonnées** ; les valeurs de repli se trouvent dans `lib/site.ts`.

Restent à vérifier avant mise en ligne : le **numéro d'autorisation CNAPS** et
l'**hébergeur** dans les mentions légales, ainsi que le SIREN/SIRET (repris des registres
publics).

---

## Crédits images

Photographies libres de droit pour usage commercial, issues de gabarits open source
(licences MIT / GPL, images sourcées Pixabay), recadrées et étalonnées pour une identité
visuelle homogène :

- Agents de sécurité — [themewagon/guarder](https://github.com/themewagon/guarder)
- Vidéoprotection — [themewagon/securex](https://github.com/themewagon/securex)

---

## Limites connues

Trois points à connaître, sans gravité en usage normal mais qu'il vaut mieux avoir en tête :

- **Le HTML des services et des articles est inséré tel quel.** C'est ce qui permet de
  mettre en forme librement, mais un compte « Éditeur » peut donc injecter du script dans
  une page publique. N'ouvrez le back-office qu'à des personnes de confiance. Pour
  verrouiller, ajoutez un assainissement côté serveur (`isomorphic-dompurify`) dans
  `app/admin/actions.ts`, avant l'enregistrement.
- **Pas de limitation de débit sur les formulaires.** Le pot de miel arrête les robots
  courants, mais un envoi massif ciblé reste possible. Si le besoin s'en fait sentir,
  activez Vercel WAF ou ajoutez un plafond par IP sur `/api/leads`.
- **Les statistiques sont déclaratives.** L'identifiant de visiteur vient du navigateur :
  fiable pour mesurer des tendances et comparer des campagnes, mais falsifiable par un
  robot. Pour un chiffre contractuel avec une régie, croisez toujours avec les données de
  la plateforme publicitaire.
