import React, { useState, useRef, useEffect, useLayoutEffect } from "react"
import gsap from "gsap"
import { useNavigate } from "react-router-dom"
import { useJwt, decodeToken, isExpired } from "react-jwt"
import styles from './../css/yummyGame.module.css';

const YummyGame = () => {
    const navigate = useNavigate()

    const token = localStorage.getItem('token')
    console.log("token : " + token)

    const [dices, setDices] = useState([0,0,0,0,0])
    const [message, setMessage] = useState('');
    const [chancesLeft, setChancesLeft] = useState(0);


    useEffect(() => {
        if (token) {
            let isTokenExpired = isExpired(token)
            console.log("Token expired : " + isTokenExpired)
            let user = decodeToken(token)
            console.log("user name : " + user.name)
            if (!user) {
                localStorage.removeItem('token')
                console.log("Token removed")
            } else {
                fetchChancesLeft(user.email);
            }
        } else {
            let data = localStorage.getItem('data')
            console.log("data : " + data) 
            console.log("token : " + token) 
        }
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
                setChancesLeft(data);
                setMessage(data <= 0 ? 'You rolled the dices 3 times.' : `You have ${data} chances left.`);
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
                localStorage.setItem('numberOfPastriesWon', data.numberOfPastriesWon)
                localStorage.setItem('winningDate', new Date())
                navigate('/choose-pastries')
            }
            setDices(data.dices)
            setMessage(data.chancesLeft === 0 ? 'You rolled the dices 3 times.' : 'You can roll ' + data.chancesLeft + ' more time.');
        } else {
            const errorResponse = await response.json()
            console.error(errorResponse)
        }
    }


    // function informPlayer(data) {
    //     console.log("dices : " + data.dices)
    //     if (data.dices.includes(0)) {
    //         return <p>You rolled the dices 3 times.</p>
    //     } else {
    //         return <p>You have .. more chances</p>
    //     }
    // }


    return (
        <div className={styles.main}>
            <h1>Roll the dices</h1>
            {/* {user && (
                <p>Welcome, {user}!</p>
            )} */}
            {message && <p>{message}</p>}
            {dices.map((dice, index) => <Dice key={gsap.utils.random()} value={dice} />)}
		
            <div className={styles.actions}>
                <button className={styles.play_button} onClick={rollDices}>PLAY</button>
            </div>
        </div>
    )
}

export default YummyGame;