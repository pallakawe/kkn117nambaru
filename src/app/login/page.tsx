import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
    return (
        <main className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-white">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-3xl animate-pulse" />

            <div className="w-full max-w-md z-10">
                <div className="flex flex-col items-center mb-8 space-y-2">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg rotate-3 transform transition-transform hover:rotate-0">
                        <img src="/logo kkn.png" alt="Logo KKN 117" className="w-full h-full object-cover" />
                    </div>
                    <h1 className="text-2xl font-bold font-outfit text-slate-800 tracking-tight">Sistem Logbook Harian KKN 117 Nambaru</h1>
                </div>

                <LoginForm />

                <p className="mt-8 text-center text-xs text-slate-400 font-medium uppercase tracking-widest">
                    KULIAH KERJA NYATA • ANGKATAN 117 Nambaru • SISFOR x GIZI
                </p>
            </div>
        </main>
    );
}
