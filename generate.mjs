// Generates index.html for the Cigu current-screens catalog from the data below.
import { writeFileSync } from 'node:fs';

const UPDATED = '29 June 2026';
const BUILD = '20260629b'; // cache-bust token — bump on every screenshot refresh so browsers re-fetch
const TOTAL = 36;

// section → ordered screens. tag types: state | caveat
const SECTIONS = [
  {
    id: 'onboarding-auth', label: 'Onboarding & Sign-in',
    blurb: 'The signed-out front door — first-run intro and the ways a teacher gets into the app.',
    screens: [
      { n: 21, file: '21-onboarding-welcome.png', title: 'Onboarding · Welcome', tags: ['Signed out', 'First run'],
        desc: 'First screen a brand-new teacher sees. The “cigu” wordmark, a sample RPH card, and the core promise — “RPH siap dalam beberapa minit.” One “Mula” button to start.' },
      { n: 22, file: '22-onboarding-choice.png', title: 'Onboarding · Choice', tags: ['Signed out', 'First run'],
        desc: 'Step two: pick how to begin — jump straight in, snap a timetable photo, or sign in. “Cuba dulu tanpa akaun” lets a teacher taste the app with no account.' },
      { n: 27, file: '27-sign-in.png', title: 'Sign-in', tags: ['Signed out'],
        desc: 'Account screen — continue with Apple or Google, or get a passwordless magic-link by email. “Langkau” / “Cuba dulu tanpa akaun” keep it skippable.' },
      { n: 28, file: '28-magic-error.png', title: 'Magic-link · Error', tags: ['Signed out', 'Sad path'],
        desc: 'What a teacher sees when a magic-link is invalid or expired — a clear red message and a way back. (The success state redirects straight into the app.)' },
    ],
  },
  {
    id: 'hari-ini', label: 'Hari Ini (Today)',
    blurb: 'The home tab — today’s teaching agenda built from the timetable.',
    screens: [
      { n: 1, file: '01-today.png', title: 'Hari Ini · Signed in', tags: ['Signed in'],
        desc: 'The daily home: the date as the large title, an inline week strip with per-day dots, and the “PERLU RPH” agenda — today’s classes that still need an RPH. Native-HIG (system blue).' },
      { n: 23, file: '23-today-signedout.png', title: 'Hari Ini · Signed out', tags: ['Signed out'],
        desc: 'The same tab when no one is signed in — a gentle prompt to go to Profil and log in before the schedule can load.' },
    ],
  },
  {
    id: 'arkib', label: 'Arkib (Reuse library)',
    blurb: 'Find and reuse past activities and reflections instead of generating from scratch.',
    screens: [
      { n: 2, file: '02-arkib.png', title: 'Arkib · Aktiviti', tags: ['Signed in'],
        desc: 'The reuse engine: an “Aktiviti / RPH Saya” toggle, search, scope chips, a recommended activity for the next class, and a recent list — each with a one-tap “Guna”.' },
      { n: 24, file: '24-arkib-signedout.png', title: 'Arkib · Signed out', tags: ['Signed out'],
        desc: 'Arkib for a signed-out teacher — the library is gated behind a sign-in notice.' },
    ],
  },
  {
    id: 'generate', label: 'Jana RPH (Generate)',
    blurb: 'The core action — start a new lesson plan. Reached via the centre ＋ button. Redesigned from a dense form into a one-tap confirm card with an optional 3-step flow behind “Ubah butiran”.',
    screens: [
      { n: 3, file: '03-generate.png', title: 'Jana RPH · Confirm card', tags: ['Signed in'],
        desc: 'The new one-tap default: a single card remembers last week’s lesson (“Diingat dari RPH terakhir” → “Sains · Tahun 4”) so the teacher can just press “Jana RPH”. “Ubah butiran” opens the step-flow to change anything.' },
      { n: 33, file: '33-generate-step1-subject.png', title: 'Step 1 · Subject', tags: ['Signed in', 'Step flow'],
        desc: 'Tapping “Ubah butiran” opens step 1 of 3 (“Cikgu ajar apa?”). A searchable subject list grouped by cluster (Lazim / Bahasa / Sains & Matematik), with the current subject (Sains) pre-ticked.' },
      { n: 34, file: '34-generate-step2-level.png', title: 'Step 2 · Level', tags: ['Signed in', 'Step flow'],
        desc: 'Step 2 of 3 (“Tahun berapa?”). Only curriculum-valid levels for the chosen subject are shown — split into Sekolah Rendah and Sekolah Menengah — with the current level pre-selected.' },
      { n: 35, file: '35-generate-step3-topic.png', title: 'Step 3 · Topic', tags: ['Signed in', 'Step flow'],
        desc: 'Step 3 of 3 (“Topik apa?”). Live DSKP topic chips for the chosen subject + level, a “Cadangkan untuk saya” suggestion, optional class and advanced settings, and the final “Jana RPH” button.' },
      { n: 36, file: '36-generate-signedout.png', title: 'Jana RPH · Signed out', tags: ['Signed out'],
        desc: 'The same tab with no account — no form, just a friendly “Cuba tanpa akaun” invite letting a teacher generate one full RPH before signing up.' },
    ],
  },
  {
    id: 'kelas', label: 'Kelas (Classes)',
    blurb: 'The teacher’s classes, sorted by when they next meet.',
    screens: [
      { n: 4, file: '04-kelas.png', title: 'Kelas · Signed in', tags: ['Signed in'],
        desc: 'A grid of class cards (“3 kelas aktif · sesi 2026”) with subject glyphs and a “Jumpa lagi” footer telling the teacher when each class next meets.' },
      { n: 25, file: '25-kelas-signedout.png', title: 'Kelas · Signed out', tags: ['Signed out'],
        desc: 'The Kelas tab with no session — a sign-in prompt instead of the class grid.' },
    ],
  },
  {
    id: 'profil', label: 'Profil (Account hub)',
    blurb: 'Identity, subscription, and the data & privacy controls.',
    screens: [
      { n: 5, file: '05-profile.png', title: 'Profil · Hub', tags: ['Signed in'],
        desc: 'The account hub: identity card with “Log keluar”, the teaching profile drill-in, subscription status (“Pelan Plus · Aktif”), and the Umum + Data & privasi sections.' },
      { n: 26, file: '26-profile-signedout.png', title: 'Profil · Signed out', tags: ['Signed out'],
        desc: 'The signed-out hub — a single “Log masuk ke Cigu” prompt and button.' },
      { n: 6, file: '06-profile-cikgu.png', title: 'Profil cikgu · Detail', tags: ['Signed in'],
        desc: 'Read-only teaching identity — name, school, grade, the subjects & years taught, and the Arkib handle. “Ubah” opens the editor.' },
      { n: 7, file: '07-profile-edit.png', title: 'Profil cikgu · Edit', tags: ['Signed in', 'Form'],
        desc: 'The edit form for the teaching identity, with a “Batal / Simpan” modal header.' },
    ],
  },
  {
    id: 'rph-detail', label: 'RPH Detail & Bahan mengajar',
    blurb: 'A finished lesson plan and the teaching materials generated from it.',
    screens: [
      { n: 8, file: '08-rph-detail.png', title: 'RPH Detail', tags: ['Signed in'],
        desc: 'A full lesson plan: subject hero, glance tiles (sections done, AI-vs-teacher split, worksheets), a “shaped by past reflections” loop-back, the Bahan mengajar hub, and the 8 RPH sections.' },
      { n: 18, file: '18-quiz.png', title: 'Bahan · Kuiz', tags: ['Signed in', 'AI output'],
        desc: 'An auto-generated quiz for the lesson — question cards with options, the correct answer marked, and DSKP / objective / thinking-level tags per question.' },
      { n: 19, file: '19-slaid.png', title: 'Bahan · Slaid', tags: ['Signed in', 'AI output'],
        desc: 'A generated slide deck — a subject-coloured title slide plus content slides with objectives, bullets, and speaker notes (“Nota Penceramah”).' },
      { n: 20, file: '20-peta-minda.png', title: 'Bahan · Peta Minda', tags: ['Signed in', 'AI output'],
        desc: 'An auto-generated interactive mind-map (d3 in a WebView) — the topic at the centre, colour-coded branches with sub-nodes, pinch-to-zoom, and a “Peta Pokok / Mind map / Peta Buih” style switcher.' },
      { n: 32, file: '32-fresh-spotlight.png', title: 'RPH · Fresh spotlight', tags: ['Signed in'],
        desc: 'The moment a freshly generated RPH lands — a “RPH SIAP · Sambung terus — buat kuiz?” spotlight that nudges the teacher straight into making materials.' },
      { n: 37, file: '37-detail-signedout-401.png', title: 'RPH Detail · Signed out (401)', tags: ['Signed out', 'Sad path'],
        desc: 'Opening an RPH with no session (or after it expires) — a clean Bahasa “Log masuk untuk teruskan” state explaining the session may have ended, with one “Log masuk” button. No raw error text.' },
    ],
  },
  {
    id: 'detail-exec', label: 'Class detail · Fragment · Teaching mode',
    blurb: 'Drill-ins from a class, the reuse library, and the in-lesson teaching view.',
    screens: [
      { n: 9, file: '09-class-detail.png', title: 'Class detail', tags: ['Signed in'],
        desc: 'Everything for one class — an archive toggle, “Jana RPH baru”, the list of RPHs for the class, and a “what worked” reflections feed.' },
      { n: 10, file: '10-arkib-fragment.png', title: 'Arkib fragment', tags: ['Signed in'],
        desc: 'A single saved activity — DSKP code, subject/level, duration, the activity body, and a “Salin ke draf RPH” action to reuse it.' },
      { n: 11, file: '11-class-mode.png', title: 'Class mode (teaching)', tags: ['Signed in'],
        desc: 'The in-lesson player — one activity at a time, large text for reading from a distance, a next-up hint, a progress bar, and the screen stays awake.' },
    ],
  },
  {
    id: 'akaun', label: 'Akaun & Langganan',
    blurb: 'Upgrade, consent, data export, and account deletion (the compliance surfaces).',
    screens: [
      { n: 15, file: '15-account-upgrade.png', title: 'Naik taraf (Paywall)', tags: ['Signed in', 'Monetisation'],
        desc: 'The plan catalogue — Free vs Pro (monthly/yearly), the teacher’s current plan flagged, and clear upgrade buttons.' },
      { n: 12, file: '12-account-consent.png', title: 'Persetujuan (Consent)', tags: ['Signed in', 'PDPA'],
        desc: 'The PDPA consent record — current version and accepted date, with a re-consent action when a newer version exists.' },
      { n: 13, file: '13-account-export.png', title: 'Eksport data', tags: ['Signed in', 'PDPA'],
        desc: 'Request a full export of the teacher’s data, with a history of past export jobs and their status.' },
      { n: 14, file: '14-account-delete.png', title: 'Padam akaun', tags: ['Signed in', 'Sad path'],
        desc: 'Account deletion with a 7-day grace window and a type-to-confirm email guard against accidental taps.' },
      { n: 17, file: '17-billing-return.png', title: 'Billing return', tags: ['Best-effort'],
        desc: 'The post-checkout screen verifies the payment and redirects in well under a second, so the brief “Mengesahkan pembayaran…” state is too fast to freeze cleanly — captured here just after it lands back on Profil.' },
    ],
  },
  {
    id: 'states', label: 'States — loading & error',
    blurb: 'Representative non-happy states, captured live.',
    screens: [
      { n: 29, file: '29-generate-loading.png', title: 'Generating (loading)', tags: ['Signed in', 'Loading'],
        desc: 'Right after “Jana RPH” — the new plan builds with content-shaped skeletons and a “Menyusun RPH…” status while each section generates.' },
      { n: 30, file: '30-detail-error.png', title: 'Load error', tags: ['Sad path', 'Error'],
        desc: 'When a screen can’t load its data (here, an expired session) — a clear red “Tidak dapat dimuatkan” banner with a “Cuba lagi” retry.' },
    ],
  },
  {
    id: 'jadual', label: 'Jadual (Timetable)',
    blurb: 'Set up the weekly timetable once; it repeats every week.',
    screens: [
      { n: 16, file: '16-timetable-import.png', title: 'Susun jadual', tags: ['Signed in'],
        desc: 'The timetable builder entry — snap a photo of the timetable (auto-fill), pick from the gallery, or fill it in by hand.' },
    ],
  },
];

const TAG_COLORS = {
  'Signed in': '#1f3d2f', 'Signed out': '#8a6d3b', 'First run': '#5b6470',
  'Form': '#5b6470', 'AI output': '#6b3fa0', 'Monetisation': '#0a7d4d', 'Step flow': '#0a66c2',
  'PDPA': '#5b6470', 'Sad path': '#b3261e', 'OTA gate': '#b3261e', 'Best-effort': '#9a6a00',
  'Loading': '#0a66c2', 'Error': '#b3261e',
};

const tagHtml = (t) => `<span class="tag" style="--tc:${TAG_COLORS[t] || '#5b6470'}">${t}</span>`;

const cardHtml = (s) => `
  <article class="card" id="screen-${s.n}">
    <div class="frame"><img loading="lazy" src="screens/${s.file}?v=${BUILD}" alt="${s.title}"></div>
    <div class="meta">
      <div class="num">${String(s.n).padStart(2, '0')}</div>
      <h3>${s.title}</h3>
      <div class="tags">${s.tags.map(tagHtml).join('')}</div>
      <p>${s.desc}</p>
    </div>
  </article>`;

const sectionHtml = (sec) => `
  <section class="sec" id="${sec.id}">
    <div class="sec-head">
      <h2>${sec.label}</h2>
      <p>${sec.blurb}</p>
    </div>
    <div class="grid">${sec.screens.map(cardHtml).join('')}</div>
  </section>`;

const indexHtml = SECTIONS.map((sec) => `
  <div class="idx-group">
    <a class="idx-sec" href="#${sec.id}">${sec.label}</a>
    ${sec.screens.map((s) => `<a class="idx-screen" href="#screen-${s.n}"><span>${String(s.n).padStart(2, '0')}</span> ${s.title}</a>`).join('')}
  </div>`).join('');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Cigu — Current Screen Catalog</title>
<style>
  :root{
    --bg:#f4f1ea; --card:#ffffff; --ink:#1a1c1a; --muted:#6b6f6a;
    --line:#e4e0d6; --forest:#1f3d2f; --accent:#6b3fa0;
  }
  *{box-sizing:border-box}
  html{-webkit-text-size-adjust:100%}
  body{margin:0;background:var(--bg);color:var(--ink);
    font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)}
  .wrap{max-width:1080px;margin:0 auto;padding:28px 20px 80px}
  header.top{padding:18px 0 8px}
  .word{font-size:30px;font-weight:800;letter-spacing:-.02em}
  .word .spark{color:var(--accent)}
  h1{font-size:26px;line-height:1.2;margin:14px 0 6px;letter-spacing:-.02em}
  .sub{color:var(--muted);font-size:16px;max-width:60ch;margin:0 0 16px}
  .pills{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0 6px}
  .pill{background:#fff;border:1px solid var(--line);border-radius:999px;padding:6px 12px;font-size:13px;color:var(--muted)}
  .pill b{color:var(--forest)}
  .note{background:#fff;border:1px solid var(--line);border-left:3px solid var(--forest);
    border-radius:12px;padding:14px 16px;margin:18px 0;font-size:14px;color:#44483f}
  .note b{color:var(--ink)}
  /* index */
  .index{background:#fff;border:1px solid var(--line);border-radius:16px;padding:18px 18px 8px;margin:18px 0 30px}
  .index h2{font-size:14px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin:0 0 12px}
  .idx-cols{columns:2;column-gap:26px}
  @media(max-width:640px){.idx-cols{columns:1}}
  .idx-group{break-inside:avoid;margin-bottom:16px}
  .idx-sec{display:block;font-weight:700;color:var(--forest);text-decoration:none;font-size:14px;margin-bottom:4px}
  .idx-screen{display:flex;gap:8px;text-decoration:none;color:#3a3d38;font-size:13.5px;padding:2px 0}
  .idx-screen span{color:var(--muted);font-variant-numeric:tabular-nums;min-width:20px}
  .idx-screen:hover{color:var(--accent)}
  /* sections */
  .sec{margin:36px 0}
  .sec-head h2{font-size:21px;margin:0 0 4px;letter-spacing:-.01em}
  .sec-head p{color:var(--muted);margin:0 0 18px;font-size:14.5px}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(248px,1fr));gap:22px}
  .card{background:var(--card);border:1px solid var(--line);border-radius:18px;overflow:hidden;
    display:flex;flex-direction:column;scroll-margin-top:18px}
  .frame{background:#eceae3;padding:14px 14px 0;display:flex;justify-content:center}
  .frame img{width:100%;max-width:240px;border-radius:18px 18px 0 0;
    box-shadow:0 8px 24px rgba(0,0,0,.12);display:block}
  .meta{padding:14px 16px 18px;position:relative}
  .num{position:absolute;top:-14px;right:14px;background:var(--forest);color:#fff;
    font-size:12px;font-weight:700;border-radius:999px;padding:4px 9px;font-variant-numeric:tabular-nums}
  .meta h3{font-size:16px;margin:2px 0 8px;letter-spacing:-.01em}
  .tags{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:9px}
  .tag{font-size:11px;font-weight:600;color:#fff;background:var(--tc);border-radius:999px;padding:3px 8px;opacity:.92}
  .meta p{font-size:13.5px;color:#4a4e47;margin:0;line-height:1.5}
  footer{margin-top:50px;padding-top:22px;border-top:1px solid var(--line);color:var(--muted);font-size:13px}
  a.back{color:var(--accent);text-decoration:none}
</style>
</head>
<body>
<div class="wrap">
  <header class="top">
    <div class="word">cigu<span class="spark">+</span></div>
    <h1>Current Screen Catalog</h1>
    <p class="sub">A screen-by-screen record of the Cigu teacher app exactly as it stands today —
      every screen captured as a real iOS Simulator screenshot, signed-in and signed-out.</p>
    <div class="pills">
      <span class="pill"><b>${TOTAL}</b> screens</span>
      <span class="pill">Real device captures</span>
      <span class="pill">Light mode (app is light-only today)</span>
      <span class="pill">Updated ${UPDATED}</span>
    </div>
    <div class="note">
      These are <b>real captures of the live app</b>, not redesign mockups. All teacher data is seeded /
      fictional (“Cikgu Aisyah”). One screen is best-effort: <b>Billing return</b> verifies and redirects
      too fast to freeze. Brand-new-teacher <b>empty states</b> aren’t shown (the populated states are).
      Everything else is the real screen — including the interactive Peta Minda map and the loading / error states.
    </div>
  </header>

  <nav class="index">
    <h2>All ${TOTAL} screens</h2>
    <div class="idx-cols">${indexHtml}</div>
  </nav>

  ${SECTIONS.map(sectionHtml).join('')}

  <footer>
    Cigu (JASA) mobile app · current-state catalog · ${TOTAL} screens · updated ${UPDATED}.<br>
    Captured on iOS Simulator (iPhone 17 Pro) from the live development build. Previews are screenshots, not interactive.
    <br><br><a class="back" href="#">↑ Back to top</a>
  </footer>
</div>
</body>
</html>`;

writeFileSync(new URL('./index.html', import.meta.url), html);
console.log('wrote index.html');
