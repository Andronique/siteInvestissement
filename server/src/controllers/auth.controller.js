const prisma = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generatorToken = require('../utils/tokenGenerator');

exports.register = async (req, res) => {
  const { phone, countryCode, password, confirmPassword, referralId } = req.body;

  if (!phone || !countryCode || !password || !confirmPassword) {
    return res.status(400).json({ error: "Tous les champs obligatoires ne sont pas remplis." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Les mots de passe ne correspondent pas." });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { phone } });
    if (existingUser) return res.status(400).json({ error: "Utilisateur déjà inscrit." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        phone,
        countryCode,
        password: hashedPassword,
        referralId: referralId || null
      }
    });

   const token = generatorToken(user);

    res.status(201).json({ token, message: "Utilisateur créé", referralCode: user.referralCode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.login = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) return res.status(400).json({ error: "Utilisateur introuvable." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Mot de passe incorrect." });

    const token = generatorToken(user);

    res.json({ token, userId: user.id, referralCode: user.referralCode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.test = async (req, res) => {
  res.status(200).json({ message: "hello world" });
};

