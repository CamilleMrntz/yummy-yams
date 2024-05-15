import { useState } from 'react';
import styles from './../css/connexion.module.css';
import { useDispatch } from "react-redux";
import { addUser } from '../redux/features/User';

function Login() {
  // Store
  const dispatch = useDispatch()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')


  async function loginUser(event) {
    event.preventDefault()
    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      }),
    })

    const data = await response.json()

    if (data.user) {
      localStorage.setItem('token', data.user)
      dispatch(addUser({ email: email, username: data.username, token: data.user, chancesLeft: data.chancesLeft, winner: data.winner, numberOfPastriesWon: data.numberOfPastriesWon }))
      alert('Login successful')
      window.location.href = '/yummy-game'
    } else {
      alert('Please check your username and password')
    }
    console.log(data)
  }

  return (
    <div className={styles.main}>
      <form>
        <h1 className={styles.title}>Login</h1>
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
        <button onClick={loginUser}>Se connecter</button>
        <a href="/register">Clique ici si tu n'as pas de compte</a>
      </form>
    </div>
  );
}

export default Login;
