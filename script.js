const STORAGE_KEY = "abiStoreProductsV1";
const WA_NUMBER = "6289603539296";
const initialProducts = [
  {id:"demo-ff",name:"Akun EPEP — Contoh",category:"AKUN EPEP",price:0,description:"Contoh tampilan stok akun Free Fire. Atur harga dan detail melalui panel admin.",image:"",demo:true},
  {id:"demo-ml",name:"Akun ML — Contoh",category:"AKUN ML",price:0,description:"Contoh tampilan stok akun Mobile Legends. Atur harga dan detail melalui panel admin.",image:"",demo:true},
  {id:"demo-topup",name:"Top Up Game — Contoh",category:"TOP UP ALGAME",price:0,description:"Contoh produk top up. Silakan ubah nama, deskripsi, dan harga di panel admin.",image:"",demo:true}
];
let products = loadProducts();
let activeFilter = "SEMUA";
const $ = id => document.getElementById(id);
function loadProducts(){try{const saved=localStorage.getItem(STORAGE_KEY);return saved?JSON.parse(saved):initialProducts.map(p=>({...p}));}catch(e){return initialProducts.map(p=>({...p}));}}
function saveProducts(){localStorage.setItem(STORAGE_KEY,JSON.stringify(products));}
function rupiah(value){return Number(value)===0?"Hubungi admin":"Rp "+new Intl.NumberFormat("id-ID").format(Number(value)||0);}
function escapeHTML(value=""){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function renderProducts(){
 const query=$("searchInput").value.trim().toLowerCase();
 const filtered=products.filter(p=>(activeFilter==="SEMUA"||p.category===activeFilter)&&(`${p.name} ${p.category} ${p.description}`).toLowerCase().includes(query));
 $("productGrid").innerHTML=filtered.map(p=>`<article class="product-card">
   <div class="product-image">${p.image?`<img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" onerror="this.remove()">`:`<span class="product-placeholder">${p.category==="AKUN EPEP"?"FF":p.category==="AKUN ML"?"ML":p.category==="TOP UP ALGAME"?"⚡":"ABI"}</span>`}<span class="product-category">${escapeHTML(p.category)}</span></div>
   <div class="product-info"><h3>${escapeHTML(p.name)}</h3><p>${escapeHTML(p.description||"Hubungi admin untuk detail produk.")}</p><div class="product-bottom"><div><span class="price-label">HARGA</span><span class="price">${rupiah(p.price)}</span></div><button class="order-btn" data-order="${escapeHTML(p.id)}">Pesan ↗</button></div></div>
  </article>`).join("");
 $("emptyState").hidden=filtered.length!==0;
 $("productGrid").hidden=filtered.length===0;
}
function renderAdmin(){
 $("adminProductList").innerHTML=products.length?products.map(p=>`<div class="admin-row"><div><b>${escapeHTML(p.name)}</b><small>${escapeHTML(p.category)} · ${rupiah(p.price)}</small></div><button data-edit="${escapeHTML(p.id)}">Edit</button><button class="delete" data-delete="${escapeHTML(p.id)}">Hapus</button></div>`).join(""):'<p style="color:#8fa8c2;font-size:11px">Belum ada stok produk.</p>';
}
function resetForm(){ $("productForm").reset();$("productId").value="";$("saveProduct").textContent="Simpan produk";}
$("productGrid").addEventListener("click",e=>{const btn=e.target.closest("[data-order]");if(!btn)return;const p=products.find(x=>x.id===btn.dataset.order);if(!p)return;const price=Number(p.price)===0?"Harga belum ditentukan":rupiah(p.price);const msg=`Halo ABI STORE, saya tertarik dengan produk: ${p.name}. Kategori: ${p.category}. Harga: ${price}. Apakah stok masih tersedia?`;window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`,"_blank","noopener");});
$("searchInput").addEventListener("input",renderProducts);
$("filterList").addEventListener("click",e=>{const btn=e.target.closest("[data-filter]");if(!btn)return;activeFilter=btn.dataset.filter;document.querySelectorAll(".filter-chip").forEach(x=>x.classList.toggle("active",x===btn));renderProducts();});
document.querySelectorAll("[data-filter-link]").forEach(link=>link.addEventListener("click",()=>{activeFilter=link.dataset.filterLink;document.querySelectorAll(".filter-chip").forEach(x=>x.classList.toggle("active",x.dataset.filter===activeFilter));renderProducts();}));
$("adminToggle").addEventListener("click",()=>{$("adminBackdrop").hidden=false;renderAdmin();});
$("closeAdmin").addEventListener("click",()=>$("adminBackdrop").hidden=true);
$("adminBackdrop").addEventListener("click",e=>{if(e.target===$("adminBackdrop"))$("adminBackdrop").hidden=true;});
$("productForm").addEventListener("submit",e=>{e.preventDefault();const id=$("productId").value;const item={id:id||`p-${Date.now()}`,name:$("productName").value.trim(),category:$("productCategory").value,price:Number($("productPrice").value),description:$("productDescription").value.trim(),image:$("productImage").value.trim()};if(id){products=products.map(p=>p.id===id?item:p);}else products.unshift(item);saveProducts();renderProducts();renderAdmin();resetForm();});
$("adminProductList").addEventListener("click",e=>{const edit=e.target.closest("[data-edit]");const del=e.target.closest("[data-delete]");if(edit){const p=products.find(x=>x.id===edit.dataset.edit);if(!p)return;$("productId").value=p.id;$("productName").value=p.name;$("productCategory").value=p.category;$("productPrice").value=p.price;$("productDescription").value=p.description||"";$("productImage").value=p.image||"";$("saveProduct").textContent="Perbarui produk";$("productName").focus();}if(del){if(confirm("Hapus produk ini dari katalog?")){products=products.filter(p=>p.id!==del.dataset.delete);saveProducts();renderProducts();renderAdmin();resetForm();}}});
$("resetForm").addEventListener("click",resetForm);
$("resetDemo").addEventListener("click",()=>{if(confirm("Kembalikan katalog ke contoh awal? Semua perubahan stok lokal akan diganti.")){products=initialProducts.map(p=>({...p}));saveProducts();renderProducts();renderAdmin();resetForm();}});
$("exportData").addEventListener("click",()=>{const blob=new Blob([JSON.stringify(products,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="abi-store-stok.json";a.click();URL.revokeObjectURL(url);});
$("menuToggle").addEventListener("click",()=>$("mainNav").classList.toggle("open"));
document.querySelectorAll("#mainNav a").forEach(a=>a.addEventListener("click",()=>$("mainNav").classList.remove("open")));
$("year").textContent=new Date().getFullYear();
renderProducts();
