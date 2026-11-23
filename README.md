# IEG – frontend

SPA React + Vite (interfaccia in italiano) per il back-office di IEG: clienti, forniture/POD, letture, oneri,
dispacciamento, fatture. Il backend è [ieg-be](https://github.com/mkotcha/ieg-be) (Spring Boot).

## Sviluppo

```
pnpm install
cp .env.example .env.local     # e completare VITE_REACT_APP_PERSIST_KEY
pnpm dev                        # http://localhost:5173
```

Il dev server di Vite inoltra `/api` e `/auth` al **backend di sviluppo sulla porta 8081**
(`./mvnw spring-boot:run` in ieg-be, database `ieg-dev`), così può girare insieme a prod (porta 8080).

- `pnpm build` – build di produzione in `dist/` (in locale non tocca prod)
- `pnpm lint` – ESLint

## Deploy

Prod (`https://ieg.emmek.org`) segue il ramo **`main`** su GitHub: si lavora su `develop`, per pubblicare si porta
`develop` in `main` e si fa il push. Entro 5 minuti un timer su questa macchina ricostruisce frontend e backend.

```
git switch main && git pull --ff-only && git merge develop && git push && git switch develop
```

Comandi (deploy immediato, log, rollback), cartelle e installazione: vedi
[`ieg-be/deploy/README.md`](https://github.com/mkotcha/ieg-be/blob/main/deploy/README.md).
