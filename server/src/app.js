const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth.routes');

const app = express();
app.use(cors({
  origin: 'http://192.168.4.110:3000', // ✅ autorise ton frontend local sur réseau
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);

// Middleware pour gérer les erreurs
app.use((err, req, res, next) => {  
  console.error(err.stack);
  res.status(500).json({ error: 'Une erreur est survenue.' });
});
// Middleware pour gérer les routes non trouvées
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée.' });
});
// Démarrer le serveur
if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}