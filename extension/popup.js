// DevLounge Extension Popup Script

document.addEventListener("DOMContentLoaded", () => {
  const baseUrlInput = document.getElementById("base-url");
  const saveUrlBtn = document.getElementById("btn-save-url");
  const searchInput = document.getElementById("search-tools");
  const toolCards = document.querySelectorAll(".tool-card");
  const toggleDockBtn = document.getElementById("btn-toggle-floating");

  let currentBaseUrl = "http://localhost:3000";

  // Load saved Base URL
  chrome.storage.local.get(["devloungeBaseUrl"], (res) => {
    if (res.devloungeBaseUrl) {
      currentBaseUrl = res.devloungeBaseUrl.replace(/\/$/, "");
      baseUrlInput.value = currentBaseUrl;
    }
  });

  // Save Base URL
  saveUrlBtn.addEventListener("click", () => {
    let url = baseUrlInput.value.trim().replace(/\/$/, "");
    if (!url) url = "http://localhost:3000";
    currentBaseUrl = url;
    chrome.storage.local.set({ devloungeBaseUrl: url }, () => {
      saveUrlBtn.textContent = "Saved!";
      setTimeout(() => (saveUrlBtn.textContent = "Save"), 1500);
    });
  });

  // Tool Card Clicks — Direct Route Redirection (baseUrl/route)
  toolCards.forEach((card) => {
    card.addEventListener("click", () => {
      const route = card.getAttribute("data-route");
      const cleanRoute = route.startsWith("/") ? route : `/${route}`;
      const targetUrl = `${currentBaseUrl}${cleanRoute}`;
      chrome.tabs.create({ url: targetUrl });
    });
  });

  // Search Filtering
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    toolCards.forEach((card) => {
      const name = card.getAttribute("data-name") || "";
      if (name.includes(query)) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  });

  // Toggle Floating Dock on active tab
  toggleDockBtn.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "toggle-devlounge-dock" });
        window.close();
      }
    });
  });
});
