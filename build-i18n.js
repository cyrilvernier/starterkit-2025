/**
 * Script de build personnalisé pour générer plusieurs versions localisées
 * Utilise Parcel pour builder chaque version avec ses traductions
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const posthtml = require('posthtml');

const LANGUAGES = ['fr-FR', 'en-US'];
const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');
const BUILD_DIR = path.join(__dirname, 'build-temp');
const I18N_DIR = path.join(SRC_DIR, 'i18n');

// Charger le plugin i18n
const i18nPlugin = require('./posthtmlI18n.js');

async function processHtmlWithI18n(htmlPath, lang) {
  const translations = loadTranslations(lang);
  const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
  
  try {
    const result = await posthtml([i18nPlugin(translations)])
      .process(htmlContent);
    
    fs.writeFileSync(htmlPath, result.html);
  } catch (error) {
    console.error(`Error processing HTML for ${lang}:`, error);
  }
}

function loadTranslations(lang) {
  const filePath = path.join(I18N_DIR, `${lang}.json`);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  Translation file not found: ${filePath}`);
    return {};
  }
  
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    console.error(`Error loading translations for ${lang}:`, error);
    return {};
  }
}

async function buildForLanguage(lang) {
  console.log(`\n🌍 Building for ${lang}...`);
  
  try {
    // Créer un dossier temporaire pour le build
    const tempDir = path.join(BUILD_DIR, lang);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // Copier les fichiers source (sauf i18n)
    execSync(`cp -r "${SRC_DIR}"/* "${tempDir}"/ 2>/dev/null || true`);
    
    // Supprimer le dossier i18n du build temporaire
    const i18nTempDir = path.join(tempDir, 'i18n');
    if (fs.existsSync(i18nTempDir)) {
      execSync(`rm -rf "${i18nTempDir}"`);
    }
    
    // Traiter le HTML avec PostHTML i18n
    const htmlFile = path.join(tempDir, 'index.html');
    await processHtmlWithI18n(htmlFile, lang);
    
    // Ajouter l'attribut lang à la balise html
    let htmlContent = fs.readFileSync(htmlFile, 'utf-8');
    htmlContent = htmlContent.replace(
      '<html>',
      `<html lang="${lang}">`
    );
    fs.writeFileSync(htmlFile, htmlContent);
    
    // Builder avec Parcel
    const outputDir = path.join(DIST_DIR, lang);
    console.log(`📦 Bundling with Parcel...`);
    execSync(
      `parcel build "${htmlFile}" --dist-dir "${outputDir}" --public-url '.' --no-cache`,
      { stdio: 'inherit' }
    );
    
    console.log(`✅ Build completed for ${lang}`);
  } catch (error) {
    console.error(`❌ Build failed for ${lang}:`, error.message);
    process.exit(1);
  }
}

async function main() {
  console.log('🚀 Starting multilingual build process...');
  
  // Nettoyer les anciens builds
  if (fs.existsSync(DIST_DIR)) {
    execSync(`rm -rf "${DIST_DIR}"`);
  }
  if (fs.existsSync(BUILD_DIR)) {
    execSync(`rm -rf "${BUILD_DIR}"`);
  }
  
  fs.mkdirSync(BUILD_DIR, { recursive: true });
  fs.mkdirSync(DIST_DIR, { recursive: true });
  
  // Copier les fichiers statiques
  const staticDir = path.join(__dirname, 'static');
  if (fs.existsSync(staticDir)) {
    console.log(`📋 Copying static files...`);
    execSync(`cp -r "${staticDir}"/* "${DIST_DIR}"/`);
  }
  
  // Builder pour chaque langue
  for (const lang of LANGUAGES) {
    await buildForLanguage(lang);
  }
  
  // Nettoyer le dossier temporaire
  execSync(`rm -rf "${BUILD_DIR}"`);
  
  console.log('\n✨ Build complete! Versions available:');
  console.log(`   - ${LANGUAGES.map(l => l).join('\n   - ')}`);
  console.log('\n📂 Structure de sortie:');
  console.log(`   dist/`);
  console.log(`   ├── index.html (depuis /static/)`);
  console.log(`   ├── fr-FR/`);
  console.log(`   └── en-US/`);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
