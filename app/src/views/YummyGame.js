import React, { useEffect } from "react"
import { useJwt } from "react-jwt"
import { useNavigate } from "react-router-dom"
//import jwt from 'jsonwebtoken'

const YummyGame = () => {
    const navigate = useNavigate()
    
    // console.log(token)
    // console.log(decodedToken)
    // console.log(isExpired)
    let data = ""

    useEffect(() => {
        const token = localStorage.getItem('token')
        //const { isExpired } = useJwt(token)
        if (token) {
            //const user = jwt.decode(token)
            //if (!user) {
                localStorage.removeItem('token')
            } else {
                data = localStorage.getItem('data')
                console.log("data : " + data) 
                console.log("token : " + token) 
            }
        //}
    }, [])

    //const { decodedToken } = useJwt(token)


    return (
        <div>
            <h1>Roll the dices</h1>
            {/* {decodedToken && ( */}
        {/* <p>Welcome, {decodedToken.name}!</p> */}
        {/* )} */}
            {data && (
                <p>Welcome, {data.name}!</p>
            )}
        </div>
    )
}

export default YummyGame;