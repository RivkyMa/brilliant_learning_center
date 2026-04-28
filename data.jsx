/* global React */
const { useState, useEffect, useRef } = React;

/* ============ DATA ============ */
const TEAM_MGMT = [
  { name: 'Nanda Ivana Shinta, S.Pd., Gr., M.M.', role: 'Manajer SDM', img: 'assets/img/nanda.jpg' },
  { name: 'Desty Triana Muti, S.Kom.', role: 'Staf Pelayanan Siswa', placeholder: 'DT', img: 'assets/img/desti.png' },
  { name: 'Farizany Noor Al Ghifari, S.Kom.', role: 'Staf Marketing', placeholder: 'FN', img: 'assets/img/fariz.png' },
  { name: 'Taufa Salsabila Balqis, S.E., MDS.', role: 'Staf Penjadwalan', img: 'assets/img/taufa.jpg' },
  // { name: 'Rivky Muhamad Azhar', role: 'Staf IT', placeholder: 'RMA' }
];
  // untuk menambahkan image/foto tinggal nambahin ini img: 'assets/img/nama foto.jenis foto (png/jpg/jpeg)'
  // kalo mau nambahin dari univ mana tinggal nambahin , uni: 'asal univ'
const TEAM_TEACHERS = {
  Matematika: [
    { name: 'Gina Utami, S.Pd.', role: 'Guru Matematika',  placeholder: 'GU', img:'assets/img/gina.png' },
    { name: 'Dini Agustin, S.Pd.', role: 'Guru Matematika',  placeholder: 'DA', img:'assets/foto/dini.jpg' },
    { name: 'Hanifah Nabiyur Rahmah, S.Pd.', role: 'Guru Matematika',  placeholder: 'HS', img:'assets/foto/hanifah.png' },
    { name: 'Farisky Adhitama Kasnury, S.Pd. ', role: 'Guru Matematika',  placeholder: 'FA', img:'assets/foto/farisky.png' },
    { name: 'Nanda Farinta, S.Pd.', role: 'Guru Matematika', placeholder: 'HH', img:'assets/foto/nandaf.png' },
    { name: 'Ambar Siti Khodijah, S.Pd.', role: 'Guru Matematika', placeholder: 'AS', img:'assets/foto/ambar.png' },
    { name: 'Rima Rahayu, S.Pd.', role: 'Guru Matematika', uni: 'Institut Teknologi Bandung', placeholder: 'RR', img:'assets/foto/rima.png' },
    { name: 'Rekha Chantya Noviana, S.T.', role: 'Guru Matematika', uni: 'Institut Teknologi Kalimantan', placeholder: 'RC', img:'assets/foto/rekha.png' },
    { name: 'Shafa Afina Gayanti, S.Pd.', role: 'Guru Matematika', uni: 'Universitas Langlangbuana', placeholder: 'RA', img:'assets/foto/shafa.png' }
  ],

  Fisika: [
    { name: 'Nanda Ivana Shinta, S.Pd., M.M.', role: 'Guru Fisika',  img: 'assets/img/nanda.jpg' },
    { name: 'Lenka Maula Aziza, S.Pd.', role: 'Guru Fisika',  img: 'assets/foto/lenka.png' },
    { name: 'Isna Nur Fadilah, S.Si.', role: 'Guru Fisika',  placeholder: 'IN', img: 'assets/foto/isna.png' },
    { name: 'Winti Setiawati, S.Pd.', role: 'Guru Fisika',  placeholder: 'WS', img: 'assets/foto/winti.png' },
  ],
  Kimia: [
    { name: 'Astri Gustriana, S.Pd., M.Pd.', role: 'Guru Kimia', placeholder: 'AG', img: 'assets/foto/astri.png' },
  ],
  Biologi: [
    { name: 'Desi Nur Azizah, S.Pd.', role: 'Guru Biologi',  placeholder: 'DS', img: 'assets/foto/desi.png' },
    { name: 'Hasna Wahdini, S.Pd.', role: 'Guru Biologi',  placeholder: 'HW', img: 'assets/foto/hasna.png' },
  ],
  Lainnya: [
    { name: 'Aisyah Nur Islamiyah, S.Pd.', role: 'Guru Bahasa Indonesia',  placeholder: 'AN', img: 'assets/foto/aisyah.png' },
    { name: 'Aldi Halim, S.Pd.', role: 'Guru Bahasa Inggris',  placeholder: 'AH', img: 'assets/foto/aldi.png' },
    { name: 'Aulia Putri Tanzihah, S.Pd.', role: 'Pengajar SD',  placeholder: 'AP', img: 'assets/foto/aulia.png' },
    { name: 'Kayla Allegra Riadi, S.S.', role: 'Bahasa Inggris',  placeholder: 'KA', img: 'assets/foto/kayla.png' },
  ],
};

const ACHIEVEMENTS = [
  { abbr: 'ITB', name: 'Institut Teknologi Bandung', logo: 'assets/img/itb-removebg-preview.png' },
  { abbr: 'UNP', name: 'Universitas Padjadjaran', logo: 'assets/img/unpad-removebg-preview.png' },
  { abbr: 'UI',  name: 'Universitas Indonesia', logo: 'assets/img/ui-removebg-preview.png' },
  { abbr: 'UPI', name: 'Universitas Pendidikan Indonesia', logo: 'assets/img//upi1.png' },
  { abbr: 'IPB', name: 'Institut Pertanian Bogor', logo: 'assets/img/ipb-removebg-preview.png' },
  { abbr: 'POL', name: 'Politeknik Negeri Bandung', logo:'assets/img/polban-removebg-preview.png' },
  { abbr: 'PMB', name: 'Politeknik Manufaktur Bandung', logo: 'assets/img/polman-removebg-preview.png' },
  { abbr: 'SGD', name: 'UIN Sunan Gunung Djati', logo: 'assets/img/uin-removebg-preview.png' },
  { abbr: 'PKB', name: 'Politeknik Kesehatan Bandung', logo: 'assets/img/poltekes-removebg-preview.png' },
  { abbr: 'UNU', name: 'Universitas Udayana', logo: 'assets/img/unud-removebg-preview.png' },
  { abbr: 'UB',  name: 'Universitas Brawijaya', logo: 'assets/img/ub-removebg-preview.png' },
  { abbr: 'UNI', name: 'Universitas Bengkulu', logo:'assets/img/bengkulu-removebg-preview.png' },
  { abbr: 'NHI', name: 'Politeknik Pariwisata NHI', logo:'assets/img/Logo_NHI_Bandung-removebg-preview.png' },
  { abbr: 'UJS', name: 'Universitas Jenderal Soedirman', logo:'assets/img/Logo-Resmi-Unsoed-removebg-preview.png' },
  { abbr: 'STAN', name: 'Sekolah Tinggi Akuntansi Negara', logo:'assets/img/STAN_logo-removebg-preview.png'  },
  { abbr: 'POLRI', name: 'Kepolisian Republik Indonesia', logo:'assets/img/polri.png' },
  { abbr: 'TNI', name: 'Tentara Nasional Indonesia', logo:'assets/img/tni.webp' },
  { abbr: 'NU', name: 'Nantong University', logo:'assets/img/nantong-removebg-preview.png' },
  { abbr: 'SU', name: 'Shenzhen University', logo:'assets/img/shenzen-removebg-preview.png' },
  { abbr: 'IMI', name: 'International Management Institute Switzerland', logo:'assets/img/imi-removebg-preview.png' },
];

const TESTIMONIALS = [
  {
    image: 'assets/testimoni/testi1.png',
    alt: 'Testimoni Pramudita Pramesty',
  },
  {
    image: 'assets/testimoni/testi2.png',
    alt: 'Testimoni Alumni BLC 2',
  },
  {
    image: 'assets/testimoni/testi3.png',
    alt: 'Testimoni Alumni BLC 3',
  },
  {
    image: 'assets/testimoni/testi4.png',
    alt: 'Testimoni Alumni BLC 4',
  },
];

const FAQS = [
  { q: 'Berapa biaya bimbingan di Brilliant Learning Center?', a: 'Biaya program bervariasi tergantung jenjang (SD, SMP, SMA, Persiapan PTN) dan format yang dipilih (Reguler atau Private). Hubungi kami via WhatsApp untuk informasi paket terbaru dan promo pendaftaran.' },
  { q: 'Apakah ada kelas trial sebelum mendaftar?', a: 'Ya, kami menyediakan 1 sesi free trial untuk siswa baru agar dapat merasakan langsung suasana belajar di BLC sebelum berkomitmen mengikuti program penuh.' },
  { q: 'Bagaimana cara memilih antara Kelas Reguler dan Private?', a: 'Kelas Reguler ideal untuk siswa yang menikmati diskusi kelompok kecil (10-15 siswa), sementara Kelas Private cocok untuk siswa yang membutuhkan kurikulum personal dan kecepatan materi yang fleksibel.' },
  { q: 'Apa saja program yang tersedia untuk persiapan masuk PTN?', a: 'Kami menyediakan persiapan TKA, SNBT-UTBK, Ujian Mandiri, Ujian Kedinasan, hingga PSTS dan PSAS dengan tutor yang berpengalaman membantu siswa lolos PTN favorit.' },
  { q: 'Di mana lokasi Brilliant Learning Center?', a: 'Kami berlokasi di Jl. Cicukang No. 9 RT 04 RW 01, Mekarrahayu, Margaasih, Kabupaten Bandung. Mudah dijangkau dengan kendaraan pribadi maupun umum.' },
  { q: 'Apakah ada program konsultasi tugas akhir?', a: 'Ya, Program Umum kami mencakup konsultasi Perkuliahan, Skripsi, Jurnal, Tesis, dan Disertasi untuk mahasiswa.' },
];

const BLOG_POSTS = [
  {
    cat: 'Tips Belajar',
    date: '12 Apr 2026',
    title: '5 Strategi Efektif Hadapi UTBK SNBT 2026',
    excerpt:
      'Mendekati UTBK, persiapan mental dan strategi pengerjaan soal sama pentingnya dengan penguasaan materi…',
    image: 'assets/img/artikel1.png',
  },
  {
    cat: 'Prestasi',
    date: '02 Apr 2026',
    title: 'Alumni BLC Kembali Lolos PTN Favorit Tahun Ini',
    excerpt:
      'Lebih dari 90% siswa BLC angkatan 2025 berhasil lolos ke PTN pilihan, mulai dari ITB, UI, UPI, hingga Unpad…',
    image: 'assets/img/artikel2.png',
  },
  {
    cat: 'Edukasi',
    date: '21 Mar 2026',
    title: 'Mengenal Tipe Belajar Anak: Visual, Auditori, atau Kinestetik?',
    excerpt:
      'Setiap anak punya gaya belajar yang berbeda. Mengenali tipe belajar membantu orang tua memilih metode bimbel yang tepat…',
    image: 'assets/img/artikel3.png',
  },
];

window.BLC_DATA = { TEAM_MGMT, TEAM_TEACHERS, ACHIEVEMENTS, TESTIMONIALS, FAQS, BLOG_POSTS };
