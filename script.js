/* ===== KONFIGURASI — edit bagian ini saja =====
 - senderName / partnerName : ganti nama
 - apologyLetter            : isi surat (baris kosong = paragraf baru)
 - musicPath                : ganti file musik (taruh di assets/audio/, sesuaikan namanya)
 - memories                 : foto di assets/images/ (memory-1.jpg ... memory-4.jpg), judul, tanggal, caption
 - reasons                  : daftar alasan; kata "Karena " ditambahkan otomatis (reasonPrefix)
 - closing/decline          : pesan penutup */
document.addEventListener("DOMContentLoaded", function() {
const CONFIG = {
  senderName: "[Ahmad Syauqi]",
  partnerName: "[Annisa Safina]",
  signatureLead: "with a sincere heart,",
  typeSpeedMs: 30,
  apologyLetter: `Sayang,

Aku sudah memikirkan semuanya, termasuk hal-hal yang mungkin selama ini tidak cukup aku pahami.

Aku sadar bahwa ada sikap dan perkataanku yang menyakitimu. Aku menyesal karena telah membuat seseorang yang begitu berarti bagiku merasakan hal itu.

Aku tidak ingin sekadar meminta maaf lalu menganggap semuanya selesai. Aku ingin belajar memahami perasaanmu dengan lebih baik, memperbaiki kesalahanku, dan membuktikannya lewat tindakan, bukan hanya kata-kata.

Aku tahu mungkin sekarang kamu masih kecewa. Aku tidak akan memaksamu untuk segera memaafkanku. Aku hanya ingin kamu tahu bahwa perasaanmu berarti bagiku dan aku benar-benar menyesali apa yang telah terjadi.

Terima kasih sudah menjadi bagian dari banyak hal indah dalam hidupku.

Maafkan aku, ya. Aku masih punya banyak hal yang ingin aku perbaiki, terutama dalam diriku sendiri.`,
  musicEnabled: true,
  musicPath: "assets/audio/lagu-kita.mp3",
  memories: [
    { title: "The First Memory", image: "assets/images/memory-1.jpeg", date: "18 Agustus 2026", caption: "Ini pas pertama kali kita foto sayangggg.. ingatt kann??" },
    { title: "That Random Day", image: "assets/images/memory-2.jpeg", date: "21 Agustus 2026", caption: "Foto ini pas magrib magrib banget.. dua duanya cape HAHHA" },
    { title: "The Love", image: "assets/images/memory-3.jpeg", date: "2 Oktober 2026", caption: "HAHHA ingett bangett ini pas kita awal awal go public" },
    { title: "My Favorite Photo", image: "assets/images/memory-4.jpeg", date: "16 Oktober 2026", caption: "SUMPAH AKU GA BOSEN LIATIN FOTO INI SAYANGG" }
  ],
  reasonPrefix: "Karena ",
  reasons: [
    "kamu bisa membuat hari biasa terasa lebih berarti.",
    "caramu bercerita tentang hal kecil selalu menarik bagiku.",
    "ada banyak momen sederhana bersamamu yang masih aku ingat.",
    "kamu punya caramu sendiri untuk menunjukkan kepedulian.",
    "kamu mengingatkanku bahwa hubungan yang baik perlu terus dipelajari.",
    "tawamu membuat ruangan terasa lebih hangat.",
    "kamu memperhatikan hal-hal yang orang lain lewatkan.",
    "kamu sabar saat aku sedang tidak mudah dimengerti.",
    "caramu menyapa orang asing selalu sopan dan tulus.",
    "kamu ingat detail kecil yang pernah aku ceritakan sekali.",
    "bersamamu, diam pun terasa nyaman.",
    "kamu tidak pura-pura menjadi orang lain.",
    "kamu bertanya kabarku dengan sungguh-sungguh.",
    "kamu membuatku ingin jadi versi diriku yang lebih baik.",
    "caramu memilih kata saat sedang kesal masih terasa peduli.",
    "kamu menghargai usaha, sekecil apa pun itu.",
    "kamu punya selera lagu yang selalu membuatku penasaran.",
    "kamu tahu kapan aku butuh ditemani dan kapan butuh ruang.",
    "kamu berani jujur meski itu tidak mudah.",
    "senyummu di pagi hari bisa memperbaiki suasana hatiku.",
    "kamu memperlakukan orang tuamu dengan penuh hormat.",
    "kamu selalu menyisakan bagian terenak untuk orang lain.",
    "kamu tidak pernah meremehkan mimpi orang lain.",
    "caramu menyemangatiku terasa tulus, bukan basa-basi.",
    "kamu bisa tertawa pada dirimu sendiri.",
    "kamu peduli pada hal-hal yang sering dianggap sepele.",
    "kamu membuat tempat yang sederhana terasa istimewa.",
    "kamu mau belajar, begitu juga aku bersamamu.",
    "pesan singkatmu bisa membuat hariku lebih ringan.",
    "kamu punya cara unik untuk menyelesaikan masalah.",
    "kamu mendengarkan sampai aku selesai bicara.",
    "kamu menepati janji-janji kecil.",
    "kamu terlihat tenang saat orang lain panik.",
    "kamu membuatku merasa aman menjadi diriku sendiri.",
    "kamu suka berbagi makanan, bahkan yang paling kamu suka.",
    "kamu mengingatkanku untuk istirahat saat aku lupa.",
    "kamu menghargai waktu orang lain.",
    "cara berpikirmu sering membuka sudut pandang baru bagiku.",
    "kamu masih bisa kagum pada hal-hal kecil, seperti langit sore.",
    "kamu tidak ragu meminta maaf saat salah.",
    "kamu berbicara baik tentang orang yang tidak ada di sana.",
    "kamu membuat percakapan malam terasa seperti rumah.",
    "kamu punya keberanian yang tidak selalu kamu sadari.",
    "kamu peduli pada kebahagiaan orang di sekitarmu.",
    "kamu membuatku percaya bahwa aku bisa lebih baik.",
    "kamu menyimpan kenangan kecil dengan hati-hati.",
    "kamu tahu cara menenangkanku tanpa banyak kata.",
    "kamu selalu punya cerita lucu di waktu yang tepat.",
    "kamu bekerja keras tanpa banyak mengeluh.",
    "kamu menghargai kejujuran lebih dari kata-kata manis.",
    "kamu menyapa hariku dengan cara yang hangat.",
    "kamu membuat hal biasa seperti makan bersama terasa berkesan.",
    "kamu tidak pernah berhenti belajar.",
    "kamu memberi ruang untuk orang lain berkembang.",
    "kamu punya kebiasaan kecil yang diam-diam aku sukai.",
    "kamu bisa membuatku tersenyum meski sedang lelah.",
    "kamu peduli pada orang yang sedang kesulitan.",
    "kamu menunjukkan bahwa kelembutan itu kekuatan.",
    "kamu membuatku lebih sabar dari sebelumnya.",
    "kamu tahu cara menikmati hal sederhana.",
    "kamu berani mengatakan apa yang kamu rasakan.",
    "kamu menemaniku di hari-hari yang tidak mudah.",
    "kamu membuat rencana kecil terasa menyenangkan.",
    "kamu tidak pernah membuatku merasa kecil.",
    "kamu memberi perhatian pada hal-hal yang aku anggap remeh.",
    "kamu punya cara menghibur yang tidak dibuat-buat.",
    "kamu mengajariku arti mendengarkan.",
    "kamu terlihat cantik justru saat sedang menjadi dirimu sendiri.",
    "kamu menghargai proses, bukan hanya hasil.",
    "kamu membuat perjalanan biasa terasa seperti petualangan.",
    "kamu mau mencoba lagi, meski pernah kecewa.",
    "kamu tahu bagaimana membuat orang merasa diterima.",
    "kamu bisa serius dan bercanda dalam waktu yang sama.",
    "kamu punya cara mencintai yang penuh pertimbangan.",
    "kamu mengingatkanku pada hal-hal yang benar-benar penting.",
    "kamu menghargai waktu yang kita habiskan berdua.",
    "kamu bisa melihat sisi baik di hari yang buruk.",
    "kamu tidak membiarkan aku menyerah pada diriku sendiri.",
    "kamu memberiku semangat tanpa menekan.",
    "kamu menunjukkan bahwa perhatian tidak harus mewah.",
    "kamu mau berjuang untuk hal yang kamu yakini.",
    "kamu membuat aku ingin pulang lebih cepat.",
    "kamu mengajari aku bahwa tidak apa-apa untuk belum tahu segalanya.",
    "kamu menjaga hal-hal kecil yang kita punya.",
    "kamu bisa menjadi tempat bersandar sekaligus teman bertumbuh.",
    "suaramu menenangkan, bahkan lewat telepon yang singkat.",
    "kamu menghargai kepercayaan dan menjaganya.",
    "kamu membuat aku lebih peka pada perasaan orang lain.",
    "kamu tahu cara merayakan keberhasilan kecil.",
    "kamu bisa memaafkan dirimu sendiri, dan itu menginspirasiku.",
    "kamu mengajakku melihat dunia dengan lebih pelan.",
    "kamu mau mendengar penjelasanku, meski sedang kecewa.",
    "kamu membuatku belajar bertanggung jawab atas perkataanku.",
    "kamu memberiku banyak alasan untuk jadi lebih baik.",
    "kamu hadir di banyak kenangan indah dalam hidupku.",
    "kamu punya hati yang hangat, walau kadang lelah.",
    "kamu berarti bagiku, jauh lebih dari yang bisa aku tulis.",
    "aku ingin tumbuh bersamamu, dengan lebih jujur dan lebih peka.",
    "kamu membuatku percaya bahwa hal-hal baik layak diperjuangkan.",
    "aku masih ingin belajar mencintaimu dengan cara yang lebih baik."
  ],
  decline: "Tidak apa-apa. Aku mengerti kalau kamu masih butuh waktu. Terima kasih sudah membaca semuanya.",
  closing: `Terima kasih sudah memberiku ruang untuk memperbaiki semuanya.

Aku nggak mau berhenti di kata maaf. Aku ingin membuktikan bahwa aku bisa belajar dari kesalahanku.

Aku akan menghubungimu sekarang, kalau kamu juga siap. 🤍`
};

/* ===== Helper ===== */
const $ = id => document.getElementById(id);
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
let audio = null;

/* ===== 01 Gate + musik ===== */
function initGate() {
  const btn = $("openBtn");
  btn.textContent = `Untuk ${CONFIG.partnerName}, sentuh di sini`;
  let busy = false;
  btn.addEventListener("click", () => {
    if (busy) return;               // cegah klik berulang
    busy = true; btn.disabled = true;
    startMusic();
    $("main").hidden = false;
    $("gate").classList.add("out");
    setTimeout(() => {
      $("gate").hidden = true;
      document.body.classList.remove("locked");
      initLetterObserver();
    }, reduced ? 50 : 900);
  });
}

function startMusic() {
  const mbtn = $("musicBtn");
  if (!CONFIG.musicEnabled) return;
  try {
    audio = new Audio(CONFIG.musicPath);   // ganti file lewat CONFIG.musicPath
    audio.loop = true; audio.volume = 0.5;
    audio.addEventListener("error", () => { mbtn.hidden = true; });
    const p = audio.play();
    mbtn.hidden = false;
    if (p && p.catch) p.catch(() => { mbtn.hidden = true; audio = null; });
  } catch (e) { mbtn.hidden = true; }
  mbtn.addEventListener("click", () => {
    if (!audio) return;
    const paused = !audio.paused;
    if (paused) audio.pause(); else audio.play().catch(() => {});
    mbtn.classList.toggle("paused", paused);
    mbtn.setAttribute("aria-pressed", String(paused));
    mbtn.setAttribute("aria-label", paused ? "Putar musik" : "Jeda musik");
  });
}

/* ===== 02 Surat (typewriter) ===== */
let typeTimer = null, typed = false;
function finishLetter() {
  clearTimeout(typeTimer);
  $("letterText").textContent = CONFIG.apologyLetter;
  $("cursor").classList.add("done");
  const sig = $("signature");
  sig.textContent = `${CONFIG.signatureLead}\n${CONFIG.senderName}`;
  sig.classList.add("show");
  $("skipBtn").hidden = true;
}
function startTypewriter() {
  if (typed) return; typed = true;
  if (reduced) return finishLetter();
  const text = CONFIG.apologyLetter, out = $("letterText");
  let i = 0;
  (function tick() {
    if (i >= text.length) return finishLetter();
    out.textContent = text.slice(0, ++i);
    const ch = text[i - 1];
    typeTimer = setTimeout(tick, CONFIG.typeSpeedMs + (/[.,\n]/.test(ch) ? 160 : 0));
  })();
}
function initLetterObserver() {
  $("skipBtn").addEventListener("click", () => { typed = true; finishLetter(); });
  if (!("IntersectionObserver" in window)) return startTypewriter();
  const io = new IntersectionObserver(es => {
    if (es[0].isIntersecting) { io.disconnect(); startTypewriter(); }
  }, { threshold: 0.35 });
  io.observe($("letter"));
}

/* ===== 03 Galeri kenangan ===== */
function initGallery() {
  const g = $("gallery");
  CONFIG.memories.forEach(m => {
    const card = document.createElement("button");
    card.type = "button"; card.className = "card";
    card.setAttribute("aria-expanded", "false");

    const photo = document.createElement("div"); photo.className = "photo";
    const img = document.createElement("img");
    img.src = m.image; img.alt = `Foto kenangan: ${m.title}`; img.loading = "lazy";
    img.addEventListener("error", () => card.classList.add("nophoto"));   // fallback foto
    photo.appendChild(img);

    const label = document.createElement("div"); label.className = "label"; label.textContent = m.title;
    const meta = document.createElement("div"); meta.className = "meta";
    const time = document.createElement("time"); time.textContent = m.date;
    const cap = document.createElement("span"); cap.textContent = m.caption;
    meta.append(time, cap);

    card.append(photo, label, meta);
    card.addEventListener("click", () => {
      const open = card.classList.toggle("open");   // klik lagi untuk menutup
      card.setAttribute("aria-expanded", String(open));
    });
    g.appendChild(card);
  });
}

/* ===== 04 Modal alasan ===== */
function initModal() {
  const modal = $("modal"), list = $("reasonList"), openBtn = $("reasonsBtn"), closeBtn = $("modalClose");
  const frag = document.createDocumentFragment();
  CONFIG.reasons.forEach(r => { const li = document.createElement("li"); li.textContent = CONFIG.reasonPrefix + r; frag.appendChild(li); });
  list.appendChild(frag);
  let last = null;
  const onKey = e => {
    if (e.key === "Escape") return close();
    if (e.key === "Tab") {                       // jaga fokus tetap di dalam modal
      const f = [closeBtn, list];
      if (e.shiftKey && document.activeElement === closeBtn) { e.preventDefault(); list.focus(); }
      else if (!e.shiftKey && document.activeElement === list) { e.preventDefault(); closeBtn.focus(); }
    }
  };
  function open() {
    last = document.activeElement;
    modal.hidden = false; document.body.classList.add("locked");
    list.tabIndex = 0; list.scrollTop = 0; closeBtn.focus();
    document.addEventListener("keydown", onKey);
  }
  function close() {
    modal.hidden = true; document.body.classList.remove("locked");
    document.removeEventListener("keydown", onKey);
    if (last) last.focus();
  }
  openBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  modal.addEventListener("click", e => { if (e.target === modal) close(); });
}

/* ===== 05 Jawaban ===== */
function initAnswers() {
  const decline = $("declineMsg");
  const noBtn = $("noBtn");
  const yesBtn = $("yesBtn");
  
  let noClickCount = 0;
  
  // Kita atur ukuran awal untuk tombol YES
  let currentFontSize = 1; // dalam rem (standarnya 1rem)
  let currentPadding = 0.8; // dalam rem (standarnya 0.8rem vertikal)

  // Daftar teks lucu
  const noTexts = [
    "Beneran nih?",
    "Yakin nggak mau maafin?",
    "Pikirin lagi donggg",
    "Tega banget ih 🥺",
    "Plis maafin akuuu...",
    "Jangan pencet ini lagi dong!",
    "Pencet yang sebelah kiri aja 😭",
    "Oke, tombol ini aku sita! 🏃💨"
  ];

  noBtn.addEventListener("click", () => {
    if (noClickCount < noTexts.length) {
      noBtn.textContent = noTexts[noClickCount];
      noClickCount++;
      
      // Membesarkan tombol YES secara proporsional tanpa menimpa layout
      currentFontSize += 0.2; // Tambah ukuran teks
      currentPadding += 0.15; // Tambah jarak di dalam tombol
      
      yesBtn.style.fontSize = `${currentFontSize}rem`;
      yesBtn.style.padding = `${currentPadding}rem ${currentPadding * 2}rem`;
      yesBtn.style.transition = "all 0.3s ease";
      
    } else {
      // Hilangkan tombol NO di klik terakhir
      noBtn.style.display = "none";
    }
  });

  yesBtn.addEventListener("click", () => {
    // Reset ukuran (opsional, agar saat transisi tidak aneh)
    yesBtn.style.fontSize = "";
    yesBtn.style.padding = "";
    
    showClosing();
  });

  // Tombol kembali/tutup bawaan (biarkan saja)
  $("backBtn").addEventListener("click", () => {
    decline.hidden = true;
    $("capsule").scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  });
  $("closeSiteBtn").addEventListener("click", () => {
    window.close();
    $("closeHint").hidden = false;
  });
}
// PASTIKAN FUNGSI INI TETAP ADA TEPAT DI BAWAH initAnswers()
function showClosing() {
  const scene = $("scene");
  $("sceneMsg").textContent = CONFIG.closing; // Mengambil teks dari CONFIG di atas
  scene.hidden = false; 
  document.body.classList.add("locked");

  if (reduced) return;
  const box = $("petals"), colors = ["#D8A7A7", "#B97C83", "#EDE2D5"];
  box.innerHTML = ''; // Bersihkan kelopak sebelumnya (jika ada)

  for (let i = 0; i < 22; i++) {                 
    const p = document.createElement("span");
    p.className = "petal";
    p.style.cssText = `left:${Math.random() * 100}%;background:${colors[i % 3]};--dx:${(Math.random() - .5) * 120}px;animation-duration:${7 + Math.random() * 6}s;animation-delay:${-Math.random() * 10}s`;
    box.appendChild(p);
  }
}

/* ===== Init (tiap fitur terisolasi agar satu error tidak menghentikan yang lain) ===== */
[initGate, initGallery, initModal, initAnswers].forEach(fn => {
  try { fn(); } catch (e) { console.error(fn.name, e); }
});

 const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); 
      }
    });
  }, { threshold: 0.15 });

  const hiddenElements = document.querySelectorAll('.fade-in-section');
  hiddenElements.forEach((el) => observer.observe(el));

});
