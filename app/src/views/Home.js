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

    const [pictures, setPictures] = useState([]);
    useEffect(() => {
        fetch("http://localhost:3001/pastries-img")
        .then(res => res.json())
        .then(
            (result) => {
                setPictures(result);
            }
        )
    }, []);

    return(
        <div className={styles.main}>
            <h1>Yummy Yams</h1>
            <p>Joue et tente de gagner des pâtisseries !</p>
            <p>Pour jouer, connecte-toi 🚀</p>
            <div className={styles.buttons}>
                <button onClick={register}>Créer un compte</button>
                <button onClick={login}>Se connecter</button>
            </div>
            {pictures.length > 0 && (
            <div className={styles.img_caroussel}>
                {pictures.map((item) => (
                    <img key={item} src={`/images/pastries/${item}`} alt={item} />
                ))}
            </div>
            )}
        </div>
    );
}

export default Home;