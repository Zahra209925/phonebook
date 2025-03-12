const mongoose = require('mongoose');

// Määrittele skeema henkilötietoja varten
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Nimi on pakollinen
  },
  number: {
    type: String,
    required: true, // Numero on pakollinen
  },
});

// Poista __v ja muuta _id -> id JSON-vastauksissa
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// Vie malli
module.exports = mongoose.model('Person', personSchema);