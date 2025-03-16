const express = require('express');
const router = express.Router();
const Testimonio = require('../models/Testimonio');

// Obtenir tous les témoignages approuvés
router.get('/', async (req, res) => {
  try {
    const testimonios = await Testimonio.find({ aprobado: true });
    res.json(testimonios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtenir tous les témoignages en attente (pour admin)
router.get('/pendientes', async (req, res) => {
  try {
    const testimonios = await Testimonio.find({ aprobado: false });
    res.json(testimonios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Créer un nouveau témoignage
router.post('/', async (req, res) => {
  const testimonio = new Testimonio({
    nombre: req.body.nombre,
    comentario: req.body.comentario,
    valoracion: req.body.valoracion,
    aprobado: false
  });

  try {
    const nuevoTestimonio = await testimonio.save();
    res.status(201).json(nuevoTestimonio);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Approuver un témoignage
router.patch('/:id/aprobar', async (req, res) => {
  try {
    const testimonio = await Testimonio.findById(req.params.id);
    if (!testimonio) {
      return res.status(404).json({ message: 'Témoignage non trouvé' });
    }
    
    testimonio.aprobado = true;
    const testimonioActualizado = await testimonio.save();
    res.json(testimonioActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Rejeter un témoignage
router.delete('/:id', async (req, res) => {
  try {
    const testimonio = await Testimonio.findById(req.params.id);
    if (!testimonio) {
      return res.status(404).json({ message: 'Témoignage non trouvé' });
    }
    
    await Testimonio.deleteOne({ _id: req.params.id });
    res.json({ message: 'Témoignage supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
