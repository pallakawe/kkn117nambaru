import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
    return (
        <main className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
            {/* Split Background Images */}
            <div className="absolute inset-0 flex flex-col md:flex-row">
                <div
                    className="flex-1 h-1/2 md:h-full bg-cover bg-[center_top_10%] md:bg-contain md:bg-no-repeat md:bg-center bg-white transition-all duration-700"
                    style={{ backgroundImage: "url('/team-black.jpg')" }}
                />
                <div
                    className="flex-1 h-1/2 md:h-full bg-cover bg-[center_top_10%] md:bg-contain md:bg-no-repeat md:bg-center bg-white transition-all duration-700"
                    style={{ backgroundImage: "url('/team-blue.jpg')" }}
                />
            </div>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-black/30 to-primary/20 backdrop-blur-[1px]" />

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
