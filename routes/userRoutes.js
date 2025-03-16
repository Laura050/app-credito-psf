const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Authentification admin
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
    }
    
    res.json({
      _id: user._id,
      username: user.username,
      isAdmin: user.isAdmin
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Créer un utilisateur admin initial (cette route sera désactivée en production)
router.post('/setup', async (req, res) => {
  try {
    const adminExists = await User.findOne({ isAdmin: true });
    if (adminExists) {
      return res.status(400).json({ message: 'Un administrateur existe déjà' });
    }
    
    const admin = new User({
      username: 'admin',
      password: 'admin123',
      isAdmin: true
    });
    
    await admin.save();
    res.status(201).json({ message: 'Administrateur créé avec succès' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
