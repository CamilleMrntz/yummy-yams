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


  return (
    <div className={styles.main}>
      {winners.length > 0 && (
        <div className={styles.winner}>
          {winners.map((item) => (
            <p key={item}>{item.userName}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default Winners;