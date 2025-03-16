const mongoose = require('mongoose');

const testimonioSchema = mongoose.Schema({
  nombre: { type: String, required: true },
  comentario: { type: String, required: true },
  valoracion: { type: Number, required: true },
  fecha: { type: String, default: new Date().getFullYear().toString() },
  aprobado: { type: Boolean, default: false }
});

module.exports = mongoose.model('Testimonio', testimonioSchema);
