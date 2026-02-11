// ✅ Put YOUR Apps Script /exec URL here (same one your products page uses)
const API = "PASTE_YOUR_APPS_SCRIPT_EXEC_URL_HERE";

const rowsEl = document.getElementById("rows");
const searchEl = document.getElementById("search");
const statusText = document.getElementById("statusText");
const refreshBtn = document.getElementById("refreshBtn");
const saveBtn = document.getElementById("saveBtn");
const adminKeyEl = document.getElementById("adminKey");

let allProducts = [];
let dirtyMap = new Map(); // id -> {id, price, stock, name?}

function setStatus(msg){ statusText.textContent = msg; }

async function fetchProducts(){
  setStatus("Loading products...");
  const res = await fetch(API, { method:"GET" });
  const data = await res.json();
  if(!Array.isArray(data)) throw new Error("API returned not an array");
  allProducts = data;

  // ✅ prioritize in-stock first (your request #3)
  allProducts.sort((a,b)=> Number(b.stock||0) - Number(a.stock||0));

  renderTable(allProducts);
  setStatus(`Loaded ${allProducts.length} products`);
}

function renderTable(list){
  rowsEl.innerHTML = "";

  list.forEach(p=>{
    const tr = document.createElement("tr");

    const stockNum = Number(p.stock||0);
    const liveBadge = stockNum > 0
      ? `<span class="badge">In stock</span>`
      : `<span class="badge out">Out</span>`;

    tr.innerHTML = `
      <td><strong>${p.id}</strong></td>
      <td>${escapeHtml(p.name || "")}</td>
      <td><input class="cell-input" data-field="price" data-id="${p.id}" type="number" step="0.01" value="${Number(p.price||0)}"></td>
      <td><input class="cell-input" data-field="stock" data-id="${p.id}" type="number" step="1" value="${stockNum}"></td>
      <td>${liveBadge}</td>
    `;

    rowsEl.appendChild(tr);
  });
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

// Track edits
document.addEventListener("input", (e)=>{
  const inp = e.target.closest(".cell-input");
  if(!inp) return;

  const id = inp.dataset.id;
  const field = inp.dataset.field;
  const val = inp.value;

  const existing = dirtyMap.get(id) || { id:Number(id) };
  existing[field] = field === "price" ? Number(val) : Number(val);
  dirtyMap.set(id, existing);

  setStatus(`Unsaved changes: ${dirtyMap.size}`);
});

function applySearch(){
  const q = (searchEl.value||"").toLowerCase().trim();
  if(!q){
    renderTable(allProducts);
    return;
  }
  const filtered = allProducts.filter(p=>{
    const idMatch = String(p.id).includes(q);
    const nameMatch = String(p.name||"").toLowerCase().includes(q);
    return idMatch || nameMatch;
  });
  renderTable(filtered);
}

searchEl.addEventListener("input", applySearch);

refreshBtn.addEventListener("click", async ()=>{
  dirtyMap.clear();
  await fetchProducts();
});

saveBtn.addEventListener("click", async ()=>{
  const key = adminKeyEl.value.trim();
  if(!key){
    alert("Enter admin key first.");
    return;
  }
  if(dirtyMap.size === 0){
    alert("No changes to save.");
    return;
  }

  const updates = Array.from(dirtyMap.values());

  setStatus("Saving...");
  const res = await fetch(API, {
    method:"POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify({
      type: "admin_update",
      key,
      updates
    })
  });

  const out = await res.json();
  if(out.status !== "success"){
    console.log(out);
    alert(out.message || "Save failed");
    setStatus("Save failed");
    return;
  }

  dirtyMap.clear();
  await fetchProducts();
  alert("Saved ✅");
});

// init
fetchProducts().catch(err=>{
  console.error(err);
  setStatus("Failed to load (check API URL / deployment / sheet headers)");
  alert("Failed to load products. Check console.");
});
