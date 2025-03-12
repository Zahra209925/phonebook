import React, { useState, useEffect } from 'react';
import axios from 'axios';
const baseUrl = '/api/notes'

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [errorMessage, setErrorMessage] = useState(null); // Virheilmoituksen tila

  // Hakee tiedot backendistä
  useEffect(() => {
    axios.get('http://localhost:3001/api/persons').then((response) => {
      setPersons(response.data);
    });
  }, []);

  // Lisää uuden henkilön
  const addPerson = (event) => {
    event.preventDefault();

    const personObject = {
      name: newName,
      number: newNumber,
    };

    // Lähetä tiedot backendille
    axios
      .post('http://localhost:3001/api/persons', personObject)
      .then((response) => {
        setPersons(persons.concat(response.data));
        setNewName('');
        setNewNumber('');
        setErrorMessage(null); // Tyhjennä virheilmoitus onnistuneen lisäyksen jälkeen
      })
      .catch((error) => {
        setErrorMessage(error.response.data.error); // Aseta virheilmoitus
        setTimeout(() => {
          setErrorMessage(null); // Poista virheilmoitus 5 sekunnin kuluttua
        }, 5000);
      });
  };

  // Suodattaa näkyvät henkilöt
  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>

      {/* Näytä virheilmoitus, jos sellainen on */}
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

      <div>
        filter shown with <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      </div>
      <h3>add a new</h3>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={(e) => setNewName(e.target.value)} />
        </div>
        <div>
          number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h3>Numbers</h3>
      <ul>
        {personsToShow.map((person) => (
          <li key={person.id}>
            {person.name} {person.number}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;











