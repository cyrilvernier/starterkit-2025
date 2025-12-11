/**
 * Plugin PostHTML pour remplacer les tokens i18n
 * Utilisation: <t key="page.title" /> → remplacé par la valeur traduire
 */

module.exports = function(translations = {}) {
  return function posthtml(tree) {
    tree.walk((node) => {
      // Chercher les balises <t key="..." />
      if (node.tag === 't' && node.attrs && node.attrs.key) {
        const key = node.attrs.key;
        const value = getNestedValue(translations, key);
        
        // Remplacer la balise par le texte traduit
        return value || `[MISSING: ${key}]`;
      }
      
      // Remplacer aussi les attributs data-i18n dans les autres balises
      if (node.attrs && node.attrs['data-i18n']) {
        const key = node.attrs['data-i18n'];
        const value = getNestedValue(translations, key);
        
        if (value) {
          // Ajouter le contenu traduit
          if (!node.content) {
            node.content = [];
          }
          node.content = [value];
        }
        
        // Supprimer l'attribut data-i18n du rendu final
        delete node.attrs['data-i18n'];
      }
      
      return node;
    });
    
    return tree;
  };
};

/**
 * Récupère une valeur imbriquée dans un objet avec notation pointée
 * @param {object} obj - L'objet source
 * @param {string} path - Le chemin avec notation pointée (ex: "page.title")
 * @returns {*} La valeur trouvée ou undefined
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, prop) => {
    return current && current[prop] !== undefined ? current[prop] : undefined;
  }, obj);
}
