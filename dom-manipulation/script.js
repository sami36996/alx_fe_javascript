let quotes = [
  { text: "Stay hungry, stay foolish.", category: "Motivation" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Simplicity is the soul of efficiency.", category: "Productivity" }
];

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `
    <p>"${quotes[randomIndex].text}"</p>
    <small>- ${quotes[randomIndex].category}</small>
  `;
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  alert("Quote added successfully!");

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Local Storage Functions
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// JSON Export
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
}

// JSON Import
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);

}

document.getElementById("importFile").addEventListener("change", importFromJsonFile);

// Category Functions
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    categoryFilter.innerHTML += `<option value="${cat}">${cat}</option>`;
  });
}

function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategory", selected);
  const filtered = selected === "all" ? quotes : quotes.filter(q => q.category === selected);
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = filtered.map(q => `<p>"${q.text}" - ${q.category}</p>`).join("");
}

function restoreFilter() {
  const last = localStorage.getItem("lastCategory");
  if (last) document.getElementById("categoryFilter").value = last;
  filterQuotes();
}

// Simulate Server Sync
async function syncWithServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverQuotes = await response.json();

    quotes = [...quotes, ...serverQuotes.slice(0, 5).map(p => ({ text: p.title, category: "Server" }))];
    saveQuotes();
    populateCategories();
    alert("Synced with server successfully!");
  } catch (error) {
    console.error("Sync failed:", error);
  }
}

setInterval(syncWithServer, 30000);

window.onload = () => {
  loadQuotes();
  populateCategories();
  restoreFilter();
};
