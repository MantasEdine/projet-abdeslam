#!/usr/bin/env python3
"""Génère les pages internes du site à partir d'un gabarit commun (en-tête + pied de page).
Usage : python3 build.py    — puis committer le contenu de site/."""
import os, re, io

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "site")
SRC  = os.path.join(ROOT, "index.html")

TEL_HREF = "+33000000000"
TEL_TEXT = "01 00 00 00 00"
MAIL     = "contact@regiis-security.com"

with io.open(SRC, encoding="utf-8") as f:
    home = f.read()

def slice_between(start, end):
    i = home.index(start); j = home.index(end, i)
    return home[i:j]

HEADER = slice_between("<!-- ============ HEADER ============ -->", "<main>")
FOOTER = slice_between("<!-- ============ FOOTER ============ -->", "<script src=")
STICKY = slice_between('<div class="sticky-bar">', "<script src=")

def rebase(html, prefix):
    """Réécrit les liens relatifs pour une page située dans un sous-dossier."""
    if not prefix:
        return html
    html = html.replace('href="index.html', f'href="{prefix}index.html')
    html = html.replace('href="contact.html', f'href="{prefix}contact.html')
    html = html.replace('href="mentions-legales.html', f'href="{prefix}mentions-legales.html')
    html = html.replace('href="services/', f'href="{prefix}services/')
    html = html.replace('src="assets/', f'src="{prefix}assets/')
    html = html.replace('srcset="assets/', f'srcset="{prefix}assets/')
    return html

def nav_current(html, href):
    html = html.replace(' aria-current="page"', '')
    return html.replace(f'<a href="{href}"', f'<a href="{href}" aria-current="page"', 1)

CHECK = ('<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
         'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
         '<path d="M20 6 9 17l-5-5"/></svg>')
ARROW = ('<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
         'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
         '<path d="M5 12h14M13 6l6 6-6 6"/></svg>')

def page(path, prefix, title, desc, nav_href, body, ld=""):
    hdr = nav_current(rebase(HEADER, prefix), (nav_href if not prefix else prefix + nav_href)
                      if not nav_href.startswith("services/") or prefix
                      else nav_href)
    out = f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#0A0B0D">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{prefix}assets/img/og.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="{prefix}assets/img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{prefix}assets/css/style.css">
{ld}
</head>
<body>

{hdr}
<main>
{body}
</main>

{rebase(FOOTER, prefix)}
{rebase(STICKY, prefix)}
<script src="{prefix}assets/js/main.js" defer></script>
</body>
</html>
"""
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with io.open(full, "w", encoding="utf-8") as f:
        f.write(out)
    print(f"  {path:38s} {len(out)//1024} KB")

def phero(prefix, crumb, eyebrow, h1, lead, img, alt):
    return f"""
<section class="phero">
  <div class="phero__bg">
    <picture><source srcset="{prefix}assets/img/{img}.webp" type="image/webp">
    <img src="{prefix}assets/img/{img}.jpg" alt="{alt}" width="1400" height="900" fetchpriority="high"></picture>
  </div>
  <div class="grain" aria-hidden="true"></div>
  <div class="wrap">
    <nav class="crumbs" aria-label="Fil d'Ariane">
      <a href="{prefix}index.html">Accueil</a> <span aria-hidden="true">/</span> <span>{crumb}</span>
    </nav>
    <span class="eyebrow">{eyebrow}</span>
    <h1 class="h-xl">{h1}</h1>
    <p class="lead">{lead}</p>
    <div class="hero__actions">
      <a class="btn btn--gold" href="{prefix}contact.html">Demander un devis {ARROW}</a>
      <a class="btn btn--ghost" href="tel:{TEL_HREF}">{TEL_TEXT}</a>
    </div>
  </div>
</section>
"""

def cta(prefix, title, text):
    return f"""
<section class="section section--tight">
  <div class="wrap">
    <div class="cta" data-rv="0">
      <picture><source srcset="{prefix}assets/img/cta.webp" type="image/webp">
      <img src="{prefix}assets/img/cta.jpg" alt="" aria-hidden="true" width="1600" height="760" loading="lazy"></picture>
      <span class="pill"><span class="dot"></span> Réponse sous 24 h ouvrées</span>
      <h2 class="h-l" style="margin-top:18px">{title}</h2>
      <p class="lead">{text}</p>
      <div class="cta__actions">
        <a class="btn btn--gold" href="{prefix}contact.html">Demander mon devis {ARROW}</a>
        <a class="btn btn--ghost" href="tel:{TEL_HREF}">Nous appeler</a>
      </div>
    </div>
  </div>
</section>
"""

def li(items):
    return "\n".join(f"      <li>{CHECK} {t}</li>" for t in items)

P = "../"

# ---------------------------------------------------------------- GARDIENNAGE
body = phero(P, "Gardiennage", "Service 01", "Gardiennage",
  "Un agent de sécurité posté sur votre site, aux horaires que vous choisissez. "
  "Il accueille, il filtre, il contrôle les accès — et sa seule présence règle la plupart des problèmes avant qu'ils arrivent.",
  "gardiennage", "Agent de gardiennage Regiis Security en poste")
body += f"""
<section class="section">
  <div class="wrap split">
    <div class="split__media" data-rv="0">
      <picture><source srcset="{P}assets/img/agent-2.webp" type="image/webp">
      <img src="{P}assets/img/agent-2.jpg" alt="Agent de sécurité en tenue devant un site protégé" width="520" height="620" loading="lazy"></picture>
      <div class="split__stat"><b>ADS</b><small>Agents de sécurité qualifiés</small></div>
    </div>
    <div class="prose" data-rv="80">
      <span class="eyebrow">La prestation</span>
      <h2 class="h-l">La dissuasion commence par quelqu'un à l'entrée.</h2>
      <p>Le gardiennage, c'est la réponse quand votre site ne peut pas rester seul : flux de
      visiteurs à filtrer, matériel de valeur, horaires étendus, ou simple besoin d'avoir
      quelqu'un capable de réagir immédiatement.</p>
      <p>Nos agents sont <strong>titulaires d'une carte professionnelle</strong>, formés aux
      procédures de votre site et briefés sur des consignes écrites que nous rédigeons avec vous.
      Sur les sites récurrents, nous affectons les mêmes agents : ils finissent par connaître vos
      équipes, vos livreurs et vos habitudes.</p>
      <h3>Ce que l'agent prend en charge</h3>
      <ul>
{li(["Accueil, orientation et filtrage des visiteurs",
     "Contrôle d'accès des véhicules et des piétons",
     "Ouverture et fermeture du site aux horaires convenus",
     "Surveillance des zones sensibles et rondes internes",
     "Contrôle des issues de secours et des ouvrants",
     "Application des consignes de sécurité et premiers réflexes en cas d'incident",
     "Tenue d'une main courante consultable à tout moment"])}
      </ul>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="sec-head" data-rv="0">
      <span class="eyebrow">Formules</span>
      <h2 class="h-l">Trois façons d'organiser un poste.</h2>
      <p class="lead">Nous partons toujours de vos horaires réels, pas d'un forfait standard.</p>
    </div>
    <div class="grid" style="grid-template-columns:repeat(3,1fr)">
      <div class="card" data-rv="0">
        <span class="card__num">FORMULE A</span>
        <h3 class="h-s">Poste de jour</h3>
        <p>Accueil et filtrage aux heures d'ouverture. Idéal pour les sites tertiaires, les
        entrepôts en activité et les bases-vie de chantier.</p>
      </div>
      <div class="card" data-rv="70">
        <span class="card__num">FORMULE B</span>
        <h3 class="h-s">Poste de nuit</h3>
        <p>Un agent présent de la fermeture à la réouverture, avec rondes internes régulières
        et contrôle systématique des ouvrants.</p>
      </div>
      <div class="card" data-rv="140">
        <span class="card__num">FORMULE C</span>
        <h3 class="h-s">Ponctuel &amp; événementiel</h3>
        <p>Fermeture d'usine, inventaire, salon, chantier de quelques semaines : un effectif
        dimensionné pour la durée exacte de votre besoin.</p>
      </div>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="sec-head" data-rv="0">
      <span class="eyebrow">Questions fréquentes</span>
      <h2 class="h-l">Le gardiennage en pratique.</h2>
    </div>
    <div class="faq" data-rv="0">
      <details open><summary>Vos agents sont-ils habilités ?</summary>
        <p>Oui. Tous nos agents de sécurité sont titulaires d'une carte professionnelle en cours
        de validité, condition légale pour exercer une activité de surveillance humaine en France.
        Ils sont déclarés, assurés et équipés par nos soins.</p></details>
      <details><summary>Peut-on combiner un poste de jour et des rondes de nuit ?</summary>
        <p>C'est même la configuration la plus courante. Un agent en poste pendant l'activité,
        puis des passages de notre rondier une fois le site fermé : vous ne payez une présence
        permanente que sur les heures où elle est vraiment utile.</p></details>
      <details><summary>Quel préavis pour mettre en place un poste ?</summary>
        <p>Comptez en général 48 à 72 h entre la validation du devis et le premier jour de
        prestation, le temps de la visite technique et de la rédaction des consignes. Pour
        une urgence, appelez-nous : nous vous dirons franchement ce qui est tenable.</p></details>
      <details><summary>Que se passe-t-il en cas d'incident sur site ?</summary>
        <p>L'agent applique les consignes écrites : sécurisation, alerte des secours ou des forces
        de l'ordre si nécessaire, et appel immédiat de votre référent. Un rapport d'incident
        détaillé vous est transmis dans la foulée.</p></details>
    </div>
  </div>
</section>
"""
body += cta(P, "Besoin d'un agent sur votre site ?",
  "Décrivez-nous vos horaires et votre configuration : nous vous répondons avec une "
  "proposition chiffrée sous 24 h ouvrées.")
page("services/gardiennage.html", P,
     "Gardiennage — Agents de sécurité sur site | Regiis Security",
     "Gardiennage et agents de sécurité pour vos locaux : accueil, filtrage, contrôle d'accès, "
     "ouverture et fermeture de site. Postes de jour, de nuit et missions ponctuelles dans l'Oise.",
     "services/gardiennage.html", body)

# ---------------------------------------------------------------- RONDES
body = phero(P, "Rondes de surveillance", "Service 02", "Rondes de surveillance",
  "Un agent passe contrôler votre bâtiment plusieurs fois par nuit, à des horaires "
  "volontairement irréguliers. Toute la dissuasion d'une présence humaine, sans le coût d'un poste fixe.",
  "rondes-wide", "Agent rondier en intervention de nuit")
body += f"""
<section class="section">
  <div class="wrap">
    <div class="night" data-rv="0">
      <div class="sec-head" style="margin-bottom:0">
        <span class="eyebrow">Exemple : formule 2 passages</span>
        <h2 class="h-l">Une nuit type sur votre site.</h2>
        <p class="lead">Voici à quoi ressemble concrètement une prestation à deux passages.
        Les heures changent chaque nuit — c'est précisément ce qui rend la ronde efficace :
        personne ne peut apprendre votre rythme.</p>
      </div>
      <div class="night__rail">
        <div class="night__line" aria-hidden="true"></div>
        <ol class="night__steps">
          <li><span class="night__pin">21:30</span><h4>Fermeture</h4>
            <p>Bouclage du site : portails, issues de secours, coupure des accès, activation de l'alarme.</p></li>
          <li><span class="night__pin">01:10</span><h4>1<sup>er</sup> passage</h4>
            <p>Tour extérieur complet, contrôle des ouvrants, du parc véhicules et des zones de stockage.</p></li>
          <li><span class="night__pin">04:25</span><h4>2<sup>e</sup> passage</h4>
            <p>Nouveau tour, itinéraire inversé, avec vérification de tout point noté au passage précédent.</p></li>
          <li><span class="night__pin">06:00</span><h4>Rapport</h4>
            <p>Compte rendu horodaté : heures réelles, anomalies, photos si nécessaire.</p></li>
        </ol>
      </div>
      <div class="night__foot">
        <span class="pill"><span class="dot"></span> Anomalie → levée de doute immédiate</span>
        <span class="pill">Astreinte joignable toute la nuit</span>
      </div>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap split split--rev">
    <div class="split__media" data-rv="0">
      <picture><source srcset="{P}assets/img/rondes.webp" type="image/webp">
      <img src="{P}assets/img/rondes.jpg" alt="Agent rondier équipé d'une radio devant un véhicule d'intervention" width="1400" height="932" loading="lazy"></picture>
      <div class="split__stat"><b data-count="6">0</b><small>Passages par nuit maximum</small></div>
    </div>
    <div class="prose" data-rv="80">
      <span class="eyebrow">Le principe</span>
      <h2 class="h-l">Le bon compromis entre coût et protection.</h2>
      <p>Beaucoup de sites n'ont pas besoin d'un agent présent huit heures d'affilée. Ce qu'il
      leur faut, c'est que <strong>quelqu'un vienne vérifier, plusieurs fois, sans prévenir</strong>.
      C'est exactement ce qu'est une ronde.</p>
      <p>Notre rondier se déplace en véhicule sérigraphié entre plusieurs sites de son secteur.
      Sur le vôtre, il effectue un circuit défini avec vous lors de la visite technique :
      les points à contrôler, l'ordre, et ce qui doit déclencher une alerte.</p>
      <h3>Ce que le rondier contrôle à chaque passage</h3>
      <ul>
{li(["Périmètre extérieur, clôtures et portails",
     "Portes, fenêtres et issues de secours",
     "Parkings, véhicules et engins stationnés",
     "Zones de stockage et matériel de valeur",
     "Éclairages, fuites, dégâts des eaux et départs de feu",
     "Présence de tiers non autorisés sur le site"])}
      </ul>
      <h3>Et si quelque chose cloche ?</h3>
      <p>L'agent effectue la <strong>levée de doute</strong> : il constate, sécurise ce qui peut
      l'être, prévient les forces de l'ordre si la situation l'exige, et vous appelle. Vous n'êtes
      pas réveillé pour une porte de garage mal fermée — mais vous l'êtes immédiatement si ça compte.</p>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="sec-head" data-rv="0">
      <span class="eyebrow">Formules</span>
      <h2 class="h-l">Combien de passages pour votre site ?</h2>
    </div>
    <div class="grid" style="grid-template-columns:repeat(3,1fr)">
      <div class="card" data-rv="0"><span class="card__num">ESSENTIEL</span>
        <h3 class="h-s">2 passages / nuit</h3>
        <p>Un en début de nuit, un avant l'aube. La formule qui couvre la majorité des bureaux,
        commerces et copropriétés.</p></div>
      <div class="card" data-rv="70"><span class="card__num">RENFORCÉ</span>
        <h3 class="h-s">4 passages / nuit</h3>
        <p>Pour les sites exposés : chantiers avec engins, entrepôts, concessions,
        stocks de métaux ou de carburant.</p></div>
      <div class="card" data-rv="140"><span class="card__num">SUR MESURE</span>
        <h3 class="h-s">Jusqu'à 6 passages</h3>
        <p>Grands périmètres, sites multi-bâtiments, périodes à risque comme les congés
        ou les fermetures prolongées.</p></div>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="sec-head" data-rv="0">
      <span class="eyebrow">Questions fréquentes</span>
      <h2 class="h-l">Les rondes en pratique.</h2>
    </div>
    <div class="faq" data-rv="0">
      <details open><summary>Les horaires de passage sont-ils fixes ?</summary>
        <p>Non, et c'est volontaire. Des horaires fixes s'apprennent en quelques nuits d'observation.
        Nous garantissons un nombre de passages et une plage horaire, mais l'heure exacte varie
        d'une nuit à l'autre.</p></details>
      <details><summary>Comment vérifier que l'agent est réellement passé ?</summary>
        <p>Chaque passage est pointé et horodaté sur place. Vous recevez un compte rendu avec les
        heures réelles, les anomalies constatées et des photos si la situation le justifie.</p></details>
      <details><summary>Les rondes fonctionnent-elles aussi le week-end et les jours fériés ?</summary>
        <p>Oui, y compris sur les fermetures longues — congés d'été, période de Noël, arrêt
        technique. Ce sont justement les moments où un site inoccupé devient une cible.</p></details>
      <details><summary>Peut-on coupler les rondes à une alarme ?</summary>
        <p>C'est la combinaison la plus efficace : l'alarme détecte, le rondier vérifie. En cas de
        déclenchement entre deux passages, notre astreinte envoie un agent pour la levée de doute.</p></details>
      <details><summary>Faut-il vous remettre les clés du site ?</summary>
        <p>Pas nécessairement. Beaucoup de rondes se limitent à un contrôle extérieur. Si vous
        souhaitez un contrôle intérieur, les accès sont remis contre décharge et conservés en
        coffre sécurisé.</p></details>
    </div>
  </div>
</section>
"""
body += cta(P, "Deux passages par nuit, ça donne quoi chez vous ?",
  "Dites-nous l'adresse et la configuration du site : nous vous proposons un circuit de ronde "
  "et un tarif ferme sous 24 h ouvrées.")
page("services/rondes.html", P,
     "Rondes de surveillance de nuit — Agent rondier | Regiis Security",
     "Rondes de surveillance : 2 à 6 passages par nuit à horaires aléatoires, contrôle du site, "
     "levée de doute et rapport horodaté. Oise, Hauts-de-France, Île-de-France.",
     "services/rondes.html", body)

# ---------------------------------------------------------------- ALARMES
body = phero(P, "Alarmes & télésurveillance", "Service 03", "Alarmes &amp; télésurveillance",
  "Détection d'intrusion, vidéoprotection et report d'alarme sur notre astreinte. "
  "Le signal part, nous levons le doute — et un agent se déplace si la situation le demande.",
  "alarmes", "Caméra de vidéoprotection reliée à un système d'alarme")
body += f"""
<section class="section">
  <div class="wrap split">
    <div class="split__media" data-rv="0">
      <picture><source srcset="{P}assets/img/camera-pole.webp" type="image/webp">
      <img src="{P}assets/img/camera-pole.jpg" alt="Ensemble de caméras de vidéoprotection sur mât" width="800" height="900" loading="lazy"></picture>
      <div class="split__stat"><b>24/7</b><small>Report d'alarme sur astreinte</small></div>
    </div>
    <div class="prose" data-rv="80">
      <span class="eyebrow">Le principe</span>
      <h2 class="h-l">Une alarme ne sert à rien si personne ne se déplace.</h2>
      <p>Une sirène fait fuir un amateur. Elle n'empêche pas un vol préparé, et elle ne vous dira
      jamais ce qu'il s'est réellement passé sur votre site à 3 h du matin.</p>
      <p>C'est pourquoi nous traitons l'alarme comme un <strong>déclencheur, pas comme une
      protection</strong>. Le système détecte, le signal remonte à notre astreinte, nous levons
      le doute — par la vidéo puis, si nécessaire, par l'envoi physique d'un agent sur place.</p>
      <h3>Ce que nous installons</h3>
      <ul>
{li(["Centrales d'alarme filaires ou radio, avec transmetteur",
     "Détecteurs de mouvement, d'ouverture et de bris de glace",
     "Vidéoprotection intérieure et extérieure, vision nocturne",
     "Détection périmétrique pour les grands sites et les chantiers",
     "Contrôle d'accès par badge ou par code",
     "Détecteurs techniques : fumée, inondation, coupure secteur"])}
      </ul>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="sec-head" data-rv="0">
      <span class="eyebrow">Le déroulé d'une alerte</span>
      <h2 class="h-l">Ce qu'il se passe quand ça sonne.</h2>
    </div>
    <div class="steps">
      <div class="step" data-rv="0"><span class="step__n">ÉTAPE 01</span><h4>Détection</h4>
        <p>Un détecteur se déclenche. Le transmetteur envoie l'alerte à notre astreinte
        en quelques secondes.</p></div>
      <div class="step" data-rv="70"><span class="step__n">ÉTAPE 02</span><h4>Levée de doute</h4>
        <p>Nous vérifions immédiatement les images et l'origine du déclenchement pour écarter
        les fausses alertes.</p></div>
      <div class="step" data-rv="140"><span class="step__n">ÉTAPE 03</span><h4>Intervention</h4>
        <p>Si le doute persiste, un agent est envoyé sur place : il constate, sécurise et alerte
        les forces de l'ordre si nécessaire.</p></div>
      <div class="step" data-rv="210"><span class="step__n">ÉTAPE 04</span><h4>Rapport</h4>
        <p>Vous êtes appelé, puis vous recevez un rapport d'intervention détaillé avec l'heure,
        les constats et les suites données.</p></div>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap split split--rev">
    <div class="split__media" data-rv="0">
      <picture><source srcset="{P}assets/img/telesurveillance.webp" type="image/webp">
      <img src="{P}assets/img/telesurveillance.jpg" alt="Supervision à distance d'un site sécurisé depuis un smartphone" width="1200" height="760" loading="lazy"></picture>
    </div>
    <div class="prose" data-rv="80">
      <span class="eyebrow">Au quotidien</span>
      <h2 class="h-l">Votre site dans votre poche.</h2>
      <p>Les systèmes que nous posons sont pilotables depuis votre smartphone : mise en service
      et hors service à distance, notifications en temps réel, accès aux images et historique
      des événements.</p>
      <p>Nous assurons la <strong>maintenance et la vérification périodique</strong> de
      l'installation. Un détecteur qui ne détecte plus, une caméra désalignée ou une batterie en
      fin de vie, c'est une protection qui n'existe que sur le papier.</p>
      <h3>Alarme, rondes ou les deux ?</h3>
      <p>L'alarme couvre l'instant : elle voit tout, tout le temps, mais ne fait rien d'elle-même.
      La ronde couvre le terrain : elle constate ce qu'aucun capteur ne détecte — une clôture
      forcée, un véhicule qui repère les lieux, une fuite. Sur les sites sensibles,
      c'est la combinaison des deux qui donne les meilleurs résultats.</p>
      <p><a class="link-arrow" href="{P}services/rondes.html">Voir les rondes de surveillance {ARROW}</a></p>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="sec-head" data-rv="0">
      <span class="eyebrow">Questions fréquentes</span>
      <h2 class="h-l">Les alarmes en pratique.</h2>
    </div>
    <div class="faq" data-rv="0">
      <details open><summary>Peut-on conserver une alarme déjà installée ?</summary>
        <p>Dans la plupart des cas oui. Nous réalisons un diagnostic de l'installation existante :
        si la centrale est compatible, nous ajoutons simplement le transmetteur et raccordons le
        report vers notre astreinte, sans tout remplacer.</p></details>
      <details><summary>Que se passe-t-il en cas de fausse alerte ?</summary>
        <p>C'est précisément le rôle de la levée de doute. Nous vérifions avant d'agir, ce qui
        évite les déplacements inutiles et les dérangements à 4 h du matin pour un chat ou une
        porte mal fermée.</p></details>
      <details><summary>Et si internet ou le courant est coupé ?</summary>
        <p>Les centrales que nous posons disposent d'une batterie de secours et d'une transmission
        de repli (GSM). Une coupure prolongée remonte elle-même comme une alerte technique.</p></details>
      <details><summary>La vidéoprotection est-elle légale sur mon site ?</summary>
        <p>Oui, sous conditions : information des personnes filmées, cadrage limité à vos espaces
        privés, durée de conservation encadrée et, pour les lieux ouverts au public, autorisation
        préfectorale. Nous vous accompagnons sur ces démarches.</p></details>
    </div>
  </div>
</section>
"""
body += cta(P, "Faisons le point sur votre installation.",
  "Nouvelle installation ou reprise d'un système existant : nous passons faire un diagnostic "
  "et vous remettons un devis clair.")
page("services/alarmes.html", P,
     "Alarmes &amp; télésurveillance — Intervention 24/7 | Regiis Security",
     "Installation d'alarmes, vidéoprotection et télésurveillance avec levée de doute et "
     "intervention d'un agent 24 h/24. Senlis, Oise, Hauts-de-France, Île-de-France.",
     "services/alarmes.html", body)

# ---------------------------------------------------------------- CONTACT
body = f"""
<section class="phero">
  <div class="phero__bg">
    <picture><source srcset="assets/img/hero.webp" type="image/webp">
    <img src="assets/img/hero.jpg" alt="" aria-hidden="true" width="1600" height="1066"></picture>
  </div>
  <div class="grain" aria-hidden="true"></div>
  <div class="wrap">
    <nav class="crumbs" aria-label="Fil d'Ariane">
      <a href="index.html">Accueil</a> <span aria-hidden="true">/</span> <span>Contact</span>
    </nav>
    <span class="eyebrow">Devis gratuit</span>
    <h1 class="h-xl">Parlons de votre site.</h1>
    <p class="lead">Dix minutes suffisent à savoir s'il vous faut un agent posté, deux rondes par
    nuit ou une alarme reliée à notre astreinte. Réponse sous 24 h ouvrées, sans engagement.</p>
  </div>
</section>

<section class="section">
  <div class="wrap contact">
    <div data-rv="0">
      <span class="eyebrow">Nous joindre</span>
      <h2 class="h-m">Directement, tout de suite.</h2>
      <p class="lead" style="margin-top:14px">Une urgence ou une intervention à organiser dans la
      journée ? Le téléphone reste le plus rapide — notre astreinte répond 24 h/24.</p>

      <div class="info-list">
        <div class="info">
          <div class="icon-box"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg></div>
          <div><b>Téléphone — 24 h/24</b><a href="tel:{TEL_HREF}">{TEL_TEXT}</a></div>
        </div>
        <div class="info">
          <div class="icon-box"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg></div>
          <div><b>E-mail</b><a href="mailto:{MAIL}">{MAIL}</a></div>
        </div>
        <div class="info">
          <div class="icon-box"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
          <div><b>Adresse</b><span>6-8 avenue de Creil<br>60300 Senlis</span></div>
        </div>
        <div class="info">
          <div class="icon-box"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg></div>
          <div><b>Zone d'intervention</b><span>Oise · Hauts-de-France · Île-de-France</span></div>
        </div>
      </div>
    </div>

    <form class="form" data-form novalidate data-rv="80">
      <div class="form__ok" role="status">
        Merci, votre demande est bien enregistrée. Nous vous rappelons sous 24 h ouvrées.
      </div>
      <h2 class="h-s" style="margin-bottom:22px">Demande de devis</h2>

      <div class="field-row">
        <div class="field">
          <label for="nom">Nom et prénom *</label>
          <input id="nom" name="nom" type="text" autocomplete="name" required placeholder="Jean Dupont">
        </div>
        <div class="field">
          <label for="societe">Société</label>
          <input id="societe" name="societe" type="text" autocomplete="organization" placeholder="Nom de l'entreprise">
        </div>
      </div>

      <div class="field-row">
        <div class="field">
          <label for="email">E-mail *</label>
          <input id="email" name="email" type="email" autocomplete="email" required placeholder="jean@exemple.fr">
        </div>
        <div class="field">
          <label for="tel">Téléphone *</label>
          <input id="tel" name="tel" type="tel" autocomplete="tel" required placeholder="06 00 00 00 00">
        </div>
      </div>

      <div class="field">
        <label for="service">Service souhaité *</label>
        <select id="service" name="service" required>
          <option value="">Sélectionnez…</option>
          <option>Gardiennage — agent sur site</option>
          <option>Rondes de surveillance</option>
          <option>Alarme &amp; télésurveillance</option>
          <option>Plusieurs services / je ne sais pas encore</option>
        </select>
      </div>

      <div class="field">
        <label for="ville">Commune du site à protéger *</label>
        <input id="ville" name="ville" type="text" required placeholder="Senlis (60300)">
      </div>

      <div class="field">
        <label for="msg">Votre besoin</label>
        <textarea id="msg" name="msg" placeholder="Type de site, surface, horaires souhaités, nombre de passages par nuit envisagé…"></textarea>
      </div>

      <label class="consent">
        <input type="checkbox" name="consent" required>
        <span>J'accepte que ces informations soient utilisées pour être recontacté au sujet de ma
        demande. Elles ne sont ni revendues, ni transmises à des tiers.</span>
      </label>

      <button class="btn btn--gold btn--block" type="submit">Envoyer ma demande</button>
      <p class="form__note">Réponse sous 24 h ouvrées · Devis gratuit et sans engagement</p>
    </form>
  </div>
</section>
"""
page("contact.html", "",
     "Contact &amp; devis gratuit | Regiis Security — Senlis",
     "Contactez Regiis Security pour un devis gratuit de gardiennage, de rondes de surveillance "
     "ou d'alarme télésurveillée. Réponse sous 24 h ouvrées. Astreinte 24 h/24.",
     "contact.html", body)

# ---------------------------------------------------------------- MENTIONS
body = f"""
<section class="phero">
  <div class="grain" aria-hidden="true"></div>
  <div class="wrap">
    <nav class="crumbs" aria-label="Fil d'Ariane">
      <a href="index.html">Accueil</a> <span aria-hidden="true">/</span> <span>Mentions légales</span>
    </nav>
    <span class="eyebrow">Informations légales</span>
    <h1 class="h-l">Mentions légales &amp; confidentialité</h1>
  </div>
</section>

<section class="section">
  <div class="wrap prose">
    <h2>Éditeur du site</h2>
    <p><strong>Regiis Security</strong><br>
    Société par actions simplifiée à associé unique (SASU)<br>
    Siège social : 6-8 avenue de Creil, 60300 Senlis, France<br>
    SIREN : 948 608 013 — SIRET (siège) : 948 608 013 00017<br>
    Téléphone : <a href="tel:{TEL_HREF}">{TEL_TEXT}</a> — E-mail : <a href="mailto:{MAIL}">{MAIL}</a></p>

    <h2>Activité réglementée</h2>
    <p>Les activités privées de sécurité sont régies par le livre VI du code de la sécurité
    intérieure et placées sous le contrôle du Conseil national des activités privées de sécurité
    (CNAPS). L'entreprise est titulaire d'une autorisation d'exercice et ses agents sont titulaires
    d'une carte professionnelle en cours de validité.</p>
    <p>Conformément à l'article L. 612-14 du code de la sécurité intérieure : l'autorisation
    d'exercice ne confère aucune prérogative de puissance publique à l'entreprise ou aux personnes
    qui en bénéficient.</p>

    <h2>Hébergement</h2>
    <p>Le site est hébergé par l'hébergeur retenu par l'éditeur, dont les coordonnées complètes
    sont disponibles sur simple demande à l'adresse e-mail ci-dessus.</p>

    <h2>Propriété intellectuelle</h2>
    <p>L'ensemble des contenus de ce site — textes, mise en page, identité visuelle et éléments
    graphiques — est protégé par le droit de la propriété intellectuelle. Toute reproduction ou
    représentation, totale ou partielle, sans autorisation écrite préalable est interdite.</p>
    <p>Les photographies utilisées sur ce site sont des images d'illustration libres de droit pour
    un usage commercial.</p>

    <h2 id="confidentialite">Données personnelles</h2>
    <p>Les informations transmises via le formulaire de contact sont utilisées dans le seul but de
    répondre à votre demande et d'établir, le cas échéant, une proposition commerciale. Elles ne
    sont ni revendues, ni cédées à des tiers.</p>
    <ul>
{li(["Données collectées : nom, société, e-mail, téléphone, commune du site et contenu du message.",
     "Base légale : votre consentement, recueilli au moment de l'envoi du formulaire.",
     "Durée de conservation : 3 ans à compter du dernier contact.",
     "Destinataire : le personnel habilité de Regiis Security, à l'exclusion de tout tiers."])}
    </ul>
    <p>Conformément au Règlement général sur la protection des données (RGPD) et à la loi
    Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, d'effacement,
    de limitation, d'opposition et de portabilité de vos données. Pour l'exercer, écrivez à
    <a href="mailto:{MAIL}">{MAIL}</a>. Vous pouvez également introduire une réclamation
    auprès de la CNIL (www.cnil.fr).</p>

    <h2>Cookies</h2>
    <p>Ce site ne dépose aucun cookie de mesure d'audience ni de suivi publicitaire. Seules des
    ressources nécessaires à l'affichage des pages sont chargées.</p>

    <h2>Vidéoprotection</h2>
    <p>Les installations de vidéoprotection réalisées par Regiis Security respectent le cadre légal
    applicable : information des personnes filmées, limitation du champ de vision aux espaces
    privés du client, durée de conservation des images encadrée et, pour les lieux ouverts au
    public, autorisation préfectorale préalable.</p>
  </div>
</section>
"""
page("mentions-legales.html", "",
     "Mentions légales &amp; confidentialité | Regiis Security",
     "Mentions légales, informations sur l'éditeur, protection des données personnelles et "
     "politique de confidentialité du site Regiis Security.",
     "mentions-legales.html", body)

print("\nOK — pages générées.")
