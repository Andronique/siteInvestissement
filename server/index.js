require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('./generated/prisma');

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Créer un utilisateur
app.post('/register', async (req, res) => {
  const { phone, countryCode, password, confirmPassword, referralUsed } = req.body;

  if (password !== confirmPassword) return res.status(400).json({ error: "Les mots de passe ne correspondent pas." });

  try {
    const existingUser = await prisma.user.findUnique({ where: { phone } });
    if (existingUser) return res.status(400).json({ error: "Utilisateur déjà inscrit." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        phone,
        countryCode,
        password: hashedPassword,
        referralUsed: referralUsed || null
      }
    });

    res.json({ message: "Utilisateur créé", referralCode: user.referralCode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
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
