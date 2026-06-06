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

const GALLERY_ITEMS = [
  {
    label: 'Suasana Kelas Reguler',
    image: 'assets/img/kelasreg.jfif',
  },
  {
    label: 'Suasana Kelas Regular',
    image: 'assets/img/kelas.png',
  },
  {
    label: 'Suasana Kelas Reguler',
    image: 'assets/img/bg2.jpg',
  },
  {
    label: 'Diskusi Kelompok',
    image: 'assets/img/kelas2.png',
  },
  {
    label: 'kelas private',
    image: 'assets/img/private.jpeg',
  },
  {
    label: 'Workshop Persiapan PTN',
    image: 'assets/img/workshop1.jpg',
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
    readTime: '5 menit baca',
    title: '5 Strategi Efektif Hadapi UTBK SNBT 2026',
    excerpt:
      'Mendekati UTBK, persiapan mental dan strategi pengerjaan soal sama pentingnya dengan penguasaan materi…',
    image: 'assets/img/artikel1.png',
    content: [
      {
        heading: 'Mulai dari peta kemampuan',
        body: 'Sebelum menambah jam belajar, siswa perlu tahu dulu bagian mana yang sudah kuat dan bagian mana yang masih sering membuat nilai turun. Gunakan hasil try out, catatan kesalahan, dan evaluasi guru untuk membuat prioritas materi.',
      },
      {
        heading: 'Latihan soal dengan batas waktu',
        body: 'UTBK bukan hanya tentang bisa menjawab soal, tetapi juga mampu menjaga ritme. Biasakan mengerjakan paket soal dengan timer agar siswa belajar memilih soal yang harus dikerjakan dulu dan soal yang lebih baik dilewati sementara.',
      },
      {
        heading: 'Bangun rutinitas review',
        body: 'Review singkat setiap hari lebih efektif dibanding belajar banyak sekaligus menjelang ujian. Sisihkan waktu 20-30 menit untuk mengulang rumus, konsep, dan tipe soal yang sebelumnya keliru.',
      },
      {
        heading: 'Jaga kondisi mental dan fisik',
        body: 'Tidur cukup, makan teratur, dan jeda istirahat punya pengaruh besar terhadap konsentrasi. Di BLC, siswa juga dibantu membangun rasa percaya diri agar persiapan terasa lebih terarah dan tidak membuat panik.',
      },
    ],
    takeaway: 'Kunci persiapan UTBK adalah konsisten, terukur, dan berani mengevaluasi kesalahan sejak awal.',
  },
  {
    cat: 'Prestasi',
    date: '02 Apr 2026',
    readTime: '4 menit baca',
    title: 'Alumni BLC Kembali Lolos PTN Favorit Tahun Ini',
    excerpt:
      'Lebih dari 90% siswa BLC angkatan 2025 berhasil lolos ke PTN pilihan, mulai dari ITB, UI, UPI, hingga Unpad…',
    image: 'assets/img/artikel2.png',
    content: [
      {
        heading: 'Perjalanan yang dibangun bertahap',
        body: 'Keberhasilan alumni BLC tidak datang dalam satu malam. Mereka melewati proses belajar rutin, try out berkala, evaluasi nilai, dan diskusi personal untuk menentukan strategi masuk kampus impian.',
      },
      {
        heading: 'Pendampingan sesuai target jurusan',
        body: 'Setiap siswa punya tujuan yang berbeda. Ada yang mengejar teknik, kedokteran, pendidikan, sosial humaniora, hingga sekolah kedinasan. Karena itu, mentor BLC membantu siswa memilih fokus materi yang sesuai dengan target masing-masing.',
      },
      {
        heading: 'Kolaborasi siswa, mentor, dan orang tua',
        body: 'Hasil terbaik biasanya lahir dari komunikasi yang rapi. Orang tua mendapat gambaran perkembangan, mentor memberi arahan belajar, dan siswa belajar mengambil tanggung jawab terhadap targetnya sendiri.',
      },
      {
        heading: 'Prestasi sebagai motivasi angkatan berikutnya',
        body: 'Cerita alumni menjadi bukti bahwa target besar bisa dicapai dengan proses yang terarah. BLC terus menjaga budaya belajar yang suportif agar siswa baru punya contoh nyata untuk dituju.',
      },
    ],
    takeaway: 'Prestasi alumni adalah hasil dari proses panjang yang konsisten, bukan sekadar keberuntungan saat ujian.',
  },
  {
    cat: 'Edukasi',
    date: '21 Mar 2026',
    readTime: '6 menit baca',
    title: 'Mengenal Tipe Belajar Anak: Visual, Auditori, atau Kinestetik?',
    excerpt:
      'Setiap anak punya gaya belajar yang berbeda. Mengenali tipe belajar membantu orang tua memilih metode bimbel yang tepat…',
    image: 'assets/img/artikel3.png',
    content: [
      {
        heading: 'Anak visual lebih mudah memahami gambar',
        body: 'Anak dengan kecenderungan visual biasanya terbantu oleh diagram, warna, mind map, tabel, dan contoh tertulis. Materi yang abstrak akan lebih mudah dipahami jika dibuat menjadi bentuk yang bisa dilihat.',
      },
      {
        heading: 'Anak auditori kuat lewat penjelasan',
        body: 'Tipe auditori sering lebih cepat menangkap materi ketika mendengar penjelasan guru, berdiskusi, atau mengulang materi dengan suara. Mereka cocok diberi kesempatan bertanya dan menjelaskan ulang konsep.',
      },
      {
        heading: 'Anak kinestetik belajar lewat praktik',
        body: 'Anak kinestetik membutuhkan aktivitas yang melibatkan gerak, eksperimen, simulasi, atau latihan langsung. Mereka biasanya lebih fokus saat pembelajaran tidak hanya duduk dan mendengar.',
      },
      {
        heading: 'Gaya belajar bisa dikombinasikan',
        body: 'Sebagian besar anak tidak hanya punya satu gaya belajar. Pendekatan terbaik adalah menggabungkan visual, penjelasan, dan praktik sesuai kebutuhan materi. Mentor BLC membantu membaca pola ini agar siswa belajar dengan cara yang lebih nyaman.',
      },
    ],
    takeaway: 'Mengenali gaya belajar anak membantu orang tua dan mentor memilih pendekatan yang lebih tepat, sabar, dan efektif.',
  },
];

window.BLC_DATA = { TEAM_MGMT, TEAM_TEACHERS, ACHIEVEMENTS, TESTIMONIALS, GALLERY_ITEMS, FAQS, BLOG_POSTS };
