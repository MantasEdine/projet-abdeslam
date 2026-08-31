/**
 * Remplit la base avec le contenu actuel du site et quelques articles.
 * Lancer avec : npm run db:seed
 * Idempotent : peut être relancé sans créer de doublons.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const SERVICES = [
  {
    slug: "gardiennage",
    title: "Gardiennage",
    navLabel: "Gardiennage",
    tagline: "01 — Présence",
    excerpt:
      "Un agent posté sur votre site, en journée comme la nuit. Il filtre, il contrôle, il dissuade — et il est là quand il se passe quelque chose.",
    heroImage: "/assets/img/gardiennage.jpg",
    cardImage: "/assets/img/svc-gardiennage.jpg",
    intro:
      "Un agent de sécurité posté sur votre site, aux horaires que vous choisissez. Il accueille, il filtre, il contrôle les accès — et sa seule présence règle la plupart des problèmes avant qu'ils arrivent.",
    bodyTitle: "La dissuasion commence par quelqu'un à l'entrée.",
    bodyHtml: `<p>Le gardiennage, c'est la réponse quand votre site ne peut pas rester seul : flux de visiteurs à filtrer, matériel de valeur, horaires étendus, ou simple besoin d'avoir quelqu'un capable de réagir immédiatement.</p>
<p>Nos agents sont <strong>titulaires d'une carte professionnelle</strong>, formés aux procédures de votre site et briefés sur des consignes écrites que nous rédigeons avec vous. Sur les sites récurrents, nous affectons les mêmes agents : ils finissent par connaître vos équipes, vos livreurs et vos habitudes.</p>`,
    features: [
      "Accueil, orientation et filtrage des visiteurs",
      "Contrôle d'accès des véhicules et des piétons",
      "Ouverture et fermeture du site aux horaires convenus",
      "Surveillance des zones sensibles et rondes internes",
      "Contrôle des issues de secours et des ouvrants",
      "Application des consignes de sécurité et premiers réflexes en cas d'incident",
      "Tenue d'une main courante consultable à tout moment",
    ],
    formulas: [
      { label: "FORMULE A", title: "Poste de jour", text: "Accueil et filtrage aux heures d'ouverture. Idéal pour les sites tertiaires, les entrepôts en activité et les bases-vie de chantier." },
      { label: "FORMULE B", title: "Poste de nuit", text: "Un agent présent de la fermeture à la réouverture, avec rondes internes régulières et contrôle systématique des ouvrants." },
      { label: "FORMULE C", title: "Ponctuel & événementiel", text: "Fermeture d'usine, inventaire, salon, chantier de quelques semaines : un effectif dimensionné pour la durée exacte de votre besoin." },
    ],
    faqs: [
      { q: "Vos agents sont-ils habilités ?", a: "Oui. Tous nos agents de sécurité sont titulaires d'une carte professionnelle en cours de validité, condition légale pour exercer une activité de surveillance humaine en France. Ils sont déclarés, assurés et équipés par nos soins." },
      { q: "Peut-on combiner un poste de jour et des rondes de nuit ?", a: "C'est même la configuration la plus courante. Un agent en poste pendant l'activité, puis des passages de notre rondier une fois le site fermé : vous ne payez une présence permanente que sur les heures où elle est vraiment utile." },
      { q: "Quel préavis pour mettre en place un poste ?", a: "Comptez en général 48 à 72 h entre la validation du devis et le premier jour de prestation, le temps de la visite technique et de la rédaction des consignes. Pour une urgence, appelez-nous : nous vous dirons franchement ce qui est tenable." },
      { q: "Que se passe-t-il en cas d'incident sur site ?", a: "L'agent applique les consignes écrites : sécurisation, alerte des secours ou des forces de l'ordre si nécessaire, et appel immédiat de votre référent. Un rapport d'incident détaillé vous est transmis dans la foulée." },
    ],
    ctaTitle: "Besoin d'un agent sur votre site ?",
    ctaText: "Décrivez-nous vos horaires et votre configuration : nous vous répondons avec une proposition chiffrée sous 24 h ouvrées.",
    metaTitle: "Gardiennage — Agents de sécurité sur site | Regiis Security",
    metaDesc: "Gardiennage et agents de sécurité pour vos locaux : accueil, filtrage, contrôle d'accès, ouverture et fermeture de site. Postes de jour, de nuit et missions ponctuelles dans l'Oise.",
    position: 1,
  },
  {
    slug: "rondes",
    title: "Rondes de surveillance",
    navLabel: "Rondes",
    tagline: "02 — Passages",
    excerpt:
      "Pas d'agent à demeure, mais un passage régulier : notre rondier vient contrôler votre bâtiment plusieurs fois par nuit, à horaires volontairement irréguliers.",
    heroImage: "/assets/img/rondes-wide.jpg",
    cardImage: "/assets/img/svc-rondes.jpg",
    intro:
      "Un agent passe contrôler votre bâtiment plusieurs fois par nuit, à des horaires volontairement irréguliers. Toute la dissuasion d'une présence humaine, sans le coût d'un poste fixe.",
    bodyTitle: "Le bon compromis entre coût et protection.",
    bodyHtml: `<p>Beaucoup de sites n'ont pas besoin d'un agent présent huit heures d'affilée. Ce qu'il leur faut, c'est que <strong>quelqu'un vienne vérifier, plusieurs fois, sans prévenir</strong>. C'est exactement ce qu'est une ronde.</p>
<p>Notre rondier se déplace en véhicule sérigraphié entre plusieurs sites de son secteur. Sur le vôtre, il effectue un circuit défini avec vous lors de la visite technique : les points à contrôler, l'ordre, et ce qui doit déclencher une alerte.</p>
<h3>Et si quelque chose cloche ?</h3>
<p>L'agent effectue la <strong>levée de doute</strong> : il constate, sécurise ce qui peut l'être, prévient les forces de l'ordre si la situation l'exige, et vous appelle. Vous n'êtes pas réveillé pour une porte de garage mal fermée — mais vous l'êtes immédiatement si ça compte.</p>`,
    features: [
      "Périmètre extérieur, clôtures et portails",
      "Portes, fenêtres et issues de secours",
      "Parkings, véhicules et engins stationnés",
      "Zones de stockage et matériel de valeur",
      "Éclairages, fuites, dégâts des eaux et départs de feu",
      "Présence de tiers non autorisés sur le site",
    ],
    formulas: [
      { label: "ESSENTIEL", title: "2 passages / nuit", text: "Un en début de nuit, un avant l'aube. La formule qui couvre la majorité des bureaux, commerces et copropriétés." },
      { label: "RENFORCÉ", title: "4 passages / nuit", text: "Pour les sites exposés : chantiers avec engins, entrepôts, concessions, stocks de métaux ou de carburant." },
      { label: "SUR MESURE", title: "Jusqu'à 6 passages", text: "Grands périmètres, sites multi-bâtiments, périodes à risque comme les congés ou les fermetures prolongées." },
    ],
    faqs: [
      { q: "Les horaires de passage sont-ils fixes ?", a: "Non, et c'est volontaire. Des horaires fixes s'apprennent en quelques nuits d'observation. Nous garantissons un nombre de passages et une plage horaire, mais l'heure exacte varie d'une nuit à l'autre." },
      { q: "Comment vérifier que l'agent est réellement passé ?", a: "Chaque passage est pointé et horodaté sur place. Vous recevez un compte rendu avec les heures réelles, les anomalies constatées et des photos si la situation le justifie." },
      { q: "Les rondes fonctionnent-elles aussi le week-end et les jours fériés ?", a: "Oui, y compris sur les fermetures longues — congés d'été, période de Noël, arrêt technique. Ce sont justement les moments où un site inoccupé devient une cible." },
      { q: "Peut-on coupler les rondes à une alarme ?", a: "C'est la combinaison la plus efficace : l'alarme détecte, le rondier vérifie. En cas de déclenchement entre deux passages, notre astreinte envoie un agent pour la levée de doute." },
      { q: "Faut-il vous remettre les clés du site ?", a: "Pas nécessairement. Beaucoup de rondes se limitent à un contrôle extérieur. Si vous souhaitez un contrôle intérieur, les accès sont remis contre décharge et conservés en coffre sécurisé." },
    ],
    ctaTitle: "Deux passages par nuit, ça donne quoi chez vous ?",
    ctaText: "Dites-nous l'adresse et la configuration du site : nous vous proposons un circuit de ronde et un tarif ferme sous 24 h ouvrées.",
    metaTitle: "Rondes de surveillance de nuit — Agent rondier | Regiis Security",
    metaDesc: "Rondes de surveillance : 2 à 6 passages par nuit à horaires aléatoires, contrôle du site, levée de doute et rapport horodaté. Oise, Hauts-de-France, Île-de-France.",
    position: 2,
  },
  {
    slug: "alarmes",
    title: "Alarmes & télésurveillance",
    navLabel: "Alarmes",
    tagline: "03 — Détection",
    excerpt:
      "Détection d'intrusion, vidéoprotection et report d'alarme sur notre astreinte. Le signal part, on lève le doute, et un agent se déplace si nécessaire.",
    heroImage: "/assets/img/alarmes.jpg",
    cardImage: "/assets/img/svc-alarmes.jpg",
    intro:
      "Détection d'intrusion, vidéoprotection et report d'alarme sur notre astreinte. Le signal part, nous levons le doute — et un agent se déplace si la situation le demande.",
    bodyTitle: "Une alarme ne sert à rien si personne ne se déplace.",
    bodyHtml: `<p>Une sirène fait fuir un amateur. Elle n'empêche pas un vol préparé, et elle ne vous dira jamais ce qu'il s'est réellement passé sur votre site à 3 h du matin.</p>
<p>C'est pourquoi nous traitons l'alarme comme un <strong>déclencheur, pas comme une protection</strong>. Le système détecte, le signal remonte à notre astreinte, nous levons le doute — par la vidéo puis, si nécessaire, par l'envoi physique d'un agent sur place.</p>`,
    features: [
      "Centrales d'alarme filaires ou radio, avec transmetteur",
      "Détecteurs de mouvement, d'ouverture et de bris de glace",
      "Vidéoprotection intérieure et extérieure, vision nocturne",
      "Détection périmétrique pour les grands sites et les chantiers",
      "Contrôle d'accès par badge ou par code",
      "Détecteurs techniques : fumée, inondation, coupure secteur",
    ],
    formulas: [
      { label: "DÉTECTION", title: "Alarme intrusion", text: "Centrale, détecteurs et transmetteur. La base : votre site signale lui-même toute intrusion, jour et nuit." },
      { label: "VIDÉO", title: "Vidéoprotection", text: "Caméras intérieures et extérieures avec vision nocturne, pour lever le doute sur images avant tout déplacement." },
      { label: "COMPLET", title: "Télésurveillance 24/7", text: "Report d'alarme sur notre astreinte, levée de doute et intervention physique d'un agent sur déclenchement." },
    ],
    faqs: [
      { q: "Peut-on conserver une alarme déjà installée ?", a: "Dans la plupart des cas oui. Nous réalisons un diagnostic de l'installation existante : si la centrale est compatible, nous ajoutons simplement le transmetteur et raccordons le report vers notre astreinte, sans tout remplacer." },
      { q: "Que se passe-t-il en cas de fausse alerte ?", a: "C'est précisément le rôle de la levée de doute. Nous vérifions avant d'agir, ce qui évite les déplacements inutiles et les dérangements à 4 h du matin pour un chat ou une porte mal fermée." },
      { q: "Et si internet ou le courant est coupé ?", a: "Les centrales que nous posons disposent d'une batterie de secours et d'une transmission de repli (GSM). Une coupure prolongée remonte elle-même comme une alerte technique." },
      { q: "La vidéoprotection est-elle légale sur mon site ?", a: "Oui, sous conditions : information des personnes filmées, cadrage limité à vos espaces privés, durée de conservation encadrée et, pour les lieux ouverts au public, autorisation préfectorale. Nous vous accompagnons sur ces démarches." },
    ],
    ctaTitle: "Faisons le point sur votre installation.",
    ctaText: "Nouvelle installation ou reprise d'un système existant : nous passons faire un diagnostic et vous remettons un devis clair.",
    metaTitle: "Alarmes & télésurveillance — Intervention 24/7 | Regiis Security",
    metaDesc: "Installation d'alarmes, vidéoprotection et télésurveillance avec levée de doute et intervention d'un agent 24 h/24. Senlis, Oise, Hauts-de-France, Île-de-France.",
    position: 3,
  },
];

const ARTICLES = [
  {
    slug: "rondes-horaires-aleatoires-pourquoi",
    title: "Pourquoi une ronde à heure fixe ne sert presque à rien",
    excerpt:
      "Deux passages par nuit à 23 h et 4 h, tous les jours de l'année : c'est confortable à organiser, et c'est exactement ce qu'attend quelqu'un qui repère votre site.",
    coverImage: "/assets/img/rondes.jpg",
    tags: ["Rondes", "Prévention", "Méthode"],
    readMinutes: 5,
    contentHtml: `<p>Un site qui subit des vols répétés est presque toujours un site observé. Avant de passer à l'acte, on vient voir : quand la dernière voiture part, à quelle heure les lumières s'éteignent, si quelqu'un passe dans la nuit — et surtout <strong>quand</strong>.</p>
<h2>Trois nuits suffisent</h2>
<p>Une ronde à heure fixe s'apprend vite. Trois nuits d'observation depuis un véhicule garé plus loin, et le créneau est connu. Il ne reste plus qu'à travailler dans l'intervalle, qui est confortable : entre un passage à 23 h et un passage à 4 h, il y a cinq heures pendant lesquelles personne ne viendra.</p>
<p>Pire : la ronde régulière devient une information utile pour celui qui la subit. Elle lui dit précisément de combien de temps il dispose.</p>
<h2>Ce que change l'aléatoire</h2>
<p>Décalez ces mêmes deux passages de façon imprévisible — 0 h 40 une nuit, 2 h 15 la suivante, 1 h 05 celle d'après — et le calcul s'inverse. L'intervalle n'est plus mesurable. Le risque d'être surpris devient permanent, et c'est ce risque, bien plus que la présence elle-même, qui fait renoncer.</p>
<blockquote><p>Le nombre de passages achète de la couverture. L'imprévisibilité, elle, achète de la dissuasion. Les deux ne se remplacent pas.</p></blockquote>
<h2>Comment nous organisons les circuits</h2>
<ul>
<li><strong>Plage garantie, heure libre.</strong> Le contrat fixe un nombre de passages et une amplitude horaire — pas des heures précises.</li>
<li><strong>Itinéraire inversé.</strong> Le second passage ne suit jamais le même ordre que le premier : les points contrôlés en dernier deviennent les premiers.</li>
<li><strong>Rotation des véhicules et des agents</strong> sur les sites les plus exposés, pour ne pas rendre l'arrivée reconnaissable de loin.</li>
<li><strong>Pointage horodaté</strong> à chaque point de contrôle : l'aléatoire côté extérieur, la traçabilité complète côté client.</li>
</ul>
<h2>Et la traçabilité, alors ?</h2>
<p>C'est la question qui vient toujours : si les horaires changent, comment vérifier que l'agent est bien venu ? Par le pointage. Chaque passage est enregistré sur place, avec l'heure réelle, et vous recevez le récapitulatif. Vous ne connaissez pas l'heure à l'avance — vous la connaissez après, ce qui est la seule chose qui compte.</p>`,
  },
  {
    slug: "cnaps-carte-professionnelle-verifier-prestataire",
    title: "CNAPS, carte professionnelle : comment vérifier que votre prestataire est en règle",
    excerpt:
      "La sécurité privée est une activité réglementée en France. Trois vérifications simples vous évitent de confier vos clés à une entreprise qui n'a pas le droit d'exercer.",
    coverImage: "/assets/img/agent-2.jpg",
    tags: ["Réglementation", "CNAPS", "Conseils"],
    readMinutes: 6,
    contentHtml: `<p>Beaucoup de donneurs d'ordre l'ignorent : en France, la surveillance humaine, le gardiennage et la télésurveillance ne sont pas des prestations de service ordinaires. Elles relèvent du <strong>livre VI du code de la sécurité intérieure</strong> et sont contrôlées par le CNAPS, le Conseil national des activités privées de sécurité.</p>
<h2>Deux autorisations, pas une</h2>
<p>Il faut distinguer deux choses que l'on confond souvent :</p>
<ul>
<li><strong>L'autorisation d'exercice</strong>, délivrée à l'entreprise. Sans elle, la société n'a pas le droit de proposer de prestation de sécurité, quelle que soit sa forme juridique.</li>
<li><strong>La carte professionnelle</strong>, délivrée à chaque agent, après enquête de moralité et vérification de l'aptitude professionnelle. Elle est nominative et a une durée de validité limitée.</li>
</ul>
<p>Une entreprise autorisée qui emploie un agent sans carte est en infraction. Un agent titulaire d'une carte qui travaille pour une société non autorisée l'est également.</p>
<h2>Les trois vérifications à faire</h2>
<ol>
<li><strong>Demandez le numéro d'autorisation d'exercice</strong> et faites-le figurer au contrat. Une entreprise en règle le communique sans hésiter.</li>
<li><strong>Vérifiez l'attestation d'assurance responsabilité civile professionnelle</strong>, à jour et couvrant l'activité de surveillance.</li>
<li><strong>Demandez à voir les cartes professionnelles</strong> des agents affectés à votre site. C'est votre droit, et c'est une demande normale.</li>
</ol>
<h2>La mention légale obligatoire</h2>
<p>L'article L. 612-14 du code de la sécurité intérieure impose une mention explicite sur les documents contractuels et publicitaires : l'autorisation d'exercice <em>« ne confère aucune prérogative de puissance publique à l'entreprise ou aux personnes qui en bénéficient »</em>. Autrement dit, un agent de sécurité privée n'est ni policier, ni gendarme, et ne dispose d'aucun pouvoir de contrainte au-delà de ce que la loi accorde à tout citoyen.</p>
<h2>Ce que vous risquez avec un prestataire non autorisé</h2>
<p>Au-delà des sanctions qui frappent l'entreprise, c'est votre couverture qui s'effondre. En cas de sinistre — vol, dégradation, accident impliquant l'agent — l'assurance peut refuser sa garantie au motif que la prestation était irrégulière. Le tarif attractif d'un prestataire non déclaré se paie toujours au moment du sinistre.</p>
<p>Un devis un peu plus cher émanant d'une société autorisée, assurée et dont les agents sont cartés n'est pas une dépense : c'est la condition pour que votre protection existe juridiquement.</p>`,
  },
  {
    slug: "vols-sur-chantier-btp-comment-repondre",
    title: "Vols sur chantier : pourquoi le BTP est une cible, et ce qui marche vraiment",
    excerpt:
      "Cuivre, carburant, outillage, engins : un chantier réunit tout ce qui se revend vite. Le point sur les mesures qui réduisent réellement le risque.",
    coverImage: "/assets/img/hero.jpg",
    tags: ["BTP", "Chantiers", "Prévention"],
    readMinutes: 6,
    contentHtml: `<p>Un chantier est, du point de vue de celui qui vient voler, une situation presque idéale : du matériel de valeur, peu ou pas de clôture solide, aucune présence la nuit, un accès véhicule large, et une rotation permanente d'intervenants qui rend toute silhouette peu suspecte en journée.</p>
<h2>Ce qui part en premier</h2>
<ul>
<li><strong>Le cuivre et les métaux</strong> — câbles, gaines, cuves : revendus au poids, difficiles à tracer.</li>
<li><strong>Le carburant</strong> — siphonné directement dans les réservoirs des engins, souvent en fin de semaine.</li>
<li><strong>L'outillage électroportatif</strong> — léger, cher, revendu en quelques heures.</li>
<li><strong>Les engins compacts</strong> — mini-pelles et nacelles, chargés sur plateau en quelques minutes.</li>
</ul>
<p>Le coût réel dépasse largement la valeur du bien volé. C'est l'arrêt du chantier qui coûte : équipes immobilisées, délais contractuels, pénalités de retard, franchise d'assurance et hausse de la prime l'année suivante.</p>
<h2>Les périodes à risque</h2>
<p>Trois moments concentrent l'essentiel des sinistres : le <strong>week-end</strong>, en particulier du samedi soir au dimanche matin ; les <strong>ponts et jours fériés</strong> ; et les <strong>congés</strong>, quand un chantier reste fermé une à trois semaines. Un site désert et annoncé comme tel — la grue à l'arrêt se voit de loin — devient une cible facile.</p>
<h2>Ce qui fonctionne, par ordre d'efficacité</h2>
<ol>
<li><strong>Ne rien laisser de facilement revendable sur place.</strong> Évident, rarement appliqué. Outillage remisé, cuves vidées avant une fermeture longue, câble non déroulé à l'avance.</li>
<li><strong>Fermer réellement le périmètre.</strong> Une clôture de chantier bien tenue, un portail verrouillé, et surtout aucun accès véhicule laissé libre : sans véhicule, on ne repart pas avec un groupe électrogène.</li>
<li><strong>Éclairer.</strong> Un chantier éclairé impose de travailler à la vue de tous.</li>
<li><strong>Faire passer quelqu'un, à heures imprévisibles.</strong> C'est la mesure qui change le plus le calcul du risque, parce qu'elle rend la durée d'intervention impossible à estimer.</li>
<li><strong>Détecter et lever le doute.</strong> Détection périmétrique ou vidéo reliée à une astreinte capable d'envoyer un agent : la détection seule ne fait que constater.</li>
</ol>
<h2>Le bon dosage</h2>
<p>Un gardien posté toute la nuit sur un chantier de trois semaines est rarement justifié économiquement. Deux à quatre passages nocturnes, couplés à une détection sur les zones de stockage, couvrent l'essentiel du risque pour une fraction du coût. Sur les chantiers longs avec engins lourds, le poste fixe redevient pertinent — surtout pendant les phases de gros œuvre où le matériel présent atteint sa valeur maximale.</p>`,
  },
  {
    slug: "alarme-videoprotection-telesurveillance-differences",
    title: "Alarme, vidéoprotection, télésurveillance : qui fait quoi exactement ?",
    excerpt:
      "Trois mots souvent employés l'un pour l'autre, qui désignent trois choses différentes. Comprendre la différence évite d'acheter une protection qui n'en est pas une.",
    coverImage: "/assets/img/camera-pole.jpg",
    tags: ["Alarmes", "Vidéoprotection", "Comprendre"],
    readMinutes: 5,
    contentHtml: `<p>« J'ai une alarme, je suis protégé. » C'est la phrase qui revient le plus souvent, et c'est un raccourci coûteux. Une alarme détecte. Elle ne protège pas — la différence tient à ce qui se passe <em>après</em> le déclenchement.</p>
<h2>L'alarme : détecter et signaler</h2>
<p>Une centrale, des détecteurs, une sirène. Le système repère une intrusion et fait du bruit. Contre un passage opportuniste, c'est souvent suffisant. Contre quelqu'un qui sait que personne ne viendra vérifier, beaucoup moins : dans une zone d'activité déserte, une sirène qui hurle à 3 h du matin n'alerte personne.</p>
<h2>La vidéoprotection : voir et prouver</h2>
<p>Les caméras apportent deux choses. D'abord la <strong>levée de doute</strong> : savoir en quelques secondes si le déclenchement vient d'une intrusion réelle ou d'une bâche qui claque au vent. Ensuite la <strong>preuve</strong>, utile pour le dépôt de plainte et l'indemnisation.</p>
<p>En revanche, une caméra non surveillée ne fait rien d'autre qu'enregistrer un vol que vous découvrirez le lendemain matin.</p>
<h2>La télésurveillance : la chaîne complète</h2>
<p>C'est le maillon qui relie les deux précédents à une action. Le signal remonte à une astreinte humaine, joignable 24 h/24, qui vérifie l'origine du déclenchement, consulte les images, vous appelle et — c'est le point décisif — <strong>envoie physiquement un agent sur place</strong> si le doute persiste.</p>
<blockquote><p>Une alarme sans levée de doute est un réveil. Une levée de doute sans intervention est un constat. Seule la chaîne complète change l'issue.</p></blockquote>
<h2>Comment choisir</h2>
<ul>
<li><strong>Local isolé, faible valeur</strong> : alarme seule, éventuellement avec notification sur smartphone.</li>
<li><strong>Commerce, bureaux, zone fréquentée</strong> : alarme + vidéo pour la levée de doute et la preuve.</li>
<li><strong>Entrepôt, chantier, site isolé de valeur</strong> : chaîne complète, avec intervention. C'est le seul montage qui garantit que quelqu'un se déplace.</li>
</ul>
<p>Un dernier point souvent négligé : une installation ne vaut que si elle est <strong>maintenue</strong>. Un détecteur en fin de vie, une caméra désalignée par le vent ou une batterie de secours morte transforment une protection en décor.</p>`,
  },
  {
    slug: "videoprotection-rgpd-ce-que-vous-avez-le-droit-de-filmer",
    title: "Vidéoprotection et RGPD : ce que vous avez le droit de filmer",
    excerpt:
      "Installer des caméras dans son entreprise est légal. Filmer n'importe quoi, n'importe où, ne l'est pas. Les règles essentielles, sans jargon.",
    coverImage: "/assets/img/telesurveillance.jpg",
    tags: ["Réglementation", "RGPD", "Vidéoprotection"],
    readMinutes: 6,
    contentHtml: `<p>La vidéoprotection est encadrée par deux corps de règles qui se superposent : le RGPD et la loi Informatique et Libertés d'un côté, le code de la sécurité intérieure de l'autre. Le régime applicable dépend d'une seule question : <strong>filmez-vous un lieu ouvert au public, ou un lieu privé ?</strong></p>
<h2>Lieux non ouverts au public</h2>
<p>Réserves, entrepôts, bureaux, zones techniques : pas d'autorisation préfectorale, mais le RGPD s'applique pleinement. Vous devez pouvoir justifier d'un intérêt légitime — la protection contre le vol en est un — et respecter le principe de proportionnalité.</p>
<h2>Lieux ouverts au public</h2>
<p>Surface de vente, hall d'accueil, parking accessible à la clientèle : ces installations relèvent du code de la sécurité intérieure et nécessitent une <strong>autorisation préfectorale préalable</strong>, accordée pour une durée déterminée et renouvelable.</p>
<h2>Ce que vous ne pouvez pas filmer</h2>
<ul>
<li><strong>Les postes de travail en continu.</strong> Placer une caméra braquée en permanence sur un salarié constitue une surveillance disproportionnée.</li>
<li><strong>Les espaces de pause, vestiaires et sanitaires.</strong> Interdit sans exception.</li>
<li><strong>Les locaux syndicaux</strong> et leurs accès.</li>
<li><strong>La voie publique.</strong> Le champ des caméras doit se limiter à vos abords immédiats. Filmer le trottoir ou la rue est réservé aux autorités publiques.</li>
</ul>
<h2>Vos obligations</h2>
<ol>
<li><strong>Informer.</strong> Panneaux visibles à chaque accès, mentionnant l'existence du dispositif, le responsable et les modalités d'exercice des droits.</li>
<li><strong>Consulter le CSE</strong> et informer individuellement les salariés avant la mise en service.</li>
<li><strong>Limiter la conservation.</strong> Un mois est la durée de référence ; au-delà, il faut un motif précis. Les images utiles à une procédure sont extraites et conservées séparément.</li>
<li><strong>Restreindre l'accès aux images</strong> à des personnes nommément habilitées, et tracer les consultations.</li>
<li><strong>Tenir un registre des traitements</strong> et, pour les dispositifs à grande échelle, réaliser une analyse d'impact.</li>
</ol>
<h2>Pourquoi c'est votre intérêt</h2>
<p>Ces règles ne sont pas qu'une contrainte administrative. Une installation irrégulière produit des images <strong>inexploitables</strong> : un enregistrement obtenu sans information préalable des personnes peut être écarté devant le conseil de prud'hommes, et une procédure disciplinaire fondée dessus se retourne contre l'employeur. La conformité, c'est ce qui rend vos images utilisables le jour où vous en avez besoin.</p>`,
  },
];

async function main() {
  // --- Compte administrateur ---
  const email = (process.env.SEED_ADMIN_EMAIL || "admin@regiis-security.com").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || "RegiisAdmin2026!";
  const admin = await db.admin.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Administrateur",
      passwordHash: await bcrypt.hash(password, 12),
      role: "OWNER",
    },
  });
  console.log(`✔ Admin : ${email}`);

  // --- Réglages ---
  const settings = {
    phone: "+33652920387",
    phoneDisplay: "06 52 92 03 87",
    whatsapp: "33652920387",
    email: "contact@regiis-security.com",
  };
  for (const [key, value] of Object.entries(settings)) {
    await db.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }
  console.log(`✔ Réglages : ${Object.keys(settings).length}`);

  // --- Services ---
  for (const s of SERVICES) {
    await db.service.upsert({
      where: { slug: s.slug },
      update: { navLabel: s.navLabel },
      create: s as never,
    });
  }
  console.log(`✔ Services : ${SERVICES.length}`);

  // --- Articles ---
  let i = 0;
  for (const a of ARTICLES) {
    i++;
    await db.article.upsert({
      where: { slug: a.slug },
      update: {},
      create: {
        ...a,
        published: true,
        publishedAt: new Date(Date.now() - i * 6 * 24 * 3600 * 1000),
        authorId: admin.id,
        metaTitle: `${a.title} | Regiis Security`,
        metaDesc: a.excerpt,
      },
    });
  }
  console.log(`✔ Articles : ${ARTICLES.length}`);
}

main()
  .then(() => db.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
