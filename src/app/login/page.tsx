import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
    return (
        <main className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
            {/* Split Background Images */}
            <div className="absolute inset-0 flex">
                <div
                    className="w-1/2 h-full bg-contain bg-no-repeat bg-center bg-white transition-all duration-700 hover:opacity-90"
                    style={{ backgroundImage: "url('/team-black.jpg')" }}
                />
                <div
                    className="w-1/2 h-full bg-contain bg-no-repeat bg-center bg-white transition-all duration-700 hover:opacity-90"
                    style={{ backgroundImage: "url('/team-blue.jpg')" }}
                />
            </div>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-black/50 to-primary/40 backdrop-blur-[2px]" />

            <div className="w-full max-w-md z-10 py-10">
                <div className="flex flex-col items-center mb-6 space-y-3">
                    <div className="w-20 h-20 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/50 rotate-3 transform transition-transform hover:rotate-0 bg-white/20 backdrop-blur-sm p-1">
                        <img src="/logo kkn.png" alt="Logo KKN 117" className="w-full h-full object-contain" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold font-outfit text-white tracking-tight drop-shadow-lg">Posko KKN 117 Nambaru</h1>
                        <p className="text-white/80 text-xs font-medium uppercase tracking-[0.2em] mt-1 drop-shadow-md">Sistem Logbook Harian</p>
                    </div>
                </div>

                <div className="animate-in fade-in zoom-in-95 duration-500">
                    <LoginForm />
                </div>

                <p className="mt-8 text-center text-[10px] text-white/60 font-medium uppercase tracking-[0.3em] drop-shadow-md">
                    KKN ANGKATAN 117 • SISFOR x GIZI
                </p>
            </div>
        </main>
    );
}
