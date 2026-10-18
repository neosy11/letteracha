document.addEventListener("DOMContentLoaded", function () {
  /* ===== KONFIGURASI SUPABASE ===== */
  const SUPABASE_URL = 'https://hggbpvgyvtoxlfsgglom.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_aiDfBiLS7UuszHRyt_A_2rurM';
  
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  /* ===== STATE MANAGEMENT ===== */
  const STATE = {
    user: null,
    memories: [],
    things: [],
    isCurator: false
  };

  const CURATOR_EMAILS = [
    "achacantik@gmail.com",
    "neolycant@gmail.com"
  ];

  const CONFIG = {
    senderName: "Kurator Museum",
    typeSpeedMs: 40,
    apologyLetter: `Selamat datang di tempat di mana waktu berhenti sejenak.\n\nTempat ini dibangun bukan untuk mengingat satu hari tertentu, melainkan untuk menyimpan jejak dari setiap langkah yang kita ambil bersama. Dari tawa yang tak sengaja terekam, hingga keheningan yang nyaman saat kita berdua.\n\nMungkin akan ada masa di mana kita lupa, lelah, atau tersesat dalam rutinitas. Saat hari itu tiba, aku harap museum ini bisa menjadi tempat kita pulang—untuk mengingatkan kembali bagaimana semua ini dimulai, dan mengapa kita memilih untuk terus bertahan.\n\nSilakan berkeliling. Ruangan ini adalah milikmu, sama seperti hatiku.`,
    closing: `Terima kasih atas kunjungannya.\nMuseum ini akan selalu terbuka untukmu.\n\nI love you.`
  };

  /* ===== HELPER FUNCTIONS ===== */
  const $ = id => document.getElementById(id);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function showToast(message, type = 'success') {
    const container = $('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    
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
      const { data: { session }, error } = await supabase.auth.getSession();

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

        if (curatorBadge) curatorBadge.classList.toggle("hidden", !STATE.isCurator);
        if (titipBtn) titipBtn.classList.toggle("hidden", !STATE.isCurator);
        if (addReasonContainer) addReasonContainer.classList.toggle("hidden", !STATE.isCurator);
        if (loginBtn) loginBtn.hidden = true;
      } else {
        STATE.user = null;
        STATE.isCurator = false;
        if (curatorBadge) curatorBadge.classList.add("hidden");
        if (titipBtn) titipBtn.classList.add("hidden");
        if (addReasonContainer) addReasonContainer.classList.add("hidden");
        if (loginBtn) loginBtn.hidden = false;
      }
    } catch (err) {
      console.error("checkAuth error:", err);
    }
  }

  $('loginBtn').addEventListener('click', () => {$('authModal').hidden = false; });
  document.querySelectorAll('.close-auth-modal').forEach(btn => {
    btn.addEventListener('click', () => $('authModal').hidden = true);
  });

  $('authForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = $('authEmail').value;
    const password = $('authPassword').value;
    const btn = e.target.querySelector('button');
    btn.textContent = 'Memverifikasi...';
    btn.disabled = true;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      showToast('Akses ditolak. Kredensial tidak valid.', 'error');
    } else {
      STATE.user = data.user;
      const loggedEmail = (data.user.email || "").trim().toLowerCase();
      STATE.isCurator = CURATOR_EMAILS.includes(loggedEmail);

      $("curatorBadge")?.classList.toggle("hidden", !STATE.isCurator);
      $("titipBtn")?.classList.toggle("hidden", !STATE.isCurator);
      $("addReasonContainer")?.classList.toggle("hidden", !STATE.isCurator);
      if ($('loginBtn'))$('loginBtn').hidden = true;

      showToast(STATE.isCurator ? "Selamat datang kembali, Kurator!" : "Berhasil masuk ke museum.");
      $('authModal').hidden = true;
      $('authForm').reset();
      await loadMemories();
    }
    btn.textContent = 'Masuk';
    btn.disabled = false;
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
      
      $("main").hidden = false;
      $("gate").classList.add("out");
      setTimeout(() => {
        $("gate").hidden = true;
        document.body.classList.remove("locked");
        initLetterObserver();
        loadMemories();
        loadThings();
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
      
      const { data: publicUrlData } = supabase.storage.from('museum_media').getPublicUrl(m.image_url);
      img.src = m.image_url ? publicUrlData.publicUrl : ''; 
      img.alt = `Arsip: ${m.title}`; img.loading = "lazy";
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

  $('searchInput').addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase();
    const filtered = STATE.memories.filter(m => 
      m.title.toLowerCase().includes(keyword) || 
      m.description.toLowerCase().includes(keyword) ||
      m.category.toLowerCase().includes(keyword)
    );
    renderGallery(filtered);
  });

  $('titipBtn').addEventListener('click', () => {
    if (!STATE.isCurator) return showToast('Hanya Kurator resmi yang dapat menambah koleksi.', 'error');
    $('memoryModal').hidden = false;
  });

  document.querySelectorAll('.close-memory-modal').forEach(btn => {
    btn.addEventListener('click', () => { $('memoryModal').hidden = true; $('memoryForm').reset();$('imagePreview').style.display = 'none'; });
  });

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

  $('memoryForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!STATE.user || !STATE.isCurator) {
      showToast("Hanya dua curator resmi yang dapat mengabadikan kenangan.", "error");
      return;
    }

    const btn = $('saveMemoryBtn');
    btn.textContent = 'Menyimpan ke Arsip...'; 
    btn.disabled = true;

    try {
      const title = $('memTitle').value.trim();
      const date = $('memDate').value;
      const desc = $('memDesc').value.trim();
      const category = $('memCat').value;
      const file = $('memImage').files[0];

      if (!title || !date || !desc || !category) {
        showToast("Lengkapi semua informasi kenangan.", "error");
        return;
      }
      
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
        { title, date, description: desc, category, image_url: imageUrl, user_id: STATE.user.id }
      ]);

      if (insertError) throw insertError;

      showToast('Kenangan berhasil diabadikan.');
      $('memoryModal').hidden = true;
      $('memoryForm').reset();
      if ($('imagePreview'))$('imagePreview').style.display = 'none';
      await loadMemories();

    } catch (err) {
      console.error("Gagal menyimpan kenangan:", err);
      showToast('Gagal: ' + (err?.message || "Kesalahan sistem"), 'error');
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
      check.disabled = !STATE.isCurator;
      
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
    const total = Math.max(STATE.things.length, 100);
    const completed = STATE.things.filter(t => t.is_completed).length;
    const percentage = Math.min((completed / total) * 100, 100);
    
    if ($('reasonsProgress'))$('reasonsProgress').style.width = `${percentage}%`;
    if ($('progressText'))$('progressText').textContent = `${completed} dari 100 momen telah terkumpul`;
  }

  $('saveReasonBtn').addEventListener('click', async () => {
    if (!STATE.isCurator) return showToast("Hanya kurator yang dapat menambah hal baru.", "error");
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

  const modal = $("modal"), openBtn = $("reasonsBtn");
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => modal.hidden = true);
  });
  if (openBtn) openBtn.addEventListener("click", () => { modal.hidden = false; });


  /* ===== 05 FINAL SCENE ===== */
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

  /* ===== OBSERVER & INIT ===== */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); 
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-in-section').forEach((el) => observer.observe(el));

  initGate();
  initFuture();
  checkAuth();
});
