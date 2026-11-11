const defaults = {
  landing: { title: { es: "Tu nombre", en: "Your name" }, subtitle: { es: "Artista · Diseñadora · Creadora", en: "Artist · Designer · Creator" }, enter: { es: "ENTRAR ↗", en: "ENTER ↗" }, animationUrl: "", animationType: "video" },
  about: { es: "Bienvenida/o a mi espacio creativo. Aquí encontrarás una selección de mi trabajo, mis ideas y los proyectos que me inspiran.", en: "Welcome to my creative space. Explore a selection of my work, ideas, and the projects that inspire me." },
  pages: [{ slug: "about", titleEs: "Sobre mí", titleEn: "About", bodyEs: "", bodyEn: "" }],
  categories: [{ nameEs: "Diseño", nameEn: "Design", subcategories: [{ nameEs: "Identidad", nameEn: "Identity" }, { nameEs: "Digital", nameEn: "Digital" }] }, { nameEs: "Arte", nameEn: "Art", subcategories: [{ nameEs: "Ilustración", nameEn: "Illustration" }] }],
  projects: [],
  links: [{ labelEs: "Instagram", labelEn: "Instagram", url: "https://instagram.com/" }, { labelEs: "Contacto", labelEn: "Contact", url: "mailto:hello@example.com" }]
};
const config = window.PORTFOLIO_CONFIG || {};
const hasSupabase = window.supabase && config.supabaseUrl && config.supabaseAnonKey && !config.supabaseUrl.includes("YOUR_");
const db = hasSupabase ? window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey) : null;
let data = structuredClone(defaults), lang = localStorage.getItem("portfolio-lang") || "es", currentPage = "home", session = null;
const $ = (id) => document.getElementById(id);
const text = (es, en) => lang === "es" ? (es || en || "") : (en || es || "");
const safeUrl = (value) => { try { const u = new URL(value, location.href); return ["http:", "https:", "mailto:", "tel:"].includes(u.protocol) ? u.href : "#"; } catch { return "#"; } };
const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function toast(message) { const el = $("toast"); el.textContent = message; el.classList.add("show"); setTimeout(() => el.classList.remove("show"), 2800); }
function setLang(next) { lang = next; localStorage.setItem("portfolio-lang", lang); document.documentElement.lang = lang; render(); }
function renderLanding() {
  const l = data.landing || defaults.landing;
  $("landing-title").textContent = text(l.title?.es, l.title?.en);
  $("landing-subtitle").textContent = text(l.subtitle?.es, l.subtitle?.en);
  $("landing-kicker").textContent = lang === "es" ? "UN PEQUEÑO ESPACIO CREATIVO" : "A LITTLE CREATIVE SPACE";
  $("enter-button").textContent = text(l.enter?.es, l.enter?.en);
  const media = $("landing-media"); media.replaceChildren();
  if (l.animationUrl) {
    if (l.animationType === "image") { const img = document.createElement("img"); img.src = l.animationUrl; img.alt = ""; media.append(img); }
    else { const video = document.createElement("video"); video.src = l.animationUrl; video.autoplay = true; video.muted = true; video.loop = true; video.playsInline = true; media.append(video); }
  }
  document.querySelectorAll(".lang-toggle").forEach(b => b.textContent = lang === "es" ? "EN" : "ES");
}
function renderHub() {
  $("brand").textContent = data.landing?.title?.[lang] || "Portfolio";
  $("admin-open").hidden = false;
  const pages = Array.isArray(data.pages) ? data.pages : [];
  $("page-nav").innerHTML = `<a href="#home" class="${currentPage === "home" ? "active" : ""}">${lang === "es" ? "Inicio" : "Home"}</a>` + pages.map(p => `<a href="#page/${encodeURIComponent(p.slug)}" class="${currentPage === p.slug ? "active" : ""}">${esc(text(p.titleEs,p.titleEn))}</a>`).join("");
  $("admin-open").textContent = session ? (lang === "es" ? "Editar sitio" : "Edit site") : (lang === "es" ? "Administrar" : "Admin");
  const content = $("page-content");
  if (currentPage !== "home") {
    const page = pages.find(p => p.slug === currentPage);
    content.innerHTML = page ? `<section class="simple-page"><p class="eyebrow">${lang === "es" ? "PÁGINA" : "PAGE"}</p><h1>${esc(text(page.titleEs,page.titleEn))}</h1><p>${esc(text(page.bodyEs,page.bodyEn) || text(data.about?.es,data.about?.en))}</p></section>` : `<section class="simple-page"><h1>404</h1></section>`;
  } else {
    const categories = Array.isArray(data.categories) ? data.categories : [];
    const projects = Array.isArray(data.projects) ? data.projects : [];
    const categoryNames = [...new Set([...categories.map(c => text(c.nameEs,c.nameEn)), ...projects.map(p => text(p.categoryEs,p.categoryEn)).filter(Boolean)])];
    content.innerHTML = `<section class="hub-intro"><span class="intro-sticker" aria-hidden="true">♡</span><p class="eyebrow">${lang === "es" ? "HOLA, QUÉ BUENO TENERTE AQUÍ" : "HELLO, SO HAPPY YOU'RE HERE"}</p><h1>${lang === "es" ? "Un mundo hecho a mi manera." : "A little world, made my way."}</h1><p>${esc(text(data.about?.es,data.about?.en))}</p></section>
      <section class="work-section"><div class="section-heading"><div><p class="eyebrow">${lang === "es" ? "COSITAS QUE HE CREADO" : "LITTLE THINGS I'VE MADE"}</p><h2>${lang === "es" ? "Mi portfolio" : "My portfolio"}</h2></div><span class="project-count">♡ ${String(projects.length).padStart(2,"0")}</span></div>
      <div class="filters"><button class="filter active" data-filter="all">${lang === "es" ? "Todo" : "All"}</button>${categoryNames.map(n => `<button class="filter" data-filter="${esc(n)}">${esc(n)}</button>`).join("")}</div>
      <div class="project-grid">${projects.map((p,i) => projectCard(p,i)).join("")}</div>${projects.length ? "" : `<p class="empty-state">${lang === "es" ? "Tus proyectos aparecerán aquí. Inicia sesión para añadir el primero ♡" : "Your projects will appear here. Sign in to add the first one ♡"}</p>`}</section>
      <section class="links-section"><div><p class="eyebrow">${lang === "es" ? "NOS VEMOS POR AHÍ" : "SEE YOU AROUND"}</p><h2>${lang === "es" ? "Mis rinconcitos online" : "My little corners online"}</h2></div><div class="links-list">${(data.links || []).map(x => `<a href="${esc(safeUrl(x.url))}" target="_blank" rel="noreferrer">${esc(text(x.labelEs,x.labelEn))}<span>↗</span></a>`).join("")}</div></section>`;
    content.querySelectorAll(".filter").forEach(btn => btn.addEventListener("click", () => { content.querySelectorAll(".filter").forEach(x=>x.classList.remove("active")); btn.classList.add("active"); content.querySelectorAll(".project-card").forEach(card=>card.hidden = btn.dataset.filter !== "all" && card.dataset.category !== btn.dataset.filter); }));
  }
  $("footer").innerHTML = `<span>© ${new Date().getFullYear()} ${esc(data.landing?.title?.[lang] || "Portfolio")}</span><span>${lang === "es" ? "hecho con cariño ♡" : "made with love ♡"}</span>`;
}
function projectCard(p,i) {
  const cat = text(p.categoryEs,p.categoryEn), title = text(p.titleEs,p.titleEn);
  const image = p.image ? `<img src="${esc(safeUrl(p.image))}" alt="${esc(title)}" loading="lazy">` : `<div class="image-placeholder"><span>♡</span></div>`;
  const body = `<div class="project-image">${image}<span class="project-arrow">↗</span></div><div class="project-meta"><div><h3>${esc(title || (lang === "es" ? "Proyecto sin título" : "Untitled project"))}</h3><p>${esc(text(p.descriptionEs,p.descriptionEn))}</p></div><span class="project-category">${esc(cat)}</span></div>`;
  return `<article class="project-card" data-category="${esc(cat)}">${p.url ? `<a href="${esc(safeUrl(p.url))}" target="_blank" rel="noreferrer">${body}</a>` : body}</article>`;
}
function render() { renderLanding(); renderHub(); }
function enterHub() { $("landing").classList.add("hidden"); $("hub").classList.remove("hidden"); if(location.hash !== "#home") location.hash = "home"; }
function route() { const match = location.hash.match(/^#page\/(.+)$/); if (match) { currentPage = decodeURIComponent(match[1]); enterHub(); renderHub(); } else if (location.hash === "#home") { currentPage = "home"; enterHub(); renderHub(); } }
async function loadContent() {
  if (!db) return;
  try { const {data: row,error} = await db.from("portfolio_site").select("content").eq("id",1).maybeSingle(); if (error) throw error; if (row?.content) data = {...structuredClone(defaults), ...row.content}; }
  catch (e) { console.error(e); toast("No se pudo cargar el contenido guardado."); }
}
function fillEditor() {
  const l = data.landing || defaults.landing;
  $("e-title-es").value=l.title?.es||""; $("e-title-en").value=l.title?.en||""; $("e-subtitle-es").value=l.subtitle?.es||""; $("e-subtitle-en").value=l.subtitle?.en||"";
  $("e-enter-es").value=l.enter?.es||""; $("e-enter-en").value=l.enter?.en||""; $("e-animation").value=l.animationUrl||""; $("e-animation-type").value=l.animationType||"video";
  $("e-about-es").value=data.about?.es||""; $("e-about-en").value=data.about?.en||"";
  for(const [id,key] of [["e-pages","pages"],["e-categories","categories"],["e-projects","projects"],["e-links","links"]]) $(id).value=JSON.stringify(data[key]||[],null,2);
}
function readJson(id,key) { try { const v=JSON.parse($(id).value); if (!Array.isArray(v)) throw new Error("must be a JSON array"); return v; } catch(e) { throw new Error(`${key}: ${e.message}`); } }
function editorContent() {
  return {landing:{title:{es:$("e-title-es").value,en:$("e-title-en").value},subtitle:{es:$("e-subtitle-es").value,en:$("e-subtitle-en").value},enter:{es:$("e-enter-es").value,en:$("e-enter-en").value},animationUrl:$("e-animation").value.trim(),animationType:$("e-animation-type").value},about:{es:$("e-about-es").value,en:$("e-about-en").value},pages:readJson("e-pages","Pages"),categories:readJson("e-categories","Categories"),projects:readJson("e-projects","Projects"),links:readJson("e-links","Links")};
}
async function save() {
  const status=$("save-status");
  try { const next=editorContent(); if (!db) throw new Error("Configura Supabase (consulta README.md) para guardar los cambios de forma privada."); $("save-button").disabled=true; status.textContent="Guardando…";
    const {error}=await db.from("portfolio_site").upsert({id:1,content:next,updated_at:new Date().toISOString()},{onConflict:"id"}); if(error) throw error;
    data=next; render(); status.textContent="Cambios guardados."; toast("Portfolio actualizado ♡");
  } catch(e) { status.textContent=e.message; } finally { $("save-button").disabled=false; }
}
async function initAuth() { if(!db) return; const {data:result}=await db.auth.getSession(); session=result.session; db.auth.onAuthStateChange((_event,s)=>{session=s; $("admin-open").textContent=session?(lang==="es"?"Editar sitio":"Edit site"):(lang==="es"?"Administrar":"Admin");}); }
$("enter-button").addEventListener("click",enterHub);
document.querySelectorAll(".lang-toggle").forEach(b=>b.addEventListener("click",()=>setLang(lang==="es"?"en":"es")));
$("brand").addEventListener("click",()=>{currentPage="home";});
$("admin-open").addEventListener("click",()=>{if(session){fillEditor();$("editor-dialog").showModal();}else{$("login-error").textContent="";$("login-dialog").showModal();}});
$("login-form").addEventListener("submit",async e=>{e.preventDefault(); const f=new FormData(e.currentTarget); const errorEl=$("login-error"); if(!db){errorEl.textContent="Primero configura Supabase siguiendo README.md.";return;} const entered=String(f.get("email")||"").trim(); const username=config.adminUsername||"emiitheadmin"; const email=(entered.toLowerCase()===username.toLowerCase()?config.adminEmail:entered); if(!email||email.includes("YOUR_")){errorEl.textContent="Configura adminEmail en config.js con el correo de tu usuario Supabase.";return;} const {data:result,error}=await db.auth.signInWithPassword({email,password:f.get("password")}); if(error){errorEl.textContent="No se pudo iniciar sesión. Revisa tus credenciales.";return;} session=result.session; $("login-dialog").close(); fillEditor(); $("editor-dialog").showModal(); renderHub(); });
$("editor-form").addEventListener("submit",e=>{e.preventDefault();save();});
$("logout-button").addEventListener("click",async()=>{if(db) await db.auth.signOut(); session=null; $("editor-dialog").close(); renderHub();toast("Sesión cerrada.");});
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>$(b.dataset.close).close()));
$("image-upload").addEventListener("change",async e=>{const file=e.target.files?.[0];if(!file)return;const status=$("upload-status");if(!db||!session){status.textContent="Inicia sesión y configura Supabase para subir imágenes.";return;}status.textContent="Subiendo…";const path=`${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,"-")}`;const {error}=await db.storage.from("portfolio-media").upload(path,file,{cacheControl:"3600",upsert:false});if(error){status.textContent=error.message;return;}const {data:result}=db.storage.from("portfolio-media").getPublicUrl(path);await navigator.clipboard?.writeText(result.publicUrl);status.textContent=`Imagen subida; URL copiada: ${result.publicUrl}`;toast("Imagen subida ♡");e.target.value="";});
window.addEventListener("hashchange",route);
(async()=>{await loadContent();await initAuth();render();if(location.hash)route();})();
