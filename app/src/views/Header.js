import React from "react";
import styles from './../css/header.module.css';

function Header() {


    function home() {
        window.location.href = '/'
    }

    return(
        <div className={styles.main}>
            <button onClick={home}>Home</button>
        </div>
    );
}

export default Header;