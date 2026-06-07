/* global React, BLC_DATA */
const { useState: useStateH, useEffect: useEffectH, useRef: useRefH } = React;

/* ============ HEADER ============ */
function Header({ onNavClick, onRegister, onHome, page }) {
  const [scrolled, setScrolled] = useStateH(false);
  const [menuOpen, setMenuOpen] = useStateH(false);
  const [active, setActive] = useStateH('hero');
  useEffectH(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      const sections = ['hero','about','services','team','achievement','testimonials','blog','contact'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.top <= 120 && r.bottom >= 120) { setActive(id); break; }
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [page]);

  const links = [
    ['hero','Beranda'],['about','Tentang'],['services','Program'],
    ['team','Tim'],['achievement','Prestasi'],['blog','Berita'],['contact','Kontak']
  ];

  return (
    <header className={'header' + (scrolled ? ' scrolled' : '')}>
      <div className="topbar">
        <div className="container row">
          <div className="info">
            <span><i className="bi bi-envelope"></i> bimbelbrilliantlearningcenter@gmail.com</span>
            <span><i className="bi bi-telephone"></i> +62 812-2142-0400</span>
          </div>
          <div className="socials">
            <a href="https://www.instagram.com/brilliant_blc/" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
            <a href="https://www.youtube.com/@brilliantlearningcenter3346" aria-label="YouTube"><i className="bi bi-youtube"></i></a>
            <a href="#" aria-label="TikTok"><i className="bi bi-tiktok"></i></a>
          </div>
        </div>
      </div>
      <div className="container row">
        <a className="brand" href="#" onClick={(e)=>{e.preventDefault(); onHome();}}>
          <img src="assets/img/logoblc.png" alt="BLC"/>
          <div className="brand-text">
            <div className="name">Brilliant Learning Center</div>
            <div className="tag">Learn Easy, Achieve More</div>
          </div>
        </a>
        <nav className={'nav' + (menuOpen ? ' open' : '')}>
          {links.map(([id,label]) => (
            <a key={id} href={'#'+id}
               className={page==='home' && active===id ? 'active' : ''}
               onClick={(e)=>{e.preventDefault(); setMenuOpen(false); onNavClick(id);}}>
              {label}
            </a>
          ))}
          <button className="btn btn-accent cta" onClick={()=>{setMenuOpen(false); onRegister();}}>
            Daftar Sekarang <i className="bi bi-arrow-right"></i>
          </button>
        </nav>
        <button
          className="btn btn-ghost menu-toggle"
          onClick={()=>setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          aria-expanded={menuOpen}
        >
          <span className="menu-fallback" aria-hidden="true">{menuOpen ? '\u00d7' : '\u2630'}</span>
          <i className={'bi ' + (menuOpen ? 'bi-x-lg' : 'bi-list')}></i>
        </button>
      </div>
    </header>
  );
}

/* ============ HERO ============ */
function Hero({ layout = 'full', tone, onRegister }) {
  const headline = tone === 'casual'
    ? <>Yuk, Belajar <span className="accent">Bareng BLC</span> — Biar Lebih Pinter & Pede!</>
    : <>Wujudkan Prestasi Akademik Bersama <span className="accent">Brilliant Learning Center</span></>;
  const lead = tone === 'casual'
    ? 'Bimbel asik dengan kakak mentor yang sabar & seru. Dari SD sampai persiapan masuk PTN — kita temenin bareng-bareng sampai goal kamu tercapai.'
    : 'Lembaga bimbingan belajar nonformal yang telah meluluskan ratusan siswa ke sekolah favorit dan PTN ternama sejak 2013. Melalui pendekatan individu dan pengajar yang ramah, BLC selalu mengutamakan kedekatan emosional dengan setiap siswanya. Kami memastikan sesi belajar berjalan santai dan menyenangkan, membuat siswa merasa nyaman berproses tanpa terbebani dalam meraih mimpi mereka.';

  const heroStats = [
    { icon: 'bi-award-fill', num: '13 Tahun', label: 'Pengalaman', sub: 'Sejak 2013' },
    { icon: 'bi-mortarboard-fill', num: 'Ratusan', label: 'Alumni Berprestasi', sub: 'Diterima di PTN Favorit' },
    { icon: 'bi-people-fill', num: 'Pengajar', label: 'Profesional, Ramah & Peduli', sub: 'Berpengalaman & Ramah' },
    { icon: 'bi-book-fill', num: 'Program Lengkap', label: 'SD, SMP, SMA, Alumni', sub: 'Kurikulum Terstruktur' },
    { icon: 'bi-trophy-fill', num: 'Fokus Hasil', label: '& Karakter', sub: 'Belajar Santai, Prestasi Nyata' },
  ];

  return (
    <section id="hero" className={'hero layout-' + layout}>
      <div className="hero-bg-pattern"></div>
      <div className="container hero-grid">
        <div className="hero-text">
          <div className="eyebrow"><span className="dot"></span> Sejak 2013 · Yayasan Pendidikan Brilliant Learning Center</div>
          <h1>{headline}</h1>
          <p className="lead">{lead}</p>
          <div className="hero-cta-row">
            <button className="btn btn-accent" onClick={onRegister}>
              Daftar Siswa Baru <i className="bi bi-arrow-right"></i>
            </button>
            <a className="btn btn-light" href="#services">
              Lihat Program <i className="bi bi-grid"></i>
            </a>
          </div>
          <div className="hero-stats" aria-label="Keunggulan Brilliant Learning Center">
            {heroStats.map((item, index) => (
              <div className="item" key={index}>
                <div className="stat-icon"><i className={'bi ' + item.icon}></i></div>
                <div className="stat-copy">
                  <div className="num">{item.num}</div>
                  <div className="label">{item.label}</div>
                  <div className="sub">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ ABOUT ============ */
function About({ tone }) {
  const intro = tone === 'casual'
    ? 'BLC bukan bimbel biasa — kita lebih kaya keluarga kedua buat siswa. Dari 2013, kita udah temenin ribuan adik-adik wujudin mimpi akademiknya.'
    : 'Brilliant Learning Center (BLC) adalah lembaga pendidikan nonformal resmi di bawah Yayasan Pendidikan Brilliant Learning Center, berdiri atas komitmen kuat untuk menjadi mitra terdepan bagi siswa dalam meraih sukses akademik.';

  return (
    <section id="about" className="about">
      <div className="container about-grid">
        <div className="about-visual">
          <div className="img-main" style={{backgroundImage:'url(assets/img/sukiman.png)'}}></div>
          <div className="accent-shape"></div>
          <div className="credit-card">
            <div className="num">13</div>
            <div className="txt"><strong>Tahun</strong><br/>Mendampingi siswa raih prestasi terbaik</div>
          </div>
        </div>
        <div className="about-text">
          <span className="kicker">Tentang Kami</span>
          <h2>Welcome to Brilliant Learning Center</h2>
          <p>{intro}</p>
          <p>Berdiri sejak <strong>27 Oktober 2013</strong>, BLC hadir sebagai respon kebutuhan masyarakat akan lembaga bimbingan belajar berkualitas. Beroperasi mandiri di Jalan Cicukang dengan jumlah siswa berkembang lebih dari 100% setiap tahun, mencakup jenjang SD, SMP, hingga SMA.</p>
          <div className="about-features">
            <div className="feat">
              <div className="ico"><i className="bi bi-people-fill"></i></div>
              <div><div className="ttl">Mentor Berdedikasi</div><div className="desc">Lulusan PTN top dengan metode pengajaran teruji</div></div>
            </div>
            <div className="feat">
              <div className="ico"><i className="bi bi-journal-bookmark-fill"></i></div>
              <div><div className="ttl">Kurikulum Selaras</div><div className="desc">Materi sesuai kebutuhan sekolah dan ujian nasional</div></div>
            </div>
            <div className="feat">
              <div className="ico"><i className="bi bi-graph-up-arrow"></i></div>
              <div><div className="ttl">Hasil Terukur</div><div className="desc">Evaluasi rutin & tracking prestasi siswa</div></div>
            </div>
            <div className="feat">
              <div className="ico"><i className="bi bi-heart-fill"></i></div>
              <div><div className="ttl">Suasana Kekeluargaan</div><div className="desc">Lingkungan belajar nyaman seperti keluarga kedua</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ STATS BAND (animated counter) ============ */
function StatsBand() {
  const ref = useRefH(null);
  const [vis, setVis] = useStateH(false);
  useEffectH(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: .3 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const stats = [
    { val: 500, suffix: '+', label: 'Siswa Yang Telah Bergabung' },
    { val: 90, suffix: '%+', label: 'Lolos Perguruan Tinggi Pilihan' },
    { val: 50, suffix: '+', label: 'Pengajar Profesional' },
    { val: 13, suffix: '+', label: 'Tahun Pengalaman' },
  ];
  return (
    <div className="stats-band" ref={ref}>
      <div className="container stats-grid">
        {stats.map((s,i) => <Counter key={i} {...s} active={vis}/>)}
      </div>
    </div>
  );
}
function Counter({ val, suffix, label, active }) {
  const [n, setN] = useStateH(0);
  useEffectH(() => {
    if (!active) return;
    const dur = 1600; const start = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.floor(val * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setN(val);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, val]);
  return (
    <div className="item">
      <div className="num">{n.toLocaleString('id-ID')}{suffix}</div>
      <div className="label">{label}</div>
    </div>
  );
}

/* ============ VISION & MISSION ============ */
function VisionMission() {
  return (
    <section id="vision">
      <div className="container">
        <div className="sec-head">
          <span className="kicker">Visi & Misi</span>
          <h2>Arah & Komitmen Kami</h2>
          <p>Menjadi lembaga pendidikan nonformal yang dipercaya masyarakat dalam mencetak generasi unggul.</p>
        </div>
        <div className="vm-grid">
          <div className="vm-card vision">
            <div className="ico"><i className="bi bi-eye-fill"></i></div>
            <h3>Visi Kami</h3>
            <p>Menjadi lembaga pendidikan nonformal yang terpercaya dan dibutuhkan masyarakat dalam memberikan layanan bimbingan belajar berkualitas untuk meningkatkan prestasi akademik siswa di sekolah.</p>
          </div>
          <div className="vm-card mission">
            <div className="ico"><i className="bi bi-bullseye"></i></div>
            <h3>Misi Kami</h3>
            <ul>
              <li>Memberikan layanan bimbingan belajar yang berkualitas guna meningkatkan prestasi akademik siswa.</li>
              <li>Menggali dan meningkatkan potensi akademik siswa untuk mencapai prestasi terbaik.</li>
              <li>Meningkatkan profesionalisme manajemen, SDM, serta pengajar akademik berkualitas.</li>
              <li>Menjadi mitra kerja lembaga pendidikan lain dalam mengembangkan layanan jasa pendidikan bermutu.</li>
              <li>Mempererat hubungan dengan siswa dan menjadi sahabat dalam meraih prestasi.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ SERVICES ============ */
function Services({ onRegister }) {
  return (
    <section id="services" className="services">
      <div className="container">
        <div className="sec-head">
          <span className="kicker">Program Kami</span>
          <h2>Pilih Program Sesuai Jenjang & Kebutuhan</h2>
          <p>Dari pendampingan SD hingga persiapan masuk PTN favorit — kurikulum kami terstruktur, terencana, dan terukur.</p>
        </div>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-head">
              <div className="ico"><i className="bi bi-book-fill"></i></div>
              <div><div className="lvl">Jenjang SD</div><h3>Program Tingkat SD</h3></div>
            </div>
            <ul>
              <li>Pendampingan Pembelajaran Numerasi & Literasi</li>
              <li>Persiapan Masuk SMP Unggulan</li>
              <li>Program Intensif Persiapan Ujian Sekolah Kelas 6</li>
              <li>Latihan soal & simulasi ujian</li>
            </ul>
            <div className="service-foot">
              <span className="price">Mulai dari Kelas 1–6</span>
              <a href="#" onClick={(e)=>{e.preventDefault(); onRegister();}}>Daftar →</a>
            </div>
          </div>

          <div className="service-card">
            <div className="service-head">
              <div className="ico"><i className="bi bi-pencil-square"></i></div>
              <div><div className="lvl">Jenjang SMP</div><h3>Program Tingkat SMP</h3></div>
            </div>
            <ul>
              <li>Persiapan Masuk SMA Favorit</li>
              <li>Program Intensif Persiapan Ujian Sekolah</li>
              <li>Pendampingan mata pelajaran utama</li>
              <li>Try Out & evaluasi berkala</li>
            </ul>
            <div className="service-foot">
              <span className="price">Kelas 7–9</span>
              <a href="#" onClick={(e)=>{e.preventDefault(); onRegister();}}>Daftar →</a>
            </div>
          </div>

          <div className="service-card featured">
            <div className="service-head">
              <div className="ico"><i className="bi bi-mortarboard-fill"></i></div>
              <div><div className="lvl">Jenjang SMA · Populer</div><h3>Program Tingkat SMA</h3></div>
            </div>
            <ul>
              <li>Persiapan Masuk PTN Target — Tes TKA</li>
              <li>Persiapan SNBT-UTBK</li>
              <li>Persiapan Ujian Mandiri & Kedinasan</li>
              <li>Persiapan PSTS dan PSAS</li>
            </ul>
            <div className="service-foot">
              <span className="price">Kelas 10–12 + Alumni</span>
              <a href="#" onClick={(e)=>{e.preventDefault(); onRegister();}}>Daftar →</a>
            </div>
          </div>

          <div className="service-card">
            <div className="service-head">
              <div className="ico"><i className="bi bi-chat-dots-fill"></i></div>
              <div><div className="lvl">Mahasiswa</div><h3>Program Umum & Konsultasi</h3></div>
            </div>
            <ul>
              <li>Konsultasi Perkuliahan</li>
              <li>Bimbingan Skripsi & Tesis</li>
              <li>Pendampingan Jurnal & Disertasi</li>
              <li>Sesi 1-on-1 dengan dosen pembimbing</li>
            </ul>
            <div className="service-foot">
              <span className="price">Per sesi / paket</span>
              <a href="#" onClick={(e)=>{e.preventDefault(); onRegister();}}>Daftar →</a>
            </div>
          </div>
        </div>

        <div className="format-row">
          <div className="format-card">
            <div className="tag">Format Belajar</div>
            <h3>Kelas Reguler</h3>
            <ul>
              <li>Memastikan penguasaan konsep inti (kurikulum terencana)</li>
              <li>Kelas kecil maks. 8–10 siswa — kondusif & kaya diskusi</li>
              <li>Fokus pada review materi sekolah dan latihan soal intensif</li>
              <li>Biaya lebih terjangkau, ideal untuk pembelajaran rutin</li>
            </ul>
          </div>
          <div className="format-card private">
            <div className="tag">Format Belajar</div>
            <h3>Kelas Private</h3>
            <ul>
              <li>Fokus 1-on-1 (satu guru, satu siswa)</li>
              <li>Kurikulum dipersonalisasi sepenuhnya sesuai kebutuhan</li>
              <li>Kecepatan dan materi fleksibel — review, pendalaman, atau persiapan ujian</li>
              <li>Penguasaan konsep inti sesuai kebutuhan spesifik siswa</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ TEAM ============ */
function Team({ data = BLC_DATA }) {
  const [tab, setTab] = useStateH('Manajemen');
  const teacherGroups = data.TEAM_TEACHERS || {};
  const subjectOrder = ['Matematika','Fisika','Kimia','Biologi', 'Lainnya'];
  const remoteSubjects = Object.keys(teacherGroups).filter((subject) => !subjectOrder.includes(subject));
  const tabs = ['Manajemen']
    .concat(subjectOrder.filter((subject) => teacherGroups[subject] && teacherGroups[subject].length))
    .concat(remoteSubjects);
  const tabKey = tabs.join('|');
  useEffectH(() => {
    if (!tabs.includes(tab)) setTab(tabs[0] || 'Manajemen');
  }, [tab, tabKey]);
  const list = tab === 'Manajemen' ? (data.TEAM_MGMT || []) : (teacherGroups[tab] || []);

  return (
    <section id="team">
      <div className="container">
        <div className="sec-head">
          <span className="kicker">Tim Kami</span>
          <h2>Mentor & Manajemen Berdedikasi</h2>
          <p>Nilai utama kami adalah <strong>Kekeluargaan</strong> dan <strong>Kerja Sama Tim</strong> — ikatan erat dan kesediaan saling membantu adalah aset terpenting BLC.</p>
        </div>
        <div className="team-tabs">
          {tabs.map(t => (
            <button key={t} className={tab===t ? 'active' : ''} onClick={()=>setTab(t)}>{t}</button>
          ))}
        </div>

        {tab === 'Manajemen' && (
          <div className="member-lead">
            <div className="photo" style={{backgroundImage:'url(assets/img/sukiman.png)'}}></div>
            <div>
              <div className="role">Direktur</div>
              <h3>Dr. (C) Sukiman, S.Tr.Kom., S.Pd., M.Kom., MCE.</h3>
              <p>"Brilliant Learning Center berkomitmen menjadi mitra terpercaya bagi siswa dan orang tua. Kami percaya setiap siswa punya potensi luar biasa — tugas kami adalah menggali, mengasah, dan mengantarkan mereka ke prestasi terbaik."</p>
            </div>
          </div>
        )}

        <div className="team-grid">
          {list.map((m, i) => (
            <div className="member" key={tab + i}>
              <div className="photo" style={m.img ? {backgroundImage:`url(${m.img})`} : {}}>
                {!m.img && <PhotoPlaceholder initials={m.placeholder}/>}
              </div>
              <div className="info">
                <div className="name">{m.name}</div>
                <div className="role">{m.role}</div>
                {m.uni && <div className="uni">{m.uni}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function PhotoPlaceholder({ initials }) {
  return (
    <div style={{
      position:'absolute', inset:0,
      background: 'linear-gradient(135deg, #1B3A8A, #2C50B0)',
      display:'grid', placeItems:'center',
      color:'#fff', fontFamily:"'Plus Jakarta Sans', sans-serif",
      fontWeight:800, fontSize:'34px', letterSpacing:'.05em'
    }}>{initials}</div>
  );
}

/* ============ ACHIEVEMENT ============ */
function Achievement() {
  return (
    <section id="achievement" className="achievement">
      <div className="container">
        <div className="sec-head">
          <span className="kicker">Prestasi BLC</span>
          <h2>Lebih dari 90% Siswa Lolos Perguruan Tinggi Pilihan Tiap Tahun</h2>
          <p>Alumni BLC tersebar di berbagai Perguruan Tinggi ternama dan Sekolah Kedinasan didalam maupun diluar negeri.</p>
        </div>

        <div className="uni-grid">
          {BLC_DATA.ACHIEVEMENTS.map((u, i) => (
            <div className="uni-card" key={i}>
              <div className="seal">
                {u.logo ? (
                  <img src={u.logo} alt={u.name} />
                ) : (
                  u.abbr
                )}
              </div>
              <div className="nm">{u.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ TESTIMONIALS ============ */
function Testimonials({ data = BLC_DATA }) {
  const [page, setPage] = useStateH(0);
  const [paused, setPaused] = useStateH(false);
  const [touchStartX, setTouchStartX] = useStateH(null);
  const testimonials = data.TESTIMONIALS || [];
  const total = testimonials.length;
  const perPage = 3;
  const pages = [];

  for (let i = 0; i < testimonials.length; i += perPage) {
    pages.push(testimonials.slice(i, i + perPage));
  }

  const totalPages = pages.length;

  useEffectH(() => {
    if (paused || totalPages <= 1) return undefined;
    const t = setInterval(() => setPage(p => (p + 1) % totalPages), 5000);
    return () => clearInterval(t);
  }, [paused, totalPages]);

  useEffectH(() => {
    if (page >= totalPages) setPage(0);
  }, [page, totalPages]);

  const next = () => {
    if (!totalPages) return;
    setPage(p => (p + 1) % totalPages);
  };

  const prev = () => {
    if (!totalPages) return;
    setPage(p => (p - 1 + totalPages) % totalPages);
  };

  const handleTouchEnd = (event) => {
    if (touchStartX === null) return;
    const delta = touchStartX - event.changedTouches[0].clientX;
    if (Math.abs(delta) > 42) {
      if (delta > 0) next();
      else prev();
    }
    setTouchStartX(null);
  };

  return (
  <section id="testimonials" className="testimonials">
    <div className="container">
      <div className="sec-head">
        <span className="kicker">Testimoni Alumni</span>
        <h2>Cerita dari Siswa yang Telah Lolos PTN Favorit</h2>
        <p>Pengalaman nyata alumni BLC yang berhasil mewujudkan mimpi akademiknya.</p>
      </div>

      <div
        className="testi-carousel"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)}
        onTouchEnd={handleTouchEnd}
      >
        {totalPages > 1 && (
          <button className="testi-nav prev" onClick={prev} aria-label="Testimoni sebelumnya">
            <i className="bi bi-chevron-left"></i>
          </button>
        )}

        <div className="testi-viewport">
          <div className="testi-track" style={{ transform: `translateX(-${page * 100}%)` }}>
            {pages.map((group, groupIndex) => (
              <div className="testi-slide" key={'testi-page-' + groupIndex}>
                <div className={'testi-slide-grid count-' + group.length}>
                  {group.map((t, i) => {
                    const itemIndex = groupIndex * perPage + i;
                    return (
                      <div className="testi-card testi-image-card" key={t.image + itemIndex}>
                        <img
                          src={t.image}
                          alt={t.alt}
                          className="testi-image"
                          loading={itemIndex < perPage ? 'eager' : 'lazy'}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {!total && (
              <div className="testi-slide">
                <div className="testi-card testi-empty">
                  <p>Belum ada testimoni alumni yang ditampilkan.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {totalPages > 1 && (
          <button className="testi-nav next" onClick={next} aria-label="Testimoni berikutnya">
            <i className="bi bi-chevron-right"></i>
          </button>
        )}
      </div>

      {totalPages > 1 && (
      <div className="slider-dots">
        {pages.map((_, i) => (
          <button
            key={i}
            className={'dot ' + (page === i ? 'active' : '')}
            onClick={() => setPage(i)}
            aria-label={`Tampilkan grup testimoni ${i + 1}`}
          />
        ))}
      </div>
      )}
    </div>
  </section>
);
}

/* ============ GALLERY ============ */
function Gallery({ data = BLC_DATA }) {
  const items = data.GALLERY_ITEMS || [];
  const visibleItems = items.slice(0, 5);
  const galleryHighlights = [
    {
      icon: 'bi-people',
      text: 'Kelas reguler yang kondusif dan interaktif',
    },
    {
      icon: 'bi-person',
      text: 'Pendampingan privat sesuai kebutuhan siswa',
    },
    {
      icon: 'bi-chat-square-dots',
      text: 'Workshop dan diskusi untuk membangun kepercayaan diri',
    },
  ];
  const galleryMeta = [
    {
      icon: 'bi-people',
      subtitle: 'Suasana belajar terarah dan interaktif',
    },
    {
      icon: 'bi-chat-square-dots',
      subtitle: 'Belajar bersama, bertukar ide, menguatkan pemahaman',
    },
    {
      icon: 'bi-person',
      subtitle: 'Pendampingan intensif sesuai kebutuhan siswa',
    },
    {
      icon: 'bi-mortarboard',
      subtitle: 'Persiapan matang untuk masa depan cerah',
    },
    {
      icon: 'bi-star',
      subtitle: 'Aktif, fokus, dan penuh semangat',
    },
  ];
  const getGalleryMeta = (item, index) => {
    if (item.description || item.icon) {
      const fallback = galleryMeta[index % galleryMeta.length];
      return {
        icon: item.icon || fallback.icon,
        subtitle: item.description || fallback.subtitle,
      };
    }

    const label = (item.label || '').toLowerCase();
    if (label.includes('diskusi')) {
      return { icon: 'bi-chat-square-dots', subtitle: 'Belajar bersama, bertukar ide, menguatkan pemahaman' };
    }
    if (label.includes('private') || label.includes('privat')) {
      return { icon: 'bi-person', subtitle: 'Pendampingan intensif sesuai kebutuhan siswa' };
    }
    if (label.includes('workshop') || label.includes('ptn')) {
      return { icon: 'bi-mortarboard', subtitle: 'Persiapan matang untuk masa depan cerah' };
    }
    if (label.includes('aktif')) {
      return { icon: 'bi-star', subtitle: 'Aktif, fokus, dan penuh semangat' };
    }
    return galleryMeta[index % galleryMeta.length];
  };

  return (
    <section id="gallery" className="gallery-showcase-section">
      <div className="container">
        <div className="gallery-showcase">
          <div className="gallery-copy">
            <span className="kicker">Dokumentasi Kegiatan</span>
            <h2>Suasana Belajar di Brilliant Learning Center</h2>
            <p>
              Kami menghadirkan lingkungan belajar yang aktif, nyaman, dan terarah
              melalui kelas reguler, sesi privat, diskusi kelompok, dan workshop
              persiapan PTN.
            </p>

            <div className="gallery-highlight-list">
              {galleryHighlights.map((item) => (
                <div className="gallery-highlight" key={item.text}>
                  <span className="gallery-highlight-icon">
                    <i className={'bi ' + item.icon}></i>
                  </span>
                  <i className="bi bi-check-lg"></i>
                  <strong>{item.text}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="gallery-board">
            {visibleItems.map((it, i) => {
              const meta = getGalleryMeta(it, i);
              return (
                <article className={'gallery-photo-card' + (i === 0 ? ' featured' : '')} key={it.image + i}>
                  <img src={it.image} alt={it.label} loading={i < 2 ? 'eager' : 'lazy'} />
                  <div className="gallery-photo-caption">
                    <span className="gallery-photo-icon">
                      <i className={'bi ' + meta.icon}></i>
                    </span>
                    <div>
                      <h3>{it.label}</h3>
                      <p>{meta.subtitle}</p>
                    </div>
                  </div>
                </article>
              );
            })}

            {!visibleItems.length && (
              <div className="gallery-empty">
                <i className="bi bi-images"></i>
                <p>Belum ada galeri kegiatan.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ BLOG ============ */
function Blog({ data = BLC_DATA }) {
  const [selectedPost, setSelectedPost] = useStateH(null);
  const posts = data.BLOG_POSTS || [];

  useEffectH(() => {
    if (!selectedPost) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setSelectedPost(null);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [selectedPost]);

  const openPost = (post) => setSelectedPost(post);

  return (
    <section id="blog" className="blog">
      <div className="container">
        <div className="sec-head">
          <span className="kicker">Berita & Artikel</span>
          <h2>Tips, Insight & Cerita dari BLC</h2>
          <p>
            Artikel pilihan untuk membantu siswa dan orang tua dalam perjalanan akademik.
          </p>
        </div>

        <div className="blog-grid">
          {posts.map((p, i) => (
            <article
              className="blog-card"
              key={p.title}
              role="button"
              tabIndex={0}
              aria-label={'Baca artikel ' + p.title}
              onClick={() => openPost(p)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  openPost(p);
                }
              }}
            >
              <div className="img">
                {p.image ? (
                  <img src={p.image} alt={p.title} />
                ) : (
                  <div className="placeholder">Artikel BLC</div>
                )}
              </div>

              <div className="body">
                <div className="meta">
                  <span className="cat">{p.cat}</span>
                  <span>
                    <i className="bi bi-calendar3"></i> {p.date}
                  </span>
                </div>
                <h4>{p.title}</h4>
                <p>{p.excerpt}</p>
                <span className="read-more">
                  Baca artikel <i className="bi bi-arrow-right"></i>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {selectedPost && (
        <BlogModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </section>
  );
}

function BlogModal({ post, onClose }) {
  return (
    <div
      className="article-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <article
        className="article-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="article-modal-title"
      >
        <button className="article-close" onClick={onClose} aria-label="Tutup artikel">
          <i className="bi bi-x-lg"></i>
        </button>

        <div className="article-hero">
          {post.image ? (
            <img src={post.image} alt={post.title} />
          ) : (
            <div className="article-hero-placeholder">Artikel BLC</div>
          )}
        </div>

        <div className="article-content">
          <div className="article-meta">
            <span>{post.cat}</span>
            <span><i className="bi bi-calendar3"></i> {post.date}</span>
            {post.readTime && <span><i className="bi bi-clock"></i> {post.readTime}</span>}
          </div>

          <h3 id="article-modal-title">{post.title}</h3>
          <p className="article-lead">{post.excerpt}</p>

          {(post.content || []).map((section, index) => (
            <section className="article-section" key={index}>
              <h4>{section.heading}</h4>
              <p>{section.body}</p>
            </section>
          ))}

          {post.takeaway && (
            <div className="article-takeaway">
              <i className="bi bi-lightbulb"></i>
              <p>{post.takeaway}</p>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

/* ============ FAQ ============ */
function FAQ() {
  const [open, setOpen] = useStateH(0);
  return (
    <section id="faq">
      <div className="container faq-grid">
        <div className="faq-side">
          <span className="kicker">Pertanyaan Umum</span>
          <h2>Yang Sering Ditanyakan</h2>
          <p>Belum menemukan jawaban? Hubungi kami via WhatsApp dan tim Customer Service akan membantu.</p>
          <a className="btn btn-primary" href="https://wa.me/6281221420400" target="_blank" rel="noreferrer">
            <i className="bi bi-whatsapp"></i> Chat WhatsApp
          </a>
        </div>
        <div className="faq-list">
          {BLC_DATA.FAQS.map((f, i) => (
            <div key={i} className={'faq-item ' + (open===i ? 'open' : '')}>
              <button onClick={()=>setOpen(open===i ? -1 : i)}>
                <span>{f.q}</span>
                <span className="icon"><i className="bi bi-plus-lg"></i></span>
              </button>
              <div className="answer"><div className="answer-inner">{f.a}</div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ CONTACT ============ */
function Contact() {
  return (
    <section id="contact">
      <div className="container">
        <div className="sec-head">
          <span className="kicker">Hubungi Kami</span>
          <h2>Kunjungi atau Konsultasi Langsung</h2>
          <p>Tim Customer Service BLC siap menjawab pertanyaan Anda seputar program dan pendaftaran.</p>
        </div>
        <div className="contact-grid">
          <div className="contact-info">
            <h3>Informasi Kontak</h3>
            <p>Senin – Sabtu · 08:00 – 20:00 WIB</p>
            <div className="item">
              <div className="ico"><i className="bi bi-geo-alt-fill"></i></div>
              <div><div className="ttl">Lokasi</div><div className="val">Jl. Cicukang No. 9 RT 04 RW 01<br/>Mekarrahayu, Margaasih, Kab. Bandung</div></div>
            </div>
            <div className="item">
              <div className="ico"><i className="bi bi-telephone-fill"></i></div>
              <div><div className="ttl">Telepon</div><div className="val">+62 812-2142-0400</div></div>
            </div>
            <div className="item">
              <div className="ico"><i className="bi bi-envelope-fill"></i></div>
              <div><div className="ttl">Email</div><div className="val">bimbelbrilliantlearningcenter@gmail.com</div></div>
            </div>
            <div className="item">
              <div className="ico"><i className="bi bi-instagram"></i></div>
              <div><div className="ttl">Instagram</div><div className="val">@brilliant_blc</div></div>
            </div>
            <div className="socials">
              <a href="https://www.instagram.com/brilliant_blc/"><i className="bi bi-instagram"></i></a>
              <a href="https://www.youtube.com/@brilliantlearningcenter3346"><i className="bi bi-youtube"></i></a>
              <a href="#"><i className="bi bi-tiktok"></i></a>
            </div>
          </div>
          <div className="contact-map">
            <iframe className="map-frame"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15840.993998002516!2d107.56329448757326!3d-6.979977241350155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68ef9ce8983823%3A0x75217d9c25a214fc!2sBimbel%20BLC%20(Brilliant%20Learning%20Center)%20Cicukang!5e0!3m2!1sid!2sid!4v1777110594037!5m2!1sid!2sid" 
              loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi BLC"></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ CTA BAND ============ */
function CTABand({ onRegister }) {
  return (
    <section className="cta-band">
      <div className="container">
        <h2>Siap Wujudkan Prestasi Terbaikmu?</h2>
        <p>Bergabung dengan ratusan siswa yang telah meraih sukses akademik bersama Brilliant Learning Center.</p>
        <div className="row">
          <button className="btn btn-primary" onClick={onRegister}>
            <i className="bi bi-pencil-square"></i> Daftar Sekarang
          </button>
          <a className="btn btn-ghost" href="https://wa.me/6281221420400" target="_blank" rel="noreferrer">
            <i className="bi bi-whatsapp"></i> Konsultasi Gratis
          </a>
        </div>
      </div>
    </section>
  );
}

/* ============ FOOTER ============ */
function Footer({ onNavClick, onRegister }) {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand">
            <img src="assets/img/logoblc.png" alt="BLC" style={{width:42, height:42, marginRight:10, display:'inline-block', verticalAlign:'middle'}}/>
            <div className="brand-text" style={{display:'inline-block', verticalAlign:'middle'}}>
              <div className="name">Brilliant Learning Center</div>
              <div className="tag">Learn Easy, Achieve More</div>
            </div>
          </div>
        </div>
        <div>
          <h5>Navigasi</h5>
          <ul>
            <li><a href="#hero" onClick={(e)=>{e.preventDefault(); onNavClick('hero');}}>Beranda</a></li>
            <li><a href="#about" onClick={(e)=>{e.preventDefault(); onNavClick('about');}}>Tentang</a></li>
            <li><a href="#services" onClick={(e)=>{e.preventDefault(); onNavClick('services');}}>Program</a></li>
            <li><a href="#team" onClick={(e)=>{e.preventDefault(); onNavClick('team');}}>Tim</a></li>
            <li><a href="#contact" onClick={(e)=>{e.preventDefault(); onNavClick('contact');}}>Kontak</a></li>
          </ul>
        </div>
        <div>
          <h5>Program</h5>
          <ul>
            <li><a href="#" onClick={(e)=>{e.preventDefault(); onRegister();}}>Tingkat SD</a></li>
            <li><a href="#" onClick={(e)=>{e.preventDefault(); onRegister();}}>Tingkat SMP</a></li>
            <li><a href="#" onClick={(e)=>{e.preventDefault(); onRegister();}}>Tingkat SMA</a></li>
            <li><a href="#" onClick={(e)=>{e.preventDefault(); onRegister();}}>Persiapan PTN</a></li>
            <li><a href="#" onClick={(e)=>{e.preventDefault(); onRegister();}}>Konsultasi Mahasiswa</a></li>
          </ul>
        </div>
        <div>
          <h5>Newsletter</h5>
          <p style={{marginBottom:14, lineHeight:1.6}}>Dapatkan tips belajar dan info promo terbaru langsung ke email Anda.</p>
          <form className="newsletter" onSubmit={(e)=>{e.preventDefault(); alert('Terima kasih telah berlangganan!');}}>
            <input type="email" placeholder="email@anda.com" required/>
            <button type="submit">Kirim</button>
          </form>
        </div>
      </div>
      <div className="copy">© 2026 Brilliant Learning Center · Yayasan Pendidikan Brilliant Learning Center. All rights reserved.</div>
    </footer>
  );
}

Object.assign(window, {
  Header, Hero, About, StatsBand, VisionMission, Services, Team,
  Achievement, Testimonials, Gallery, Blog, FAQ, Contact, CTABand, Footer
});
