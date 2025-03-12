const mongoose = require('mongoose');

// Mongoose-malli
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

// Muotoillaan JSON-vastaus
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString(); // Muutetaan _id merkkijonoksi
    delete returnedObject._id; // Poistetaan _id
    delete returnedObject.__v; // Poistetaan __v
  },
});

// Exportataan malli
module.exports = mongoose.model('Person', personSchema);