import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import styles from './../css/home.module.css'

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

    function slide() {
        const caroussel = document.querySelector('.caroussel')
        const caroussel_1 = document.querySelector('.img_caroussel')
        
        if (caroussel) {
            caroussel.appendChild(caroussel_1)
        } else {
            console.log('no')
        }
    }

    slide()

    // useEffect(() => {
    //     const intervalId = setInterval(() => {
    //       const caroussel = document.querySelector('.img_caroussel');
    //       if (caroussel) {
    //         const firstImage = caroussel.querySelector('img');
    
    //         // Déplacer la première image à la fin du carrousel
    //         caroussel.appendChild(firstImage.cloneNode(true));
    //         caroussel.removeChild(firstImage);
    //       } else {
    //         console.log('no')
    //       }
    //     }, 10000); // Modifier cette valeur pour ajuster la vitesse du carrousel
    
    //     return () => clearInterval(intervalId);
    //   }, []);

    return(
        <div>
            <h1>Yummy Yams</h1>
            <p>Joue et tente de gagner des patisseries !</p>
            <p>Pour jouer connecte toi 🚀</p>
            <button onClick={register}>Créer mon compte</button>
            <button onClick={login}>Se connecter</button>
            {pictures.length > 0 && (
            <section className={styles.caroussel}>
                <div className={styles.img_caroussel}>
                    {pictures.map((item) => (
                        <img key={item} src={`./../images/${item}`} alt={item} />
                    ))}
                </div>
            </section>
            )}
        </div>
    );
}

export default Home;