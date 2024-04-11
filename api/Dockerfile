# Utilisation de l'image Node.js avec la version 20
FROM node:20

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port 3001 (port utilisé par l'API)
EXPOSE 3001

# Commande pour démarrer l'application Node.js
CMD ["node", "app.js"]  
# Assurez-vous que "app.js" est le fichier principal de votre application
