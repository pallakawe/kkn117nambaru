export const DIVISIONS = [
    "Koordinator Desa",
    "Sekretaris",
    "Bendahara",
    "Hubungan Masyarakat",
    "Publikasi, Dokumentasi & Desain",
] as const;

export type Division = (typeof DIVISIONS)[number];

export const PICS_BY_DIVISION: Record<Division, string[]> = {
    "Koordinator Desa": ["Moh. Hafiz"],
    "Sekretaris": ["Moh. Rasyid Siddiq", "Andi Aulia Kardi"],
    "Bendahara": ["Nur Reski Adelia Ananta"],
    "Hubungan Masyarakat": ["Yuda Ramanda Putra", "Andika Putra"],
    "Publikasi, Dokumentasi & Desain": ["Dilla Ambarwati Rahmaniar Asrif", "Nabila Annhifa Kadir"],
};

export const VERIFICATION_STATUS = [
    "Terverifikasi",
    "Perlu Revisi",
    "Belum Diverifikasi",
] as const;

export type VerificationStatus = (typeof VERIFICATION_STATUS)[number];
