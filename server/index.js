require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('./generated/prisma');

const prisma = new PrismaClient();
const app = express();
app.use(cors({
  origin: 'http://192.168.4.110:3000', // ✅ autorise ton frontend local sur réseau
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// ✅ Créer un utilisateur
app.post('/register', async (req, res) => {
  const { phone, countryCode, password, confirmPassword, referralId } = req.body;
  console.log("Données reçues :", req.body);

  if (!phone || !countryCode || !password || !confirmPassword) {
    return res.status(400).json({ error: "Tous les champs obligatoires ne sont pas remplis." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Les mots de passe ne correspondent pas." });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { phone } });
    if (existingUser) {
      return res.status(400).json({ error: "Utilisateur déjà inscrit." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newReferralCode = `USR_${phone.slice(-6)}`; // Génère un code de parrainage

    const user = await prisma.user.create({
      data: {
        phone,
        countryCode,
        password: hashedPassword,
        referralId: referralId || null,
        referralCode: newReferralCode
      }
    });

    res.status(201).json({
      message: "Utilisateur créé",
      userId: user.id,
      referralCode: user.referralCode
    });
  } catch (err) {
    console.error('Erreur serveur:', err);
    res.status(500).json({ error: "Erreur serveur lors de l'inscription." });
  }
});


// ✅ Connexion utilisateur
app.post('/login', async (req, res) => {
  const { phone, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) return res.status(400).json({ error: "Utilisateur introuvable." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Mot de passe incorrect." });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, userId: user.id, referralCode: user.referralCode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ✅ Lancer le serveur
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Serveur en ligne sur http://localhost:${PORT}`));
