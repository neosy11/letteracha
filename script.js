document.addEventListener("DOMContentLoaded", function () {
  /* ===== KONFIGURASI SUPABASE ===== */
  // MASUKKAN KREDENSIAL SUPABASE ANDA DI SINI
  const SUPABASE_URL = 'https://hggbpvgyvtoxlfsgglom.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnZ2Jwdmd5dnRveGxmc2dnbG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzMDAzMDAsImV4cCI6MjEwNzg3NjMwMH0.OqF6TqPvKLejLMYWBkwYhAif_SB4On9ID216YR6TC_Q';
  
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  /* ===== STATE MANAGEMENT ===== */
  const STATE = {
    user: null,
    memories: [],
    things: [],
    isCurator: false
  };
// DAFTAR EMAIL YANG BERHAK MENJADI KURATOR
  const CURATOR_EMAILS = [
    "achacantik@gmail.com",
    "neolycant@gmail.com"
  ];
  
  const CONFIG = {
    senderName: "Ahmad Syauqi",
    typeSpeedMs: 30,
    musicEnabled: true,
    musicPath: "assets/audio/lagu-kita.mp3",
    apologyLetter: `Selamat datang di tempat di mana waktu berhenti sejenak.\n\nTempat ini dibangun bukan untuk mengingat satu hari tertentu, melainkan untuk menyimpan jejak dari setiap langkah yang kita ambil bersama. Dari tawa yang tak sengaja terekam, hingga keheningan yang nyaman saat kita berdua.\n\nMungkin akan ada masa di mana kita lupa, lelah, atau tersesat dalam rutinitas. Saat hari itu tiba, aku harap museum ini bisa menjadi tempat kita pulang—untuk mengingatkan kembali bagaimana semua ini dimulai, dan mengapa kita memilih untuk terus bertahan.\n\nSilakan berkeliling. Ruangan ini adalah milikmu, sama seperti hatiku.`,
    closing: `Terima kasih atas kunjungannya.\nMuseum ini akan selalu terbuka untukmu.\n\nI love you.`
  };

  /* ===== HELPER FUNCTIONS ===== */
  const $ = id => document.getElementById(id);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let audio = null;

  function startMusic() {
    const mbtn = $("musicBtn");
    if (!CONFIG.musicEnabled) return;
    try {
      audio = new Audio(CONFIG.musicPath);
      audio.loop = true; 
      audio.volume = 0.5; // Atur volume (0.0 sampai 1.0)
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

  function showToast(message, type = 'success') {
    const container = $('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    
    // Trigger reflow
    void toast.offsetWidth;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  function formatDate(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  }

/* ===== AUTHENTICATION ===== */

async function checkAuth() {
  try {
    const {
      data: { session },
      error
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Gagal mengecek session:", error);
      return;
    }

    const curatorBadge = $("curatorBadge");
    const titipBtn = $("titipBtn");
    const addReasonContainer = $("addReasonContainer");
    const loginBtn = $("loginBtn");

    if (session?.user) {
      STATE.user = session.user;

      const email = (session.user.email || "").trim().toLowerCase();

      STATE.isCurator = CURATOR_EMAILS.includes(email);

      console.log(
        STATE.isCurator
          ? `Session curator ditemukan: ${email}`
          : `User biasa ditemukan: ${email}`
      );

      // Badge curator
      if (curatorBadge) {
        curatorBadge.classList.toggle(
          "hidden",
          !STATE.isCurator
        );
      }

      // Tombol tambah kenangan
      if (titipBtn) {
        titipBtn.classList.toggle(
          "hidden",
          !STATE.isCurator
        );
      }

      // Tombol tambah "100 Hal"
      if (addReasonContainer) {
        addReasonContainer.classList.toggle(
          "hidden",
          !STATE.isCurator
        );
      }

      // Tombol login
      if (loginBtn) {
        loginBtn.hidden = true;
      }

    } else {
      STATE.user = null;
      STATE.isCurator = false;

      if (curatorBadge) {
        curatorBadge.classList.add("hidden");
      }

      if (titipBtn) {
        titipBtn.classList.add("hidden");
      }

      if (addReasonContainer) {
        addReasonContainer.classList.add("hidden");
      }

      if (loginBtn) {
        loginBtn.hidden = false;
      }

      console.log("Tidak ada session aktif.");
    }

  } catch (err) {
    console.error("checkAuth error:", err);
  }
}

/* ===== BUKA MODAL LOGIN ===== */

const loginButton = $("loginBtn");
const authModal = $("authModal");

if (loginButton && authModal) {
  loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    authModal.hidden = false;
  });
}


/* ===== PROSES LOGIN ===== */

const authForm = $("authForm");

if (authForm) {
  authForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = $("authEmail").value.trim();
    const password = $("authPassword").value;
    const btn = e.currentTarget.querySelector("button");

    btn.textContent = "Memverifikasi...";
    btn.disabled = true;

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: email,
          password: password
        });

      if (error) {
        console.error("Supabase Login Error:", error);

        showToast(
          `Login gagal: ${error.message}`,
          "error"
        );

        return;
      }

     if (!data.session || !data.user) {
        throw new Error("Session login tidak ditemukan.");
      }

      /* Simpan user & Cek Email Kurator */
      STATE.user = data.user;
      const loggedEmail = (data.user.email || "").trim().toLowerCase();
      STATE.isCurator = CURATOR_EMAILS.includes(loggedEmail);

      /* Aktifkan mode kurator HANYA jika emailnya cocok */
      $("curatorBadge")?.classList.toggle("hidden", !STATE.isCurator);
      $("titipBtn")?.classList.toggle("hidden", !STATE.isCurator);
      $("addReasonContainer")?.classList.toggle("hidden", !STATE.isCurator);

      /* Sembunyikan tombol login */
      if ($("loginBtn")) {
        $("loginBtn").hidden = true;
      }

      /* Tutup modal */
      $("authModal").hidden = true;

      showToast(STATE.isCurator ? "Selamat datang kembali, Kurator!" : "Berhasil masuk ke museum.");

      /* Refresh data */
      await loadMemories();
      await loadThings();

    } catch (err) {

      console.error("Login Exception:", err);

      showToast(
        `Terjadi kesalahan: ${err.message}`,
        "error"
      );

    } finally {

      btn.textContent = "Masuk";
      btn.disabled = false;

    }
  });
}

/* ===== MUSEUM SECTION NAVIGATION ===== */

function initMuseumNavigation() {
  const nav = $("museumNav");

  if (!nav) return;

  const buttons = nav.querySelectorAll("[data-target]");
  const sections = Array.from(
    document.querySelectorAll(".fade-in-section")
  );

  // Klik navigasi
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.target;
      const target = $(targetId);

      if (!target) return;

      target.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "start"
      });
    });
  });

  // Menentukan menu aktif berdasarkan posisi section
  if (!("IntersectionObserver" in window)) return;

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = entry.target.id;

        buttons.forEach((button) => {
          button.classList.toggle(
            "active",
            button.dataset.target === id
          );
        });
      });
    },
    {
      root: null,
      threshold: 0.45
    }
  );

  sections.forEach((section) => {
    navObserver.observe(section);
  });
}
 /* ===== MUSEUM ANALYTICS ===== */
  function renderAnalytics() {
    const grid = $('analyticsGrid');
    if (!grid || !STATE.memories) return;

    const totalMemories = STATE.memories.length;
    let daysTogether = 0;
    
    if (totalMemories > 0) {
      const oldestDate = new Date(Math.min(...STATE.memories.map(m => new Date(m.date))));
      const today = new Date();
      daysTogether = Math.floor((today - oldestDate) / (1000 * 60 * 60 * 24));
    }

    const totalThings = STATE.things ? STATE.things.filter(t => t.is_completed).length : 0;
    
    const categories = new Set(STATE.memories.map(m => m.category)).size;

    grid.innerHTML = `
      <div class="stat-card">
        <span class="stat-num">${daysTogether}</span>
        <span class="stat-label">Hari Perjalanan</span>
      </div>
      <div class="stat-card">
        <span class="stat-num">${totalMemories}</span>
        <span class="stat-label">Momen Tersimpan</span>
      </div>
      <div class="stat-card">
        <span class="stat-num">${totalThings}</span>
        <span class="stat-label">Hal Terwujud</span>
      </div>
      <div class="stat-card">
        <span class="stat-num">${categories}</span>
        <span class="stat-label">Bab Cerita</span>
      </div>
    `;
  }
  
  /* ===== INTERACTIVE SCRAPBOOK ===== */
  async function loadScrapbook() {
    const { data, error } = await supabase.from('scrapbook').select('*');
    if (!error && data) renderScrapbook(data);
  }

  function renderScrapbook(items) {
    const canvas = $('scrapbookCanvas');
    if (!canvas) return;
    canvas.innerHTML = '';

    items.forEach(item => {
      const el = document.createElement('div');
      el.className = `scrap-item ${item.type}`;
      el.dataset.rotation = item.rotation;
      
      // Deteksi Teks atau Foto
      let contentHTML = '';
      if (item.type === 'photo') {
        const { data: publicUrlData } = supabase.storage.from('museum_media').getPublicUrl(item.content);
        contentHTML = `<img src="${publicUrlData.publicUrl}" alt="Polaroid" loading="lazy" decoding="async">`;
      } else {
        contentHTML = item.content;
      }

      // Tombol hapus hanya muncul jika Kurator yang login
      const deleteBtnHTML = STATE.isCurator ? `<button class="scrap-delete-btn" onclick="deleteScrap('${item.id}', '${item.type}', '${item.content}')">✕</button>` : '';

      el.innerHTML = `${deleteBtnHTML}<div class="scrap-pin"></div>${contentHTML}`;
      el.style.transform = `translate(${item.pos_x}px, ${item.pos_y}px) rotate(${item.rotation}deg)`;
      canvas.appendChild(el);

      makeDraggable(el, item.id, parseFloat(item.pos_x), parseFloat(item.pos_y));
    });
  }

 function makeDraggable(el, id, initialX, initialY) {
    let isDragging = false;
    let startX, startY, currentX = initialX, currentY = initialY;
    let ticking = false; // <-- Variabel baru untuk mengontrol frame rate agar tidak lag

    el.addEventListener('pointerdown', (e) => {
      if (!STATE.isCurator || e.target.classList.contains('scrap-delete-btn')) return; 
      isDragging = true;
      el.style.zIndex = 100; // Majukan ke depan saat ditarik
      startX = e.clientX - currentX;
      startY = e.clientY - currentY;
      el.setPointerCapture(e.pointerId);
    });

    el.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      currentX = e.clientX - startX;
      currentY = e.clientY - startY;
      
      // Menggunakan requestAnimationFrame agar pergeseran foto di HP sangat mulus
      if (!ticking) {
        window.requestAnimationFrame(() => {
          el.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${el.dataset.rotation}deg)`;
          ticking = false;
        });
        ticking = true;
      }
    });

    el.addEventListener('pointerup', async (e) => {
      if (!isDragging) return;
      isDragging = false;
      el.style.zIndex = 1;
      el.releasePointerCapture(e.pointerId);
      
      // Update posisi baru ke Supabase di latar belakang
      await supabase.from('scrapbook').update({ pos_x: currentX, pos_y: currentY }).eq('id', id);
    });
  }

  // Fungsi Global Menghapus Item
  window.deleteScrap = async function(id, type, content) {
    if (!STATE.isCurator) return;
    if (!confirm('Apakah kamu yakin ingin mencabut memori ini dari papan?')) return;

    const { error } = await supabase.from('scrapbook').delete().eq('id', id);
    if (!error) {
      // Jika yang dihapus foto, bersihkan juga filenya dari rak Storage
      if (type === 'photo') supabase.storage.from('museum_media').remove([content]);
      loadScrapbook();
    } else {
      showToast('Gagal mencabut memori.', 'error');
    }
  };

  // Handler: Tambah Catatan Teks
  $('addScrapNoteBtn')?.addEventListener('click', async () => {
    if (!STATE.isCurator) return;
    const input = $('scrapNoteInput');
    if (!input.value.trim()) return;

    const btn = $('addScrapNoteBtn');
    btn.disabled = true;

    const randX = Math.floor(Math.random() * 200) + 50;
    const randY = Math.floor(Math.random() * 150) + 50;
    const randRot = Math.floor(Math.random() * 30) - 15;

    const { error } = await supabase.from('scrapbook').insert([{
      type: 'note', content: input.value, pos_x: randX, pos_y: randY, rotation: randRot
    }]);

    if (!error) { input.value = ''; loadScrapbook(); }
    btn.disabled = false;
  });

  // Handler: Tambah Foto Polaroid
  $('scrapImageInput')?.addEventListener('change', (e) => {
    const label = document.querySelector('label[for="scrapImageInput"]');
    label.textContent = e.target.files.length > 0 ? "1 Foto Dipilih" : "Pilih Foto";
    label.style.border = e.target.files.length > 0 ? "1px solid var(--accent)" : "";
  });

  $('addScrapPhotoBtn')?.addEventListener('click', async () => {
    if (!STATE.isCurator) return;
    const fileInput = $('scrapImageInput');
    const file = fileInput.files[0];
    
    if (!file) return showToast("Silakan pilih foto terlebih dahulu.", "error");

    const btn = $('addScrapPhotoBtn');
    btn.disabled = true; btn.textContent = 'Menempel...';

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `scrapbook/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('museum_media').upload(fileName, file);
      if (uploadError) throw uploadError;

      const randX = Math.floor(Math.random() * 200) + 50;
      const randY = Math.floor(Math.random() * 150) + 50;
      const randRot = Math.floor(Math.random() * 30) - 15;

      const { error: insertError } = await supabase.from('scrapbook').insert([{
        type: 'photo', content: fileName, pos_x: randX, pos_y: randY, rotation: randRot
      }]);

      if (insertError) throw insertError;
      
      fileInput.value = '';
      document.querySelector('label[for="scrapImageInput"]').textContent = "Pilih Foto";
      loadScrapbook();
    } catch (err) {
      console.error(err);
      showToast('Gagal menempel foto.', 'error');
    } finally {
      btn.disabled = false; btn.textContent = 'Tempel Foto';
    }
  });
  
/* ===== 01 GATE & NAVIGATION ===== */
  function initGate() {
    const btn = $("openBtn");
    let busy = false;
    btn.addEventListener("click", () => {
      if (busy) return;
      busy = true; 
      btn.textContent = "Membuka Pintu...";
      btn.disabled = true;

      startMusic();
      
      $("main").hidden = false;
      $("gate").classList.add("out");
      
      // Tambahkan kata "async" di dalam setTimeout
      setTimeout(async () => {
        $("gate").hidden = true;
        document.body.classList.remove("locked");
        initLetterObserver();
        
        // Tunggu database selesai mengambil data kenangan
        await loadMemories();
        loadThings();
        
        // Panggil Mesin Waktu!
        showMemoryOfTheDay();
        
      }, 1500);
    });
  }
  
  /* ===== 02 KATA PENGANTAR ===== */
  let typeTimer = null, typed = false;
  function finishLetter() {
    clearTimeout(typeTimer);
    $("letterText").textContent = CONFIG.apologyLetter;
    $("cursor").classList.add("done");
    $("signature").textContent = CONFIG.senderName;
    $("signature").classList.add("show");
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

  /* ===== 03 CRUD KENANGAN (DATABASE) ===== */
  async function loadMemories() {
    const gallery = $("gallery");
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      showToast('Gagal memuat arsip museum.', 'error');
      gallery.innerHTML = '<p class="hint">Gagal terhubung ke arsip.</p>';
      return;
    }

    STATE.memories = data;
    renderGallery(data);
  }

  function renderGallery(memories) {
    const g = $("gallery");
    g.innerHTML = '';
    
    if (memories.length === 0) {
      g.innerHTML = '<p class="hint" style="grid-column: 1/-1; text-align: center;">Belum ada kenangan yang dipajang di ruang ini.</p>';
      return;
    }

    memories.forEach(m => {
      const card = document.createElement("button");
      card.type = "button"; card.className = "card";
      card.setAttribute("aria-expanded", "false");

      const photo = document.createElement("div"); photo.className = "photo";
      const img = document.createElement("img");
      
      // Handle Image Fetching from Supabase Storage
      const { data: publicUrlData } = supabase.storage.from('museum_media').getPublicUrl(m.image_url);
      img.src = m.image_url ? publicUrlData.publicUrl : ''; 
      img.alt = `Arsip: ${m.title}`; 
      img.loading = "lazy";
      img.decoding = "async"; // <-- Perintah tambahan untuk HP
      img.addEventListener("error", () => { img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23EAE0CF"/></svg>'; });
      photo.appendChild(img);

      const label = document.createElement("div"); label.className = "label"; label.textContent = m.title;
      const meta = document.createElement("div"); meta.className = "meta";
      const time = document.createElement("time"); time.textContent = formatDate(m.date);
      
      const cat = document.createElement("span"); 
      cat.style.display = "block"; cat.style.fontSize = "0.8rem"; cat.style.marginBottom = "0.5rem"; cat.style.color = "var(--text-main)"; cat.textContent = m.category;

      const desc = document.createElement("span"); desc.textContent = m.description;
      meta.append(time, cat, desc);

      card.append(photo, label, meta);
      card.addEventListener("click", () => {
        const open = card.classList.toggle("open");
        card.setAttribute("aria-expanded", String(open));
      });
      g.appendChild(card);
    });
  }

  // Pencarian (Search)
  $('searchInput').addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase();
    const filtered = STATE.memories.filter(m => 
      m.title.toLowerCase().includes(keyword) || 
      m.description.toLowerCase().includes(keyword) ||
      m.category.toLowerCase().includes(keyword)
    );
    renderGallery(filtered);
  });

  // Modal Penambahan Kenangan
  $('titipBtn').addEventListener('click', () => {
    if (!STATE.isCurator) return showToast('Hanya Kurator yang dapat menambah koleksi.', 'error');
    $('memoryModal').hidden = false;
  });

  document.querySelectorAll('.close-memory-modal').forEach(btn => {
    btn.addEventListener('click', () => { $('memoryModal').hidden = true; $('memoryForm').reset();$('imagePreview').style.display = 'none'; });
  });

  // Image Preview
  $('memImage').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        $('imagePreview').style.display = 'block';$('imagePreview').style.backgroundImage = `url(${e.target.result})`;
      }
      reader.readAsDataURL(file);
    }
  });

  // Submit Kenangan Baru
  $('memoryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = $('saveMemoryBtn');
    btn.textContent = 'Menyimpan ke Arsip...'; btn.disabled = true;

    try {
      const title = $('memTitle').value;
      const date = $('memDate').value;
      const desc = $('memDesc').value;
      const category = $('memCat').value;
      const file = $('memImage').files[0];
      
      let imageUrl = '';

      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `memories/${fileName}`;
        
        const { error: uploadError } = await supabase.storage.from('museum_media').upload(filePath, file);
        if (uploadError) throw uploadError;
        imageUrl = filePath;
      }

      const { error: insertError } = await supabase.from('memories').insert([
        {
        title,
        date,
        description: desc,
        category,
        image_url: imageUrl,
        user_id: STATE.user.id
        }
      ]);

      if (insertError) throw insertError;

      showToast('Kenangan berhasil diabadikan.');
      $('memoryModal').hidden = true;
      $('memoryForm').reset();$('imagePreview').style.display = 'none';
      loadMemories(); // Refresh grid

   
    } catch (err) {
      console.error("Gagal menyimpan kenangan:", err);

      showToast(
        'Gagal: ' + (err?.message || "Kesalahan sistem"),
        'error'
      );
    } finally {
      btn.textContent = 'Simpan ke Database';
      btn.disabled = false;
    }
  });

  /* ===== 04 KOLEKSI 100 HAL (THINGS ABOUT US) ===== */
  async function loadThings() {
    const { data, error } = await supabase
      .from('things_about_us')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data) {
      STATE.things = data;
      renderThings();
    }
  }

  function renderThings() {
    const list = $("reasonList");
    list.innerHTML = '';
    let completedCount = 0;

    STATE.things.forEach(thing => {
      if (thing.is_completed) completedCount++;
      const li = document.createElement("li");
      if (thing.is_completed) li.className = "completed";
      
      const check = document.createElement("input");
      check.type = "checkbox";
      check.className = "reason-check";
      check.checked = thing.is_completed;
      check.disabled = !STATE.isCurator; // Only curator can check off items
      
      check.addEventListener('change', async (e) => {
        if (!STATE.isCurator) return;
        const isChecked = e.target.checked;
        li.classList.toggle("completed", isChecked);
        await supabase.from('things_about_us').update({ is_completed: isChecked }).eq('id', thing.id);
        updateProgress();
      });

      const text = document.createElement("span");
      text.className = "reason-text";
      text.textContent = thing.content;

      li.append(check, text);
      list.appendChild(li);
    });

    updateProgress();
  }

  function updateProgress() {
    const total = Math.max(STATE.things.length, 100); // Base target is 100
    const completed = STATE.things.filter(t => t.is_completed).length;
    const percentage = Math.min((completed / total) * 100, 100);
    
    $('reasonsProgress').style.width = `${percentage}%`;
    $('progressText').textContent = `${completed} dari 100 momen telah terkumpul`;
  }

 // Tambah Hal Baru
  $('saveReasonBtn').addEventListener('click', async () => {
    // Pengaman: Tolak jika yang mengklik bukan kurator
    if (!STATE.user || !STATE.isCurator) {
      return showToast("Hanya kurator resmi yang dapat menambah daftar ini.", "error");
    }

    const input = $('newReasonInput');
    const content = input.value.trim();
    if (!content) return;
    
    const btn = $('saveReasonBtn');
    btn.disabled = true;

    const { error } = await supabase.from('things_about_us').insert([{ content }]);
    if (!error) {
      input.value = '';
      await loadThings();
    } else {
      showToast('Gagal menambah hal baru.', 'error');
    }
    btn.disabled = false;
  });

  // Modal 100 Hal Setup
  const modal = $("modal"), openBtn = $("reasonsBtn");
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => modal.hidden = true);
  });
  openBtn.addEventListener("click", () => { modal.hidden = false; });
  
  /* ===== MESIN WAKTU HARIAN (ON THIS DAY) ===== */
  function showMemoryOfTheDay() {
    if (!STATE.memories || STATE.memories.length === 0) return;

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentDate = today.getDate();
    const currentYear = today.getFullYear();

    // 1. Filter kenangan di tanggal dan bulan yang sama dari tahun sebelumnya
    const onThisDayMemories = STATE.memories.filter(m => {
      const memDate = new Date(m.date);
      return memDate.getMonth() === currentMonth && 
             memDate.getDate() === currentDate && 
             memDate.getFullYear() < currentYear;
    });

    let selectedMemory = null;
    let isOnThisDay = false;

    if (onThisDayMemories.length > 0) {
      // Ambil secara acak jika ada lebih dari 1 kenangan di hari yang sama
      selectedMemory = onThisDayMemories[Math.floor(Math.random() * onThisDayMemories.length)];
      isOnThisDay = true;
    } else {
      // Jika tidak ada kejadian hari ini di tahun lalu, ambil 1 kenangan acak apa saja
      selectedMemory = STATE.memories[Math.floor(Math.random() * STATE.memories.length)];
      isOnThisDay = false;
    }

    // 2. Render data ke dalam Pop-up
    $('motdTitleLabel').textContent = isOnThisDay ? "⏳ Hari Ini di Masa Lalu" : "✨ Kenangan Acak Hari Ini";
    $('motdTitle').textContent = selectedMemory.title;
    $('motdDate').textContent = formatDate(selectedMemory.date);
    $('motdDesc').textContent = selectedMemory.description;

    const { data: publicUrlData } = supabase.storage.from('museum_media').getPublicUrl(selectedMemory.image_url);
    $('motdImage').src = selectedMemory.image_url ? publicUrlData.publicUrl : '';

    // 3. Tampilkan dengan sedikit jeda agar dramatis
    setTimeout(() => {
      $('motdModal').hidden = false;
    }, 1200);
  }

  // Tombol untuk menutup pop-up mesin waktu
  document.querySelectorAll('.close-motd').forEach(btn => {
    btn.addEventListener('click', () => { 
      $('motdModal').hidden = true; 
    });
  });

  /* ===== 05 FINAL SCENE (DEBU CAHAYA) ===== */
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

    // Kurangi jumlah debu jika layarnya sempit (HP)
    const particleCount = window.innerWidth < 768 ? 15 : 40;

    for (let i = 0; i < particleCount; i++) {                 
      const p = document.createElement("span");
      p.className = "dust";
      const size = Math.random() * 4 + 2;
      p.style.cssText = `
        left:${Math.random() * 100}%;
        width: ${size}px; height: ${size}px;
        animation-duration:${8 + Math.random() * 10}s;
        animation-delay:${-Math.random() * 5}s;
        will-change: transform, opacity; /* Meringankan kerja GPU */
      `;
      box.appendChild(p);
    }
  }

 /* ===== OBSERVER & INIT ===== */

const observer = new IntersectionObserver((entries) => {

  entries.forEach((entry) => {

    if (entry.isIntersecting) {

      entry.target.classList.add("is-visible");

      observer.unobserve(entry.target);

    }

  });

}, {
  threshold: 0.15
});


document
  .querySelectorAll(".fade-in-section")
  .forEach((el) => observer.observe(el));


/* ===== START WEBSITE ===== */

checkAuth()
  .catch((err) => {
    console.error("Auth initialization error:", err);
  })
  .finally(() => {
    initGate();
    initFuture();
    initMuseumNavigation();
  });
});
