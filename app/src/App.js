import React from "react"
import { Routes, Route, BrowserRouter } from "react-router-dom"
import Home from "./views/Home"
import Login from "./views/Login"
import Register from "./views/Register"
import YummyGame from "./views/YummyGame"
import ChoosePastries from "./views/ChoosePastries"
import Winners from "./views/Winners"
import Header from "./views/Header"

const App = () => {
    return (
        <div>
            <Header />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/yummy-game" element={<YummyGame />} />
                    <Route path="/choose-pastries" element={<ChoosePastries />} />
                    <Route path="/winners" element={<Winners />} />
                </Routes>   
            </BrowserRouter>
            
        </div>
    )
}

export default App