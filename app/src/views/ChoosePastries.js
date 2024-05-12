import React , { useState, useEffect }from "react";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../redux/features/User';
import styles from './../css/choosePastries.module.css';

function ChoosePastries() {
    const userInfo = useSelector((state) => state.user.value)
    const dispatch = useDispatch()

    const navigate = useNavigate()

    const numberOfPastriesWon = userInfo.numberOfPastriesWon

    const [warningMessage, setWarningMessage] = useState([]);
    const [pastries, setPastries] = useState([]);
    const [pastriesChoosed, setPastriesChoosed] = useState([]);

    useEffect(() => {

        dispatch(updateUser({ field: 'numberOfPastriesChooseable', value: userInfo.numberOfPastriesWon }))

        fetch("http://localhost:3001/pastries-left-to-win")
        .then(res => res.json())
        .then(
            (stock) => {
                // si le nombre de patisseries en stock est inferieur au nombre de patisseries gagnées
                if (stock.length < numberOfPastriesWon) {
                    dispatch(updateUser({ field: 'numberOfPastriesWon', value: stock.length }));
                    //localStorage.setItem('numberOfPastriesWon', stock.length)
                }
                setPastries(stock)
            }
        )
    }, []);

    // A CLICK ON A PASTRY ADDS IT BELOW
    function addSelectedPastry(item) {
        let numberOfPastriesChooseable = userInfo.numberOfPastriesChooseable

        if (numberOfPastriesChooseable > 0) {
            let pastriesChoosedContainer = document.querySelector('.pastries_choosed')
            const pastry = document.createElement("img")
            pastry.src = `/images/pastries/${item.image}`
            pastry.alt = item.image
    
            // style
            pastry.style.width = '15vw';
            pastry.style.aspectRatio = '1';
            pastry.style.margin = '5px';
            pastry.style.borderRadius = '5px';
    
            // remove pastries where stock = 0 from the list
            item.stock--
            const updatedPastries = pastries.filter(p => p.stock > 0);
            setPastries(updatedPastries);
    
            // add pastry choosed below
            pastriesChoosedContainer.appendChild(pastry)
            const updatedPastriesChoosed = [...pastriesChoosed, item];
            setPastriesChoosed(updatedPastriesChoosed);
            console.log(pastriesChoosed)

            numberOfPastriesChooseable--
            dispatch(updateUser({ field: 'numberOfPastriesChooseable', value: numberOfPastriesChooseable }))
            //localStorage.setItem('numberOfPastriesChooseable', numberOfPastriesChooseable.toString())

        } else {
            setWarningMessage("Tu ne peux pas choisir plus que " + numberOfPastriesWon)
        }
    }

    // POST THE SELECTION TO THE BACKEND
    function confirmSelection(pastriesChoosed) {
        setWarningMessage("")
        let pastriesChoosedContainer = document.querySelector('.pastries_choosed')
        if (pastriesChoosedContainer.childElementCount < userInfo.numberOfPastriesWon && pastries.length > 0) {
            setWarningMessage("tu peux encore en choisir " + (userInfo.numberOfPastriesWon - pastriesChoosedContainer.childElementCount))
        } else {
            fetch("http://localhost:3001/choose-pastries", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem('token'),
                },
                body: JSON.stringify({
                    pastriesChoosed: pastriesChoosed,
                    winningDate: userInfo.winningDate,
                    numberOfPastriesWon: pastriesChoosedContainer.childElementCount,
                }),
            })
            dispatch(updateUser({ field: 'numberOfPastriesChooseable', value: 0 }))
            navigate('/')
        }
        
    }


    return(
        <div className={styles.main}>

            {<p>Bravo !!! Tu peux choisir {userInfo.numberOfPastriesWon} pâtisseries.</p>}
            {pastries.length > 0 && (
            <div className={styles.pastries_container}>
                {pastries.map((item) => (
                    <img key={item} src={`/images/pastries/${item.image}`} alt={item.image} onClick={() => addSelectedPastry(item)} />
                ))}
            </div>
            )}
            <p className={styles.warning_message}>{warningMessage}</p>
            <p>pâtisseries choisis : </p>
            <div className="pastries_choosed"></div>
            <button onClick={() => confirmSelection(pastriesChoosed)}>Choisir</button>
        </div>
    );
}

export default ChoosePastries;