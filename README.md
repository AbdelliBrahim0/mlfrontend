# PersonFrontend

Frontend React + TypeScript pour saisir le profil conducteur et afficher le score predit par PersonBackend, avec une page vehicule dediee connectee a CarBackend.

## Fonctionnalites

- Formulaire en 3 etapes
- Ecran sante avec checklist maladies (style mobile inspire de la capture)
- Appel API vers FastAPI pour la prediction
- Affichage du score modele et des principales features derivees
- Page vehicule pour la recherche par marque/modele/annee
- Affichage de la trace de resolution dataset ou web fallback
- UI responsive desktop/mobile

## Configuration

Copier `.env.example` vers `.env` si tu veux changer l'URL API:

```
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
VITE_CAR_API_BASE_URL=http://127.0.0.1:8001/api/v1
```

## Lancement

1. Lancer le backend PersonBackend sur le port 8000.
2. Lancer CarBackend sur le port 8001 si tu veux utiliser la page vehicule.
2. Lancer le frontend:

```bash
npm install
npm run dev
```

## Build production

```bash
npm run build
npm run preview
```
