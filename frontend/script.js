// script.js
// Objective 1: fetch medicines and render them safely

const API_BASE = "http://localhost:8000"; // backend address (start the backend first)
const medsContainer = document.getElementById("medicines-container");
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");
const refreshBtn = document.getElementById("refresh-btn");

const addForm = document.getElementById("add-medicine-form");
const formMessage = document.getElementById("form-message");


async function fetchMedicines() 
{
  // Show loading UI
  errorEl.hidden = true;
  loadingEl.hidden = false;
  medsContainer.innerHTML = "";

  try {
    const res = await fetch(`${API_BASE}/medicines`);
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }
    const data = await res.json();

    // Defensive checks: ensure data.medines exists and is an array
    const meds = Array.isArray(data?.medicines) ? data.medicines : [];

    renderMedicinesTable(meds);
  } catch (err) {
    // Show a helpful error message (use textContent to avoid XSS)
    errorEl.textContent = `Could not load medicines: ${err.message}`;
    errorEl.hidden = false;
    medsContainer.innerHTML = ""; // clear any partial UI
  } finally {
    loadingEl.hidden = true;
  }
}

function renderMedicinesTable(meds) 
{
  if (!meds.length) {
    medsContainer.innerHTML = `<p>No medicines found.</p>`;
    return;
  }

  // Build a simple HTML table. We will render safely and use defaults when data is missing.
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th>Name</th>
      <th>Price</th>
    </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  meds.forEach((m) => {
    // Defensive reading: if name or price missing, substitute a friendly placeholder
    const name = (typeof m?.name === "string" && m.name.trim()) ? m.name.trim() : "Unknown name";
    // Price could be number or string — attempt to parseNumber; show dash if invalid
    let priceText = "Price unavailable";
    let priceTooltip = ""; // tooltip for invalid price
    
    if (m?.price !== undefined && m?.price !== null) {
      const maybeNumber = Number(m.price);
      if (!Number.isNaN(maybeNumber) && maybeNumber >= 0) {
        priceText = maybeNumber.toFixed(2)
      } else {
        priceText = "Invalid price";
        priceTooltip = "This price is not a valid number";
      }
    }


  

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td title="${escapeHtml(name)}">${escapeHtml(name)}</td>
      <td title="${escapeHtml(priceTooltip)}" style="${priceText === 'Invalid price' ? 'background-color: #ffdada;' : ''}">${escapeHtml(priceText)}</td>
    `;


    //Objective 
    //change to red color if the name is unknown
    if (name === "Unknown name") {
      tr.querySelector("td").style.color = "red"; // only first cell
    }

    // Change to red if price is not available
    if (priceText === "Price unavailable") {
      tr.querySelectorAll("td")[1].style.color = "red"; // second cell (Price)
      }

    // Highlight invalid prices
    if (priceText === "Invalid price") {
      tr.style.backgroundColor = "#ffdada";
    }

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  medsContainer.innerHTML = "";
  medsContainer.appendChild(table);
}



// tiny helper to avoid accidental HTML injection (very small, but helpful)
function escapeHtml(s) 
{
  if (s === null || s === undefined) return "";
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

//Objective 3 Add Medicine form
addForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // prevent page reload

  const name = document.getElementById("med-name").value.trim();
  const price = parseFloat(document.getElementById("med-price").value);
  

  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);

    const res = await fetch(`${API_BASE}/create`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (res.ok) {
      formMessage.style.color = "green";
      formMessage.textContent = data.message;
      addForm.reset();         // clear form
      fetchMedicines();        // refresh the table
    } else {
      formMessage.style.color = "red";
      formMessage.textContent = data.error || "Error adding medicine";
    }
  } catch (err) {
    formMessage.style.color = "red";
    formMessage.textContent = `Error: ${err.message}`;
  }
});


// Wire up refresh button
refreshBtn.addEventListener("click", fetchMedicines);

// Auto-fetch on page load
window.addEventListener("load", fetchMedicines);
