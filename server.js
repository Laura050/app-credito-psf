const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Routes
const solicitudRoutes = require('./routes/solicitudRoutes');
const testimonioRoutes = require('./routes/testimonioRoutes');
const userRoutes = require('./routes/userRoutes');

// Configuration
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.log('Erreur MongoDB:', err));

// Route de base
app.get('/', (req, res) => {
  res.send('API de l\'application de crédit PSF est en ligne');
});

// Utilisation des routes
app.use('/api/solicitudes', solicitudRoutes);
app.use('/api/testimonios', testimonioRoutes);
app.use('/api/users', userRoutes);

// Port et démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
