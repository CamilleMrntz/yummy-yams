import React, { useState, useEffect } from 'react';
import styles from './../css/winners.module.css';

function Winners() {
  const [winners, setWinners] = useState([])

  useEffect(() => {
  
    fetch("http://localhost:3001/winners")
    .then(res => res.json())
    .then(
        (result) => {
          setWinners(result)
        }
    )


  }, []);

  function formatDate(dateOfwinning) {
    const dateObj = new Date(dateOfwinning);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = dateObj.toLocaleDateString('fr-FR', options);

    return date
  }

  function formatTime(dateOfwinning) {
    const dateObj = new Date(dateOfwinning);
    const time = dateObj.toTimeString().slice(0, 8);

    return time
  }


  return (
    <div className={styles.main}>
      <h1>🏆</h1>
      {winners.length > 0 && (
        <div className={styles.winners}>
            <div className={styles.winner_card + ' ' + styles.winner_title}>
              <p>gagnant</p>
              <p>date</p>
              <p>heure</p>
              <p>nombre</p>
            </div>
          {winners.map((item) => (
            <div className={styles.winner_card + ' ' + styles.winner_card_only}>
              <p key={item}>{item.userName}</p>
              <p key={item}>{formatDate(item.date)}</p>
              <p key={item}>{formatTime(item.date)}</p>
              <p key={item}>{item.numberOfPastriesWon}</p>
              {/* <p key={item}>{item.pastries.name}</p> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Winners;