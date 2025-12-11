# Sandbox i18n - Site Multilingue avec PostHTML

Un starter kit pour créer des sites statiques multilingues (FR-FR et EN-US) avec **PostHTML**, **Parcel** et un système de tokens i18n.

## 🎯 Fonctionnalités

- ✅ **Deux versions linguistiques** automatiquement générées (fr-FR et en-US)
- ✅ **Dossiers distincts** dans le build (dist/fr-FR et dist/en-US)
- ✅ **Tokens i18n** simples avec notation pointée (`page.title`, `home.headline`)
- ✅ **Détection automatique** de langue du navigateur
- ✅ **Sélecteur de langue** à la racine
- ✅ **BCP 47 compliant** (norme web standard)

## 📂 Structure du projet

```
sandbox-i18n/
├── src/
│   ├── index.html              # Fichier HTML avec tokens
│   ├── i18n/
│   │   ├── fr-FR.json          # Traductions français
│   │   └── en-US.json          # Traductions anglais
│   ├── css/
│   │   └── main.css
│   └── js/
│       └── main.js
├── static/
│   └── index.html              # Page de sélection de langue (copié à la racine)
├── posthtmlI18n.js             # Plugin PostHTML pour i18n
├── build-i18n.js               # Script de build personnalisé
├── .parcelrc                    # Config Parcel
├── package.json
└── README.md
```

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Pour ajouter posthtml
npm install --save-dev posthtml
```

## 💻 Commandes

```bash
# Mode développement (serveur avec rechargement auto)
npm run dev

# Build production multilingue (génère dist/fr-FR et dist/en-US)
npm run build

# Build single (uniquement pour tester)
npm run build:single

# Nettoyer le cache
npm run clean-cache

# Nettoyer les fichiers générés
npm run clean-output
```

## 🔧 Comment utiliser les tokens

### Syntaxe dans HTML

Les tokens se remplacent avec deux syntaxes :

**1. Balises `<t>` (recommandé)**
```html
<h1><t key="home.headline" /></h1>
<p><t key="home.subtitle" /></p>
<button><t key="home.cta" /></button>
```

**2. Attributs `data-i18n`**
```html
<title data-i18n="page.title"></title>
<a href="#" data-i18n="nav.home"></a>
```

### Fichiers de traduction

Éditer `src/i18n/fr-FR.json` et `src/i18n/en-US.json` :

```json
{
  "page": {
    "title": "Mon Site"
  },
  "home": {
    "headline": "Bonjour",
    "subtitle": "Bienvenue",
    "cta": "Commencer"
  },
  "nav": {
    "home": "Accueil",
    "about": "À propos"
  }
}
```

La structure JSON utilise **notation pointée** pour accéder aux valeurs imbriquées :
- `page.title` → `obj.page.title`
- `nav.home` → `obj.nav.home`

## 📦 Output du build

Après `npm run build`, la structure sera:

```
dist/
├── index.html                  # Depuis /static/ (sélection de langue)
├── fr-FR/
│   ├── index.html             # Version française compilée
│   ├── css/main.css
│   └── js/main.js
└── en-US/
    ├── index.html             # Version anglaise compilée
    ├── css/main.css
    └── js/main.js
```

**Note :** Les fichiers dans `/static/` sont copiés **tels quels** à la racine du build. C'est utile pour les assets qui ne nécessitent pas de traduction (page d'accueil de sélection, favicon, robots.txt, etc.).

## 🌐 Déploiement

Le site s'organise par langue :
- `https://example.com/fr-FR/` → Version française
- `https://example.com/en-US/` → Version anglaise
- `https://example.com/` → Sélection avec redirection auto

## 🔄 Comment ajouter une nouvelle langue

1. Créer `src/i18n/de-DE.json` avec les traductions allemandes
2. Ajouter `'de-DE'` au tableau `LANGUAGES` dans `build-i18n.js`
3. Faire un `npm run build`

```javascript
// Dans build-i18n.js
const LANGUAGES = ['fr-FR', 'en-US', 'de-DE'];
```

## 🛠️ Personnalisation

### Plugin PostHTML

Éditer `posthtmlI18n.js` pour modifier le comportement :

```javascript
// Actuellement, il traite:
// - Balises <t key="..." />  → remplacées par la traduction
// - Attributs data-i18n      → contenu remplacé, attribut supprimé
```

### Build custom

Éditer `build-i18n.js` pour changer:
- Commandes Parcel
- Dossiers de destination
- Chemins publics
- Ordre de traitement

## ⚠️ Points importants

- Les tokens manquants affichent `[MISSING: key.path]`
- Les traductions sont **compilées** dans le HTML (aucun JS côté client)
- Chaque langue produit un **site statique indépendant**
- Le fichier i18n n'est **pas inclus** dans le build final
- Le `.parcelrc` ne charge pas les transformeurs PostHTML par défaut (voir `build-i18n.js`)

## 🐛 Dépannage

**Problème: Les tokens ne sont pas remplacés**
- Vérifier que la clé existe dans le JSON (respecter la casse)
- Vérifier la syntaxe: `<t key="page.title" />` (self-closing)

**Problème: CSS/JS ne se charge pas**
- Vérifier le `--public-url` dans `build-i18n.js`
- Vérifier que le serveur serve le bon dossier (`dist/fr-FR/` ou `dist/en-US/`)

**Problème: `npm run build` échoue**
- Supprimer `node_modules` et `.parcel-cache`
- Relancer `npm install`
- Vérifier que `posthtml` est installé

## 📚 Resources

- [PostHTML docs](https://github.com/posthtml/posthtml)
- [Parcel docs](https://parceljs.org/)
- [BCP 47 Language Tags](https://en.wikipedia.org/wiki/IETF_language_tag)
- [ISO 639 Language Codes](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes)

## 📄 Licence

MIT
