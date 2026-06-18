require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données établie.');
    await sequelize.sync({ alter: true });
    console.log('Modèles synchronisés.');
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('Impossible de démarrer le serveur:', error);
    process.exit(1);
  }
}

startServer();
