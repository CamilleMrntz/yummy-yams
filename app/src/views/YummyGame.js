import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useJwt, decodeToken, isExpired } from "react-jwt"

const YummyGame = () => {
    const navigate = useNavigate()

    const token = localStorage.getItem('token')
    console.log("token : " + token)

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

    //const { decodedToken } = useJwt(token)


    return (
        <div>
            <h1>Roll the dices</h1>
            {/* {user && (
                <p>Welcome, {user.name}!</p>
            )} */}
        </div>
    )
}

export default YummyGame;