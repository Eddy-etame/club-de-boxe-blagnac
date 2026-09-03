# Club de Boxe Blagnac–Toulouse

Site vitrine Astro, statique et mobile-first, préparé pour un projet de club de boxe à Blagnac. La préversion sépare volontairement les faits confirmés des informations encore attendues.

## État au 4 septembre 2026

- Design éditorial complet sur six pages publiques et une page 404.
- Images sportives réelles, responsives, sans doublon détecté avec les autres sites audités.
- SEO local prêt mais protégé par `noindex` et `robots.txt` tant que l’identité et les données locales ne sont pas validées.
- Surfaces machine disponibles : `ai.txt`, `llms.txt`, `llms-full.txt`, `humans.txt`, carte MCP et endpoint MCP en lecture seule.
- Formulaire branché sur Resend dès que trois variables serveur sont configurées.
- Aucune adresse, horaire, discipline, équipe, affiliation, récompense ou tarif n’est inventé.

## Démarrage

```bash
npm install
npm run dev
```

Contrôles :

```bash
npm run check
npm run build
```

Le script `build` lance le contrôle Astro, la génération statique et un audit du dossier produit : titres, descriptions, H1, JSON-LD, images, surfaces machine, indexabilité et absence d’attribution technique visible.

## Variables d’environnement

Copier `.env.example` vers `.env` localement ou définir les variables dans l’hébergeur :

| Variable | Rôle |
|---|---|
| `PUBLIC_SITE_URL` | Domaine canonique final, sans slash terminal. |
| `PUBLIC_SITE_INDEXABLE` | `false` par défaut. Demande l’ouverture à l’indexation. |
| `PUBLIC_RELEASE_VALIDATED` | Second verrou : valeur exacte `identity-legal-photo-rights-confirmed` après validation documentée. |
| `RESEND_API_KEY` | Clé serveur Resend. Ne jamais préfixer par `PUBLIC_`. |
| `CONTACT_FROM_EMAIL` | Expéditeur vérifié chez Resend. |
| `CONTACT_TO_EMAIL` | Destinataire privé des demandes. |

## Déploiement

Le dépôt est prévu pour Vercel :

- commande de build : `npm run build` ;
- dossier de sortie : `dist` ;
- version Node recommandée : 22.12 ou supérieure ;
- fonctions : `api/contact.js` et `api/mcp.js`.

Avant de rendre le site indexable, suivre intégralement [la checklist SEO/GEO](docs/SEO-GEO.md) et [le handoff](docs/HANDOFF.md).

## Documentation

- [État complet et reprise unique](docs/PROJECT-STATE.md)
- [Handoff et reprise](docs/HANDOFF.md)
- [Système visuel et registre des références](docs/DESIGN-SYSTEM.md)
- [SEO, GEO et lancement](docs/SEO-GEO.md)
- [Registre des faits](docs/CONTENT-FACTS.md)
- [Registre photo](docs/PHOTO-REGISTER.md)

## Règles non négociables

1. Ne jamais publier une donnée locale non vérifiée.
2. Ne pas représenter une association tierce sans autorisation explicite.
3. Ne jamais afficher d’attribution au constructeur du site dans l’interface publique.
4. Mettre à jour les pages, le JSON-LD, les fichiers agents et MCP depuis le même registre de faits.
5. Ne lever les deux verrous d’indexabilité qu’après validation juridique, éditoriale et photographique.
