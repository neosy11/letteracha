/* ===== KONFIGURASI ===== */
document.addEventListener("DOMContentLoaded", function() {
const CONFIG = {
  senderName: "[Ahmad Syauqi]",
  partnerName: "[Annisa Safina]",
  signatureLead: "Kurator Museum,",
  typeSpeedMs: 40,
  
  // Teks diubah agar "timeless" (bisa dibaca bertahun-tahun lagi)
  apologyLetter: `Selamat datang di tempat di mana waktu berhenti sejenak.

Tempat ini dibangun bukan untuk mengingat satu hari tertentu, melainkan untuk menyimpan jejak dari setiap langkah yang kita ambil bersama. Dari tawa yang tak sengaja terekam, hingga keheningan yang nyaman saat kita berdua.

Mungkin akan ada masa di mana kita lupa, lelah, atau tersesat dalam rutinitas. Saat hari itu tiba, aku harap museum ini bisa menjadi tempat kita pulang—untuk mengingatkan kembali bagaimana semua ini dimulai, dan mengapa kita memilih untuk terus bertahan.

Silakan berkeliling. Ruangan ini adalah milikmu, sama seperti hatiku.`,
  
  musicEnabled: true,
  musicPath: "assets/audio/lagu-kita.mp3",
  
  memories: [
    { title: "The Beginning", image: "assets/images/memory-1.jpeg", date: "18 Agustus 2026", caption: "Potret pertama kita. Awal dari segala cerita panjang yang ada di ruangan ini." },
    { title: "Dusk & Exhaustion", image: "assets/images/memory-2.jpeg", date: "21 Agustus 2026", caption: "Difoto saat matahari terbenam. Kita berdua sangat lelah hari itu, tapi tetap tersenyum." },
    { title: "The Declaration", image: "assets/images/memory-3.jpeg", date: "2 Oktober 2026", caption: "Momen saat dunia akhirnya tahu bahwa kita memilih satu sama lain." },
    { title: "A Masterpiece", image: "assets/images/memory-4.jpeg", date: "16 Oktober 2026", caption: "Salah satu karya favorit di museum ini. Aku tidak pernah bosan memandanginya." }
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
  
  closing: `Terima kasih atas kunjungannya.
Museum ini akan selalu terbuka untukmu.

I love you.`
};

/* ===== Helper ===== */
const $ = id => document.getElementById(id);
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
let audio = null;

/* ===== 01 Gate + musik ===== */
function initGate() {
  const btn = $("openBtn");
  btn.textContent = `Buka Pintu Untuk ${CONFIG.partnerName}`;
  let busy = false;
  btn.addEventListener("click", () => {
    if (busy) return;
    busy = true; btn.disabled = true;
    startMusic();
    $("main").hidden = false;
    $("gate").classList.add("out");
    setTimeout(() => {
      $("gate").hidden = true;
      document.body.classList.remove("locked");
      initLetterObserver();
    }, reduced ? 50 : 1500);
  });
}

function startMusic() {
  const mbtn = $("musicBtn");
  if (!CONFIG.musicEnabled) return;
  try {
    audio = new Audio(CONFIG.musicPath);
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

/* ===== 02 Surat / Pengantar ===== */
let typeTimer = null, typed = false;
function finishLetter() {
  clearTimeout(typeTimer);
  $("letterText").textContent = CONFIG.apologyLetter;
  $("cursor").classList.add("done");
  const sig = $("signature");
  sig.textContent = `${CONFIG.signatureLead}\n${CONFIG.senderName}`;
  sig.classList.add("show");
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
    typeTimer = setTimeout(tick, CONFIG.typeSpeedMs + (/[.,\n]/.test(ch) ? 200 : 0));
  })();
}
function initLetterObserver() {
  if (!("IntersectionObserver" in window)) return startTypewriter();
  const io = new IntersectionObserver(es => {
    if (es[0].isIntersecting) { io.disconnect(); startTypewriter(); }
  }, { threshold: 0.35 });
  io.observe($("letter"));
}

/* ===== 03 Galeri Kenangan ===== */
function initGallery() {
  const g = $("gallery");
  CONFIG.memories.forEach(m => {
    const card = document.createElement("button");
    card.type = "button"; card.className = "card";
    card.setAttribute("aria-expanded", "false");

    const photo = document.createElement("div"); photo.className = "photo";
    const img = document.createElement("img");
    img.src = m.image; img.alt = `Lukisan: ${m.title}`; img.loading = "lazy";
    img.addEventListener("error", () => card.classList.add("nophoto"));
    photo.appendChild(img);

    const label = document.createElement("div"); label.className = "label"; label.textContent = m.title;
    const meta = document.createElement("div"); meta.className = "meta";
    const time = document.createElement("time"); time.textContent = m.date;
    const cap = document.createElement("span"); cap.textContent = m.caption;
    meta.append(time, cap);

    card.append(photo, label, meta);
    card.addEventListener("click", () => {
      const open = card.classList.toggle("open");
      card.setAttribute("aria-expanded", String(open));
    });
    g.appendChild(card);
  });
}

/* ===== 04 Modal Koleksi 100 Hal ===== */
function initModal() {
  const modal = $("modal"), list = $("reasonList"), openBtn = $("reasonsBtn"), closeBtn = $("modalClose");
  const frag = document.createDocumentFragment();
  CONFIG.reasons.forEach(r => { const li = document.createElement("li"); li.textContent = CONFIG.reasonPrefix + r; frag.appendChild(li); });
  list.appendChild(frag);
  let last = null;
  const onKey = e => {
    if (e.key === "Escape") return close();
    if (e.key === "Tab") {
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
  /* ===== Titip Kenangan via WhatsApp ===== */
function initTitip() {
  const titipBtn = $("titipBtn");
  if (!titipBtn) return;
  
  titipBtn.addEventListener("click", () => {
    // GANTI NOMOR DI BAWAH DENGAN NOMORMU (Gunakan awalan 62 tanpa + atau 0)
    // Contoh: "6281234567890"
    const noWhatsApp = "628xxxxxxxxxx"; 
    
    // Pesan yang akan otomatis terketik di HP dia
    const pesan = "Halo Pak Kurator! 🤍 Aku mau menambahkan koleksi baru nih di Museum Kita. Ini fotonya, tolong dipajang yaa...";
    
    // Membuka tab WhatsApp baru
    window.open(`https://wa.me/${noWhatsApp}?text=${encodeURIComponent(pesan)}`, "_blank");
  });
}

/* ===== 05 Penutup (Efek Debu Cahaya) ===== */
function initFuture() {
  $("futureBtn").addEventListener("click", showClosing);
}

function showClosing() {
  const scene = $("scene");
  $("sceneMsg").textContent = CONFIG.closing; 
  scene.hidden = false; 
  document.body.classList.add("locked");

  if (reduced) return;
  const box = $("petals");
  box.innerHTML = ''; 

  // Mengubah kelopak bunga menjadi efek debu cahaya yang melayang (seperti di sorotan lampu museum)
  for (let i = 0; i < 40; i++) {                 
    const p = document.createElement("span");
    p.className = "dust";
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      left:${Math.random() * 100}%;
      width: ${size}px; height: ${size}px;
      animation-duration:${8 + Math.random() * 10}s;
      animation-delay:${-Math.random() * 5}s
    `;
    box.appendChild(p);
  }
}

/* ===== Observer ===== */
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

/* ===== Init ===== */
[initGate, initGallery, initModal, initFuture, initTitip].forEach(fn => {
  try { fn(); } catch (e) { console.error(fn.name, e); }
});

});
