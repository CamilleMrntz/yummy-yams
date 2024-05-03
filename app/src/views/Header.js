import React from "react";
import styles from './../css/header.module.css';

function Header() {


    function home() {
        window.location.href = '/'
    }

    function deconnexion() {
        localStorage.removeItem('token')
        window.location.href = '/'
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