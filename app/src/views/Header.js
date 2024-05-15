import React from "react";
import styles from './../css/header.module.css';
import { useDispatch, useSelector } from "react-redux";
import { deleteUser } from "./../redux/features/User"

function Header() {
    const userInfo = useSelector((state) => state.user.value)
    const dispatch = useDispatch();

    function home() {
        window.location.href = '/'
    }

    function deconnexion() {
        localStorage.removeItem('token')
        const email = localStorage.getItem('email')
        dispatch(deleteUser({ email: email }))
        localStorage.removeItem('email')
        window.location.href = '/'
    }

    return(
        <div className={styles.main}>
            <button className={styles.home}  onClick={home}>            
                <img src="/images/croissants.webp" alt="croissant" />
            </button>
            {userInfo != null && (
                <button className={styles.deconnexion} onClick={deconnexion}>Deconnexion</button>
            )}
        </div>
    );
}

export default Header;