require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { sequelize, Account } = require('../models');

const planComptable = [
  // Classe 1 - Comptes de financement permanent
  { code: '1', label: 'Comptes de financement permanent', type: 'passif' },
  { code: '11', label: 'Capitaux propres', type: 'passif' },
  { code: '111', label: 'Capital social ou personnel', type: 'passif' },
  { code: '112', label: 'Primes d\'émission, de fusion, d\'apport', type: 'passif' },
  { code: '113', label: 'Écarts de réévaluation', type: 'passif' },
  { code: '114', label: 'Réserve légale', type: 'passif' },
  { code: '115', label: 'Autres réserves', type: 'passif' },
  { code: '116', label: 'Report à nouveau', type: 'passif' },
  { code: '118', label: 'Résultats nets en instance d\'affectation', type: 'passif' },
  { code: '119', label: 'Résultat net de l\'exercice', type: 'passif' },
  { code: '12', label: 'Capitaux propres assimilés', type: 'passif' },
  { code: '121', label: 'Subventions d\'investissement', type: 'passif' },
  { code: '13', label: 'Dettes de financement', type: 'passif' },
  { code: '131', label: 'Emprunts obligataires', type: 'passif' },
  { code: '138', label: 'Autres dettes de financement', type: 'passif' },
  { code: '14', label: 'Provisions durables pour risques et charges', type: 'passif' },
  { code: '141', label: 'Provisions pour risques', type: 'passif' },
  { code: '142', label: 'Provisions pour charges', type: 'passif' },

  // Classe 2 - Comptes d'actif immobilisé
  { code: '2', label: 'Comptes d\'actif immobilisé', type: 'actif' },
  { code: '21', label: 'Immobilisations en non-valeurs', type: 'actif' },
  { code: '211', label: 'Frais préliminaires', type: 'actif' },
  { code: '212', label: 'Charges à répartir sur plusieurs exercices', type: 'actif' },
  { code: '22', label: 'Immobilisations incorporelles', type: 'actif' },
  { code: '221', label: 'Immobilisations en recherche et développement', type: 'actif' },
  { code: '222', label: 'Brevets, marques, droits et valeurs similaires', type: 'actif' },
  { code: '223', label: 'Fonds commercial', type: 'actif' },
  { code: '23', label: 'Immobilisations corporelles', type: 'actif' },
  { code: '231', label: 'Terrains', type: 'actif' },
  { code: '232', label: 'Constructions', type: 'actif' },
  { code: '233', label: 'Installations techniques, matériel et outillage', type: 'actif' },
  { code: '234', label: 'Matériel de transport', type: 'actif' },
  { code: '235', label: 'Mobilier, matériel de bureau et aménagements', type: 'actif' },
  { code: '236', label: 'Autres immobilisations corporelles', type: 'actif' },
  { code: '24', label: 'Immobilisations financières', type: 'actif' },
  { code: '241', label: 'Prêts immobilisés', type: 'actif' },
  { code: '248', label: 'Autres créances financières', type: 'actif' },

  // Classe 3 - Comptes d'actif circulant (hors trésorerie)
  { code: '3', label: 'Comptes d\'actif circulant', type: 'actif' },
  { code: '31', label: 'Stocks', type: 'actif' },
  { code: '311', label: 'Marchandises', type: 'actif' },
  { code: '312', label: 'Matières et fournitures consommables', type: 'actif' },
  { code: '313', label: 'Produits en cours', type: 'actif' },
  { code: '315', label: 'Produits finis', type: 'actif' },
  { code: '34', label: 'Créances de l\'actif circulant', type: 'actif' },
  { code: '342', label: 'Clients et comptes rattachés', type: 'actif' },
  { code: '3421', label: 'Clients', type: 'actif' },
  { code: '3422', label: 'Clients - effets à recevoir', type: 'actif' },
  { code: '343', label: 'Personnel débiteur', type: 'actif' },
  { code: '345', label: 'État débiteur', type: 'actif' },
  { code: '3451', label: 'Subventions à recevoir', type: 'actif' },
  { code: '3455', label: 'État - TVA récupérable', type: 'actif' },
  { code: '34551', label: 'TVA récupérable sur immobilisations', type: 'actif' },
  { code: '34552', label: 'TVA récupérable sur charges', type: 'actif' },

  // Classe 4 - Comptes de passif circulant (hors trésorerie)
  { code: '4', label: 'Comptes de passif circulant', type: 'passif' },
  { code: '44', label: 'Dettes du passif circulant', type: 'passif' },
  { code: '441', label: 'Fournisseurs et comptes rattachés', type: 'passif' },
  { code: '4411', label: 'Fournisseurs', type: 'passif' },
  { code: '4412', label: 'Fournisseurs - effets à payer', type: 'passif' },
  { code: '443', label: 'Personnel créditeur', type: 'passif' },
  { code: '4431', label: 'Rémunérations dues au personnel', type: 'passif' },
  { code: '444', label: 'Organismes sociaux', type: 'passif' },
  { code: '4441', label: 'CNSS', type: 'passif' },
  { code: '445', label: 'État créditeur', type: 'passif' },
  { code: '4451', label: 'État - TVA facturée', type: 'passif' },
  { code: '44511', label: 'TVA facturée sur ventes', type: 'passif' },
  { code: '4453', label: 'État - impôts sur les résultats', type: 'passif' },
  { code: '4455', label: 'État - taxes sur la valeur ajoutée', type: 'passif' },
  { code: '446', label: 'Comptes des associés - créditeurs', type: 'passif' },

  // Classe 5 - Comptes de trésorerie
  { code: '5', label: 'Comptes de trésorerie', type: 'tresorerie' },
  { code: '51', label: 'Trésorerie - actif', type: 'tresorerie' },
  { code: '511', label: 'Chèques et valeurs à encaisser', type: 'tresorerie' },
  { code: '514', label: 'Banques, trésorerie générale et CCP', type: 'tresorerie' },
  { code: '5141', label: 'Banques', type: 'tresorerie' },
  { code: '516', label: 'Caisses', type: 'tresorerie' },
  { code: '5161', label: 'Caisse principale', type: 'tresorerie' },
  { code: '52', label: 'Trésorerie - passif', type: 'tresorerie' },
  { code: '521', label: 'Crédits d\'escompte', type: 'tresorerie' },
  { code: '523', label: 'Crédits de trésorerie', type: 'tresorerie' },

  // Classe 6 - Comptes de charges
  { code: '6', label: 'Comptes de charges', type: 'charge' },
  { code: '61', label: 'Charges d\'exploitation', type: 'charge' },
  { code: '611', label: 'Achats revendus de marchandises', type: 'charge' },
  { code: '612', label: 'Achats consommés de matières et fournitures', type: 'charge' },
  { code: '613', label: 'Autres charges externes', type: 'charge' },
  { code: '6131', label: 'Locations et charges locatives', type: 'charge' },
  { code: '6132', label: 'Redevances de crédit-bail', type: 'charge' },
  { code: '6133', label: 'Entretien et réparations', type: 'charge' },
  { code: '6134', label: 'Primes d\'assurances', type: 'charge' },
  { code: '6135', label: 'Rémunérations du personnel extérieur', type: 'charge' },
  { code: '6136', label: 'Rémunérations d\'intermédiaires et honoraires', type: 'charge' },
  { code: '6141', label: 'Études et recherches', type: 'charge' },
  { code: '6142', label: 'Transports', type: 'charge' },
  { code: '6143', label: 'Déplacements, missions et réceptions', type: 'charge' },
  { code: '6144', label: 'Publicité, publications et relations publiques', type: 'charge' },
  { code: '6145', label: 'Frais postaux et frais de télécommunications', type: 'charge' },
  { code: '614', label: 'Impôts et taxes', type: 'charge' },
  { code: '616', label: 'Charges de personnel', type: 'charge' },
  { code: '6161', label: 'Rémunérations du personnel', type: 'charge' },
  { code: '6162', label: 'Charges sociales', type: 'charge' },
  { code: '617', label: 'Dotations d\'exploitation', type: 'charge' },
  { code: '63', label: 'Charges financières', type: 'charge' },
  { code: '631', label: 'Charges d\'intérêts', type: 'charge' },
  { code: '65', label: 'Charges non courantes', type: 'charge' },

  // Classe 7 - Comptes de produits
  { code: '7', label: 'Comptes de produits', type: 'produit' },
  { code: '71', label: 'Produits d\'exploitation', type: 'produit' },
  { code: '711', label: 'Ventes de marchandises', type: 'produit' },
  { code: '712', label: 'Ventes de biens et services produits', type: 'produit' },
  { code: '7121', label: 'Ventes de biens produits', type: 'produit' },
  { code: '7122', label: 'Ventes de travaux', type: 'produit' },
  { code: '7123', label: 'Ventes de services', type: 'produit' },
  { code: '713', label: 'Variation de stocks de produits', type: 'produit' },
  { code: '714', label: 'Immobilisations produites par l\'entreprise', type: 'produit' },
  { code: '716', label: 'Subventions d\'exploitation', type: 'produit' },
  { code: '717', label: 'Autres produits d\'exploitation', type: 'produit' },
  { code: '73', label: 'Produits financiers', type: 'produit' },
  { code: '731', label: 'Produits des titres de participation', type: 'produit' },
  { code: '738', label: 'Intérêts et autres produits financiers', type: 'produit' },
  { code: '75', label: 'Produits non courants', type: 'produit' },
  { code: '751', label: 'Produits de cessions d\'immobilisations', type: 'produit' },
  { code: '756', label: 'Subventions d\'équilibre', type: 'produit' },
  { code: '758', label: 'Autres produits non courants', type: 'produit' }
];

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('Début du seeding du plan comptable CGNC...');
    for (const account of planComptable) {
      await Account.findOrCreate({ where: { code: account.code }, defaults: account });
    }
    console.log(`Plan comptable seedé: ${planComptable.length} comptes créés/vérifiés.`);
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors du seeding:', error);
    process.exit(1);
  }
}

seed();
