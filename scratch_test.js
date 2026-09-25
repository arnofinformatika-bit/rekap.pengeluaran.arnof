
/* =====================================================
   DATA STORAGE & CONFIG
===================================================== */
const KEY = "dompetku_v1";
const KATEGORI = [
  "Kebutuhan pokok",
  "Kebutuhan kuliah",
  "Transportasi",
  "Tempat Tinggal/Kost",
  "Buku/ATK",
  "Kebutuhan lainnya"
];
const WARNA = {
  "Kebutuhan pokok": "#3b82f6",
  "Kebutuhan kuliah": "#8b5cf6",
  "Transportasi": "#06b6d4",
  "Tempat Tinggal/Kost": "#ec4899",
  "Buku/ATK": "#10b981",
  "Kebutuhan lainnya": "#f59e0b"
};

let DB = { users: [], sesi: null };
let state = { page: "dashboard", bukti: null, filter: { tipe:"", kategori:"", cari:"" } };
let tempQuickBukti = null;

/* SVG ICONS FOR TILES & NAV */
const ICONS = {
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
  saldo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"></path><path d="m7 21 1.6-1.4c.4-.4.9-.6 1.4-.6h4c1.7 0 3-1.3 3-3V7c0-1.7-1.3-3-3-3H7"></path><rect x="3" y="3" width="4" height="4" rx="1"></rect></svg>`,
  pengeluaran: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="17.5" r="3.5"></circle><circle cx="18.5" cy="17.5" r="3.5"></circle><path d="M15 6h2l2 4"></path><path d="M12 17.5V14l-3-3 4-3 2 3h4"></path></svg>`,
  riwayat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M12 7v5l4 2"></path></svg>`,
  nabung: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="3"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>`,
  user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>`,
  grafik: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`,
  aktivitas: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line><path d="M6 12l4-4 3 3 5-5"></path></svg>`,
  pdf: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M10 12h2a1 1 0 0 0 0-2h-2v4"></path><path d="M15 10h-2v4h2a1 1 0 0 0 0-2h-2"></path></svg>`,
  word: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
  pengaturan: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
  theme: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>`,
  logout: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>`
};

/* TILES USER */
const TILES_USER = [
  { id: "saldo", label: "Masukan Saldo", icon: ICONS.saldo, action: () => goto("saldo") },
  { id: "pengeluaran", label: "Pengeluaran", icon: ICONS.pengeluaran, action: () => goto("pengeluaran") },
  { id: "nabung", label: "Nabung", icon: ICONS.nabung, action: () => goto("nabung") },
  { id: "riwayat", label: "Riwayat Transaksi", icon: ICONS.riwayat, action: () => goto("riwayat") },
  { id: "pdf", label: "Cetak PDF", icon: ICONS.pdf, action: () => cetakKePDF() },
  { id: "word", label: "Cetak Word", icon: ICONS.word, action: () => cetakKeWord() },
  { id: "aktivitas", label: "Aktivitas", icon: ICONS.aktivitas, action: () => goto("riwayat") },
  { id: "pengaturan", label: "Pengaturan", icon: ICONS.pengaturan, action: () => bukaModalFirebase() },
  { id: "theme", label: "Ganti Tema", icon: ICONS.theme, action: () => toggleTheme() }
];

/* TILES ADMIN */
const TILES_ADMIN = [
  { id: "saldo", label: "Masukan Saldo", icon: ICONS.saldo, action: () => goto("saldo") },
  { id: "pengeluaran", label: "Pengeluaran", icon: ICONS.pengeluaran, action: () => goto("pengeluaran") },
  { id: "nabung", label: "Nabung", icon: ICONS.nabung, action: () => goto("nabung") },
  { id: "riwayat", label: "Riwayat Transaksi", icon: ICONS.riwayat, action: () => goto("riwayat") },
  { id: "pdf", label: "Cetak PDF", icon: ICONS.pdf, action: () => cetakKePDF() },
  { id: "word", label: "Cetak Word", icon: ICONS.word, action: () => cetakKeWord() },
  { id: "aktivitas", label: "Aktivitas", icon: ICONS.aktivitas, action: () => goto("riwayat") },
  { id: "pengaturan", label: "Pengaturan", icon: ICONS.pengaturan, action: () => bukaModalFirebase() },
  { id: "theme", label: "Ganti Tema", icon: ICONS.theme, action: () => toggleTheme() }
];

let firebaseApp = null;
let fbDatabase = null;
let fbFirestore = null;
let isFirebaseConnected = false;

const defaultFirebaseConfig = {
  apiKey: "AIzaSyDemoDompetKuAppKeyForRealtime123",
  authDomain: "tabungan-a0a9e.firebaseapp.com",
  databaseURL: "https://tabungan-a0a9e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tabungan-a0a9e",
  storageBucket: "tabungan-a0a9e.appspot.com",
  messagingSenderId: "102938475612",
  appId: "1:102938475612:web:tabungana0a9e"
};

function getFirebaseConfig() {
  if (window.firebaseConfig && window.firebaseConfig.apiKey) return window.firebaseConfig;
  try {
    const saved = localStorage.getItem("dompetku_fb_config");
    if (saved) return JSON.parse(saved);
  } catch(e) {}
  return defaultFirebaseConfig;
}

function initFirebase() {
  if (typeof firebase === "undefined") return;
  try {
    const cfg = getFirebaseConfig();
    if (!cfg.apiKey || !cfg.projectId) {
      updateCloudDot(false, "Konfigurasi Firebase belum diisi.");
      return;
    }

    if (!firebase.apps.length) {
      firebaseApp = firebase.initializeApp(cfg);
    } else {
      firebaseApp = firebase.app();
    }

    try { fbDatabase = firebase.database(); } catch(e) {}
    try { fbFirestore = firebase.firestore(); } catch(e) {}

    let listenerActive = false;

    // 1. Realtime Database Listener — Triggers automatically on Realtime DB changes!
    if (fbDatabase) {
      try {
        const handleDbSnap = (snapshot) => {
          const data = snapshot.val();
          if (data) {
            let fbUsers = Array.isArray(data) ? data.filter(Boolean) : Object.values(data);
            if (fbUsers.length > 0) {
              DB.users = fbUsers;
              try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch(e){}
              isFirebaseConnected = true;
              updateCloudDot(true, "Terhubung ke Firebase Realtime Database 🔥");
              renderUI();
            }
          }
        };

        // Subscribe to dompetku/users node and users node
        fbDatabase.ref("dompetku/users").on("value", handleDbSnap);
        fbDatabase.ref("users").on("value", handleDbSnap);
        listenerActive = true;
      } catch(err){
        console.warn("Realtime DB listener error:", err.message);
      }
    }

    // 2. Cloud Firestore Listener — Triggers automatically on Firestore changes!
    if (fbFirestore) {
      try {
        fbFirestore.collection("users").onSnapshot((snapshot) => {
          if (!snapshot.empty) {
            let fsUsers = [];
            snapshot.forEach(doc => fsUsers.push(doc.data()));
            if (fsUsers.length > 0) {
              DB.users = fsUsers;
              try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch(e){}
              isFirebaseConnected = true;
              updateCloudDot(true, "Terhubung ke Firebase Firestore 🔥");
              renderUI();
            }
          }
        }, (error) => console.warn("Firestore error:", error.message));
        listenerActive = true;
      } catch(err){}
    }

    if (listenerActive) {
      isFirebaseConnected = true;
      updateCloudDot(true, "Terhubung ke Firebase 🔥");
    }

  } catch(e) {
    console.warn("Firebase Init Notice:", e.message);
    updateCloudDot(false, e.message);
  }
}

function updateCloudDot(connected, msg) {
  const dot = document.getElementById("headerCloudDot");
  if (dot) {
    dot.style.background = connected ? "#10b981" : "#f59e0b";
    dot.title = msg || (connected ? "Terhubung ke Firebase Realtime Sync (Otomatis Sync)" : "Mode Offline / Local Storage");
  }
}

function syncToFirebase(userId) {
  try {
    if (fbDatabase) {
      fbDatabase.ref("dompetku/users").set(DB.users);
      fbDatabase.ref("dompetku/terakhirUpdate").set(new Date().toISOString());
      if (userId) {
        const u = DB.users.find(x => x.id === userId);
        if (u) fbDatabase.ref("users/" + u.id).set(u);
      } else {
        fbDatabase.ref("users").set(DB.users);
      }
    }
    if (fbFirestore) {
      if (userId) {
        const u = DB.users.find(x => x.id === userId);
        if (u) fbFirestore.collection("users").doc(u.id).set(u);
      } else {
        (DB.users||[]).forEach(u => fbFirestore.collection("users").doc(u.id).set(u));
      }
    }
  } catch(e) {
    console.warn("Firebase Sync Write:", e.message);
  }
}

function muat() {
  try {
    const raw = localStorage.getItem(KEY);
    if(raw) DB = JSON.parse(raw);
  } catch(e){}
  if(!DB.users) DB.users = [];
  
  // Cleanup funnyoktara account if present
  DB.users = DB.users.filter(u => {
    const e = (u.email || "").toLowerCase();
    const n = (u.nama || "").toLowerCase();
    return !e.includes("funnyoktara") && !n.includes("funnyoktara");
  });

  if(!DB.users.some(u => u.role === "admin")){
    DB.users.push({ id:"adm-1", nama:"Administrator", email:"admin@dompetku.id", password:"arnof1111uyuy", role:"admin", transaksi:[], dibuat:Date.now() });
  }
  initFirebase();
}

function simpan(userId) {
  try { localStorage.setItem(KEY, JSON.stringify(DB)); }
  catch(e){ toast("Penyimpanan penuh."); }
  syncToFirebase(userId);
}
function uid(p){ return p + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2,6); }
function userAktif(){ return DB.users.find(u => u.id === DB.sesi) || null; }

function ringkas(u){
  let masuk=0, keluar=0, nabung=0, tarik=0;
  (u.transaksi||[]).forEach(t=>{
    if(t.tipe==="masuk") masuk += t.nominal;
    else if(t.tipe==="keluar") keluar += t.nominal;
    else if(t.tipe==="nabung") nabung += t.nominal;
    else if(t.tipe==="tarik") tarik += t.nominal;
  });
  return {
    masuk, keluar,
    saldo: masuk - keluar - nabung + tarik,
    tabungan: nabung - tarik,
    totalNabung: nabung,
    jumlah: (u.transaksi||[]).length
  };
}

const rp = n => "Rp " + Math.round(n||0).toLocaleString("id-ID");
function formatRupiahInput(el){
  let val = el.value.replace(/\D/g, "");
  if(!val){ el.value = ""; return; }
  el.value = parseInt(val, 10).toLocaleString("id-ID");
}
function parseRupiahInput(val){
  if(typeof val === "number") return val;
  return parseInt(String(val||"").replace(/\D/g, ""), 10) || 0;
}
function tglHariIni(){
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
function tglID(iso){
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"});
}
function esc(s){ return String(s??"").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }

/* TIME GREETING LOGIC */
function getGreetingText(nama) {
  const hr = new Date().getHours();
  const shortName = (nama || "User").split(" ")[0];
  if (hr >= 5 && hr < 12) return `Good Morning, ${shortName} ☀️`;
  if (hr >= 12 && hr < 18) return `Good Afternoon, ${shortName} 🌤️`;
  return `Good Evening, ${shortName} 🌙`;
}

/* CETAK PDF (.pdf) */
function cetakKePDF() {
  const u = userAktif(); if(!u) return toast("Pengguna tidak ditemukan.");
  const r = ringkas(u);
  const now = new Date();
  const tglCetak = now.toLocaleDateString("id-ID", { day:"2-digit", month:"long", year:"numeric" });
  
  let data = [];
  if(u.role === "admin"){
    DB.users.forEach(usr => { (usr.transaksi||[]).forEach(t => data.push({...t, usrNama: usr.nama})); });
  } else {
    data = [...(u.transaksi||[])];
  }
  data.sort((a,b)=> new Date(b.tanggal)-new Date(a.tanggal));

  const me = u.role === "admin" ? null : perKategori(u);
  let katRowsHtml = "";
  if(me && r.keluar > 0){
    katRowsHtml = KATEGORI.map(k => {
      const val = me[k] || 0;
      if(val === 0) return "";
      const pct = Math.round((val / r.keluar) * 100);
      return '<tr>'
        + '<td style="border:1px solid #cbd5e1;padding:6px 10px;">'+esc(k)+'</td>'
        + '<td style="border:1px solid #cbd5e1;padding:6px 10px;text-align:right;font-weight:bold">'+rp(val)+'</td>'
        + '<td style="border:1px solid #cbd5e1;padding:6px 10px;text-align:center;">'+pct+'%</td>'
      + '</tr>';
    }).join("");
  }

  let tableRows = data.map((t, idx) => `
    <tr>
      <td style="border:1px solid #e2e8f0;padding:8px;text-align:center">${idx + 1}</td>
      <td style="border:1px solid #e2e8f0;padding:8px">${tglID(t.tanggal)}</td>
      <td style="border:1px solid #e2e8f0;padding:8px;text-align:center;font-weight:bold">${labelTipe(t.tipe)}</td>
      <td style="border:1px solid #e2e8f0;padding:8px">${esc(t.kategori || "—")}</td>
      <td style="border:1px solid #e2e8f0;padding:8px">${esc(t.keterangan || "—")}</td>
      <td style="border:1px solid #e2e8f0;padding:8px;text-align:right;font-weight:bold">${rp(t.nominal)}</td>
    </tr>
  `).join("");

  if(!data.length) {
    tableRows = `<tr><td colspan="6" style="border:1px solid #e2e8f0;padding:12px;text-align:center">Belum ada data transaksi tersimpan.</td></tr>`;
  }

  const printHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Laporan Keuangan - ${esc(u.nama)}</title>
      <style>
        @page { size: A4; margin: 15mm; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1e293b; padding: 20px; margin: 0; background: #ffffff; line-height: 1.5; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #2563eb; padding-bottom: 12px; margin-bottom: 20px; }
        .header h1 { color: #2563eb; margin: 0; font-size: 22px; font-weight: 800; }
        .header p { margin: 4px 0 0; font-size: 13px; color: #64748b; }
        .meta-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; font-size: 13px; }
        .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; }
        .stat-card { background: #f1f5f9; padding: 10px; border-radius: 6px; text-align: center; }
        .stat-card .lbl { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; }
        .stat-card .val { font-size: 15px; font-weight: 800; color: #0f172a; margin-top: 4px; }
        h3 { color: #0f172a; font-size: 15px; margin-top: 20px; margin-bottom: 10px; border-left: 4px solid #2563eb; padding-left: 8px; }
        table.data-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
        th { background: #2563eb; color: #ffffff; padding: 8px 10px; border: 1px solid #2563eb; text-align: left; }
        td { border: 1px solid #e2e8f0; padding: 7px 10px; }
        tr:nth-child(even) { background-color: #f8fafc; }
        .footer { margin-top: 30px; font-size: 11px; color: #94a3b8; text-align: right; border-top: 1px solid #e2e8f0; padding-top: 10px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1>DOMPETKU — LAPORAN KEUANGAN</h1>
          <p>Laporan Resmi Pemasukan & Pengeluaran</p>
        </div>
        <div style="text-align:right">
          <div style="font-weight:800;font-size:14px;color:#2563eb">Laporan PDF</div>
          <div style="font-size:12px;color:#64748b">${tglCetak}</div>
        </div>
      </div>

      <div class="meta-box">
        <div class="meta-grid">
          <div><b>Nama Pengguna:</b> ${esc(u.nama)}</div>
          <div><b>Email:</b> ${esc(u.email || "—")}</div>
          <div><b>Peran:</b> ${esc(u.role.toUpperCase())}</div>
          <div><b>Tanggal Cetak:</b> ${tglCetak}</div>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card"><div class="lbl">Saldo Utama</div><div class="val" style="color:#2563eb">${rp(r.saldo)}</div></div>
        <div class="stat-card"><div class="lbl">Total Pemasukan</div><div class="val" style="color:#16a34a">${rp(r.masuk)}</div></div>
        <div class="stat-card"><div class="lbl">Total Pengeluaran</div><div class="val" style="color:#dc2626">${rp(r.keluar)}</div></div>
        <div class="stat-card"><div class="lbl">Total Tabungan</div><div class="val" style="color:#9333ea">${rp(r.tabungan)}</div></div>
      </div>

      ${katRowsHtml ? `
        <h3>Pengeluaran Per Kategori</h3>
        <table style="width:100%;max-width:500px;border-collapse:collapse;font-size:12px;margin-bottom:15px;">
          <thead>
            <tr style="background:#f1f5f9;">
              <th style="color:#334155;background:#e2e8f0;border:1px solid #cbd5e1;">Kategori</th>
              <th style="color:#334155;background:#e2e8f0;border:1px solid #cbd5e1;text-align:right;">Jumlah</th>
              <th style="color:#334155;background:#e2e8f0;border:1px solid #cbd5e1;text-align:center;">Persentase</th>
            </tr>
          </thead>
          <tbody>${katRowsHtml}</tbody>
        </table>
      ` : ''}

      <h3>Daftar Rincian Transaksi</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th style="width:30px;text-align:center">No</th>
            <th style="width:90px">Tanggal</th>
            <th style="width:75px;text-align:center">Tipe</th>
            <th style="width:130px">Kategori</th>
            <th>Keterangan</th>
            <th style="width:110px;text-align:right">Nominal</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>

      <div class="footer">
        Dicetak otomatis dari Aplikasi DompetKu pada ${tglCetak} | Siap Simpan PDF
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() { window.print(); }, 250);
        };
      