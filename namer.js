import {Namer} from '@parcel/plugin';
import path from 'path';
import {URLSearchParams} from 'url';

// Mappings d'extensions par catégorie
const fileCategories = {
  // Images
  img: ['png', 'jpg', 'jpeg', 'webp', 'avif', 'svg', 'gif', 'ico'],
  
  // Styles
  css: ['css', 'scss', 'sass', 'less'],
  
  // Scripts
  js: ['js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs'],
  
  // Vidéos
  videos: ['mp4', 'webm', 'ogv', 'mov', 'avi', 'mkv', 'flv', 'wmv', 'm4v'],
  
  // Audio
  audio: ['mp3', 'wav', 'oga', 'aac', 'flac', 'm4a', 'wma', 'opus']
};

export default new Namer({
  name({bundle}) {
    // Si le bundle n'a pas d'entrée principale (ce qui arrive pour certains 
    // bundles générés par des transformers), laissez Parcel gérer
    if (!bundle.getMainEntry()) {
      return null;
    }
    
    const type = bundle.type;
    
    // Obtenir le filepath pour extraire l'extension si nécessaire
    let filePath = bundle.getMainEntry().filePath;
    
    // Récupérer les paramètres de requête
    const query = bundle.getMainEntry().query;
    let queryParams = {};
    
    if (query) {
      // Convertir la chaîne de requête en objet
      queryParams = Object.fromEntries(new URLSearchParams(query));
    }
    
    // Construire un suffixe basé sur les paramètres de requête
    let suffix = '';
    if (queryParams.width) {
      suffix += `@${queryParams.width}w`;
    }
    if (queryParams.height) {
      suffix += `@${queryParams.height}h`;
    }
    
    // Gestion spéciale pour les transformations d'image
    if (queryParams.as) {
      // Si le type de sortie est différent du type d'entrée (conversion),
      // utilisez le type demandé pour décider de la catégorie
      const targetType = queryParams.as;
      
      // Trouver la catégorie pour le type cible
      for (const [category, extensions] of Object.entries(fileCategories)) {
        if (extensions.includes(targetType)) {
          const fileName = path.basename(filePath, path.extname(filePath));
          return `${category}/${fileName}${suffix}.${targetType}`;
        }
      }
    }
    
    // Traitement standard par type de fichier
    for (const [category, extensions] of Object.entries(fileCategories)) {
      if (extensions.includes(type)) {
        const fileName = path.basename(filePath, path.extname(filePath));
        const fileExt = path.extname(filePath);
        return `${category}/${fileName}${suffix}${fileExt}`;
      }
    }
    
    // Si aucune catégorie ne correspond, retourne null pour utiliser le nommage par défaut
    return null;
  }
});