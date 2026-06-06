/* global React, ReactDOM, BLC_DATA, Header, Hero, About, StatsBand, VisionMission, Services, Team, Achievement, Testimonials, Gallery, Blog, FAQ, Contact, CTABand, Footer, Registration, useTweaks, TweaksPanel, TweakSection, TweakColor, TweakRadio, TweakSelect */
const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primaryColor": "#1B3A8A",
  "accentColor": "#F5A623",
  "heroLayout": "image-right",
  "formMode": "single",
  "tone": "formal",
  "fontHead": "Plus Jakarta Sans"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const setTweaks = (obj) => { Object.entries(obj).forEach(([k,v]) => setTweak(k, v)); };
  const [page, setPage] = useState('home');
  const [siteData, setSiteData] = useState(BLC_DATA);

  // Apply CSS variables from tweaks
  useEffect(() => {
    const root = document.documentElement.style;
    const p = tweaks.primaryColor;
    const a = tweaks.accentColor;
    root.setProperty('--brand', p);
    root.setProperty('--brand-deep', shade(p, -25));
    root.setProperty('--brand-light', shade(p, 15));
    root.setProperty('--accent', a);
    root.setProperty('--accent-deep', shade(a, -15));
    root.setProperty('--bg-tint', mix(p, '#FFFFFF', 0.92));
    root.setProperty('--font-head', `'${tweaks.fontHead}', system-ui, sans-serif`);
  }, [tweaks.primaryColor, tweaks.accentColor, tweaks.fontHead]);

  useEffect(() => {
    const client = createPublicSupabaseClient();
    if (!client) return;

    let cancelled = false;

    const loadRemoteData = async () => {
      const [teacherResult, articleResult, galleryResult, testimonialResult] = await Promise.all([
        client
          .from('teachers')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false }),
        client
          .from('articles')
          .select('*')
          .eq('is_published', true)
          .order('sort_order', { ascending: true })
          .order('published_at', { ascending: false }),
        client
          .from('gallery_items')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false }),
        client
          .from('testimonials')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false }),
      ]);

      if (cancelled) return;

      [teacherResult, articleResult, galleryResult, testimonialResult]
        .filter((result) => result.error)
        .forEach((result) => console.warn('Supabase data fallback:', result.error));

      setSiteData((currentData) => {
        const nextData = { ...currentData };

        if (!teacherResult.error && teacherResult.data && teacherResult.data.length) {
          const mappedTeachers = mapSupabaseTeachers(teacherResult.data);
          nextData.TEAM_MGMT = mappedTeachers.management;
          nextData.TEAM_TEACHERS = mappedTeachers.teachers;
        }

        if (!articleResult.error && articleResult.data && articleResult.data.length) {
          nextData.BLOG_POSTS = articleResult.data.map(mapSupabaseArticle);
        }

        if (!galleryResult.error && galleryResult.data && galleryResult.data.length) {
          nextData.GALLERY_ITEMS = galleryResult.data.map(mapSupabaseGalleryItem);
        }

        if (!testimonialResult.error && testimonialResult.data && testimonialResult.data.length) {
          nextData.TESTIMONIALS = testimonialResult.data.map(mapSupabaseTestimonial);
        }

        return nextData;
      });
    };

    loadRemoteData();

    return () => {
      cancelled = true;
    };
  }, []);

  const onNavClick = (id) => {
    if (page !== 'home') { setPage('home'); setTimeout(()=>scrollTo(id), 80); }
    else scrollTo(id);
  };
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({top: el.offsetTop - 70, behavior: 'smooth'});
  };
  const goRegister = () => { setPage('register'); window.scrollTo({top:0, behavior:'instant'}); };
  const goHome = () => { setPage('home'); window.scrollTo({top:0, behavior:'instant'}); };

  return (
    <>
      {page === 'home' ? (
        <>
          <Header page="home" onHome={goHome} onNavClick={onNavClick} onRegister={goRegister}/>
          <Hero layout={tweaks.heroLayout} tone={tweaks.tone} onRegister={goRegister}/>
          <About tone={tweaks.tone}/>
          <StatsBand/>
          <VisionMission/>
          <Services onRegister={goRegister}/>
          <Team data={siteData}/>
          <Achievement/>
          <Testimonials data={siteData}/>
          <Gallery data={siteData}/>
          <Blog data={siteData}/>
          <FAQ/>
          <Contact/>
          <CTABand onRegister={goRegister}/>
          <Footer onNavClick={onNavClick} onRegister={goRegister}/>
        </>
      ) : (
        <Registration mode={tweaks.formMode} onHome={goHome} onNavClick={onNavClick}/>
      )}

      <a className="wa-fab" href="https://wa.me/6281221420400" target="_blank" rel="noreferrer" aria-label="WhatsApp">
        <i className="bi bi-whatsapp"></i>
      </a>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Brand & Warna">
          <TweakColor label="Warna Utama (Brand)" value={tweaks.primaryColor} onChange={v=>setTweaks({primaryColor:v})}/>
          <TweakColor label="Warna Aksen" value={tweaks.accentColor} onChange={v=>setTweaks({accentColor:v})}/>
          <div style={{display:'flex', gap:6, flexWrap:'wrap', marginTop:8}}>
            {[
              {p:'#1B3A8A', a:'#F5A623', label:'Navy Gold'},
              {p:'#0F4C81', a:'#FFB400', label:'Royal'},
              {p:'#1E40AF', a:'#EA580C', label:'Vivid'},
              {p:'#0E7490', a:'#F59E0B', label:'Teal'},
              {p:'#7C3AED', a:'#F59E0B', label:'Violet'},
            ].map((c,i) => (
              <button key={i} onClick={()=>setTweaks({primaryColor:c.p, accentColor:c.a})}
                style={{padding:'4px 8px', fontSize:11, border:'1px solid #ddd', borderRadius:6, background:'#fff', cursor:'pointer', display:'flex', gap:4, alignItems:'center'}}>
                <span style={{width:10, height:10, borderRadius:'50%', background:c.p}}></span>
                <span style={{width:10, height:10, borderRadius:'50%', background:c.a}}></span>
                {c.label}
              </button>
            ))}
          </div>
        </TweakSection>

        <TweakSection title="Layout & Tipografi">
          <TweakRadio label="Layout Hero" value={tweaks.heroLayout} onChange={v=>setTweaks({heroLayout:v})}
            options={[
              {value:'image-right', label:'Gambar Kanan'},
              {value:'image-left', label:'Gambar Kiri'},
              {value:'full', label:'Centered (no image)'},
            ]}/>
          <TweakSelect label="Font Heading" value={tweaks.fontHead} onChange={v=>setTweaks({fontHead:v})}
            options={[
              {value:'Plus Jakarta Sans', label:'Plus Jakarta Sans'},
              {value:'Poppins', label:'Poppins'},
              {value:'Manrope', label:'Manrope'},
              {value:'Outfit', label:'Outfit'},
              {value:'Sora', label:'Sora'},
            ]}/>
        </TweakSection>

        <TweakSection title="Konten">
          <TweakRadio label="Tone Copywriting" value={tweaks.tone} onChange={v=>setTweaks({tone:v})}
            options={[
              {value:'formal', label:'Formal & Profesional'},
              {value:'casual', label:'Santai & Friendly'},
            ]}/>
          <TweakRadio label="Form Pendaftaran" value={tweaks.formMode} onChange={v=>setTweaks({formMode:v})}
            options={[
              {value:'single', label:'Single Page'},
              {value:'multi', label:'Multi-Step Wizard'},
            ]}/>
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

/* color helpers */
function hexToRgb(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];}
function rgbToHex(r,g,b){return '#'+[r,g,b].map(x=>Math.max(0,Math.min(255,Math.round(x))).toString(16).padStart(2,'0')).join('');}
function shade(hex, pct){const [r,g,b]=hexToRgb(hex);const f=pct/100;if(pct<0){return rgbToHex(r*(1+f),g*(1+f),b*(1+f));}return rgbToHex(r+(255-r)*f,g+(255-g)*f,b+(255-b)*f);}
function mix(a,b,t){const A=hexToRgb(a),B=hexToRgb(b);return rgbToHex(A[0]*(1-t)+B[0]*t,A[1]*(1-t)+B[1]*t,A[2]*(1-t)+B[2]*t);}

function createPublicSupabaseClient() {
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

function mapSupabaseTeachers(rows) {
  const subjectOrder = ['Matematika', 'Fisika', 'Kimia', 'Biologi', 'Lainnya'];
  const teachers = subjectOrder.reduce((groups, subject) => {
    groups[subject] = [];
    return groups;
  }, {});

  const management = [];

  rows.forEach((row) => {
    const item = {
      name: row.name,
      role: row.role,
      uni: row.university || undefined,
      placeholder: row.initials || getInitialsFromName(row.name),
      img: row.image_url || undefined,
    };

    if (row.is_management) {
      management.push(item);
      return;
    }

    const subject = row.subject || 'Lainnya';
    if (!teachers[subject]) teachers[subject] = [];
    teachers[subject].push(item);
  });

  return {
    management,
    teachers: Object.fromEntries(
      Object.entries(teachers).filter(([, list]) => list.length)
    ),
  };
}

function mapSupabaseArticle(row) {
  return {
    cat: row.category || 'Artikel',
    date: formatDisplayDate(row.published_at),
    readTime: row.read_time || '',
    title: row.title,
    excerpt: row.excerpt || '',
    image: row.image_url || '',
    content: Array.isArray(row.content) ? row.content : [],
    takeaway: row.takeaway || '',
  };
}

function mapSupabaseGalleryItem(row) {
  return {
    label: row.label,
    image: row.image_url || '',
  };
}

function mapSupabaseTestimonial(row) {
  return {
    image: row.image_url || '',
    alt: row.alt_text || 'Testimoni Alumni BLC',
  };
}

function formatDisplayDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value + 'T00:00:00'));
}

function getInitialsFromName(name) {
  return String(name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'BLC';
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
