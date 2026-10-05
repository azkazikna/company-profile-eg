#!/usr/bin/env node
// Generator halaman statis (Node.js, tanpa dependency). Jalankan: node build.js
// Saat pindah ke Laravel: pecah jadi layout Blade + partials.
const fs = require('fs'), path = require('path');
const R = __dirname, U = 'https://www.eghans.com'; // TODO domain

const SV = {
  'financial-advisory': ['Financial Advisory', 'Understand your numbers. Make better decisions.',
    'Pahami kondisi keuangan perusahaan dengan lebih jelas dan ambil keputusan berdasarkan financial insight yang bermakna.',
    ['Financial Health Assessment', 'Financial Statement Analysis', 'Cash Flow Analysis', 'Profitability Analysis', 'Cost Analysis', 'Financial Planning', 'Management Reporting'],
    'Jasa Konsultan Keuangan Perusahaan | Financial Advisory – PT Evergreen Hans',
    'Jasa konsultan keuangan dan analisis keuangan perusahaan dari PT Evergreen Hans: financial health assessment, cash flow, profitabilitas, hingga management reporting.', 'fin'],
  'tax-compliance': ['Tax & Compliance', 'Stay compliant. Manage risks with confidence.',
    'Hadapi kewajiban pajak dan regulasi dengan lebih percaya diri dan persiapan yang lebih baik.',
    ['Tax Compliance', 'Tax Review', 'Tax Advisory', 'Tax Reconciliation', 'Tax Risk Assessment', 'Tax Reporting Assistance', 'Regulatory Compliance'],
    'Jasa Konsultan Pajak Perusahaan | Tax & Compliance – PT Evergreen Hans',
    'Jasa konsultan pajak dan kepatuhan pajak perusahaan: tax review, tax advisory, rekonsiliasi pajak, tax risk assessment, dan regulatory compliance bersama PT Evergreen Hans.', 'tax'],
  'business-technology': ['Business Technology', 'Turn complex processes into smarter digital workflows.',
    'Technology should adapt to your business — not the other way around.',
    ['Business Application Development', 'Business Process Digitization', 'System Integration', 'API Integration', 'Data & Reporting', 'Workflow Automation', 'Custom Business Solutions'],
    'Konsultan Teknologi Informasi & Pengembangan Aplikasi Bisnis | PT Evergreen Hans',
    'Konsultan sistem informasi dan pengembangan aplikasi bisnis: digitalisasi proses, integrasi sistem, API, workflow automation, dan solusi bisnis kustom dari PT Evergreen Hans.', 'tech'],
};
const IND = [['manufacturing', 'Manufacturing'], ['trading', 'Trading & Distribution'], ['services', 'Services'], ['garment', 'Garment & Textile'], ['other', 'Other Industries']];
const INDN = Object.fromEntries(IND);
// PLACEHOLDER: ganti dengan data nyata dari CMS (Laravel)
const CL = [['Nama Klien 01', 'manufacturing'], ['Nama Klien 02', 'trading'], ['Nama Klien 03', 'garment'], ['Nama Klien 04', 'services'], ['Nama Klien 05', 'manufacturing'],
  ['Nama Klien 06', 'trading'], ['Nama Klien 07', 'other'], ['Nama Klien 08', 'garment'], ['Nama Klien 09', 'services'], ['Nama Klien 10', 'manufacturing']];
const CS = [['Financial', 'Analisis profitabilitas lintas lini produk', 'Memetakan margin per produk agar manajemen tahu di mana bisnis benar-benar menghasilkan.', 'cf'],
  ['Tax', 'Review kepatuhan dan rekonsiliasi pajak', 'Merapikan data pajak dan menyiapkan perusahaan menghadapi pemeriksaan dengan lebih tenang.', 'ct'],
  ['Technology', 'Digitalisasi inventory dan pelaporan', 'Mengganti proses manual dengan alur kerja digital yang terintegrasi dan mudah dilaporkan.', 'cc']];
const IN = [['Finance', 'Membaca laporan arus kas dengan benar', 'Panduan singkat memahami cash flow untuk pemilik bisnis.', '12 Jan 2026', 5, 'fin'],
  ['Tax', 'Checklist kepatuhan pajak perusahaan', 'Hal-hal yang perlu disiapkan sebelum periode pelaporan.', '28 Jan 2026', 6, 'tax'],
  ['Technology', 'Kapan bisnis perlu mendigitalkan prosesnya?', 'Tanda-tanda proses manual mulai menghambat pertumbuhan.', '10 Feb 2026', 4, 'tech']];
const STEPS = [['UNDERSTAND', 'Memahami bisnis, tujuan, dan tantangan Anda sebelum menawarkan solusi.'], ['ANALYZE', 'Menggunakan data untuk menemukan insight yang tersembunyi.'],
  ['ADVISE', 'Menyusun rekomendasi yang praktis dan sesuai kondisi perusahaan.'], ['IMPLEMENT', 'Mendampingi penerapan, dari proses hingga sistem.'], ['IMPROVE', 'Mengukur hasil dan terus memperbaiki agar dampaknya bertahan.']];
const NAV = [['/', 'Beranda'], ['/about', 'Tentang'], ['/services', 'Layanan'], ['/industries', 'Industri'], ['/clients', 'Klien'], ['/case-studies', 'Studi Kasus'], ['/insights', 'Insight'], ['/contact', 'Kontak']];

// Foto: Unsplash (ganti dengan foto sendiri/berlisensi sebelum go-live). Gambar gagal muat -> otomatis hilang, latar hijau tetap tampil.
const P = { hero: '1551288049-bebda4e38f71', fin: '1454165804606-c3d57bc86b40', tax: '1450101499163-c8848c66ca85', tech: '1518770660439-4636190af475',
  team: '1522071820081-009f0129c71c', meet: '1556761175-5973dc0f32e7', cf: '1460925895917-afdab827c52f', ct: '1554224155-6726b3ff858f', cc: '1504384308090-c894fdcc538d' };
const img = (k, alt, w = 900, eager = false) => `<img class="ph" src="https://images.unsplash.com/photo-${P[k]}?auto=format&fit=crop&w=${w}&q=70" alt="PT Evergreen Hans ${alt}" width="${w}" height="${Math.round(w * .66)}" loading="${eager ? 'eager" fetchpriority="high' : 'lazy'}" decoding="async" onerror="this.remove()">`;
const pf = (k, alt, c = '') => `<div class="pf ${c}">${img(k, alt)}</div>`;

const head = (p, t, d, crumb) => {
  const g = [{ '@type': 'Organization', name: 'PT Evergreen Hans', alternateName: ['Evergreen Hans', 'Evergreenhans', 'EG Hans'], url: U, logo: U + '/assets/img/logo.png' }, { '@type': 'WebSite', name: 'PT Evergreen Hans', url: U }];
  if (crumb) g.push({ '@type': 'BreadcrumbList', itemListElement: [['Beranda', '/'], ...crumb].map(([n, u], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: U + u })) });
  return `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${t}</title><meta name="description" content="${d}"><link rel="canonical" href="${U}${p}">
<meta property="og:type" content="website"><meta property="og:title" content="${t}"><meta property="og:description" content="${d}"><meta property="og:url" content="${U}${p}"><meta property="og:image" content="${U}/assets/img/og.jpg"><meta property="og:locale" content="id_ID">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${t}"><meta name="twitter:description" content="${d}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="preconnect" href="https://images.unsplash.com">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"><link href="/assets/css/style.css" rel="stylesheet">
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': g })}</script>
<!-- GA4: ganti G-XXXXXXXXXX -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-XXXXXXXXXX');</script>
</head><body><a class="skip" href="#main">Lewati ke konten</a>`;
};

const header = () => `<nav class="navbar navbar-expand-lg eh-nav fixed-top" aria-label="Navigasi utama"><div class="container">
<a class="navbar-brand" href="/">EVERGREEN<span>HANS</span></a>
<button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#nav" aria-controls="nav" aria-label="Buka menu"><span class="navbar-toggler-icon"></span></button>
<div class="offcanvas-lg offcanvas-end" tabindex="-1" id="nav"><div class="offcanvas-header"><span class="navbar-brand">EVERGREEN<span>HANS</span></span><button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" data-bs-target="#nav" aria-label="Tutup"></button></div>
<div class="offcanvas-body align-items-lg-center"><ul class="navbar-nav ms-auto me-lg-3">${NAV.map(([h, n]) => `<li class="nav-item"><a class="nav-link" href="${h}">${n}</a></li>`).join('')}</ul><a class="btn-eh btn-sm" href="/contact" data-track="nav_lets_talk">Let's Talk</a></div></div></div></nav>`;

const footer = () => `<footer class="foot"><div class="container"><div class="row g-5"><div class="col-lg-5"><p class="big">PT EVERGREEN HANS</p><p class="big" style="color:var(--lime)">Understand Your Business.<br>Improve What Matters.</p></div>
<div class="col-6 col-lg-2"><h4>Layanan</h4><ul>${Object.entries(SV).map(([k, v]) => `<li><a href="/services/${k}">${v[0]}</a></li>`).join('')}</ul></div>
<div class="col-6 col-lg-2"><h4>Perusahaan</h4><ul>${[NAV[1], ...NAV.slice(3)].map(([h, n]) => `<li><a href="${h}">${n}</a></li>`).join('')}</ul></div>
<div class="col-lg-3"><h4>Kontak</h4><ul><li>Gedung Berca Indonesia Suite 202B <br>
                                Jl. Palmerah Utara No. 14, Jakarta - 11480, INDONESIA</li><li><a href="tel:+620000000">021-5302686</a></li><li><a href="mailto:info@eghans.com">[Email]</a></li><li><a href="https://wa.me/620000000">WhatsApp</a></li></ul></div></div>
<hr style="border-color:rgba(255,255,255,.15)" class="my-4"><div class="d-flex flex-wrap justify-content-between gap-2"><span>© 2026 PT Evergreen Hans</span><span><a href="/privacy-policy">Privacy Policy</a> &nbsp;·&nbsp; <a href="/terms">Terms</a></span></div></div></footer>
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script><script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script><script src="/assets/js/main.js" defer></script></body></html>`;

const hero = (h1, p, eb, crumb) => `<header class="hero hero-s"><div class="grid-bg"></div><div class="container position-relative">${crumb ? `<div class="crumb"><a href="/">Beranda</a> / ${crumb}</div>` : ''}<span class="eyebrow" style="color:var(--lime)">${eb}</span><h1 class="mt-2 mb-3">${h1}</h1><p class="lead">${p}</p></div></header>`;
const cta = (h = "Let's Talk About Your Business.", p = 'Ceritakan tantangan Anda. Mari temukan pendekatan yang tepat bersama.', b = 'Start a Conversation') => `<section class="sec cta"><div class="container rv"><h2>${h}</h2><p class="mx-auto my-4" style="max-width:34rem">${p}</p><a class="btn-eh magnetic" href="/contact" data-track="final_cta">${b} →</a></div></section>`;
const logos = (marquee = false) => { const t = CL.map(([n, f]) => `<div class="logo fi" data-f="${f}" data-placeholder>${n}<small>${INDN[f]}</small></div>`).join(''); return marquee ? `<div class="marq"><div class="marq-t">${t}</div></div>` : `<div class="lg">${t}</div>`; };
const cases = () => `<div class="row g-4">${CS.map(([c, t, d, k]) => `<div class="col-md-4 rv fi" data-f="${c.toLowerCase()}" data-placeholder><a class="case" href="/case-studies"><div class="im"><span class="badge-c">${c}</span>${img(k, 'studi kasus ' + c.toLowerCase(), 800)}</div><h3>${t}</h3><p>${d}</p><span class="lnk">Lihat studi kasus <span>→</span></span></a></div>`).join('')}</div>`;
const insights = () => `<div class="row g-4">${IN.map(([c, t, d, dt, m, k]) => `<div class="col-md-4 rv fi" data-f="${c.toLowerCase()}" data-placeholder><a class="card-eh" href="/insights">${pf(k, 'insight ' + c.toLowerCase(), 'top')}<span class="eyebrow">${c}</span><h3>${t}</h3><p>${d}</p><p class="meta mt-3">${dt} · ${m} menit baca</p></a></div>`).join('')}</div>`;
const filt = (items) => `<div class="svc-tabs" role="group" aria-label="Filter">${items.map(([k, v], i) => `<button class="filter-btn${i ? '' : ' on'}" data-f="${k}">${v}</button>`).join('')}</div>`;
const list = (v, st = '') => `<ul class="svc-list" ${st}>${v[3].map(s => `<li>${s}</li>`).join('')}</ul>`;

const page = (p, t, d, body, h, crumb, noindex) => {
  let html = head(p, t, d, crumb);
  if (noindex) html = html.replace('<title>', '<meta name="robots" content="noindex"><title>');
  html += header() + h + `<main id="main">${body}</main>` + footer();
  const f = p === '/' ? path.join(R, 'index.html') : p === '/404' ? path.join(R, '404.html') : path.join(R, p, 'index.html');
  fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, html);
};

// ---------- HOME ----------
const ICONS = ['◈', '§', '⚙', '⌁'];
const CH = [['Financial', 'Sudahkah Anda mendapat insight yang tepat dari data keuangan?'], ['Tax & Compliance', 'Apakah aktivitas bisnis Anda selaras dengan regulasi?'], ['Business Process', 'Apakah proses yang tidak efisien memperlambat bisnis Anda?'], ['Technology', 'Apakah teknologi membantu bisnis, atau justru menahannya?']];
const homeHero = `<header class="hero hero-home"><div class="hero-img">${img('hero', 'business analytics dan financial insight', 1400, true)}</div><div class="grid-bg"></div>
<svg class="hero-line" viewBox="0 0 1440 400" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M0 340 C200 300 300 360 480 250 S800 230 1000 120 S1250 90 1440 20"/></svg>
<span class="float f1" data-depth="40" aria-hidden="true">Financial insight</span><span class="float f2" data-depth="-30" aria-hidden="true">Tax compliance</span><span class="float f3" data-depth="55" aria-hidden="true">Workflow automation</span>
<div class="container position-relative"><span class="eyebrow">PT Evergreen Hans · Konsultan Bisnis</span>
<h1 class="mt-3 mb-4"><span class="ln"><span>Understand Your Business.</span></span><span class="ln"><span>Improve What Matters.</span></span></h1>
<p class="lead mb-4">Evergreen Hans membantu bisnis memperoleh financial insight, memperkuat compliance, memperbaiki proses bisnis, dan memanfaatkan teknologi untuk melangkah dengan percaya diri.</p>
<div class="d-flex flex-wrap gap-3"><a class="btn-eh magnetic" href="/services" data-track="hero_services">Explore Our Services</a><a class="btn-eh btn-ghost magnetic" href="/contact" data-track="hero_lets_talk">Let's Talk</a></div>
<div class="row g-4 mt-5 pt-3"><div class="col-4 col-md-2 stat"><b data-count="20" data-suf="+">20+</b><small>Tahun pengalaman</small></div><div class="col-4 col-md-2 stat"><b data-count="3">3</b><small>Core expertise</small></div><div class="col-4 col-md-2 stat"><b data-count="5">5</b><small>Tahap pendekatan</small></div></div></div></header>`;
const home = `
<section class="sec"><div class="container"><div class="row g-5 align-items-end mb-5"><div class="col-lg-7 rv"><span class="eyebrow">Tantangan bisnis</span><h2 class="mt-2">Every Business Has Its Challenges.</h2></div>
<div class="col-lg-5 rv"><p class="lead2">PT Evergreen Hans atau Evergreen Hans merupakan perusahaan konsultan yang membantu bisnis dalam bidang keuangan, perpajakan, konsultasi bisnis, dan teknologi.</p></div></div>
<div class="g4">${CH.map(([a, b], i) => `<a class="card-eh rv" href="/services"><span class="ic" aria-hidden="true">${ICONS[i]}</span><h3>${a}</h3><p>${b}</p><span class="arr mt-3" aria-hidden="true">→</span></a>`).join('')}</div></div></section>
<section class="sec tint"><div class="container"><div class="rv mb-5"><span class="eyebrow">Layanan</span><h2 class="mt-2">What We Do</h2><p class="lead2">Practical expertise for businesses that want to understand, improve and grow.</p></div>
<div class="row g-4">${Object.entries(SV).map(([k, v]) => `<div class="col-md-4 rv"><a class="card-eh" style="background:#fff" href="/services/${k}">${pf(v[6], v[0].toLowerCase() + ' consulting', 'top')}<h3>${v[0]}</h3><p>${v[1]}</p><span class="arr mt-3">→</span></a></div>`).join('')}</div>
<p class="mt-4"><a class="lnk" href="/services">View All Services <span>→</span></a></p></div></section>
<section class="proc dark" id="proc"><div class="proc-stick"><div class="container"><div class="row g-5 align-items-center"><div class="col-lg-5"><span class="eyebrow">Pendekatan kami</span><h2 class="mt-2">From Insight to Impact.</h2>
<ol class="steps"><span class="steps-fill"></span>${STEPS.map(([t, p], i) => `<li class="${i ? '' : 'on'}" data-t="${t}" data-p="${p}">${String(i + 1).padStart(2, '0')} ${t}<p>${p}</p></li>`).join('')}</ol></div>
<div class="col-lg-7 viz-wrap" aria-hidden="true"><div class="viz"><i style="height:17%"></i><i style="height:18%"></i><i style="height:15%"></i><i style="height:20%"></i><i style="height:17%"></i><i class="hl" style="height:18%"></i></div>
<div class="viz-t"><b id="vn">01</b><h3 id="vt">UNDERSTAND</h3><p id="vp">${STEPS[0][1]}</p></div></div></div></div></div></section>
<section class="sec"><div class="container"><div class="row g-4 align-items-end mb-4"><div class="col-lg-7 rv"><span class="eyebrow">Klien</span><h2 class="mt-2">Trusted by Businesses</h2></div><div class="col-lg-5 rv"><p class="lead2">Pengalaman kami mencakup bisnis di berbagai industri dan lingkungan usaha.</p></div></div>
${logos(true)}<p class="mt-4"><a class="lnk" href="/clients">View Our Clients <span>→</span></a></p></div></section>
<section class="sec tint"><div class="container"><div class="rv mb-5"><span class="eyebrow">Studi kasus</span><h2 class="mt-2">Experience That Creates Impact</h2></div>${cases()}</div></section>
<section class="sec"><div class="container"><div class="row g-5"><div class="col-lg-5 rv"><span class="eyebrow">Industri</span><h2 class="mt-2">Expertise That Adapts to Your Industry</h2><p class="lead2 mt-3">Pengalaman khusus: Bonded Zone &amp; Customs-Related Operations, termasuk konsultasi sistem kawasan berikat.</p></div>
<div class="col-lg-7"><div class="row g-3">${IND.map(([, n]) => `<div class="col-sm-6 rv"><a class="card-eh" href="/industries"><h3>${n}</h3><span class="arr">→</span></a></div>`).join('')}</div></div></div></div></section>
<section class="sec tint"><div class="container"><div class="d-flex justify-content-between align-items-end flex-wrap gap-3 mb-5 rv"><div><span class="eyebrow">Insights</span><h2 class="mt-2">Ideas for Better Business</h2></div><a class="lnk" href="/insights">Explore All Insights <span>→</span></a></div>${insights()}</div></section>
${cta()}`;
page('/', 'PT Evergreen Hans | Konsultan Bisnis, Keuangan & Pajak', 'PT Evergreen Hans adalah konsultan bisnis yang menyediakan layanan financial advisory, konsultan pajak, compliance, business consulting, dan business technology untuk membantu perusahaan berkembang dengan lebih baik.', home, homeHero);

// ---------- ABOUT ----------
const PH = [['Understand', 'Memahami bisnis sebelum memberikan solusi.'], ['Analyze', 'Menggunakan data untuk menemukan insight.'], ['Improve', 'Mengubah insight menjadi perbaikan nyata.']];
const TL = [['2001', 'Founded'], ['Financial & Tax Consulting', ''], ['Business Advisory', ''], ['Technology Solutions', ''], ['Integrated Business Consulting', '']]; // TODO verifikasi
page('/about', 'Tentang PT Evergreen Hans | Konsultan Bisnis Indonesia', 'Kenali PT Evergreen Hans, konsultan bisnis yang memadukan keahlian keuangan, perpajakan, dan teknologi untuk membantu perusahaan mengambil keputusan lebih baik.',
  `<section class="sec"><div class="container"><div class="row g-5 align-items-center"><div class="col-lg-6 rv"><span class="eyebrow">Who we are</span><h2 class="mt-2 mb-4">Siapa Evergreen Hans</h2>${pf('team', 'tim konsultan bisnis')}</div><div class="col-lg-6 rv"><p class="lead2">PT Evergreen Hans adalah mitra konsultasi bisnis yang membantu perusahaan memperoleh financial insight, memperkuat kepatuhan pajak, memperbaiki proses bisnis, dan memanfaatkan teknologi untuk hasil bisnis yang lebih baik.</p><p class="lead2">Kami berpengalaman pada perusahaan Kawasan Berikat dan operasi terkait kepabeanan sebagai salah satu keahlian khusus kami.</p></div></div></div></section>
<section class="sec dark"><div class="container"><span class="eyebrow">Our philosophy</span><h2 class="mt-2 mb-5">Tiga pilar kami</h2><div class="row g-4">${PH.map(([a, b]) => `<div class="col-md-4 rv"><div class="card-eh" style="border-color:rgba(255,255,255,.2)"><h3>${a}</h3><p style="color:#cfe0d7">${b}</p></div></div>`).join('')}</div></div></section>
<section class="sec"><div class="container"><span class="eyebrow">Our journey</span><h2 class="mt-2 mb-5">Perjalanan Evergreen Hans</h2><div class="row g-3">${TL.map(([a, b]) => `<div class="col-md rv"><div class="card-eh"><h3 style="font-size:1.15rem">${a}</h3><p>${b}</p></div></div>`).join('')}</div></div></section>${cta()}`,
  hero('More Than a Consultant. A Partner in Your Business Journey.', 'Memahami bisnis Anda lebih dulu, lalu membantu memperbaikinya.', 'Tentang kami', 'Tentang'), [['Tentang', '/about']]);

// ---------- SERVICES ----------
const sv = Object.entries(SV);
page('/services', 'Layanan Konsultan Bisnis, Keuangan, Pajak & Teknologi | PT Evergreen Hans', 'Layanan PT Evergreen Hans: financial advisory, tax & compliance, dan business technology untuk membantu perusahaan memahami, memperbaiki, dan bertumbuh.',
  `<section class="sec"><div class="container"><div class="svc-tabs" role="tablist">${sv.map(([k, v], i) => `<button class="svc-tab${i ? '' : ' on'}" role="tab" aria-selected="${!i}" data-t="${k}">${v[0]}</button>`).join('')}</div>
${sv.map(([k, v], i) => `<div class="svc-pane${i ? '' : ' on'}" id="${k}"><div class="row g-5 align-items-center"><div class="col-lg-7"><h3>${v[1]}</h3><p class="lead2">${v[2]}</p>${list(v)}<a class="btn-eh" href="/services/${k}">Detail layanan</a></div><div class="col-lg-5">${pf(v[6], v[0].toLowerCase() + ' consulting')}</div></div></div>`).join('')}</div></section>${cta()}`,
  hero('Expertise That Moves Your Business Forward.', 'Practical expertise for businesses that want to understand, improve and grow.', 'Layanan', 'Layanan'), [['Layanan', '/services']]);
sv.forEach(([k, v]) => page(`/services/${k}`, v[4], v[5],
  `<section class="sec"><div class="container"><div class="row g-5"><div class="col-lg-5 rv"><span class="eyebrow">Value</span><h2 class="mt-2">${v[1]}</h2><p class="lead2 mt-3 mb-4">${v[2]}</p>${pf(v[6], v[0].toLowerCase() + ' consulting')}</div><div class="col-lg-7 rv">${list(v, 'style="columns:1"')}</div></div></div></section>${cta()}`,
  hero(v[0], v[2], 'Layanan', `<a href="/services">Layanan</a> / ${v[0]}`), [['Layanan', '/services'], [v[0], `/services/${k}`]]));

// ---------- INDUSTRIES ----------
page('/industries', 'Industri yang Kami Layani | PT Evergreen Hans', 'Pengalaman PT Evergreen Hans di manufacturing, trading & distribution, services, garment & textile, serta keahlian khusus konsultan kawasan berikat.',
  `<section class="sec"><div class="container"><div class="row g-4">${IND.map(([, n]) => `<div class="col-md-6 col-lg-4 rv"><div class="card-eh"><h3>${n}</h3><p>Solusi keuangan, pajak, dan teknologi yang disesuaikan dengan karakter industri ini.</p></div></div>`).join('')}</div></div></section>
<section class="sec dark"><div class="container"><span class="eyebrow">Specialized experience</span><h2 class="mt-2">Bonded Zone &amp; Customs-Related Operations</h2><p class="lead2" style="color:#cfe0d7">Pengalaman kami pada perusahaan Kawasan Berikat mencakup compliance, sistem inventory, dan customs technology sebagai pelengkap keahlian inti kami.</p></div></section>${cta()}`,
  hero('Solutions That Understand Your Business Environment.', 'Memahami konteks industri sebelum merancang solusi.', 'Industri', 'Industri'), [['Industri', '/industries']]);

// ---------- CLIENTS ----------
page('/clients', 'Klien Kami | Dipercaya oleh Berbagai Bisnis – PT Evergreen Hans', 'Daftar klien PT Evergreen Hans dari berbagai industri: manufacturing, trading, services, garment & textile.',
  `<section class="sec"><div class="container">${filt([['all', 'Semua'], ...IND])}${logos()}</div></section>${cta()}`,
  hero('Trusted by Businesses. Built on Experience.', 'Klien yang diizinkan untuk dipublikasikan.', 'Klien', 'Klien'), [['Klien', '/clients']]);

// ---------- CASE STUDIES ----------
page('/case-studies', 'Studi Kasus Konsultasi Bisnis, Pajak & Teknologi | PT Evergreen Hans', 'Studi kasus PT Evergreen Hans: dari tantangan, pendekatan, solusi, hingga dampak bagi bisnis klien.',
  `<section class="sec"><div class="container">${filt([['all', 'Semua'], ['financial', 'Financial'], ['tax', 'Tax'], ['business', 'Business'], ['technology', 'Technology']])}${cases()}<div class="row g-3 mt-5">${['Challenge', 'Approach', 'Solution', 'Impact'].map(a => `<div class="col-6 col-md-3"><div class="card-eh"><b>${a}</b></div></div>`).join('')}</div></div></section>${cta()}`,
  hero('Experience That Creates Impact.', 'Challenge → Approach → Solution → Impact.', 'Studi kasus', 'Studi Kasus'), [['Studi Kasus', '/case-studies']]);

// ---------- INSIGHTS ----------
page('/insights', 'Insight Bisnis, Keuangan, Pajak & Teknologi | PT Evergreen Hans', 'Artikel dan wawasan dari PT Evergreen Hans seputar keuangan, perpajakan, bisnis, dan teknologi.',
  `<section class="sec"><div class="container"><div class="row g-3 mb-4"><div class="col-md-5"><label class="visually-hidden" for="q">Cari artikel</label><input id="q" class="form-control" type="search" placeholder="Cari artikel…"></div></div>${filt([['all', 'Semua'], ['finance', 'Finance'], ['tax', 'Tax'], ['business', 'Business'], ['technology', 'Technology']])}${insights()}</div></section>${cta()}`,
  hero('Ideas for Better Business.', 'Wawasan praktis untuk pengambilan keputusan yang lebih baik.', 'Insights', 'Insight'), [['Insight', '/insights']]);

// ---------- CONTACT ----------
const fld = (l, n, ty = 'text', rq = true) => `<div class="col-md-6"><label class="form-label" for="${n}">${l}${rq ? ' *' : ''}</label><input class="form-control" id="${n}" name="${n}" type="${ty}"${rq ? ' required' : ''}><div class="invalid-feedback">Mohon isi ${l.toLowerCase()} dengan benar.</div></div>`;
page('/contact', 'Hubungi PT Evergreen Hans | Konsultasi Bisnis, Keuangan & Pajak', 'Hubungi PT Evergreen Hans untuk konsultasi keuangan, pajak, bisnis, dan teknologi. Ceritakan tantangan bisnis Anda.',
  `<section class="sec"><div class="container"><div class="row g-5"><div class="col-lg-7"><form id="cf" novalidate method="post" action="/contact"><!-- Laravel: @csrf --><input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><div class="row g-3">${fld('Nama', 'name')}${fld('Perusahaan', 'company')}${fld('Email', 'email', 'email')}${fld('Telepon', 'phone', 'tel', false)}
<div class="col-12"><label class="form-label" for="service">Layanan *</label><select class="form-select" id="service" name="service" required><option value="">Pilih layanan</option>${['Financial Advisory', 'Tax & Compliance', 'Business Consulting', 'Business Technology', 'Other'].map(o => `<option>${o}</option>`).join('')}</select><div class="invalid-feedback">Pilih salah satu layanan.</div></div>
<div class="col-12"><label class="form-label" for="message">Pesan *</label><textarea class="form-control" id="message" name="message" rows="5" required></textarea><div class="invalid-feedback">Mohon tulis pesan Anda.</div></div>
<div class="col-12"><button class="btn-eh" type="submit">Kirim pesan</button></div></div></form></div>
<div class="col-lg-5"><p class="lead2">Tell us about your challenge. Let's explore the right approach together.</p><ul class="list-unstyled mb-4"><li>Gedung Berca Indonesia Suite 202B <br>
                                Jl. Palmerah Utara No. 14, Jakarta - 11480, INDONESIA</li><li><a href="tel:+620000000">021-5302686</a></li><li><a href="mailto:info@eghans.com">[Email]</a></li></ul>${pf('meet', 'diskusi konsultasi bisnis')}</div></div></div></section>`,
  hero("Let's Talk About Your Business.", "Tell us about your challenge. Let's explore the right approach together.", 'Kontak', 'Kontak'), [['Kontak', '/contact']]);

// ---------- UTILITY ----------
page('/thank-you', 'Terima Kasih | PT Evergreen Hans', 'Pesan Anda telah kami terima.', '<section class="sec"><div class="container"><p class="lead2">Terima kasih. Pesan Anda telah kami terima, dan tim kami akan segera menghubungi Anda.</p><a class="btn-eh" href="/">Kembali ke beranda</a></div></section>', hero('Thank you.', 'Your message has been received.', 'Terkirim'), null, true);
[['/privacy-policy', 'Privacy Policy'], ['/terms', 'Terms']].forEach(([p, t]) => page(p, `${t} | PT Evergreen Hans`, `${t} PT Evergreen Hans.`, '<section class="sec"><div class="container"><p class="lead2">[Isi dokumen hukum dari tim legal sebelum go-live.]</p></div></section>', hero(t, '', 'Legal')));
page('/404', 'Halaman Tidak Ditemukan | PT Evergreen Hans', 'Halaman tidak ditemukan.', '<section class="sec"><div class="container"><a class="btn-eh" href="/">Kembali ke beranda</a></div></section>', hero('404', 'Halaman yang Anda cari tidak ditemukan.', 'Error'), null, true);

// ---------- SEO FILES ----------
const urls = ['/', '/about', '/services', '/industries', '/clients', '/case-studies', '/insights', '/contact', ...sv.map(([k]) => `/services/${k}`)];
fs.writeFileSync(path.join(R, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(u => `<url><loc>${U}${u}</loc></url>`).join('')}</urlset>`);
fs.writeFileSync(path.join(R, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /thank-you\nSitemap: ${U}/sitemap.xml\n`);
console.log('OK', urls.length + 5, 'pages');
