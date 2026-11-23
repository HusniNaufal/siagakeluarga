import { jsx as _jsx } from "react/jsx-runtime";
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
    { path: "/", element: _jsx(Beranda, {}) },
    { path: "/r/:token", element: _jsx(Bagikan, {}) },
    {
        element: _jsx(PublicShell, {}),
        children: [
            { path: "/panduan", element: _jsx(PanduanDaftar, {}) },
            { path: "/panduan/:jenis", element: _jsx(PanduanDetail, {}) },
        ],
    },
    {
        element: _jsx(GuestRoute, {}),
        children: [
            { path: "/masuk", element: _jsx(Masuk, {}) },
            { path: "/daftar", element: _jsx(Daftar, {}) },
        ],
    },
    {
        element: _jsx(ProtectedRoute, {}),
        children: [
            { path: "/onboarding", element: _jsx(Onboarding, {}) },
            {
                element: _jsx(AppShell, {}),
                children: [
                    { path: "/beranda-saya", element: _jsx(BerandaSaya, {}) },
                    { path: "/keluarga", element: _jsx(Keluarga, {}) },
                    { path: "/rencana", element: _jsx(Rencana, {}) },
                    { path: "/tas-siaga", element: _jsx(TasSiaga, {}) },
                    { path: "/risiko", element: _jsx(Risiko, {}) },
                    { path: "/tanya", element: _jsx(Tanya, {}) },
                    { path: "/latihan", element: _jsx(Latihan, {}) },
                ],
            },
            {
                element: _jsx(AdminRoute, {}),
                children: [
                    {
                        element: _jsx(AdminShell, {}),
                        children: [
                            { path: "/admin/panduan", element: _jsx(AdminPanduan, {}) },
                            { path: "/admin/zona-bahaya", element: _jsx(AdminZona, {}) },
                            { path: "/admin/titik-kumpul", element: _jsx(AdminTitik, {}) },
                        ],
                    },
                ],
            },
        ],
    },
    { path: "*", element: _jsx(NotFound, {}) },
]);
