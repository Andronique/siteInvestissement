const prisma = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/tokenGenerator');

exports.register = async (req, res) => {
  const { phone, countryCode, password, confirmPassword, referred_by } = req.body;

  if (!phone || !countryCode || !password || !confirmPassword) {
    return res.status(400).json({ error: 'Tous les champs obligatoires ne sont pas remplis.' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Les mots de passe ne correspondent pas.' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { phone } });
    if (existingUser) {
      return res.status(400).json({ error: 'Utilisateur déjà inscrit.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        phone,
        countryCode,                 // <-- ajoute ce champ dans le modèle si nécessaire
        password_hash: hashedPassword,
        withdraw_password: '',       // TODO: demander ou générer
        referred_by: referred_by || null,
      },
    });

    const token = generateToken(user); // <-- corrige le nom du helper

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.status(201).json({
      token,
      message: 'Utilisateur créé',
      referral_code: user.referral_code,
      id: user.id,
      username: user.username, // peut être null
      balance: user.balance,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};


exports.login = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ error: "Téléphone et mot de passe sont requis." });
  }

  try {
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      return res.status(400).json({ error: "Utilisateur introuvable." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Mot de passe incorrect." });
    }

    const token = generateToken(user); // Remplace si ton helper a un autre nom

    // Définir le cookie JWT (comme dans register)
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
      path: '/',
    });

    res.status(200).json({
      token,
      message: "Connexion réussie",
      userId: user.id,
      username: user.username,
      referral_code: user.referral_code,
      balance: user.balance,
      points: user.points,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }


};

exports.logout = async (req, res) => {
  try {
    console.log("➡️ Logout appelé");
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    res.status(200).json({ message: "Déconnexion réussie." });
  } catch (err) {
    console.error("Erreur lors de la déconnexion :", err);
    res.status(500).json({ error: "Erreur serveur lors de la déconnexion." });
  }
};


