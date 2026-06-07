/* global React, ReactDOM, BLC_DATA */
const { useEffect: useEffectA, useMemo: useMemoA, useState: useStateA } = React;

const STORAGE_BUCKET = 'blc-assets';
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const SUBJECT_OPTIONS = ['Matematika', 'Fisika', 'Kimia', 'Biologi', 'Lainnya'];

const EMPTY_TEACHER = {
  id: '',
  name: '',
  role: '',
  subject: 'Matematika',
  university: '',
  image_url: '',
  initials: '',
  is_management: false,
  is_featured: false,
  is_active: true,
  sort_order: 0,
};

const EMPTY_ARTICLE = {
  id: '',
  category: 'Artikel',
  title: '',
  excerpt: '',
  image_url: '',
  published_at: new Date().toISOString().slice(0, 10),
  read_time: '',
  content_text: '',
  takeaway: '',
  is_published: true,
  sort_order: 0,
};

const EMPTY_GALLERY_ITEM = {
  id: '',
  label: '',
  description: '',
  icon: 'bi-people',
  image_url: '',
  is_active: true,
  sort_order: 0,
};

const EMPTY_TESTIMONIAL = {
  id: '',
  alt_text: 'Testimoni Alumni BLC',
  image_url: '',
  is_active: true,
  sort_order: 0,
};

function AdminApp() {
  const client = useMemoA(() => createSupabaseClient(), []);
  const [session, setSession] = useStateA(null);
  const [authReady, setAuthReady] = useStateA(false);

  useEffectA(() => {
    if (!client) return;

    let mounted = true;
    client.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session);
        setAuthReady(true);
      }
    });

    const { data: listener } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthReady(true);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [client]);

  if (!client) return <SetupScreen />;
  if (!authReady) return <AdminLoading label="Memeriksa sesi admin" />;
  if (!session) return <LoginScreen client={client} />;

  return <AdminShell client={client} session={session} />;
}

function createSupabaseClient() {
  const config = window.BLC_SUPABASE;
  const supabaseLib = window.supabase;
  const hasRealConfig = config &&
    config.enabled === true &&
    config.url &&
    config.anonKey &&
    !config.url.includes('YOUR_PROJECT_ID') &&
    !config.anonKey.includes('YOUR_SUPABASE_ANON_KEY');

  if (!hasRealConfig || !supabaseLib) return null;
  return supabaseLib.createClient(config.url, config.anonKey);
}

function SetupScreen() {
  return (
    <main className="admin-setup">
      <div className="admin-setup-card">
        <img src="assets/img/logoblc.png" alt="BLC" />
        <h1>Admin belum tersambung ke Supabase</h1>
        <p>
          Isi file <code>supabase-config.js</code> dengan Project URL dan anon key dari Supabase,
          lalu ubah <code>enabled</code> menjadi <code>true</code>.
        </p>
        <div className="admin-code">
          <div>window.BLC_SUPABASE = {'{'}</div>
          <div>&nbsp;&nbsp;enabled: true,</div>
          <div>&nbsp;&nbsp;url: 'https://PROJECT_ID.supabase.co',</div>
          <div>&nbsp;&nbsp;anonKey: 'ANON_KEY'</div>
          <div>{'}'};</div>
        </div>
        <a className="admin-link-btn" href="index.html">
          <i className="bi bi-arrow-left"></i> Kembali ke website
        </a>
      </div>
    </main>
  );
}

function LoginScreen({ client }) {
  const [email, setEmail] = useStateA('');
  const [password, setPassword] = useStateA('');
  const [loading, setLoading] = useStateA(false);
  const [error, setError] = useStateA('');

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const { error: signInError } = await client.auth.signInWithPassword({ email, password });
    if (signInError) setError(signInError.message);
    setLoading(false);
  };

  return (
    <main className="admin-login">
      <form className="admin-login-card" onSubmit={submit}>
        <div className="admin-login-brand">
          <img src="assets/img/logoblc.png" alt="BLC" />
          <div>
            <div className="admin-login-title">Admin BLC</div>
            <div className="admin-login-subtitle">Kelola konten website</div>
          </div>
        </div>

        <label className="admin-field">
          <span>Email admin</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>

        <label className="admin-field">
          <span>Password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>

        {error && <div className="admin-alert error">{error}</div>}

        <button className="admin-primary-btn" type="submit" disabled={loading}>
          <i className="bi bi-box-arrow-in-right"></i>
          {loading ? 'Masuk...' : 'Masuk Admin'}
        </button>
      </form>
    </main>
  );
}

function AdminShell({ client, session }) {
  const [active, setActive] = useStateA('teachers');
  const [teachers, setTeachers] = useStateA([]);
  const [articles, setArticles] = useStateA([]);
  const [galleryItems, setGalleryItems] = useStateA([]);
  const [testimonials, setTestimonials] = useStateA([]);
  const [loading, setLoading] = useStateA(false);
  const [notice, setNotice] = useStateA(null);
  const [sweetAlert, setSweetAlert] = useStateA(null);

  const loadData = async () => {
    setLoading(true);
    const [teacherResult, articleResult, galleryResult, testimonialResult] = await Promise.all([
      client.from('teachers').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: false }),
      client.from('articles').select('*').order('sort_order', { ascending: true }).order('published_at', { ascending: false }),
      client.from('gallery_items').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: false }),
      client.from('testimonials').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: false }),
    ]);

    if (teacherResult.error || articleResult.error || galleryResult.error || testimonialResult.error) {
      setNotice({
        type: 'error',
        text: teacherResult.error?.message || articleResult.error?.message || galleryResult.error?.message || testimonialResult.error?.message,
      });
    } else {
      setTeachers(teacherResult.data || []);
      setArticles(articleResult.data || []);
      setGalleryItems(galleryResult.data || []);
      setTestimonials(testimonialResult.data || []);
    }
    setLoading(false);
  };

  useEffectA(() => {
    loadData();
  }, []);

  const showNotice = (type, text, showDialog = false) => {
    setNotice({ type, text });
    if (showDialog || type === 'error') {
      setSweetAlert({
        type,
        mode: 'alert',
        title: type === 'success' ? 'Berhasil' : 'Terjadi kendala',
        text,
        confirmText: 'OK',
      });
    }
    window.setTimeout(() => setNotice(null), 4200);
  };

  const showConfirm = ({ title, text, confirmText = 'Ya, lanjutkan', cancelText = 'Batal', type = 'warning' }) => (
    new Promise((resolve) => {
      setSweetAlert({
        type,
        mode: 'confirm',
        title,
        text,
        confirmText,
        cancelText,
        resolve,
      });
    })
  );

  const closeSweetAlert = () => {
    if (sweetAlert && sweetAlert.resolve) sweetAlert.resolve(false);
    setSweetAlert(null);
  };

  const confirmSweetAlert = () => {
    if (sweetAlert && sweetAlert.resolve) sweetAlert.resolve(true);
    setSweetAlert(null);
  };

  const signOut = () => client.auth.signOut();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="index.html">
          <img src="assets/img/logoblc.png" alt="BLC" />
          <span>Admin BLC</span>
        </a>

        <nav className="admin-nav">
          <button className={active === 'teachers' ? 'active' : ''} onClick={() => setActive('teachers')}>
            <i className="bi bi-people"></i> Guru & Tim
          </button>
          <button className={active === 'articles' ? 'active' : ''} onClick={() => setActive('articles')}>
            <i className="bi bi-newspaper"></i> Artikel
          </button>
          <button className={active === 'gallery' ? 'active' : ''} onClick={() => setActive('gallery')}>
            <i className="bi bi-images"></i> Galeri
          </button>
          <button className={active === 'testimonials' ? 'active' : ''} onClick={() => setActive('testimonials')}>
            <i className="bi bi-chat-square-heart"></i> Testimoni
          </button>
          <button className={active === 'imports' ? 'active' : ''} onClick={() => setActive('imports')}>
            <i className="bi bi-database-add"></i> Import Awal
          </button>
        </nav>

        <div className="admin-sidebar-foot">
          <div className="admin-user-email">{session.user.email}</div>
          <button onClick={signOut}>
            <i className="bi bi-box-arrow-right"></i> Keluar
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-top">
          <div>
            <h1>{getAdminTitle(active)}</h1>
            <p>{active === 'imports' ? 'Masukkan data lama dari file lokal ke Supabase.' : 'Tambah, edit, dan atur konten website.'}</p>
          </div>
          <div className="admin-top-actions">
            <a className="admin-ghost-btn" href="index.html" target="_blank" rel="noreferrer">
              <i className="bi bi-box-arrow-up-right"></i> Lihat Website
            </a>
            <button className="admin-ghost-btn" onClick={loadData} disabled={loading}>
              <i className="bi bi-arrow-clockwise"></i> Refresh
            </button>
          </div>
        </header>

        {notice && <div className={'admin-alert ' + notice.type}>{notice.text}</div>}
        {loading && <AdminLoading label="Mengambil data Supabase" compact />}

        {active === 'teachers' && (
          <TeacherManager
            client={client}
            teachers={teachers}
            onChanged={loadData}
            showNotice={showNotice}
            showConfirm={showConfirm}
          />
        )}

        {active === 'articles' && (
          <ArticleManager
            client={client}
            articles={articles}
            onChanged={loadData}
            showNotice={showNotice}
            showConfirm={showConfirm}
          />
        )}

        {active === 'gallery' && (
          <GalleryManager
            client={client}
            galleryItems={galleryItems}
            onChanged={loadData}
            showNotice={showNotice}
            showConfirm={showConfirm}
          />
        )}

        {active === 'testimonials' && (
          <TestimonialManager
            client={client}
            testimonials={testimonials}
            onChanged={loadData}
            showNotice={showNotice}
            showConfirm={showConfirm}
          />
        )}

        {active === 'imports' && (
          <ImportPanel
            client={client}
            onChanged={loadData}
            showNotice={showNotice}
            teachersCount={teachers.length}
            articlesCount={articles.length}
            galleryCount={galleryItems.length}
            testimonialsCount={testimonials.length}
            showConfirm={showConfirm}
          />
        )}
      </main>

      {sweetAlert && (
        <AdminSweetAlert
          alert={sweetAlert}
          onClose={closeSweetAlert}
          onConfirm={confirmSweetAlert}
          onCancel={closeSweetAlert}
        />
      )}
    </div>
  );
}

function getAdminTitle(active) {
  const titles = {
    teachers: 'Guru & Tim',
    articles: 'Artikel',
    gallery: 'Galeri Kegiatan',
    testimonials: 'Testimoni Alumni',
    imports: 'Import Data Awal',
  };
  return titles[active] || 'Admin BLC';
}

function AdminSweetAlert({ alert, onClose, onConfirm, onCancel }) {
  const iconMap = {
    success: 'bi-check-lg',
    error: 'bi-x-lg',
    warning: 'bi-exclamation-lg',
    info: 'bi-info-lg',
  };
  const icon = iconMap[alert.type] || iconMap.info;
  const isConfirm = alert.mode === 'confirm';

  return (
    <div className="admin-swal-backdrop" role="presentation" onMouseDown={onCancel}>
      <div
        className={'admin-swal ' + alert.type}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="admin-swal-title"
        aria-describedby="admin-swal-text"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="admin-swal-close" type="button" onClick={onClose} aria-label="Tutup alert">
          <i className="bi bi-x-lg"></i>
        </button>
        <div className="admin-swal-icon">
          <i className={'bi ' + icon}></i>
        </div>
        <h2 id="admin-swal-title">{alert.title}</h2>
        <p id="admin-swal-text">{alert.text}</p>
        <div className="admin-swal-actions">
          {isConfirm && (
            <button className="admin-swal-btn ghost" type="button" onClick={onCancel}>
              {alert.cancelText || 'Batal'}
            </button>
          )}
          <button className="admin-swal-btn primary" type="button" onClick={isConfirm ? onConfirm : onClose}>
            {alert.confirmText || 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
}

function TeacherManager({ client, teachers, onChanged, showNotice, showConfirm }) {
  const [form, setForm] = useStateA(EMPTY_TEACHER);
  const [saving, setSaving] = useStateA(false);
  const [uploading, setUploading] = useStateA(false);

  const edit = (teacher) => {
    setForm({
      id: teacher.id,
      name: teacher.name || '',
      role: teacher.role || '',
      subject: teacher.subject || 'Lainnya',
      university: teacher.university || '',
      image_url: teacher.image_url || '',
      initials: teacher.initials || '',
      is_management: Boolean(teacher.is_management),
      is_featured: Boolean(teacher.is_featured),
      is_active: Boolean(teacher.is_active),
      sort_order: teacher.sort_order || 0,
    });
  };

  const reset = () => setForm(EMPTY_TEACHER);

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      role: form.role.trim(),
      subject: form.is_management ? 'Manajemen' : form.subject,
      university: emptyToNull(form.university),
      image_url: emptyToNull(form.image_url),
      initials: emptyToNull(form.initials),
      is_management: form.is_management,
      is_featured: form.is_featured,
      is_active: form.is_active,
      sort_order: Number(form.sort_order) || 0,
    };

    const result = form.id
      ? await client.from('teachers').update(payload).eq('id', form.id)
      : await client.from('teachers').insert(payload);

    if (result.error) {
      showNotice('error', result.error.message);
    } else {
      showNotice('success', form.id ? 'Data guru berhasil diperbarui.' : 'Data guru berhasil ditambahkan.', true);
      reset();
      await onChanged();
    }
    setSaving(false);
  };

  const remove = async (teacher) => {
    const confirmed = await showConfirm({
      title: 'Hapus data guru?',
      text: 'Data "' + teacher.name + '" akan dihapus permanen dari Supabase.',
      confirmText: 'Ya, hapus',
      type: 'warning',
    });
    if (!confirmed) return;
    const { error } = await client.from('teachers').delete().eq('id', teacher.id);
    if (error) showNotice('error', error.message);
    else {
      showNotice('success', 'Data guru berhasil dihapus.', true);
      await onChanged();
      if (form.id === teacher.id) reset();
    }
  };

  const uploadTeacherImage = async (file) => {
    setUploading(true);
    const result = await uploadImageFile(client, file, 'teachers', form.name || 'guru');
    if (result.error) {
      showNotice('error', result.error);
    } else {
      setForm((current) => ({ ...current, image_url: result.publicUrl }));
      showNotice('success', 'Foto guru berhasil diupload.');
    }
    setUploading(false);
  };

  return (
    <div className="admin-workspace">
      <form className="admin-panel admin-form-panel" onSubmit={save}>
        <div className="admin-panel-head">
          <h2>{form.id ? 'Edit Guru' : 'Tambah Guru'}</h2>
          {form.id && <button type="button" className="admin-text-btn" onClick={reset}>Batal edit</button>}
        </div>

        <TextField label="Nama" value={form.name} onChange={(value) => setForm({ ...form, name: value })} required />
        <TextField label="Role" value={form.role} onChange={(value) => setForm({ ...form, role: value })} required />

        <label className="admin-check">
          <input
            type="checkbox"
            checked={form.is_management}
            onChange={(e) => setForm({ ...form, is_management: e.target.checked })}
          />
          <span>Masuk tim manajemen</span>
        </label>

        {!form.is_management && (
          <label className="admin-field">
            <span>Mata pelajaran</span>
            <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
              {SUBJECT_OPTIONS.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
            </select>
          </label>
        )}

        <TextField label="Asal universitas" value={form.university} onChange={(value) => setForm({ ...form, university: value })} />
        <ImageUploadField
          label="Foto guru"
          imageUrl={form.image_url}
          uploading={uploading}
          onUpload={uploadTeacherImage}
          onError={(message) => showNotice('error', message, true)}
          onClear={() => setForm({ ...form, image_url: '' })}
        />
        <TextField label="Inisial fallback" value={form.initials} onChange={(value) => setForm({ ...form, initials: value })} />
        <TextField label="Urutan tampil" type="number" value={form.sort_order} onChange={(value) => setForm({ ...form, sort_order: value })} />

        <div className="admin-toggle-grid">
          <ToggleField label="Aktif tampil" checked={form.is_active} onChange={(checked) => setForm({ ...form, is_active: checked })} />
          <ToggleField label="Sorot/unggulan" checked={form.is_featured} onChange={(checked) => setForm({ ...form, is_featured: checked })} />
        </div>

        <button className="admin-primary-btn" type="submit" disabled={saving}>
          <i className="bi bi-save"></i> {saving ? 'Menyimpan...' : 'Simpan Guru'}
        </button>

        {form.id && (
          <button
            className="admin-danger-btn"
            type="button"
            onClick={() => remove({ id: form.id, name: form.name })}
          >
            <i className="bi bi-trash"></i> Hapus Guru Ini
          </button>
        )}
      </form>

      <div className="admin-panel">
        <div className="admin-panel-head">
          <h2>Daftar Guru</h2>
          <span>{teachers.length} data</span>
        </div>
        <div className="admin-list">
          {teachers.map((teacher) => (
            <div className="admin-list-item" key={teacher.id}>
              <div className="admin-avatar">
                {teacher.image_url ? <img src={teacher.image_url} alt={teacher.name} /> : <span>{teacher.initials || getInitials(teacher.name)}</span>}
              </div>
              <div className="admin-list-copy">
                <strong>{teacher.name}</strong>
                <span>{teacher.role} · {teacher.is_management ? 'Manajemen' : teacher.subject}</span>
              </div>
              <div className="admin-status">
                {teacher.is_active ? 'Aktif' : 'Nonaktif'}
              </div>
              <div className="admin-row-actions">
                <button className="admin-action-btn" onClick={() => edit(teacher)} aria-label={'Edit ' + teacher.name}>
                  <i className="bi bi-pencil"></i><span>Edit</span>
                </button>
                <button className="admin-action-btn danger" onClick={() => remove(teacher)} aria-label={'Hapus ' + teacher.name}>
                  <i className="bi bi-trash"></i><span>Hapus</span>
                </button>
              </div>
            </div>
          ))}
          {!teachers.length && <EmptyState label="Belum ada data guru di Supabase." />}
        </div>
      </div>
    </div>
  );
}

function ArticleManager({ client, articles, onChanged, showNotice, showConfirm }) {
  const [form, setForm] = useStateA(EMPTY_ARTICLE);
  const [saving, setSaving] = useStateA(false);
  const [uploading, setUploading] = useStateA(false);

  const edit = (article) => {
    setForm({
      id: article.id,
      category: article.category || 'Artikel',
      title: article.title || '',
      excerpt: article.excerpt || '',
      image_url: article.image_url || '',
      published_at: article.published_at || new Date().toISOString().slice(0, 10),
      read_time: article.read_time || '',
      content_text: contentToText(article.content),
      takeaway: article.takeaway || '',
      is_published: Boolean(article.is_published),
      sort_order: article.sort_order || 0,
    });
  };

  const reset = () => setForm(EMPTY_ARTICLE);

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);

    const payload = {
      category: form.category.trim(),
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      image_url: emptyToNull(form.image_url),
      published_at: emptyToNull(form.published_at),
      read_time: emptyToNull(form.read_time),
      content: textToContent(form.content_text),
      takeaway: emptyToNull(form.takeaway),
      is_published: form.is_published,
      sort_order: Number(form.sort_order) || 0,
    };

    const result = form.id
      ? await client.from('articles').update(payload).eq('id', form.id)
      : await client.from('articles').insert(payload);

    if (result.error) {
      showNotice('error', result.error.message);
    } else {
      showNotice('success', form.id ? 'Artikel berhasil diperbarui.' : 'Artikel berhasil ditambahkan.', true);
      reset();
      await onChanged();
    }
    setSaving(false);
  };

  const remove = async (article) => {
    const confirmed = await showConfirm({
      title: 'Hapus artikel?',
      text: 'Artikel "' + article.title + '" akan dihapus permanen dari Supabase.',
      confirmText: 'Ya, hapus',
      type: 'warning',
    });
    if (!confirmed) return;
    const { error } = await client.from('articles').delete().eq('id', article.id);
    if (error) showNotice('error', error.message);
    else {
      showNotice('success', 'Artikel berhasil dihapus.', true);
      await onChanged();
      if (form.id === article.id) reset();
    }
  };

  const uploadArticleImage = async (file) => {
    setUploading(true);
    const result = await uploadImageFile(client, file, 'articles', form.title || 'artikel');
    if (result.error) {
      showNotice('error', result.error);
    } else {
      setForm((current) => ({ ...current, image_url: result.publicUrl }));
      showNotice('success', 'Gambar artikel berhasil diupload.');
    }
    setUploading(false);
  };

  return (
    <div className="admin-workspace">
      <form className="admin-panel admin-form-panel" onSubmit={save}>
        <div className="admin-panel-head">
          <h2>{form.id ? 'Edit Artikel' : 'Tambah Artikel'}</h2>
          {form.id && <button type="button" className="admin-text-btn" onClick={reset}>Batal edit</button>}
        </div>

        <TextField label="Judul" value={form.title} onChange={(value) => setForm({ ...form, title: value })} required />
        <TextField label="Kategori" value={form.category} onChange={(value) => setForm({ ...form, category: value })} required />
        <TextArea label="Ringkasan" value={form.excerpt} onChange={(value) => setForm({ ...form, excerpt: value })} required rows={3} />
        <ImageUploadField
          label="Gambar utama"
          imageUrl={form.image_url}
          uploading={uploading}
          onUpload={uploadArticleImage}
          onError={(message) => showNotice('error', message, true)}
          onClear={() => setForm({ ...form, image_url: '' })}
        />
        <TextField label="Tanggal publish" type="date" value={form.published_at} onChange={(value) => setForm({ ...form, published_at: value })} />
        <TextField label="Estimasi baca" value={form.read_time} onChange={(value) => setForm({ ...form, read_time: value })} placeholder="Contoh: 5 menit baca" />

        <TextArea
          label="Isi artikel"
          value={form.content_text}
          onChange={(value) => setForm({ ...form, content_text: value })}
          rows={12}
          placeholder={'Format tiap bagian:\nHeading bagian\nIsi paragraf artikel\n\nHeading bagian berikutnya\nIsi paragraf berikutnya'}
        />
        <TextArea label="Takeaway" value={form.takeaway} onChange={(value) => setForm({ ...form, takeaway: value })} rows={3} />
        <TextField label="Urutan tampil" type="number" value={form.sort_order} onChange={(value) => setForm({ ...form, sort_order: value })} />

        <ToggleField label="Publish artikel" checked={form.is_published} onChange={(checked) => setForm({ ...form, is_published: checked })} />

        <button className="admin-primary-btn" type="submit" disabled={saving}>
          <i className="bi bi-save"></i> {saving ? 'Menyimpan...' : 'Simpan Artikel'}
        </button>

        {form.id && (
          <button
            className="admin-danger-btn"
            type="button"
            onClick={() => remove({ id: form.id, title: form.title })}
          >
            <i className="bi bi-trash"></i> Hapus Artikel Ini
          </button>
        )}
      </form>

      <div className="admin-panel">
        <div className="admin-panel-head">
          <h2>Daftar Artikel</h2>
          <span>{articles.length} data</span>
        </div>
        <div className="admin-list">
          {articles.map((article) => (
            <div className="admin-list-item article" key={article.id}>
              <div className="admin-thumb">
                {article.image_url ? <img src={article.image_url} alt={article.title} /> : <i className="bi bi-newspaper"></i>}
              </div>
              <div className="admin-list-copy">
                <strong>{article.title}</strong>
                <span>{article.category} · {formatIsoDate(article.published_at)}</span>
              </div>
              <div className="admin-status">
                {article.is_published ? 'Publish' : 'Draft'}
              </div>
              <div className="admin-row-actions">
                <button className="admin-action-btn" onClick={() => edit(article)} aria-label={'Edit ' + article.title}>
                  <i className="bi bi-pencil"></i><span>Edit</span>
                </button>
                <button className="admin-action-btn danger" onClick={() => remove(article)} aria-label={'Hapus ' + article.title}>
                  <i className="bi bi-trash"></i><span>Hapus</span>
                </button>
              </div>
            </div>
          ))}
          {!articles.length && <EmptyState label="Belum ada artikel di Supabase." />}
        </div>
      </div>
    </div>
  );
}

function GalleryManager({ client, galleryItems, onChanged, showNotice, showConfirm }) {
  const [form, setForm] = useStateA(EMPTY_GALLERY_ITEM);
  const [saving, setSaving] = useStateA(false);
  const [uploading, setUploading] = useStateA(false);

  const edit = (item) => {
    setForm({
      id: item.id,
      label: item.label || '',
      description: item.description || '',
      icon: item.icon || 'bi-people',
      image_url: item.image_url || '',
      is_active: Boolean(item.is_active),
      sort_order: item.sort_order || 0,
    });
  };

  const reset = () => setForm(EMPTY_GALLERY_ITEM);

  const save = async (event) => {
    event.preventDefault();
    if (!form.image_url) {
      showNotice('error', 'Upload gambar galeri terlebih dahulu.');
      return;
    }

    setSaving(true);

    const payload = {
      label: form.label.trim(),
      description: emptyToNull(form.description),
      icon: form.icon || 'bi-people',
      image_url: form.image_url,
      is_active: form.is_active,
      sort_order: Number(form.sort_order) || 0,
    };

    const result = form.id
      ? await client.from('gallery_items').update(payload).eq('id', form.id)
      : await client.from('gallery_items').insert(payload);

    if (result.error) {
      showNotice('error', result.error.message);
    } else {
      showNotice('success', form.id ? 'Galeri berhasil diperbarui.' : 'Galeri berhasil ditambahkan.', true);
      reset();
      await onChanged();
    }
    setSaving(false);
  };

  const remove = async (item) => {
    const confirmed = await showConfirm({
      title: 'Hapus galeri?',
      text: 'Galeri "' + item.label + '" akan dihapus permanen dari Supabase.',
      confirmText: 'Ya, hapus',
      type: 'warning',
    });
    if (!confirmed) return;
    const { error } = await client.from('gallery_items').delete().eq('id', item.id);
    if (error) showNotice('error', error.message);
    else {
      showNotice('success', 'Galeri berhasil dihapus.', true);
      await onChanged();
      if (form.id === item.id) reset();
    }
  };

  const uploadGalleryImage = async (file) => {
    setUploading(true);
    const result = await uploadImageFile(client, file, 'gallery', form.label || 'galeri');
    if (result.error) {
      showNotice('error', result.error);
    } else {
      setForm((current) => ({ ...current, image_url: result.publicUrl }));
      showNotice('success', 'Gambar galeri berhasil diupload.');
    }
    setUploading(false);
  };

  return (
    <div className="admin-workspace">
      <form className="admin-panel admin-form-panel" onSubmit={save}>
        <div className="admin-panel-head">
          <h2>{form.id ? 'Edit Galeri' : 'Tambah Galeri'}</h2>
          {form.id && <button type="button" className="admin-text-btn" onClick={reset}>Batal edit</button>}
        </div>
        <p className="admin-help-text">Homepage menampilkan 5 galeri aktif teratas sesuai urutan tampil.</p>

        <TextField label="Judul/label foto" value={form.label} onChange={(value) => setForm({ ...form, label: value })} required />
        <TextArea
          label="Caption kecil"
          value={form.description}
          onChange={(value) => setForm({ ...form, description: value })}
          rows={2}
          placeholder="Contoh: Suasana belajar terarah dan interaktif"
        />
        <SelectField
          label="Ikon overlay"
          value={form.icon}
          onChange={(value) => setForm({ ...form, icon: value })}
          options={[
            ['bi-people', 'Kelas / grup'],
            ['bi-chat-square-dots', 'Diskusi'],
            ['bi-person', 'Privat'],
            ['bi-mortarboard', 'Workshop / PTN'],
            ['bi-star', 'Aktif / unggulan'],
          ]}
        />
        <ImageUploadField
          label="Foto galeri"
          imageUrl={form.image_url}
          uploading={uploading}
          onUpload={uploadGalleryImage}
          onError={(message) => showNotice('error', message, true)}
          onClear={() => setForm({ ...form, image_url: '' })}
        />
        <TextField label="Urutan tampil" type="number" value={form.sort_order} onChange={(value) => setForm({ ...form, sort_order: value })} />
        <ToggleField label="Aktif tampil" checked={form.is_active} onChange={(checked) => setForm({ ...form, is_active: checked })} />

        <button className="admin-primary-btn" type="submit" disabled={saving}>
          <i className="bi bi-save"></i> {saving ? 'Menyimpan...' : 'Simpan Galeri'}
        </button>

        {form.id && (
          <button
            className="admin-danger-btn"
            type="button"
            onClick={() => remove({ id: form.id, label: form.label })}
          >
            <i className="bi bi-trash"></i> Hapus Galeri Ini
          </button>
        )}
      </form>

      <div className="admin-panel">
        <div className="admin-panel-head">
          <h2>Daftar Galeri</h2>
          <span>{galleryItems.length} data</span>
        </div>
        <div className="admin-list">
          {galleryItems.map((item) => (
            <div className="admin-list-item article" key={item.id}>
              <div className="admin-thumb">
                {item.image_url ? <img src={item.image_url} alt={item.label} /> : <i className="bi bi-image"></i>}
              </div>
              <div className="admin-list-copy">
                <strong>{item.label}</strong>
                {item.description && <span>{item.description}</span>}
                <span>Galeri Kegiatan · Urutan {item.sort_order || 0}</span>
              </div>
              <div className="admin-status">
                {item.is_active ? 'Aktif' : 'Nonaktif'}
              </div>
              <div className="admin-row-actions">
                <button className="admin-action-btn" onClick={() => edit(item)} aria-label={'Edit ' + item.label}>
                  <i className="bi bi-pencil"></i><span>Edit</span>
                </button>
                <button className="admin-action-btn danger" onClick={() => remove(item)} aria-label={'Hapus ' + item.label}>
                  <i className="bi bi-trash"></i><span>Hapus</span>
                </button>
              </div>
            </div>
          ))}
          {!galleryItems.length && <EmptyState label="Belum ada galeri kegiatan di Supabase." />}
        </div>
      </div>
    </div>
  );
}

function TestimonialManager({ client, testimonials, onChanged, showNotice, showConfirm }) {
  const [form, setForm] = useStateA(EMPTY_TESTIMONIAL);
  const [saving, setSaving] = useStateA(false);
  const [uploading, setUploading] = useStateA(false);

  const edit = (testimonial) => {
    setForm({
      id: testimonial.id,
      alt_text: testimonial.alt_text || 'Testimoni Alumni BLC',
      image_url: testimonial.image_url || '',
      is_active: Boolean(testimonial.is_active),
      sort_order: testimonial.sort_order || 0,
    });
  };

  const reset = () => setForm(EMPTY_TESTIMONIAL);

  const save = async (event) => {
    event.preventDefault();
    if (!form.image_url) {
      showNotice('error', 'Upload gambar testimoni terlebih dahulu.');
      return;
    }

    setSaving(true);

    const payload = {
      alt_text: form.alt_text.trim() || 'Testimoni Alumni BLC',
      image_url: form.image_url,
      is_active: form.is_active,
      sort_order: Number(form.sort_order) || 0,
    };

    const result = form.id
      ? await client.from('testimonials').update(payload).eq('id', form.id)
      : await client.from('testimonials').insert(payload);

    if (result.error) {
      showNotice('error', result.error.message);
    } else {
      showNotice('success', form.id ? 'Testimoni berhasil diperbarui.' : 'Testimoni berhasil ditambahkan.', true);
      reset();
      await onChanged();
    }
    setSaving(false);
  };

  const remove = async (testimonial) => {
    const confirmed = await showConfirm({
      title: 'Hapus testimoni?',
      text: 'Testimoni ini akan dihapus permanen dari Supabase.',
      confirmText: 'Ya, hapus',
      type: 'warning',
    });
    if (!confirmed) return;
    const { error } = await client.from('testimonials').delete().eq('id', testimonial.id);
    if (error) showNotice('error', error.message);
    else {
      showNotice('success', 'Testimoni berhasil dihapus.', true);
      await onChanged();
      if (form.id === testimonial.id) reset();
    }
  };

  const uploadTestimonialImage = async (file) => {
    setUploading(true);
    const result = await uploadImageFile(client, file, 'testimonials', form.alt_text || 'testimoni');
    if (result.error) {
      showNotice('error', result.error);
    } else {
      setForm((current) => ({ ...current, image_url: result.publicUrl }));
      showNotice('success', 'Gambar testimoni berhasil diupload.');
    }
    setUploading(false);
  };

  return (
    <div className="admin-workspace">
      <form className="admin-panel admin-form-panel" onSubmit={save}>
        <div className="admin-panel-head">
          <h2>{form.id ? 'Edit Testimoni' : 'Tambah Testimoni'}</h2>
          {form.id && <button type="button" className="admin-text-btn" onClick={reset}>Batal edit</button>}
        </div>

        <TextField label="Teks alternatif" value={form.alt_text} onChange={(value) => setForm({ ...form, alt_text: value })} required />
        <ImageUploadField
          label="Gambar testimoni"
          imageUrl={form.image_url}
          uploading={uploading}
          onUpload={uploadTestimonialImage}
          onError={(message) => showNotice('error', message, true)}
          onClear={() => setForm({ ...form, image_url: '' })}
        />
        <TextField label="Urutan tampil" type="number" value={form.sort_order} onChange={(value) => setForm({ ...form, sort_order: value })} />
        <ToggleField label="Aktif tampil" checked={form.is_active} onChange={(checked) => setForm({ ...form, is_active: checked })} />

        <button className="admin-primary-btn" type="submit" disabled={saving}>
          <i className="bi bi-save"></i> {saving ? 'Menyimpan...' : 'Simpan Testimoni'}
        </button>

        {form.id && (
          <button
            className="admin-danger-btn"
            type="button"
            onClick={() => remove({ id: form.id })}
          >
            <i className="bi bi-trash"></i> Hapus Testimoni Ini
          </button>
        )}
      </form>

      <div className="admin-panel">
        <div className="admin-panel-head">
          <h2>Daftar Testimoni</h2>
          <span>{testimonials.length} data</span>
        </div>
        <div className="admin-list">
          {testimonials.map((testimonial) => (
            <div className="admin-list-item article" key={testimonial.id}>
              <div className="admin-thumb">
                {testimonial.image_url ? <img src={testimonial.image_url} alt={testimonial.alt_text} /> : <i className="bi bi-image"></i>}
              </div>
              <div className="admin-list-copy">
                <strong>{testimonial.alt_text}</strong>
                <span>Testimoni Alumni · Urutan {testimonial.sort_order || 0}</span>
              </div>
              <div className="admin-status">
                {testimonial.is_active ? 'Aktif' : 'Nonaktif'}
              </div>
              <div className="admin-row-actions">
                <button className="admin-action-btn" onClick={() => edit(testimonial)} aria-label="Edit testimoni">
                  <i className="bi bi-pencil"></i><span>Edit</span>
                </button>
                <button className="admin-action-btn danger" onClick={() => remove(testimonial)} aria-label="Hapus testimoni">
                  <i className="bi bi-trash"></i><span>Hapus</span>
                </button>
              </div>
            </div>
          ))}
          {!testimonials.length && <EmptyState label="Belum ada testimoni alumni di Supabase." />}
        </div>
      </div>
    </div>
  );
}

function ImportPanel({ client, onChanged, showNotice, showConfirm, teachersCount, articlesCount, galleryCount, testimonialsCount }) {
  const [importing, setImporting] = useStateA(false);

  const importLocalData = async () => {
    const confirmed = await showConfirm({
      title: 'Import data lokal?',
      text: 'Data dari data.jsx akan dimasukkan ke Supabase. Jalankan sekali saja agar tidak duplikat.',
      confirmText: 'Ya, import',
      type: 'warning',
    });
    if (!confirmed) return;
    setImporting(true);

    const teacherRows = buildLocalTeacherRows();
    const articleRows = buildLocalArticleRows();
    const galleryRows = buildLocalGalleryRows();
    const testimonialRows = buildLocalTestimonialRows();

    const [teachersResult, articlesResult, galleryResult, testimonialResult] = await Promise.all([
      teacherRows.length ? client.from('teachers').insert(teacherRows) : Promise.resolve({ error: null }),
      articleRows.length ? client.from('articles').insert(articleRows) : Promise.resolve({ error: null }),
      galleryRows.length ? client.from('gallery_items').insert(galleryRows) : Promise.resolve({ error: null }),
      testimonialRows.length ? client.from('testimonials').insert(testimonialRows) : Promise.resolve({ error: null }),
    ]);

    if (teachersResult.error || articlesResult.error || galleryResult.error || testimonialResult.error) {
      showNotice('error', teachersResult.error?.message || articlesResult.error?.message || galleryResult.error?.message || testimonialResult.error?.message);
    } else {
      showNotice('success', 'Data lokal berhasil diimport ke Supabase.');
      await onChanged();
    }
    setImporting(false);
  };

  return (
    <div className="admin-panel admin-import-panel">
      <div className="admin-panel-head">
        <h2>Import dari data.jsx</h2>
      </div>
      <p>
        Gunakan tombol ini untuk memindahkan data awal guru, artikel, galeri, dan testimoni dari file lokal ke Supabase.
        Setelah data masuk, edit berikutnya dilakukan dari admin panel ini.
      </p>
      <div className="admin-import-stats">
        <div><strong>{teachersCount}</strong><span>guru di Supabase</span></div>
        <div><strong>{articlesCount}</strong><span>artikel di Supabase</span></div>
        <div><strong>{galleryCount}</strong><span>galeri di Supabase</span></div>
        <div><strong>{testimonialsCount}</strong><span>testimoni di Supabase</span></div>
      </div>
      <button className="admin-primary-btn" onClick={importLocalData} disabled={importing}>
        <i className="bi bi-database-add"></i>
        {importing ? 'Mengimport...' : 'Import Data Lokal'}
      </button>
    </div>
  );
}

function TextField({ label, value, onChange, type = 'text', required = false, placeholder = '' }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        required={required}
      />
    </label>
  );
}

function TextArea({ label, value, onChange, required = false, rows = 5, placeholder = '' }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        required={required}
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options, required = false }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} required={required}>
        {options.map(([optionValue, optionLabel]) => (
          <option value={optionValue} key={optionValue}>{optionLabel}</option>
        ))}
      </select>
    </label>
  );
}

function ImageUploadField({ label, imageUrl, uploading, onUpload, onClear, onError }) {
  const [localPreview, setLocalPreview] = useStateA('');

  useEffectA(() => {
    if (!imageUrl) setLocalPreview('');
  }, [imageUrl]);

  const handleChange = async (event) => {
    const file = event.target.files && event.target.files[0];
    event.target.value = '';
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      if (onError) onError(validationError);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);

    try {
      await onUpload(file);
      setLocalPreview('');
    } finally {
      window.setTimeout(() => URL.revokeObjectURL(previewUrl), 1000);
    }
  };

  const preview = localPreview || imageUrl;

  return (
    <div className="admin-field admin-upload-field">
      <span>{label}</span>
      <div className="admin-image-uploader">
        <div className="admin-image-preview">
          {preview ? (
            <img src={preview} alt={label} />
          ) : (
            <div>
              <i className="bi bi-image"></i>
              <span>Belum ada gambar</span>
            </div>
          )}
        </div>

        <div className="admin-upload-actions">
          <label className="admin-upload-btn">
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleChange}
              disabled={uploading}
            />
            <i className="bi bi-cloud-arrow-up"></i>
            {uploading ? 'Mengupload...' : 'Pilih & Upload Gambar'}
          </label>

          {imageUrl && (
            <button className="admin-clear-image-btn" type="button" onClick={onClear} disabled={uploading}>
              <i className="bi bi-x-circle"></i> Hapus dari form
            </button>
          )}

          <small>Format JPG, PNG, WEBP, atau GIF. Maksimal 5 MB.</small>
        </div>
      </div>
    </div>
  );
}

function ToggleField({ label, checked, onChange }) {
  return (
    <label className="admin-switch">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span></span>
      <strong>{label}</strong>
    </label>
  );
}

function EmptyState({ label }) {
  return (
    <div className="admin-empty">
      <i className="bi bi-inbox"></i>
      <span>{label}</span>
    </div>
  );
}

function AdminLoading({ label, compact = false }) {
  return (
    <div className={compact ? 'admin-loading compact' : 'admin-loading'}>
      <i className="bi bi-arrow-repeat"></i>
      <span>{label}</span>
    </div>
  );
}

function emptyToNull(value) {
  const normalized = String(value || '').trim();
  return normalized ? normalized : null;
}

async function uploadImageFile(client, file, folder, seedName) {
  const validationError = validateImageFile(file);
  if (validationError) return { error: validationError };

  const extension = getFileExtension(file.name, file.type);
  const slug = slugify(seedName || file.name || 'gambar');
  const path = `${folder}/${Date.now()}-${slug}.${extension}`;

  const { error: uploadError } = await client.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, {
      cacheControl: '31536000',
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) return { error: uploadError.message };

  const { data } = client.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  if (!data || !data.publicUrl) {
    return { error: 'Upload berhasil, tapi URL publik gambar tidak bisa dibuat.' };
  }

  return {
    path,
    publicUrl: data.publicUrl,
  };
}

function validateImageFile(file) {
  if (!file) return 'File gambar belum dipilih.';
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
    return 'Format gambar harus JPG, PNG, WEBP, atau GIF.';
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return 'Ukuran gambar maksimal 5 MB.';
  }
  return '';
}

function getFileExtension(fileName, mimeType) {
  const extension = String(fileName || '').split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension)) {
    return extension === 'jpeg' ? 'jpg' : extension;
  }
  const map = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
  };
  return map[mimeType] || 'jpg';
}

function slugify(value) {
  const slug = String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'gambar';
}

function getInitials(name) {
  return String(name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'BLC';
}

function contentToText(content) {
  if (!Array.isArray(content)) return '';
  return content.map((section) => {
    return [section.heading, section.body].filter(Boolean).join('\n');
  }).join('\n\n');
}

function textToContent(text) {
  return String(text || '')
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
      return {
        heading: lines[0] || 'Isi Artikel',
        body: lines.slice(1).join(' ') || lines[0] || '',
      };
    });
}

function formatIsoDate(value) {
  if (!value) return 'Belum ada tanggal';
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value + 'T00:00:00'));
}

function buildLocalTeacherRows() {
  const rows = [];

  (BLC_DATA.TEAM_MGMT || []).forEach((teacher, index) => {
    rows.push({
      name: teacher.name,
      role: teacher.role || '',
      subject: 'Manajemen',
      university: teacher.uni || null,
      image_url: teacher.img || null,
      initials: teacher.placeholder || getInitials(teacher.name),
      is_management: true,
      is_featured: false,
      is_active: true,
      sort_order: index,
    });
  });

  Object.entries(BLC_DATA.TEAM_TEACHERS || {}).forEach(([subject, list]) => {
    list.forEach((teacher, index) => {
      rows.push({
        name: teacher.name,
        role: teacher.role || '',
        subject,
        university: teacher.uni || null,
        image_url: teacher.img || null,
        initials: teacher.placeholder || getInitials(teacher.name),
        is_management: false,
        is_featured: false,
        is_active: true,
        sort_order: index,
      });
    });
  });

  return rows;
}

function buildLocalArticleRows() {
  return (BLC_DATA.BLOG_POSTS || []).map((article, index) => ({
    category: article.cat || 'Artikel',
    title: article.title,
    excerpt: article.excerpt || '',
    image_url: article.image || null,
    published_at: parseLocalDate(article.date),
    read_time: article.readTime || null,
    content: Array.isArray(article.content) ? article.content : [],
    takeaway: article.takeaway || null,
    is_published: true,
    sort_order: index,
  }));
}

function buildLocalGalleryRows() {
  return (BLC_DATA.GALLERY_ITEMS || []).map((item, index) => ({
    label: item.label || 'Galeri Kegiatan',
    description: item.description || null,
    icon: item.icon || 'bi-people',
    image_url: item.image || '',
    is_active: true,
    sort_order: index,
  })).filter((item) => item.image_url);
}

function buildLocalTestimonialRows() {
  return (BLC_DATA.TESTIMONIALS || []).map((item, index) => ({
    alt_text: item.alt || 'Testimoni Alumni BLC',
    image_url: item.image || '',
    is_active: true,
    sort_order: index,
  })).filter((item) => item.image_url);
}

function parseLocalDate(value) {
  if (!value) return null;
  const monthMap = {
    Jan: '01',
    Feb: '02',
    Mar: '03',
    Apr: '04',
    Mei: '05',
    Jun: '06',
    Jul: '07',
    Agu: '08',
    Sep: '09',
    Okt: '10',
    Nov: '11',
    Des: '12',
  };
  const parts = String(value).split(' ');
  if (parts.length !== 3 || !monthMap[parts[1]]) return null;
  return `${parts[2]}-${monthMap[parts[1]]}-${parts[0].padStart(2, '0')}`;
}

ReactDOM.createRoot(document.getElementById('admin-root')).render(<AdminApp />);
