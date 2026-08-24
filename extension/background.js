// DevLounge Chrome Extension — Background Service Worker

// Initialize default storage settings on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["devloungeBaseUrl", "dockPosition", "theme"], (res) => {
    if (!res.devloungeBaseUrl) {
      chrome.storage.local.set({ devloungeBaseUrl: "http://localhost:3000" });
    }
    if (!res.dockPosition) {
      chrome.storage.local.set({ dockPosition: "top-right" });
    }
    if (!res.theme) {
      chrome.storage.local.set({ theme: "dark" });
    }
  });

  // Create Context Menus for Quick Access
  chrome.contextMenus.create({
    id: "devlounge-root",
    title: "DevLounge Quick Suite",
    contexts: ["all"]
  });

  chrome.contextMenus.create({
    id: "open-image-converter",
    parentId: "devlounge-root",
    title: "Open Image Converter",
    contexts: ["image", "page"]
  });

  chrome.contextMenus.create({
    id: "open-tailwind-extractor",
    parentId: "devlounge-root",
    title: "Extract Tailwind CSS",
    contexts: ["selection", "page"]
  });

  chrome.contextMenus.create({
    id: "open-fluid-clamp",
    parentId: "devlounge-root",
    title: "Fluid Clamp Calculator",
    contexts: ["all"]
  });

  chrome.contextMenus.create({
    id: "toggle-dock-menu",
    parentId: "devlounge-root",
    title: "Toggle DevLounge Floating Dock",
    contexts: ["all"]
  });
});

// Handle Context Menu clicks — Direct Route Redirection
chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.storage.local.get(["devloungeBaseUrl"], (res) => {
    const baseUrl = (res.devloungeBaseUrl || "http://localhost:3000").replace(/\/$/, "");

    if (info.menuItemId === "open-image-converter") {
      chrome.tabs.create({ url: `${baseUrl}/image-converter` });
    } else if (info.menuItemId === "open-tailwind-extractor") {
      chrome.tabs.create({ url: `${baseUrl}/tailwind-extractor` });
    } else if (info.menuItemId === "open-fluid-clamp") {
      chrome.tabs.create({ url: `${baseUrl}/fluid-clamp` });
    } else if (info.menuItemId === "toggle-dock-menu" && tab?.id) {
      chrome.tabs.sendMessage(tab.id, { action: "toggle-devlounge-dock" });
    }
  });
});

// Handle Keyboard Commands
chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-floating-dock") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "toggle-devlounge-dock" });
      }
    });
  }
});

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "get-storage-url") {
    chrome.storage.local.get(["devloungeBaseUrl"], (res) => {
      sendResponse({ baseUrl: res.devloungeBaseUrl || "http://localhost:3000" });
    });
    return true; // async response
  }
});
