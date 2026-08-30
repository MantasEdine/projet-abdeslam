# Regiis Security — site web

Refonte moderne du site de Regiis Security (sécurité privée, Senlis).
Site statique : **HTML + CSS + JavaScript natif**, aucune dépendance, aucun build à lancer.

## Lancer le site

Ouvrez `site/index.html` dans un navigateur, ou servez le dossier :

```bash
python3 -m http.server 8000 --directory site
# → http://localhost:8000
```

Pour mettre en ligne, envoyez **le contenu du dossier `site/`** à la racine de l'hébergement
(OVH, Netlify, Vercel, GitHub Pages…). Il n'y a rien à compiler.

## Structure

```
site/
├── index.html                 Page d'accueil
├── contact.html               Formulaire de devis
├── mentions-legales.html      Mentions légales + RGPD
├── services/
│   ├── gardiennage.html
│   ├── rondes.html
│   └── alarmes.html
└── assets/
    ├── css/style.css          Design system complet
    ├── js/main.js             Menu, révélations, compteurs, FAQ, formulaire
    └── img/                   Photos (JPG + WebP) et favicon
build.py                       Regénère les pages internes depuis le gabarit commun
```

### Les trois services

| Page | Contenu |
|---|---|
| **Gardiennage** | Agent posté sur site : accueil, filtrage, contrôle d'accès, ouverture/fermeture. 3 formules (jour, nuit, ponctuel). |
| **Rondes** | Passages nocturnes à horaires aléatoires, avec le déroulé d'une nuit type à 2 passages, la levée de doute et le rapport horodaté. 3 formules (2, 4, jusqu'à 6 passages). |
| **Alarmes** | Détection, vidéoprotection, télésurveillance, et le déroulé d'une alerte en 4 étapes. |

## ⚠️ À remplacer avant la mise en ligne

Ces valeurs sont des **espaces réservés** : le site d'origine étant inaccessible depuis
l'environnement de développement, les coordonnées réelles n'ont pas pu être reprises.

| Élément | Valeur actuelle | Où |
|---|---|---|
| Téléphone | `01 00 00 00 00` / `tel:+33000000000` | toutes les pages (en-tête, pied de page, contact, barre mobile) |
| E-mail | `contact@regiis-security.com` | pied de page, contact, mentions légales |
| N° d'autorisation CNAPS | non renseigné | `mentions-legales.html` |
| Hébergeur | mention générique | `mentions-legales.html` |
| SIREN / SIRET / adresse | 948 608 013 / 948 608 013 00017 / 6-8 av. de Creil, Senlis | **à vérifier** (source : registres publics) |
| Témoignages | 3 avis génériques | `index.html`, section « Ils nous font confiance » |
| Chiffres (15 min, 24/7…) | valeurs d'exemple | `index.html`, attributs `data-count` |

Remplacement rapide du téléphone sur tout le site :

```bash
grep -rl '01 00 00 00 00' site/ | xargs sed -i 's/01 00 00 00 00/VOTRE NUMÉRO/g'
grep -rl 'tel:+33000000000' site/ | xargs sed -i 's/tel:+33000000000/tel:+33VOTRENUMERO/g'
```

## Brancher le formulaire de contact

Le formulaire est aujourd'hui **front-end uniquement** : il valide les champs et affiche une
confirmation, mais **n'envoie rien**. Pour le rendre fonctionnel, au choix :

- **Formspree / Basin / Web3Forms** — ajoutez `action="https://…" method="POST"` sur le
  `<form>` de `contact.html` et supprimez le bloc `data-form` de `assets/js/main.js` ;
- **Script PHP** sur votre hébergement — même principe, avec `action="envoi.php"` ;
- **Mailto** (solution de repli) — `action="mailto:contact@regiis-security.com"`.

## Regénérer les pages internes

L'en-tête et le pied de page sont partagés : ils sont lus dans `index.html`, puis réinjectés
dans les autres pages. Après modification de la navigation ou du pied de page dans
`index.html` :

```bash
python3 build.py
```

Cela réécrit `services/*.html`, `contact.html` et `mentions-legales.html`.

## Technique

- **Responsive** : 3 points de rupture (1080 / 900 / 640 px), aucun débordement horizontal.
- **Conversion** : barre d'action fixe sur mobile (Appeler / Devis) à partir de 520 px de défilement — utile pour le trafic publicitaire.
- **Performance** : images en WebP avec repli JPG, `loading="lazy"` hors écran, ~1,7 Mo d'images au total.
- **SEO** : titres et méta-descriptions par page, Open Graph, image de partage, données structurées `SecurityService` (JSON-LD).
- **Accessibilité** : repères ARIA, navigation au clavier, contrastes élevés, `prefers-reduced-motion` respecté.
- **Aucun cookie**, aucun traceur.

## Crédits images

Photographies libres de droit pour usage commercial, issues de gabarits open source
(licences MIT / GPL, images sourcées Pixabay) :

- Agents de sécurité — [themewagon/guarder](https://github.com/themewagon/guarder)
- Vidéoprotection et télésurveillance — [themewagon/securex](https://github.com/themewagon/securex)

Toutes les photos ont été recadrées et étalonnées (traitement nuit / acier) pour donner une
identité visuelle homogène. Pour utiliser vos propres photos, remplacez les fichiers de
`site/assets/img/` en conservant les mêmes noms et proportions.
