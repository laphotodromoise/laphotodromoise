# La Photo Drômoise — version fidèle

Copie du site laphotodromoise.com (7 pages, mêmes adresses), prête pour GitHub Pages.

## Mise en ligne
1. Déposer **tout le contenu de ce dossier** à la racine du dépôt (y compris le dossier caché `.github`).
2. Les photos sont rapatriées automatiquement : à chaque envoi, l'action « Rapatrier les photos Webnode » télécharge toutes les images dans `images/` et met les pages à jour (onglet **Actions**, ~1 minute). On peut aussi la lancer à la main : Actions › Rapatrier les photos Webnode › Run workflow.
3. Settings › Pages › Deploy from a branch › `main` / root.

Si l'action échoue avec « Permission denied » : Settings › Actions › General › Workflow permissions › **Read and write permissions** › Save, puis relancer.

## Formulaire de devis
Envoyé par le script Google Apps Script du compte laphotodromoise@gmail.com (voir `google-apps-script/`) : e-mail aux couleurs du site + ligne dans le tableau Google Sheets « Demandes de devis – La Photo Drômoise ». L'adresse du script est dans `devis.js` (`SCRIPT_GOOGLE`). FormSubmit n'est plus utilisé depuis le 17/11/2026 (envois bloqués et doublons).
