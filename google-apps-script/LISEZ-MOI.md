# Recevoir les demandes de devis par e-mail aux couleurs du site (Google)

Ce dossier contient le script qui remplace FormSubmit : chaque demande de devis arrive sur
**laphotodromoise@gmail.com** dans un e-mail noir & cuivre, avec les boutons « Répondre au client »
et « Appeler », et elle est notée dans un tableau Google Sheets « Demandes de devis – La Photo Drômoise ».

## Installation (10 minutes, une seule fois)

1. Connecte-toi à **laphotodromoise@gmail.com**, puis va sur **script.google.com** › **Nouveau projet**.
2. Renomme le projet « Formulaire devis La Photo Drômoise ».
3. Efface le contenu de `Code.gs` et colle à la place tout le contenu du fichier `Code.gs` de ce dossier. Enregistre (icône disquette).
4. En haut, choisis la fonction **testerEnvoi** puis clique sur **Exécuter**.
   Google demande des autorisations : **Examiner les autorisations** › choisir le compte › **Paramètres avancés** ›
   **Accéder à … (non sécurisé)** › **Autoriser**. (C'est normal : c'est ton propre script.)
   → Tu reçois un e-mail de test aux couleurs du site, et un tableau Google Sheets est créé dans ton Drive.
5. **Déployer** › **Nouveau déploiement** › type **Application Web** :
   - Exécuter en tant que : **Moi (laphotodromoise@gmail.com)**
   - Qui a accès : **Tout le monde**
   - **Déployer**, puis **copier l'URL de l'application Web** (elle se termine par `/exec`).
6. Donne cette URL à Claude (ou colle-la dans `devis.js`, à la ligne `var SCRIPT_GOOGLE = '';`).
   À partir de là, le site envoie les demandes à Google et plus à FormSubmit.

## Modifier plus tard

- Pour changer l'e-mail : modifie `Code.gs`, puis **Déployer › Gérer les déploiements › ✏️ › Version : Nouvelle version › Déployer**
  (l'URL reste la même).
- Pour ne pas créer de tableau Sheets : mets `enregistrerDansSheets: false` en haut du script.
- Limite Gmail gratuite : environ 100 e-mails envoyés par jour par le script, largement suffisant.
