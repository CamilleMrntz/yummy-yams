import React from "react";
import styles from './../css/header.module.css';
import { useDispatch } from "react-redux";
import { deleteUser } from "./../redux/features/User"

function Header() {

    const dispatch = useDispatch();

    function home() {
        window.location.href = '/'
    }

    function deconnexion() {
        localStorage.removeItem('token')
        const email = localStorage.getItem('email')
        dispatch(deleteUser({ email: email }))
        window.location.href = '/'
    }

    function isUserConnected() {
        
    }

    return(
        <div className={styles.main}>
            <button className={styles.home}  onClick={home}>            
                <img src="/images/croissants.webp" alt="croissant" />
            </button>
            <button className={styles.deconnexion} onClick={deconnexion}>Deconnexion</button>
        </div>
    );
}

export default Header;