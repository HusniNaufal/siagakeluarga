# Frontend

React + Vite + Tailwind + shadcn/ui.

Setup awal (Frontend Developer), jalankan dari root repo:
```bash
npm create vite@latest . -- --template react
npm i react-router-dom @tanstack/react-query leaflet react-leaflet
npm i -D tailwindcss @tailwindcss/vite
npx shadcn@latest init
```
Rute: `/`, `/masuk`, `/daftar`, `/keluarga`, `/risiko`, `/rencana`, `/tas-siaga`, `/latihan`, `/tanya`, `/r/:token`, `/admin`.
Pakai mock data sesuai `docs/api-contract.md` sampai backend siap.
