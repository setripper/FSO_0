import { useState, useEffect } from 'react'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')

  useEffect(() => {
    personService.getAll().then(response => setPersons(response.data))
  }, [])


  const addPerson = (event) => {
    event.preventDefault()

    if (alreadyExist(newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const personTarget = persons.find(p => p.name === newName)
        const changedPerson = { ...personTarget, number: newNumber }

        personService
          .update(personTarget.id, changedPerson)
          .then(response => {
            setPersons(persons.map(p => p.id !== personTarget.id ? p : response.data))
            setNewName('')
            setNewNumber('')
          })
      }
      return
    }

    const personObject = {
      name: newName,
      number: newNumber,

    } 
    

    personService.create(personObject).then(response => {
      setPersons(persons.concat(response.data))
      console.log(response.data)
      setNewName('')
      setNewNumber('')
    })
  }

  const addNumber = (event) => {
    return
  }

  const handleNewPerson = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const alreadyExist = (name) => {
    return persons.some(person => person.name === name)
  }

  const handleNewSearch = (event) => {
    setNewSearch(event.target.value)
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(newSearch.toLowerCase())
  )

  const handleRemove = (id) => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <div>
        filter shown names containing a given{' '}
        <input value={newSearch} onChange={handleNewSearch} />
      </div>

      <h1>add a new</h1>

      <form onSubmit = {addPerson}>
        <div>
          name: <input value = {newName} onChange={handleNewPerson}/>
        </div>


        <div>
          number: <input value = {newNumber} onChange={handleNewNumber}/>
        </div>

        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {personsToShow.map((profile) => (
          <li key={profile.id}>{profile.name} {profile.number} <button onClick={() => handleRemove(profile.id)} >delete</button></li>
        ))}
      </ul>
    </div>
  )
}

export default App