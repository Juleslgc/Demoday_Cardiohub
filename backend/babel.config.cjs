// Transforme tout le JavaScript moderne (ESM) pour que Jest puisse l’exécuter sur ma version actuelle de Node.

module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
  ],
};
