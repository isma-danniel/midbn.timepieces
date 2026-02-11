// ===============================
// CONFIG
// ===============================
const API = "https://script.google.com/macros/s/AKfycbzLO0s0zhXDIAJ4oVyd0GNLoXqiP2lzohaIfsY9-kluiVBvljmY8G4KlbK_-aUqhApz9w/exec";
const ADMIN_TOKEN = "kirah1211"; // must match Code.gs

// ===============================
// DOM
// ===============================
const adminBody = document.getElementById("adminBody");
const searchAdmin = document.getElementById("searchAdmin");
const reloadBtn = document.getElementById("reloadBtn");
const saveAllBtn = document.getElementById("saveAllBtn");

let allProducts = [];

// ===============================
// LOAD
// ===============================
async function loadProducts(){
  adminBody.innerHTML = `<tr><td colspan="5" class="muted">Loading...</td></tr>`;

  try{
    const res = await fetch(API, { method: "GET" });
    const data = await res.json();

    if(!Array.isArray(data)) throw new Error("API not returning array");
    allProducts = data;

    renderAdmin(allProducts);
  }catch(e){
    adminBody.innerHTML = `<tr><td colspan="5" class="muted">Failed to load. Check deployment access (Anyone) + Products sheet headers.</td></tr>`;
  }
}

function renderAdmin(list){
  const q = (searchAdmin.value || "").toLowerCase().trim();
  const filtered = !q ? list : list.filter(p => String(p.name || "").toLowerCase().includes(q));

  adminBody.innerHTML = "";

  filtered.forEach(p=>{
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${escapeHtml(p.name || "")}</td>
      <td><input class="cell-input price" type="number" step="0.01" value="${Number(p.price || 0)}"></td>
      <td><input class="cell-input stock" type="number" step="1" value="${Number(p.stock || 0)}"></td>
      <td><button class="row-btn">Save</button></td>
    `;

    tr.querySelector(".row-btn").addEventListener("click", async ()=>{
      const price = Number(tr.querySelector(".price").value);
      const stock = Number(tr.querySelector(".stock").value);

      const ok = await saveItems([{ id: p.id, price, stock }]);
      if(ok){
        const btn = tr.querySelector(".row-btn");
        btn.textContent = "Saved ✓";
        setTimeout(()=> btn.textContent = "Save", 800);
      }
    });

    adminBody.appendChild(tr);
  });

  if(filtered.length === 0){
    adminBody.innerHTML = `<tr><td colspan="5" class="muted">No match.</td></tr>`;
  }
}

// ===============================
// SAVE
// ===============================
async function saveItems(items){
  try{
    const res = await fetch(API, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        type: "admin_update",
        token: ADMIN_TOKEN,
        items
      })
    });

    const out = await res.json();
    if(out.status !== "success"){
      alert(out.message || "Save failed");
      return false;
    }
    return true;
  }catch(e){
    alert("Save failed (network/API).");
    return false;
  }
}

saveAllBtn.addEventListener("click", async ()=>{
  const rows = Array.from(adminBody.querySelectorAll("tr"));

  const items = rows.map(r=>{
    const id = Number(r.children[0].textContent.trim());
    const price = Number(r.querySelector(".price")?.value || 0);
    const stock = Number(r.querySelector(".stock")?.value || 0);
    return { id, price, stock };
  }).filter(x => Number.isFinite(x.id));

  const ok = await saveItems(items);
  if(ok) alert("Saved all ✅");
});

reloadBtn.addEventListener("click", loadProducts);
searchAdmin.addEventListener("input", ()=>renderAdmin(allProducts));

// ===============================
// UTIL
// ===============================
function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

// boot
loadProducts();
