import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";
import { AuthPhotoPanel } from "@/components/sections/AuthPhotoPanel";
import { TopoBackground } from "@/components/layout/TopoBackground";
export function Daftar() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [nama, setNama] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    async function onSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await register(nama, email, password);
            navigate("/onboarding", { replace: true });
        }
        catch (err) {
            setError(err instanceof ApiError ? err.message : "Gagal mendaftar. Coba lagi.");
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsxs("div", { className: "flex min-h-screen bg-white", children: [_jsxs("div", { className: "relative flex w-full flex-col justify-center overflow-hidden px-6 py-16 lg:w-auto lg:min-w-[640px] lg:px-[100px]", children: [_jsx(TopoBackground, { variant: "light" }), _jsxs("div", { className: "relative z-10", children: [_jsx(Link, { to: "/", className: "text-xl font-semibold tracking-[-0.01em] text-[#0B2545]", children: "SiagaKeluarga" }), _jsxs("form", { onSubmit: onSubmit, className: "mt-12 w-full max-w-[440px] space-y-7", children: [_jsx("h1", { className: "text-[32px] font-semibold tracking-[-0.02em] text-[#0B2545]", children: "Buat akun baru" }), error && (_jsx("p", { className: "rounded-xl bg-bahaya/10 px-4 py-3 text-sm text-bahaya", children: error })), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "nama", className: "block text-sm font-medium text-ink-2", children: "Nama panggilan" }), _jsx("input", { id: "nama", type: "text", required: true, value: nama, onChange: (e) => setNama(e.target.value), className: "h-[52px] w-full rounded-xl border border-line bg-white px-4 text-base outline-none focus-visible:border-accent-dark", placeholder: "Budi" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-ink-2", children: "Email" }), _jsx("input", { id: "email", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "h-[52px] w-full rounded-xl border border-line bg-white px-4 text-base outline-none focus-visible:border-accent-dark", placeholder: "budi@email.com" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-ink-2", children: "Kata sandi" }), _jsx("input", { id: "password", type: "password", required: true, minLength: 6, value: password, onChange: (e) => setPassword(e.target.value), className: "h-[52px] w-full rounded-xl border border-line bg-white px-4 text-base outline-none focus-visible:border-accent-dark", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" })] }), _jsx("button", { type: "submit", disabled: loading, className: "h-[52px] w-full rounded-full bg-accent-dark text-base font-semibold text-white transition-transform hover:scale-[1.01] disabled:opacity-60", children: loading ? "Memproses..." : "Daftar gratis" }), _jsx(Link, { to: "/masuk", className: "block text-sm text-accent-dark", children: "Sudah punya akun? Masuk" })] })] })] }), _jsx(AuthPhotoPanel, {})] }));
}
