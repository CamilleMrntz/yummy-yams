import express from "express";

const app = express();
const port = 3001;

// 1. Ajoutez une route d'accueil affichant un objet JSON contenant votre nom/prénom/age
app.get("/home", (req, res) => {
  res.send({
    nom: 'CLERY',
    prenom: 'Jean-Marie',
    age: 35,
  });
});


app.listen(port, () => console.log(`App démarrée sur http://localhost:${port}`));
