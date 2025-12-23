"use client";

import { useRouter } from "next/navigation";

export default function InformasiPage() {
  const router = useRouter();

  const COLORS = {
    bg: "#F4F7F2",
    text: "#2F4F3A",
    title: "#2F4F3A",
    cardBg: "#FFFFFF",
  };

  const FONT = {
    fontFamily: "Segoe UI, Arial, sans-serif",
  };

  const dataJerawat = [
    {
      img: "/papulaacne.jpg",
      title: "Jerawat Papula",
      desc: "Papula adalah benjolan kecil berwarna merah tanpa nanah dan terasa nyeri saat disentuh.",
    },
    {
      img: "/jerawat_pustula.jpeg",
      title: "Jerawat Pustula",
      desc: "Pustula memiliki kepala putih/kuning berisi nanah akibat peradangan.",
    },
    {
      img: "/kistikacne.jpg",
      title: "Jerawat Kistik",
      desc: "Jerawat besar dan dalam yang penuh nanah, biasanya meninggalkan bekas.",
    },
    {
      img: "/nodulacne.jpeg",
      title: "Jerawat Nodul",
      desc: "Benjolan keras dan dalam tanpa nanah, terasa sakit dan sulit hilang.",
    },
    {
      img: "/komedoacne.jpg",
      title: "Komedo",
      desc: "Pori yang tersumbat oleh minyak dan sel kulit mati, bisa hitam atau putih.",
    },
    {
      img: "/fungal acne.jpg",
      title: "Jerawat Jamur (Fungal Acne)",
      desc: "Bruntusan meradang akibat pertumbuhan jamur Malassezia, muncul berupa bintik kecil seragam dan gatal.",
    },
  ];

  return (
    <main
      className="min-h-screen p-6 relative"
      style={{ backgroundColor: COLORS.bg, ...FONT }}
    >
      {/* === TOMBOL BACK BULAT === */}
<button
  onClick={() => router.back()}
  className="
    fixed top-65 left-6 z-50
    w-10 h-10 rounded-full
    flex items-center justify-center
    bg-white text-[#2F4F3A]
    shadow-md
    transition-all duration-200 ease-out
    hover:scale-105
    hover:shadow-lg
    hover:bg-[#E6F9E6]
    active:scale-95
    group
  "
  aria-label="Kembali"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="transition-transform duration-200 group-hover:-translate-x-0.5"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
</button>

      <h1
        className="text-3xl font-bold text-center mb-3"
        style={{ color: COLORS.title }}
      >
        Ayo Mengenal Jenis-Jenis Jerawat
      </h1>

      <p
        className="text-center max-w-2xl mx-auto mb-10"
        style={{ color: COLORS.text }}
      >
        Pelajari berbagai jenis jerawat agar kamu bisa lebih mudah menentukan
        perawatan yang tepat sesuai kondisi kulitmu.
      </p>

      <div className="max-w-5xl mx-auto space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {dataJerawat.slice(0, 2).map((item, index) => (
            <Card key={index} item={item} COLORS={COLORS} />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {dataJerawat.slice(2, 4).map((item, index) => (
            <Card key={index} item={item} COLORS={COLORS} />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {dataJerawat.slice(4, 6).map((item, index) => (
            <Card key={index} item={item} COLORS={COLORS} />
          ))}
        </div>
      </div>

      {/* === TOMBOL LANJUT ANALISIS === */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => router.push("/analisis")}
          className="px-12 py-4 rounded-full font-semibold shadow-lg transition active:scale-95"
          style={{
            backgroundColor: COLORS.title,
            color: "white",
          }}
        >
          Lanjut Analisis
        </button>
      </div>
    </main>
  );
}

function Card({ item, COLORS }) {
  return (
    <div
      className="p-4 rounded-2xl shadow-md"
      style={{ backgroundColor: COLORS.cardBg }}
    >
      <img
        src={item.img}
        alt={item.title}
        className="w-full h-40 object-cover rounded-xl mb-3"
      />
      <h2 className="text-xl font-semibold" style={{ color: COLORS.title }}>
        {item.title}
      </h2>
      <p className="text-sm mt-1" style={{ color: COLORS.text }}>
        {item.desc}
      </p>
    </div>
  );
}
