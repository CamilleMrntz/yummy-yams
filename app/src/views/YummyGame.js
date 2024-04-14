import React, { useEffect } from "react"
import { useJwt } from "react-jwt"
import { useNavigate } from "react-router-dom"

const YummyGame = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const { decodedToken, isExpired } = useJwt(token)

    useEffect(() => {
        if (isExpired) {
            localStorage.removeItem('token')
            navigate('/yummy-game')
        }
        console.log("token : " + token) 
    }, [isExpired])


    return (
        <div>
            <h1>Roll the dices</h1>
            {decodedToken && (
        <p>Welcome, {decodedToken.name}!</p>
      )}
        </div>
    )
}

export default YummyGame;