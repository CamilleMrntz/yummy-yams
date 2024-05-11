import React, { useState, useRef, useEffect, useLayoutEffect } from "react"
import gsap from "gsap"
import { useNavigate } from "react-router-dom"
import { decodeToken, isExpired } from "react-jwt"
import styles from './../css/yummyGame.module.css';
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { updateUser } from '../redux/features/User';

const YummyGame = () => {
    // Store
    const userInfo = useSelector((state) => state.user.value)
    const dispatch = useDispatch()

    const navigate = useNavigate()

    const token = localStorage.getItem('token')
    console.log("token : " + token)

    const [userName, setUserName] = useState('')
    const [dices, setDices] = useState([0,0,0,0,0])
    const [message, setMessage] = useState('')
    const [playButtonVisible, setPlayButtonVisible] = useState(true)


    useEffect(() => {
        const fetchData = async () => {
            if (token) {
                let isTokenExpired = isExpired(token)
                console.log("Token expired : " + isTokenExpired)
                let user = await decodeToken(token)
                console.log("user name : " + userInfo.username)
                if (!user) {
                    localStorage.removeItem('token')
                    console.log("Token removed")
                } else {
                    setUserName(user.name)
                    fetchChancesLeft(user.email);
                }
            } else {
                let data = localStorage.getItem('data')
                console.log("data : " + data) 
                console.log("token : " + token) 
            }
        }
        fetchData()
    }, [])

    async function fetchChancesLeft(email) {
        try {
            const response = await fetch(`http://localhost:3001/chances-left/${email}`, {
                headers: {
                    'x-access-token': token,
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Chances left:", data);
                setMessage(data <= 0 ? 'Tu as déjà lancé les dés 3 fois.' : `Bienvenue dans le jeu ${userInfo.username}. Tu peux lancer les dés encore ${data} fois pour tenter de remporter des pâtisseries.`);
            } else {
                console.error("Failed to fetch chances left:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching chances left:", error);
        }
    }


    function Dice(props) {
        const faces = [props.value, ...gsap.utils.shuffle([1, 2, 3, 4, 5, 6].filter(v => v !== props.value))]
        
        const dice = useRef()
        useLayoutEffect(() => {
            const ctx = gsap.context(() => {
                gsap.from(dice.current, {
                    rotationX: 'random(720, 1080)',
                    rotationY: 'random(720, 1080)',
                    rotationZ: 0,
                    duration: 'random(2, 3)'
                })
            }, dice)
            return () => ctx.revert()
        }, [props.value])

        return (
            <div className={styles.dice_container}>
                <div className={styles.dice} ref={dice}>
                    {faces.map((value) => (
                        <div className={styles.face}>{value}</div>
                    ))}
                </div>
            </div>
        )
    }

    async function rollDices(event) {
        event.preventDefault()
        const response = await fetch('http://localhost:3001/rolling-dices', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }
        })

        if (response.ok) {
            let data = await response.json()
            console.log(data.dices)
            if (data.chancesLeft === 0) {
                console.error("Cannot roll dices more than 3 times:", data);
            }
            if (data.numberOfPastriesWon !== 0) {
                console.log("pastries won : " + data.numberOfPastriesWon)
                // STORE use in choosePastries
                dispatch(updateUser({ field: 'numberOfPastriesWon', value: data.numberOfPastriesWon }));
                dispatch(updateUser({ field: 'winningDate', value: new Date() }));
                // To remove
                localStorage.setItem('numberOfPastriesWon', data.numberOfPastriesWon)
                localStorage.setItem('winningDate', new Date())
                ////////////////
                // play_button
                setMessage('BRAVOOOO !!!')
                setPlayButtonVisible(false);
                gsap.to(".yourComponent", { duration: 5, opacity: 0, onComplete: () => {
                    navigate('/choose-pastries');
                }});
            } else {
                setMessage(data.chancesLeft === 0 ? 'Tu as déjà lancé les dés 3 fois.' : 'Bienvenue dans le jeu ' + userInfo.username + '. Tu peux lancer les dés encore ' + data.chancesLeft + ' fois.')
            }
            setDices(data.dices)
        } else {
            const errorResponse = await response.json()
            console.error(errorResponse)
        }
    }



    return (
        <div className={styles.main}>
            <h1>Roll the dices</h1>
            <p></p>
            {userName && message && <p className={styles.message}>{message}</p>}
            {dices.map((dice, index) => <Dice key={gsap.utils.random()} value={dice} />)}
		
            <div className={styles.actions}>
                {playButtonVisible && <button className={styles.play_button} onClick={rollDices}>PLAY</button>}
            </div>
        </div>
    )
}

export default YummyGame;