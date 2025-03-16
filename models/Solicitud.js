const mongoose = require('mongoose');

const solicitudSchema = mongoose.Schema({
  cliente: { type: String, required: true },
  email: { type: String, required: true },
  tipo: { type: String, required: true },
  monto: { type: Number, required: true },
  plazo: { type: Number, required: true },
  tasa: { type: Number, default: 3 },
  estado: { type: String, default: 'pendiente' },
  fecha: { type: Date, default: Date.now },
  codigoAcceso: { type: String, required: true },
  contrasena: { type: String, required: true },
  mensajes: [{
    remitente: String,
    contenido: String,
    fecha: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('Solicitud', solicitudSchema);
