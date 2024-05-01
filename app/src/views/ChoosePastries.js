import React , { useState, useEffect }from "react";
import styles from './../css/choosePastries.module.css';

function ChoosePastries() {

    const pastriesWon = localStorage.getItem('numberOfPastriesWon')
    const winningDate = localStorage.getItem('winningDate')

    let pastriesChoosed = []

    const [pictures, setPictures] = useState([]);
    const [pastries, setPastries] = useState([]);
    useEffect(() => {
        fetch("http://localhost:3001/pastries-left-to-win")
        .then(res => res.json())
        .then(
            (result) => {
                const imageUrls = result.map(pastry => pastry.image)
                setPictures(imageUrls)
                setPastries(result)
            }
        )
    }, []);

    function addSelectedPastry(item) {
        let pastriesChoosedContainer = document.querySelector('.pastries_choosed')
        const pastry = document.createElement("img")
        pastry.src = `/images/pastries/${item.image}`
        pastry.alt = item.image
        pastry.classList.add('pastrie_choosed')
        pastriesChoosedContainer.appendChild(pastry)
        pastriesChoosed.push(item)
        console.log(pastriesChoosed)
    }


    return(
        <div>
            {<p>Congratulations !!! You can choose {pastriesWon} pastries.</p>}
            {pastries.length > 0 && (
            <div className={styles.img_caroussel}>
                {pastries.map((item) => (
                    <img key={item} src={`/images/pastries/${item.image}`} alt={item.image} onClick={() => addSelectedPastry(item)} />
                ))}
            </div>
            )}
            <p>Pastries you choosed : </p>
            <div className="pastries_choosed"></div>
            <button>Choose</button>
        </div>
    );
}

export default ChoosePastries;