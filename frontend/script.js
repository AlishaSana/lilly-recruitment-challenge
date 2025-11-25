//Base URL of the backend API
const API_BASE = "http://localhost:8000"; // backend address (start the backend first)


const medsContainer = document.getElementById("medicines-container");
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");
const refreshBtn = document.getElementById("refresh-btn");

const addForm = document.getElementById("add-medicine-form");
const formMessage = document.getElementById("form-message");

//Fetch medicines from the API
async function fetchMedicines() 
{
  //Show loading UI and hide any previous errors
  errorEl.hidden = true;
  loadingEl.hidden = false;
  medsContainer.innerHTML = "";

  try {
    //Make a GET request to fetch medicines
    const res = await fetch(`${API_BASE}/medicines`);
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }
    const data = await res.json();

    //Ensure data.medicines exists and is an array
    const meds = Array.isArray(data?.medicines) ? data.medicines : [];

    //Gets the table of medicines
    renderMedicinesTable(meds);
  } catch (err) {
    // Show a helpful error message if fetching fails
    errorEl.textContent = `Could not load medicines: ${err.message}`;
    errorEl.hidden = false;
    medsContainer.innerHTML = ""; // clear any partial UI
  } finally {
    loadingEl.hidden = true; //hide loading
  }
}

//Fetch medicines in a HTML table
function renderMedicinesTable(meds) 
{
  if (!meds.length) {
    //show msg if it's empty
    medsContainer.innerHTML = `<p>No medicines found.</p>`;
    return;
  }

  //Create a simple HTML table
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

  //iterate over each medicine and create rows
  meds.forEach((m) => {
    //if name or price missing,use default text
    const name = (typeof m?.name === "string" && m.name.trim()) ? m.name.trim() : "Unknown name";
    
    let priceText = "Price unavailable"; //missing price
    let priceTooltip = ""; //tooltip text for invalid price
    
    if (m?.price !== undefined && m?.price !== null) 
    {
      const maybeNumber = Number(m.price);
      if (!Number.isNaN(maybeNumber) && maybeNumber >= 0) {
        priceText = maybeNumber.toFixed(2) //format to 2 decimal places
      } else {
        priceText = "Invalid price";
        priceTooltip = "This price is not a valid number";
      }
    }

    //Create table row with HTML
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td title="${escapeHtml(name)}">${escapeHtml(name)}</td>
      <td title="${escapeHtml(priceTooltip)}" style="${priceText === 'Invalid price' ? 'background-color: #ffdada;' : ''}">${escapeHtml(priceText)}</td>
    `;

    //change to red color if the name is unknown
    if (name === "Unknown name") 
    {
      tr.querySelector("td").style.color = "red"; // only first cell
    }

    // Change to red if price is not available
    if (priceText === "Price unavailable") 
      {
      tr.querySelectorAll("td")[1].style.color = "red"; // only second cell
      }

    // Highlight invalid prices in red
    if (priceText === "Invalid price") 
    {
      tr.style.backgroundColor = "#ffdada";
    }

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  medsContainer.innerHTML = "";
  medsContainer.appendChild(table);
}



//Helper to avoid accidental HTML injection 
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

//Add medicine form submission
addForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // prevent page reload

  const name = document.getElementById("med-name").value.trim();
  const price = parseFloat(document.getElementById("med-price").value);
  

  try {
    //Create FormData to send in POST request
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);

    // Send POST request to create new medicine
    const res = await fetch(`${API_BASE}/create`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (res.ok) 
    {
      formMessage.style.color = "green"; //success msg in green
      formMessage.textContent = data.message;
      addForm.reset(); //clear form fields
      fetchMedicines(); //refresh the table to show new medicines
    } else {
      //Show error msg in red if creation fails
      formMessage.style.color = "red";
      formMessage.textContent = data.error || "Error adding medicine";
    }
  } catch (err) {
    //handles unexpected errors
    formMessage.style.color = "red";
    formMessage.textContent = `Error: ${err.message}`;
  }
});


// Wire up refresh button
refreshBtn.addEventListener("click", fetchMedicines);

// Auto-fetch on page load
window.addEventListener("load", fetchMedicines);
