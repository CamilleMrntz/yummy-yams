import React from "react"
import { Routes, Route, BrowserRouter } from "react-router-dom"
import Login from "./views/Login"
import Register from "./views/Register"
import YummyGame from "./views/YummyGame"

const App = () => {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/yummy-game" element={<YummyGame />} />
                </Routes>   
            </BrowserRouter>
            
        </div>
    )
}

export default App