const items = [
 {id:1,title:"Jardim de Rosas",category:"Flores",photo:"photo-1494972308805-463bc619d34e"},
 {id:2,title:"Flores ao Sol",category:"Flores",photo:"photo-1490750967868-88aa4486c946"},
 {id:3,title:"Amor em Tons de Rosa",category:"Amor",photo:"photo-1516589178581-6cd7833ae3b2"},
 {id:4,title:"Coração ao Entardecer",category:"Amor",photo:"photo-1518199266791-5375a83190b7"},
 {id:5,title:"Dourado Elegante",category:"Luxo",photo:"photo-1517841905240-472988babdf9"},
 {id:6,title:"Brilho & Elegância",category:"Luxo",photo:"photo-1515886657613-9f3515b0c78f"},
 {id:7,title:"Lago Tranquilo",category:"Natureza",photo:"photo-1470770841072-f978cf4d019e"},
 {id:8,title:"Montanhas Mágicas",category:"Natureza",photo:"photo-1500530855697-b586d89ba3ee"},
 {id:9,title:"Amiguinho Fofo",category:"Fofos",photo:"photo-1517849845537-4d257902454a"},
 {id:10,title:"Gatinho Querido",category:"Fofos",photo:"photo-1514888286974-6c03e2ca1dba"}
];
const imageUrl = p => `https://images.unsplash.com/${p}?auto=format&fit=crop&w=900&q=85`;
let category="Todos", selected=null;
let favorites = JSON.parse(localStorage.getItem("mmw-favorites")||"[]");
const gallery=document.getElementById("gallery"), viewer=document.getElementById("viewer");
function render(){
 const visible=items.filter(x=>category==="Todos"||(category==="Favoritos"?favorites.includes(x.id):x.category===category));
 document.getElementById("sectionTitle").textContent=category==="Todos"?"Todos os wallpapers":category==="Favoritos"?"Seus favoritos":`Wallpapers de ${category.toLowerCase()}`;
 document.getElementById("count").textContent=`${visible.length} ${visible.length===1?"imagem":"imagens"}`;
 gallery.innerHTML="";
 if(!visible.length){gallery.innerHTML='<div class="empty">Ainda não há favoritos por aqui.<br>Toque na estrelinha de uma imagem para guardá-la. ✨</div>';return;}
 visible.forEach(x=>{
  const card=document.createElement("article");card.className="wall";
  card.innerHTML=`<img loading="lazy" src="${imageUrl(x.photo)}" alt="${x.title}"><div class="shade"></div><div class="meta"><strong>${x.title}</strong><small>${x.category}</small></div><button class="heart" aria-label="Favoritar">${favorites.includes(x.id)?"♥":"♡"}</button>`;
  card.querySelector("img").addEventListener("click",()=>openViewer(x));
  card.querySelector(".meta").addEventListener("click",()=>openViewer(x));
  card.querySelector(".heart").addEventListener("click",e=>{e.stopPropagation();toggleFavorite(x.id);});
  gallery.appendChild(card);
 });
}
function toggleFavorite(id){favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];localStorage.setItem("mmw-favorites",JSON.stringify(favorites));render();}
function openViewer(x){selected=x;document.getElementById("bigImage").src=imageUrl(x.photo);document.getElementById("bigTitle").textContent=x.title;document.getElementById("bigCategory").textContent=x.category;viewer.classList.remove("hidden");}
function closeViewer(){viewer.classList.add("hidden");}
document.getElementById("closeViewer").onclick=closeViewer;
viewer.addEventListener("click",e=>{if(e.target===viewer)closeViewer();});
document.getElementById("downloadBtn").onclick=async()=>{
 if(!selected)return;const btn=document.getElementById("downloadBtn");btn.textContent="Preparando…";
 try{const response=await fetch(imageUrl(selected.photo));const blob=await response.blob();const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`wallpaper-${selected.title.toLowerCase().replaceAll(" ","-")}.jpg`;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);btn.textContent="Salvo!";}
 catch(e){window.open(imageUrl(selected.photo),"_blank");btn.textContent="Abrir imagem";}
 setTimeout(()=>btn.textContent="↓ Salvar imagem",1800);
};
document.getElementById("tabs").addEventListener("click",e=>{const b=e.target.closest("button[data-category]");if(!b)return;category=b.dataset.category;document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active",t===b));render();});
let deferredPrompt;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;document.getElementById("installBtn").classList.remove("hidden");});
document.getElementById("installBtn").onclick=async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;document.getElementById("installBtn").classList.add("hidden");};
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
render();