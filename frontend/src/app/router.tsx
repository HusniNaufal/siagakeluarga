import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { AdminShell } from "@/components/layout/AdminShell";
import { PublicShell } from "@/components/layout/PublicShell";
import { ProtectedRoute, AdminRoute, GuestRoute } from "@/app/ProtectedRoute";

import { Beranda } from "@/pages/Beranda/Beranda";
import { PanduanDaftar } from "@/pages/Panduan/PanduanDaftar";
import { PanduanDetail } from "@/pages/Panduan/PanduanDetail";
import { Masuk } from "@/pages/Masuk/Masuk";
import { Daftar } from "@/pages/Daftar/Daftar";
import { Onboarding } from "@/pages/Onboarding/Onboarding";
import { BerandaSaya } from "@/pages/BerandaSaya/BerandaSaya";
import { Keluarga } from "@/pages/Keluarga/Keluarga";
import { Rencana } from "@/pages/Rencana/Rencana";
import { TasSiaga } from "@/pages/TasSiaga/TasSiaga";
import { Risiko } from "@/pages/Risiko/Risiko";
import { Tanya } from "@/pages/Tanya/Tanya";
import { Latihan } from "@/pages/Latihan/Latihan";
import { Bagikan } from "@/pages/Bagikan/Bagikan";
import { AdminPanduan } from "@/pages/Admin/AdminPanduan";
import { AdminZona } from "@/pages/Admin/AdminZona";
import { AdminTitik } from "@/pages/Admin/AdminTitik";
import { NotFound } from "@/pages/Error/NotFound";

export const router = createBrowserRouter([
  { path: "/", element: <Beranda /> },
  { path: "/r/:token", element: <Bagikan /> },

  {
    element: <PublicShell />,
    children: [
      { path: "/panduan", element: <PanduanDaftar /> },
      { path: "/panduan/:jenis", element: <PanduanDetail /> },
    ],
  },

  {
    element: <GuestRoute />,
    children: [
      { path: "/masuk", element: <Masuk /> },
      { path: "/daftar", element: <Daftar /> },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      { path: "/onboarding", element: <Onboarding /> },
      {
        element: <AppShell />,
        children: [
          { path: "/beranda-saya", element: <BerandaSaya /> },
          { path: "/keluarga", element: <Keluarga /> },
          { path: "/rencana", element: <Rencana /> },
          { path: "/tas-siaga", element: <TasSiaga /> },
          { path: "/risiko", element: <Risiko /> },
          { path: "/tanya", element: <Tanya /> },
          { path: "/latihan", element: <Latihan /> },
        ],
      },
      {
        element: <AdminRoute />,
        children: [
          {
            element: <AdminShell />,
            children: [
              { path: "/admin/panduan", element: <AdminPanduan /> },
              { path: "/admin/zona-bahaya", element: <AdminZona /> },
              { path: "/admin/titik-kumpul", element: <AdminTitik /> },
            ],
          },
        ],
      },
    ],
  },

  { path: "*", element: <NotFound /> },
]);
