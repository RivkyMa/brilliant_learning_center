/* global React */
const { useState: useStateR } = React;

/*
  GANTI URL DI BAWAH INI DENGAN URL WEB APP GOOGLE APPS SCRIPT

  Contoh:
  const GOOGLE_SHEET_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxxxxxx/exec';
*/
const GOOGLE_SHEET_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyFt8OnWy1xLCXO6xME304shxWotTsq7C9o2p0-3hEvpOh4U44CQGikVoimlsAQ5Xko/exec';

/*
  Nomor WhatsApp Brilliant Learning Center.
  Format harus pakai kode negara Indonesia 62, tanpa tanda +.
*/
const BLC_WHATSAPP_NUMBER = '6281221420400';

function Registration({ onHome, onNavClick, mode }) {
  const [step, setStep] = useStateR(1);
  const [submitted, setSubmitted] = useStateR(false);
  const [errors, setErrors] = useStateR({});
  const [isSubmitting, setIsSubmitting] = useStateR(false);
  const [submitError, setSubmitError] = useStateR('');
  const [registrationRef, setRegistrationRef] = useStateR('');

  const [data, setData] = useStateR({
    nama: '',
    hpSiswa: '',
    tgl: '',
    gender: '',
    tempat: '',
    sekolah: '',
    kelas: '',
    namaWali: '',
    hpWali: '',
    alamat: '',
    program: '',
    format: '',
    sumber: '',
    catatan: '',
    setuju: false
  });

  const totalSteps = mode === 'multi' ? 4 : 1;

  const set = (k, v) => {
    setData(d => ({ ...d, [k]: v }));
    setErrors(e => ({ ...e, [k]: undefined }));
    setSubmitError('');
  };

  const angkaOnly = (value) => {
  return value.replace(/\D/g, '');
};

  const empty = (value, fallback = '-') => {
    if (value === undefined || value === null || value === '') return fallback;
    return value;
  };

  const formatTanggal = (value) => {
    if (!value) return '-';

    const parts = value.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    }

    return value;
  };

  const generateRegistrationRef = () => {
    return 'BLC-' + Date.now().toString(36).toUpperCase().slice(-7);
  };

  const buildPayload = (ref) => {
    return {
      noPendaftaran: ref,
      nama: data.nama,
      hpSiswa: data.hpSiswa,
      tempat: data.tempat,
      tgl: data.tgl,
      gender: data.gender,
      sekolah: data.sekolah,
      kelas: data.kelas,
      namaWali: data.namaWali,
      hpWali: data.hpWali,
      alamat: data.alamat,
      sumber: data.sumber,
      program: data.program,
      format: data.format,
      catatan: data.catatan
    };
  };

  const buildWhatsAppUrl = (ref) => {
    const message = [
      'Halo Brilliant Learning Center, saya ingin melakukan konfirmasi pendaftaran siswa baru.',
      'Berikut data yang sudah saya isi pada form pendaftaran:',
      '',
      `No. Pendaftaran: ${empty(ref)}`,
      '',
      '*Data Siswa*',
      `Nama Lengkap Siswa: ${empty(data.nama)}`,
      `No. HP / WhatsApp Siswa: ${empty(data.hpSiswa)}`,
      `Tempat Lahir: ${empty(data.tempat)}`,
      `Tanggal Lahir: ${formatTanggal(data.tgl)}`,
      `Jenis Kelamin: ${empty(data.gender)}`,
      `Sekolah Asal: ${empty(data.sekolah)}`,
      `Kelas / Tingkat: ${empty(data.kelas)}`,
      '',
      '*Data Orang Tua / Wali*',
      `Nama Orang Tua / Wali: ${empty(data.namaWali)}`,
      `No. HP / WhatsApp Wali: ${empty(data.hpWali)}`,
      `Alamat Lengkap: ${empty(data.alamat)}`,
      `Sumber Informasi: ${empty(data.sumber)}`,
      '',
      '*Pilihan Program*',
      `Program yang Dipilih: ${empty(data.program)}`,
      `Format Belajar: ${empty(data.format)}`,
      `Catatan Tambahan: ${empty(data.catatan)}`,
      '',
      'Mohon dibantu untuk proses verifikasi selanjutnya. Terima kasih.'
    ].join('\n');

    return `https://wa.me/${BLC_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  const validateStep = (s) => {
    const e = {};
    const need = (k) => {
      if (!data[k]) e[k] = 'Wajib diisi';
    };

    if (mode === 'single' || s === 1) {
      ['nama', 'hpSiswa', 'tgl', 'gender', 'sekolah', 'kelas'].forEach(need);
    }

    if (mode === 'single' || s === 2) {
      ['namaWali', 'hpWali', 'alamat'].forEach(need);
    }

    if (mode === 'single' || s === 3) {
      ['program', 'format'].forEach(need);
    }

    if (mode === 'single' || s === 4) {
      if (!data.setuju) e.setuju = 'Harap menyetujui ketentuan';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validateStep(step)) {
      setStep(Math.min(totalSteps, step + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prev = () => {
    setStep(Math.max(1, step - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!validateStep(mode === 'single' ? 99 : step)) return;

    if (
      !GOOGLE_SHEET_WEB_APP_URL ||
      GOOGLE_SHEET_WEB_APP_URL === 'GANTI_DENGAN_URL_WEB_APP_APPS_SCRIPT'
    ) {
      setSubmitError('URL Google Apps Script belum diisi. Silakan masukkan URL Web App terlebih dahulu.');
      return;
    }

    const ref = generateRegistrationRef();
    const payload = buildPayload(ref);

    try {
      setIsSubmitting(true);
      setSubmitError('');

      await fetch(GOOGLE_SHEET_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      setRegistrationRef(ref);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
      setSubmitError('Maaf, data belum berhasil dikirim. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    const ref = registrationRef || generateRegistrationRef();
    const whatsappUrl = buildWhatsAppUrl(ref);

    return (
      <>
        <Header
          page="reg"
          onHome={onHome}
          onNavClick={(id) => {
            onHome();
            setTimeout(() => onNavClick(id), 50);
          }}
          onRegister={() => {}}
        />

        <section className="reg-hero">
          <div className="container">
            <div className="breadcrumbs">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onHome();
                }}
              >
                Beranda
              </a>
              <span>/</span> Pendaftaran
            </div>
            <h1>Pendaftaran Berhasil</h1>
            <p>Selamat datang di keluarga Brilliant Learning Center.</p>
          </div>
        </section>

        <div className="reg-wrap">
          <div className="container">
            <div className="reg-card">
              <div className="success-card">
                <div className="check">
                  <i className="bi bi-check-lg"></i>
                </div>

                <h2>Terima Kasih, {data.nama || 'Calon Siswa'}!</h2>

                <p>
                  Pendaftaran Anda telah kami terima. Data pendaftaran sudah tersimpan dan tim
                  Customer Service akan menghubungi Anda dalam 1×24 jam untuk verifikasi data dan
                  informasi jadwal.
                </p>

                <div className="ref">No. Pendaftaran: {ref}</div>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button className="btn btn-primary" onClick={onHome}>
                    Kembali ke Beranda
                  </button>

                  <a className="btn btn-ghost" href={whatsappUrl} target="_blank" rel="noreferrer">
                    <i className="bi bi-whatsapp"></i> Hubungi via WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer
          onNavClick={(id) => {
            onHome();
            setTimeout(() => onNavClick(id), 50);
          }}
          onRegister={() => {}}
        />
      </>
    );
  }

  const showSec1 = mode === 'single' || step === 1;
  const showSec2 = mode === 'single' || step === 2;
  const showSec3 = mode === 'single' || step === 3;
  const showSec4 = mode === 'single' || step === 4;

  return (
    <>
      <Header
        page="reg"
        onHome={onHome}
        onNavClick={(id) => {
          onHome();
          setTimeout(() => onNavClick(id), 50);
        }}
        onRegister={() => {}}
      />

      <section className="reg-hero">
        <div className="container">
          <div className="breadcrumbs">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onHome();
              }}
            >
              Beranda
            </a>
            <span>/</span> Pendaftaran Siswa Baru
          </div>

          <h1>Formulir Pendaftaran Siswa Baru</h1>
          <p>
            Isi formulir berikut dengan lengkap dan benar. Tim kami akan menghubungi Anda dalam
            1×24 jam untuk verifikasi.
          </p>
        </div>
      </section>

      <div className="reg-wrap">
        <div className="container">
          <div className="reg-card">
            {mode === 'multi' && (
              <div className="reg-stepper">
                {[
                  { n: 1, ttl: 'Data Siswa', label: 'Identitas' },
                  { n: 2, ttl: 'Data Wali', label: 'Kontak orang tua' },
                  { n: 3, ttl: 'Pilih Program', label: 'Jenjang & format' },
                  { n: 4, ttl: 'Konfirmasi', label: 'Review & kirim' }
                ].map(s => (
                  <div
                    key={s.n}
                    className={'step ' + (step === s.n ? 'active' : step > s.n ? 'done' : '')}
                  >
                    <div className="num">
                      {step > s.n ? <i className="bi bi-check-lg"></i> : s.n}
                    </div>
                    <div>
                      <div className="ttl">{s.ttl}</div>
                      <div className="label">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <form className="reg-body" onSubmit={submit}>
              {showSec1 && (
                <>
                  <div className="section-h">
                    <span className="num">1</span> Data Calon Siswa
                  </div>

                  <div className="form-grid">
                    <div className={'field full ' + (errors.nama ? 'error' : '')}>
                      <label>
                        Nama Lengkap Siswa <span className="req">*</span>
                      </label>
                      <input
                        value={data.nama}
                        onChange={e => set('nama', e.target.value)}
                        placeholder="Sesuai akta kelahiran"
                      />
                      {errors.nama && <span className="err">{errors.nama}</span>}
                    </div>

                    <div className={'field ' + (errors.hpSiswa ? 'error' : '')}>
                      <label>
                        No. HP / WhatsApp Siswa <span className="req">*</span>
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={data.hpSiswa}
                        onChange={e => set('hpSiswa', angkaOnly(e.target.value))}
                        placeholder="08xxxxxxxxxx"
                      />
                      {errors.hpSiswa && <span className="err">{errors.hpSiswa}</span>}
                    </div>

                    <div className={'field ' + (errors.tgl ? 'error' : '')}>
                      <label>
                        Tanggal Lahir <span className="req">*</span>
                      </label>
                      <input
                        type="date"
                        value={data.tgl}
                        onChange={e => set('tgl', e.target.value)}
                      />
                      {errors.tgl && <span className="err">{errors.tgl}</span>}
                    </div>

                    <div className={'field ' + (errors.gender ? 'error' : '')}>
                      <label>
                        Jenis Kelamin <span className="req">*</span>
                      </label>
                      <div className="radio-group">
                        {['Laki-laki', 'Perempuan'].map(g => (
                          <label
                            key={g}
                            className={'radio-pill ' + (data.gender === g ? 'active' : '')}
                          >
                            <input
                              type="radio"
                              name="gender"
                              checked={data.gender === g}
                              onChange={() => set('gender', g)}
                            />
                            {g}
                          </label>
                        ))}
                      </div>
                      {errors.gender && <span className="err">{errors.gender}</span>}
                    </div>

                    <div className="field">
                      <label>Tempat Lahir</label>
                      <input
                        value={data.tempat}
                        onChange={e => set('tempat', e.target.value)}
                        placeholder="Contoh: Bandung"
                      />
                    </div>

                    <div className={'field ' + (errors.sekolah ? 'error' : '')}>
                      <label>
                        Sekolah Asal <span className="req">*</span>
                      </label>
                      <input
                        value={data.sekolah}
                        onChange={e => set('sekolah', e.target.value)}
                        placeholder="Nama sekolah saat ini"
                      />
                      {errors.sekolah && <span className="err">{errors.sekolah}</span>}
                    </div>

                    <div className={'field ' + (errors.kelas ? 'error' : '')}>
                      <label>
                        Kelas / Tingkat <span className="req">*</span>
                      </label>
                      <select value={data.kelas} onChange={e => set('kelas', e.target.value)}>
                        <option value="">— Pilih kelas —</option>
                        <optgroup label="SD">
                          {[1, 2, 3, 4, 5, 6].map(k => (
                            <option key={'sd' + k}>SD Kelas {k}</option>
                          ))}
                        </optgroup>
                        <optgroup label="SMP">
                          {[7, 8, 9].map(k => (
                            <option key={'smp' + k}>SMP Kelas {k}</option>
                          ))}
                        </optgroup>
                        <optgroup label="SMA">
                          {[10, 11, 12].map(k => (
                            <option key={'sma' + k}>SMA Kelas {k}</option>
                          ))}
                        </optgroup>
                        <option>Alumni / Gap Year</option>
                      </select>
                      {errors.kelas && <span className="err">{errors.kelas}</span>}
                    </div>
                  </div>
                </>
              )}

              {showSec2 && (
                <>
                  <div className="section-h">
                    <span className="num">2</span> Data Orang Tua / Wali
                  </div>

                  <div className="form-grid">
                    <div className={'field ' + (errors.namaWali ? 'error' : '')}>
                      <label>
                        Nama Orang Tua / Wali <span className="req">*</span>
                      </label>
                      <input
                        value={data.namaWali}
                        onChange={e => set('namaWali', e.target.value)}
                        placeholder="Nama lengkap wali"
                      />
                      {errors.namaWali && <span className="err">{errors.namaWali}</span>}
                    </div>

                    <div className={'field ' + (errors.hpWali ? 'error' : '')}>
                      <label>
                        No. HP / WhatsApp Wali <span className="req">*</span>
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={data.hpWali}
                        onChange={e => set('hpWali', angkaOnly(e.target.value))}
                        placeholder="08xxxxxxxxxx"
                      />
                      {errors.hpWali && <span className="err">{errors.hpWali}</span>}
                    </div>

                    <div className="field">
                      <label>Sumber Informasi</label>
                      <select value={data.sumber} onChange={e => set('sumber', e.target.value)}>
                        <option value="">— Pilih sumber —</option>
                        <option>Instagram / Sosial Media</option>
                        <option>Rekomendasi Teman</option>
                        <option>Brosur / Flyer</option>
                        <option>Website BLC</option>
                        <option>Lainnya</option>
                      </select>
                    </div>

                    <div className={'field full ' + (errors.alamat ? 'error' : '')}>
                      <label>
                        Alamat Lengkap <span className="req">*</span>
                      </label>
                      <textarea
                        value={data.alamat}
                        onChange={e => set('alamat', e.target.value)}
                        placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota"
                      />
                      {errors.alamat && <span className="err">{errors.alamat}</span>}
                    </div>
                  </div>
                </>
              )}

              {showSec3 && (
                <>
                  <div className="section-h">
                    <span className="num">3</span> Pilihan Program
                  </div>

                  <div className={'field ' + (errors.program ? 'error' : '')}>
                    <label>
                      Program yang Dipilih <span className="req">*</span>
                    </label>

                    <div className="program-options">
                      {[
                        {
                          id: 'sd',
                          t: 'Tingkat SD',
                          s: 'Kelas 1–6 · Pendampingan & persiapan SMP',
                          ico: 'bi-book-fill'
                        },
                        {
                          id: 'smp',
                          t: 'Tingkat SMP',
                          s: 'Kelas 7–9 · Persiapan SMA favorit',
                          ico: 'bi-pencil-square'
                        },
                        {
                          id: 'sma',
                          t: 'Tingkat SMA',
                          s: 'Kelas 10–12 · Persiapan ujian sekolah',
                          ico: 'bi-mortarboard-fill'
                        },
                        {
                          id: 'ptn',
                          t: 'Persiapan PTN',
                          s: 'TKA, SNBT-UTBK, Mandiri, Kedinasan',
                          ico: 'bi-trophy-fill'
                        },
                        {
                          id: 'umum',
                          t: 'Program Umum',
                          s: 'Konsultasi mahasiswa & tugas akhir',
                          ico: 'bi-chat-dots-fill'
                        },
                        {
                          id: 'priv',
                          t: 'Privat di Rumah',
                          s: 'Tutor datang ke rumah, jadwal fleksibel',
                          ico: 'bi-house-heart-fill'
                        }
                      ].map(p => (
                        <div
                          key={p.id}
                          className={'program-card ' + (data.program === p.t ? 'active' : '')}
                          onClick={() => set('program', p.t)}
                        >
                          <div className="head">
                            <div className="ico">
                              <i className={'bi ' + p.ico}></i>
                            </div>
                            <div className="t">{p.t}</div>
                          </div>
                          <div className="s">{p.s}</div>
                        </div>
                      ))}
                    </div>

                    {errors.program && (
                      <span className="err" style={{ marginTop: 8, display: 'block' }}>
                        {errors.program}
                      </span>
                    )}
                  </div>

                  <div className="form-grid" style={{ marginTop: 24 }}>
                    <div className={'field ' + (errors.format ? 'error' : '')}>
                      <label>
                        Format Belajar <span className="req">*</span>
                      </label>

                      <div className="radio-group">
                        {['Reguler (Kelas Kecil 10–15 siswa)', 'Private (1-3)'].map(g => (
                          <label
                            key={g}
                            className={'radio-pill ' + (data.format === g ? 'active' : '')}
                          >
                            <input
                              type="radio"
                              name="format"
                              checked={data.format === g}
                              onChange={() => set('format', g)}
                            />
                            {g}
                          </label>
                        ))}
                      </div>

                      {errors.format && <span className="err">{errors.format}</span>}
                    </div>

                    <div className="field full">
                      <label>Catatan Tambahan</label>
                      <textarea
                        value={data.catatan}
                        onChange={e => set('catatan', e.target.value)}
                        placeholder="Misalnya: target ujian, mata pelajaran fokus, atau pertanyaan khusus"
                      />
                    </div>
                  </div>
                </>
              )}

              {showSec4 && (
                <>
                  <div className="section-h">
                    <span className="num">4</span> Konfirmasi & Persetujuan
                  </div>

                  <div className={'consent ' + (errors.setuju ? 'error' : '')}>
                    <input
                      type="checkbox"
                      id="setuju"
                      checked={data.setuju}
                      onChange={e => set('setuju', e.target.checked)}
                    />

                    <label htmlFor="setuju">
                      Saya menyatakan bahwa data yang saya isi adalah{' '}
                      <strong>benar dan dapat dipertanggungjawabkan</strong>. Saya juga menyetujui{' '}
                      <a href="#" style={{ color: 'var(--brand)', fontWeight: 600 }}>
                        syarat & ketentuan
                      </a>{' '}
                      serta{' '}
                      <a href="#" style={{ color: 'var(--brand)', fontWeight: 600 }}>
                        kebijakan privasi
                      </a>{' '}
                      Brilliant Learning Center.
                    </label>
                  </div>

                  {errors.setuju && (
                    <div className="err" style={{ color: '#DC2626', fontSize: 12, marginTop: 8 }}>
                      {errors.setuju}
                    </div>
                  )}
                </>
              )}

              {submitError && (
                <div
                  className="err"
                  style={{
                    color: '#DC2626',
                    fontSize: 13,
                    marginTop: 16,
                    background: '#FEF2F2',
                    border: '1px solid #FECACA',
                    borderRadius: 10,
                    padding: '10px 12px'
                  }}
                >
                  {submitError}
                </div>
              )}

              <div className="reg-actions">
                {mode === 'multi' && step > 1 ? (
                  <button type="button" className="btn btn-ghost" onClick={prev}>
                    <i className="bi bi-arrow-left"></i> Sebelumnya
                  </button>
                ) : (
                  <button type="button" className="btn btn-ghost" onClick={onHome}>
                    <i className="bi bi-arrow-left"></i> Batal
                  </button>
                )}

                {mode === 'multi' && step < totalSteps ? (
                  <button type="button" className="btn btn-primary" onClick={next}>
                    Lanjut <i className="bi bi-arrow-right"></i>
                  </button>
                ) : (
                  <button type="submit" className="btn btn-accent" disabled={isSubmitting}>
                    <i className="bi bi-send-fill"></i>{' '}
                    {isSubmitting ? 'Mengirim...' : 'Kirim Pendaftaran'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer
        onNavClick={(id) => {
          onHome();
          setTimeout(() => onNavClick(id), 50);
        }}
        onRegister={() => {}}
      />
    </>
  );
}

window.Registration = Registration;