import React, { useState, useRef, useEffect, useLayoutEffect } from "react"
import gsap from "gsap"
import { useNavigate } from "react-router-dom"
import { useJwt, decodeToken, isExpired } from "react-jwt"
import styles from './../css/yummyGame.module.css';

const YummyGame = () => {
    // const navigate = useNavigate()

    const token = localStorage.getItem('token')
    console.log("token : " + token)

    const [dices, setDices] = useState([0,0,0,0,0])
	
	// function launch() {
	// 	setDices(rollDices())
	// }

    //const { decodedToken, isExpired } = useJwt(token);
    //console.log("token expired : " + isExpired)


    useEffect(() => {
        if (token) {
            let isTokenExpired = isExpired(token)
            console.log("Token expired : " + isTokenExpired)
            let user = decodeToken(token)
            console.log("user name : " + user.name)
            if (!user) {
                localStorage.removeItem('token')
                console.log("Token removed")
            }
        } else {
            let data = localStorage.getItem('data')
            console.log("data : " + data) 
            console.log("token : " + token) 
        }
    }, [])

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
            let dices = await response.json()
            console.log(dices)
            if (!Array.isArray(dices)) {
                console.error("Cannot roll dices more than 3 times:", dices);
                dices = [0, 0, 0, 0, 0]
            }
            setDices(dices)
        } else {
            const errorResponse = await response.json()
            console.error(errorResponse)
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



    return (
        <div>
            <h1>Roll the dices</h1>
            {/* {user && (
                <p>Welcome, {user}!</p>
            )} */}
            {dices.map((dice, index) => <Dice key={gsap.utils.random()} value={dice} />)}
		
            <div className={styles.actions}>
                <button className={styles.play_button} onClick={rollDices}>PLAY</button>
            </div>
        </div>
    )
}

export default YummyGame;