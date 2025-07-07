const { PrismaClient } = require('../../generated/prisma'); // selon ton chemin réel

const prisma = new PrismaClient();

// Assurez-vous de gérer les erreurs de connexion à la base de données
prisma.$connect()
  .then(() => {
    console.log('Connected to the database successfully');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  })
  .finally(() => {
    // Optionnel : fermer la connexion à la base de données lorsque le processus se termine
    process.on('SIGINT', async () => {
      await prisma.$disconnect();
      console.log('Database connection closed');
      process.exit(0);
    });
  });

  module.exports = prisma;