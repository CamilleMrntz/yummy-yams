import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import styles from './../css/home.module.css';

function Home() {
    const userInfo = useSelector((state) => state.user.value)

    const navigate = useNavigate()

    const [pictures, setPictures] = useState([])
    const [isTheGameOver, setIsTheGameOver] = useState()
    const [isUserConnected, setIsUserConnected] = useState()


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


    function displayConnectedUserMessage() {
        if (userInfo.winner) {
            return(
                <div>
                    <p>Bravo, tu as gagné {userInfo.numberOfPastriesWon} pâtisserie(s) !</p>
                </div>
            )
        } else if (userInfo.chancesLeft === 0) {
            return(
                <div>
                    <p>Merci d'avoir tenté ta chance {userInfo.name} !</p>
                </div>
            )
        } else {
            return(
                <div>
                    <p>Joue et tente de gagner des pâtisseries !</p>
                    <button onClick={play}>Jouer</button>
                </div>
            )
        }
    }

    
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
                    {isUserConnected ? (
                        displayConnectedUserMessage()
                    ) : (
                        <div className={styles.connexion}>
                            <p>Joue et tente de gagner des pâtisseries !</p>
                            <p>Pour jouer, connecte-toi 🚀</p>
                            <div className={styles.buttons}>
                                <button onClick={register}>Créer un compte</button>
                                <button onClick={login}>Se connecter</button>
                            </div>
                        </div>
                        
                    )}
                    <div className={styles.winners}>
                        <p>Voir les gagnants : </p>
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