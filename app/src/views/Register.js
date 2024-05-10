import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './../css/connexion.module.css';

function Register() {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  async function registerUser(event) {
    event.preventDefault()
    const response = await fetch('http://localhost:3001/registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        password
      }),
    })

    const data = await response.json()
    if (data.status === 'ok') {
      navigate('/login')
    } else {
      alert('Email déjà enregistré')
    }
    console.log(data)
  }

  return (
    <div className={styles.main}>
      <form>
        <h1 className={styles.title}>Registrer</h1>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Name"
        />
        <br />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
        />
        <br />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
        />
        <br />
        <button onClick={registerUser}>Créer un compte</button>
      </form>
    </div>
  );
}

export default Register;
