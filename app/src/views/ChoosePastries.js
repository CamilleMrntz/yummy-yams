import React , { useState, useEffect }from "react";
import { useNavigate } from 'react-router-dom';
import styles from './../css/choosePastries.module.css';

function ChoosePastries() {

    const navigate = useNavigate()

    const numberOfPastriesWon = localStorage.getItem('numberOfPastriesWon')
    const winningDate = localStorage.getItem('winningDate')

    const [warningMessage, setWarningMessage] = useState([]);
    const [pastries, setPastries] = useState([]);
    const [pastriesChoosed, setPastriesChoosed] = useState([]);

    useEffect(() => {
        localStorage.removeItem('numberOfPastriesChooseable');

        if (!localStorage.hasOwnProperty('numberOfPastriesChooseable')) {
            localStorage.setItem('numberOfPastriesChooseable', numberOfPastriesWon);
        } else {
            console.log('pastries chooseable ' + localStorage.getItem('numberOfPastriesChooseable'))
        }

        fetch("http://localhost:3001/pastries-left-to-win")
        .then(res => res.json())
        .then(
            (stock) => {
                // si le nombre de patisseries en stock est inferieur au nombre de patisseries gagnées
                if (stock.length < numberOfPastriesWon) {
                    localStorage.setItem('numberOfPastriesWon', stock.length)
                }
                setPastries(stock)
            }
        )
    }, []);

    function addSelectedPastry(item) {
        let numberOfPastriesChooseable = localStorage.getItem('numberOfPastriesChooseable')

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
            localStorage.setItem('numberOfPastriesChooseable', numberOfPastriesChooseable.toString())

        } else {
            setWarningMessage("You cannot choose more than " + numberOfPastriesWon)
        }
    }

    function confirmSelection(pastriesChoosed) {
        setWarningMessage("")
        let pastriesChoosedContainer = document.querySelector('.pastries_choosed')
        let pastriesContainer = document.querySelector('pastries_container')
        console.log(pastriesChoosedContainer.childElementCount)
        console.log(localStorage.getItem('numberOfPastriesWon'))
        if (pastriesChoosedContainer.childElementCount < localStorage.getItem('numberOfPastriesWon') && pastries.length > 0) {
            setWarningMessage("You can choose " + (localStorage.getItem('numberOfPastriesWon') - pastriesChoosedContainer.childElementCount) + " more")
        } else {
            fetch("http://localhost:3001/choose-pastries", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem('token'),
                },
                body: JSON.stringify({
                    pastriesChoosed: pastriesChoosed,
                    winningDate: winningDate,
                    numberOfPastriesWon: pastriesChoosedContainer.childElementCount,
                }),
            })
            navigate('/')
        }
        
    }


    return(
        <div className={styles.main}>

            {<p>Bravo !!! Tu peux choisir {numberOfPastriesWon} pâtisseries.</p>}
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