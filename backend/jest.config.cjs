/* Cela indique à Jest :
- d’utiliser babel-jest pour transformer les fichiers .js,
- de chercher les tests dans ton dossier tests/,
- d’afficher un rapport détaillé.
*/

module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  roots: ['<rootDir>/tests'],
  verbose: true,
};
