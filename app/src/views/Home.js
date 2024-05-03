import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import styles from './../css/home.module.css';

function Home() {

    const navigate = useNavigate()

    function register() {
        navigate('/register')
    }

    function login() {
        navigate('/login')
    }

    function play() {
        navigate('/yummy-game')
    }

    function seeWinners() {
        navigate('/winners')
    }

    const [pictures, setPictures] = useState([])
    const [isTheGameOver, setIsTheGameOver] = useState()
    const [isUserConnected, setIsUserConnected] = useState()

    useEffect(() => {
        fetch("http://localhost:3001/pastries-img")
        .then(res => res.json())
        .then(
            (result) => {
                setPictures(result);
            }
        )

        fetch("http://localhost:3001/pastries-left")
        .then(res => res.json())
        .then(
            (pastriesLeft) => {
                if (pastriesLeft > 0) {
                    setIsTheGameOver(false)
                } else {
                    setIsTheGameOver(true)
                }
            }
        )

        if (localStorage.hasOwnProperty('token')) {
            setIsUserConnected(true)
        } else {
            setIsUserConnected(false)
        }

    }, []);

    
    return(
        <div>
            {isTheGameOver ? (
                <div className={styles.game_over}>
                    <h1>The game is over 🥲</h1>

                    <button onClick={seeWinners}>See winners</button>
                </div>
            ) : (
                <div className={styles.main}>
                    <h1>Yummy Yams</h1>
                    <p>Joue et tente de gagner des pâtisseries !</p>
                    {isUserConnected ? (
                        <div className={styles.buttons}>
                            <button onClick={play}>Jouer</button>
                        </div>
                    ) : (
                        <div className={styles.connexion}>
                            <p>Pour jouer, connecte-toi 🚀</p>
                            <div className={styles.buttons}>
                                <button onClick={register}>Créer un compte</button>
                                <button onClick={login}>Se connecter</button>
                            </div>
                        </div>
                        
                    )}
                    <div className={styles.winners}>
                        <p>See the winners : </p>
                        <button onClick={seeWinners}>⭐</button>
                    </div>
                    {pictures.length > 0 && (
                        <div className={styles.img_caroussel}>
                            {pictures.map((item) => (
                                <img key={item} src={`/images/pastries/${item}`} alt={item} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Home;