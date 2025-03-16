const express = require('express');
const router = express.Router();
const Solicitud = require('../models/Solicitud');

// Obtenir toutes les demandes
router.get('/', async (req, res) => {
  try {
    const solicitudes = await Solicitud.find({});
    res.json(solicitudes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtenir une demande par code d'accès
router.get('/acceso/:codigo', async (req, res) => {
  try {
    const solicitud = await Solicitud.findOne({ codigoAcceso: req.params.codigo });
    if (!solicitud) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }
    res.json(solicitud);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Créer une nouvelle demande
router.post('/', async (req, res) => {
  const solicitud = new Solicitud({
    cliente: req.body.cliente,
    email: req.body.email,
    tipo: req.body.tipo,
    monto: req.body.monto,
    plazo: req.body.plazo,
    tasa: req.body.tasa || 3,
    codigoAcceso: generarCodigo(8),
    contrasena: generarContrasena(req.body.cliente)
  });

  try {
    const nuevaSolicitud = await solicitud.save();
    res.status(201).json(nuevaSolicitud);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mettre à jour l'état d'une demande
router.patch('/:id', async (req, res) => {
  try {
    const solicitud = await Solicitud.findById(req.params.id);
    if (!solicitud) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }
    
    if (req.body.estado) solicitud.estado = req.body.estado;
    
    // Ajouter un message sur le changement d'état
    if (req.body.motivo) {
      solicitud.mensajes.push({
        remitente: 'gestor',
        contenido: `La demande a été ${req.body.estado}. ${req.body.motivo}`
      });
    }
    
    const solicitudActualizada = await solicitud.save();
    res.json(solicitudActualizada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Ajouter un message à une demande
router.post('/:id/mensajes', async (req, res) => {
  try {
    const solicitud = await Solicitud.findById(req.params.id);
    if (!solicitud) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }
    
    solicitud.mensajes.push({
      remitente: req.body.remitente,
      contenido: req.body.contenido
    });
    
    const solicitudActualizada = await solicitud.save();
    res.json(solicitudActualizada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Fonctions utilitaires
function generarCodigo(longitud) {
  const caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let codigo = '';
  for (let i = 0; i < longitud; i++) {
    codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return codigo;
}

function generarContrasena(nombre) {
  const partes = nombre.split(' ');
  if (partes.length >= 2) {
    return partes[0].charAt(0) + partes[1].charAt(0) + Math.floor(1000 + Math.random() * 9000);
  }
  return partes[0].substring(0, 2).toUpperCase() + Math.floor(1000 + Math.random() * 9000);
}

module.exports = router;
