// DevLounge Chrome Extension — Content Script with Shadow DOM Isolation

(function () {
  if (window.__devlounge_dock_injected) return;
  window.__devlounge_dock_injected = true;

  // Create Shadow DOM Host
  const hostDiv = document.createElement("div");
  hostDiv.id = "devlounge-extension-root";
  document.documentElement.appendChild(hostDiv);

  const shadowRoot = hostDiv.attachShadow({ mode: "open" });

  // Fetch CSS content
  const cssUrl = chrome.runtime.getURL("content.css");
  const linkEl = document.createElement("link");
  linkEl.rel = "stylesheet";
  linkEl.href = cssUrl;
  shadowRoot.appendChild(linkEl);

  // Template HTML
  const container = document.createElement("div");
  container.className = "devlounge-dock-overlay pos-top-right";
  container.innerHTML = `
    <!-- Header -->
    <div class="devlounge-header" id="dl-header">
      <div class="devlounge-brand">
        <div class="devlounge-logo-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        </div>
        <div class="devlounge-title-group">
          <span class="devlounge-title">DevLounge</span>
          <span class="devlounge-subtitle">Utility Suite</span>
        </div>
      </div>
      <div class="devlounge-header-actions">
        <button class="devlounge-icon-btn" id="dl-open-full" title="Open DevLounge Home (New Tab)">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
        </button>
        <button class="devlounge-icon-btn" id="dl-close" title="Close Dock (Alt+Shift+L)">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>

    <!-- Segmented Navigation Tabs -->
    <div class="devlounge-nav-container">
      <div class="devlounge-tabs">
        <button class="devlounge-tab is-active" data-tab="tools">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          <span>Tools</span>
        </button>
        <button class="devlounge-tab" data-tab="image">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          <span>Image Converter</span>
        </button>
      </div>
    </div>

    <!-- Body Panels -->
    <div class="devlounge-body">
      <!-- PANEL 1: Tools Directory (Direct Route Redirections) -->
      <div class="devlounge-tab-panel is-active" id="panel-tools">
        <div class="devlounge-tools-grid">
          <div class="devlounge-tool-card" data-route="/fluid-clamp">
            <div class="devlounge-card-top">
              <div class="devlounge-card-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>
              </div>
              <div class="devlounge-card-arrow">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
              </div>
            </div>
            <div class="devlounge-card-title">Fluid Clamp</div>
            <div class="devlounge-card-desc">Fluid clamp scaling generator</div>
          </div>

          <div class="devlounge-tool-card" data-route="/image-converter">
            <div class="devlounge-card-top">
              <div class="devlounge-card-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </div>
              <div class="devlounge-card-arrow">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
              </div>
            </div>
            <div class="devlounge-card-title">Image Converter</div>
            <div class="devlounge-card-desc">WebP, PNG & AVIF converter</div>
          </div>

          <div class="devlounge-tool-card" data-route="/tailwind-extractor">
            <div class="devlounge-card-top">
              <div class="devlounge-card-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              </div>
              <div class="devlounge-card-arrow">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
              </div>
            </div>
            <div class="devlounge-card-title">Tailwind Extractor</div>
            <div class="devlounge-card-desc">Scan files & extract CSS</div>
          </div>

          <div class="devlounge-tool-card" data-route="/video-converter">
            <div class="devlounge-card-top">
              <div class="devlounge-card-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
              </div>
              <div class="devlounge-card-arrow">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
              </div>
            </div>
            <div class="devlounge-card-title">Video Converter</div>
            <div class="devlounge-card-desc">Convert MP4, WebM & GIF</div>
          </div>

          <div class="devlounge-tool-card" data-route="/code-vault">
            <div class="devlounge-card-top">
              <div class="devlounge-card-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div class="devlounge-card-arrow">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
              </div>
            </div>
            <div class="devlounge-card-title">Code Vault</div>
            <div class="devlounge-card-desc">Code backup & FTP diffs</div>
          </div>

          <div class="devlounge-tool-card" data-route="/fluid-box">
            <div class="devlounge-card-top">
              <div class="devlounge-card-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              </div>
              <div class="devlounge-card-arrow">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
              </div>
            </div>
            <div class="devlounge-card-title">Fluid Box</div>
            <div class="devlounge-card-desc">Figma & layout studio</div>
          </div>

          <div class="devlounge-tool-card" data-route="/font-converter">
            <div class="devlounge-card-top">
              <div class="devlounge-card-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
              </div>
              <div class="devlounge-card-arrow">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
              </div>
            </div>
            <div class="devlounge-card-title">Fluid Font</div>
            <div class="devlounge-card-desc">TTF/OTF subsetter & webfont</div>
          </div>

          <div class="devlounge-tool-card" data-route="/svg-converter">
            <div class="devlounge-card-top">
              <div class="devlounge-card-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <div class="devlounge-card-arrow">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
              </div>
            </div>
            <div class="devlounge-card-title">Fluid SVG</div>
            <div class="devlounge-card-desc">SVG optimizer & JSX studio</div>
          </div>
        </div>
      </div>

      <!-- PANEL 2: Standalone Inline Image Converter -->
      <div class="devlounge-tab-panel" id="panel-image">
        <div class="devlounge-quick-tool">
          <div class="devlounge-dropzone" id="img-dropzone">
            <div class="devlounge-dropzone-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </div>
            <div class="devlounge-dropzone-text">Drop image file here or click to upload</div>
            <input type="file" id="img-input" accept="image/*" style="display:none;" />
          </div>

          <div class="devlounge-form-group" id="img-controls" style="display:none;">
            <label class="devlounge-label">Target Format</label>
            <div class="devlounge-input-row">
              <select class="devlounge-input" id="img-format">
                <option value="image/webp">WebP (.webp)</option>
                <option value="image/png">PNG (.png)</option>
                <option value="image/jpeg">JPEG (.jpg)</option>
              </select>
              <button class="devlounge-btn devlounge-btn-primary" id="btn-convert-img">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                <span>Convert</span>
              </button>
            </div>
            <div class="devlounge-code-output" id="img-status" style="margin-top:8px; display:none;"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Minimalist Footer Controls -->
    <div class="devlounge-footer-bar">
      <div class="devlounge-pos-selector">
        <button class="devlounge-pos-btn" data-pos="pos-top-left">Top-L</button>
        <button class="devlounge-pos-btn" data-pos="pos-top-center">Top-C</button>
        <button class="devlounge-pos-btn is-active" data-pos="pos-top-right">Top-R</button>
        <button class="devlounge-pos-btn" data-pos="pos-center-center">Center</button>
        <button class="devlounge-pos-btn" data-pos="pos-bottom-right">Btm-R</button>
      </div>
      <span><kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>L</kbd></span>
    </div>
  `;

  shadowRoot.appendChild(container);

  // --- STATE & EVENT HANDLERS ---
  let isVisible = false;
  let devloungeBaseUrl = "http://localhost:3000";

  // Load storage settings
  chrome.storage.local.get(["devloungeBaseUrl", "dockPosition"], (res) => {
    if (res.devloungeBaseUrl) devloungeBaseUrl = res.devloungeBaseUrl.replace(/\/$/, "");
    if (res.dockPosition) setPositionClass(res.dockPosition);
  });

  // Toggle Visibility
  function toggleOverlay(show) {
    isVisible = show !== undefined ? show : !isVisible;
    if (isVisible) {
      container.classList.add("is-visible");
    } else {
      container.classList.remove("is-visible");
    }
  }

  // Set Dock Position
  function setPositionClass(posClass) {
    const positions = ["pos-top-left", "pos-top-center", "pos-top-right", "pos-center-center", "pos-bottom-right"];
    positions.forEach((p) => container.classList.remove(p));
    container.classList.add(posClass);

    chrome.storage.local.set({ dockPosition: posClass });

    const posBtns = shadowRoot.querySelectorAll(".devlounge-pos-btn");
    posBtns.forEach((btn) => {
      btn.classList.toggle("is-active", btn.getAttribute("data-pos") === posClass);
    });
  }

  // Handle Tab Switching
  const tabs = shadowRoot.querySelectorAll(".devlounge-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");

      const targetTab = tab.getAttribute("data-tab");
      const panels = shadowRoot.querySelectorAll(".devlounge-tab-panel");
      panels.forEach((p) => {
        p.classList.toggle("is-active", p.id === `panel-${targetTab}`);
      });
    });
  });

  // Tool Card Direct Redirection (baseUrl/route)
  const cards = shadowRoot.querySelectorAll(".devlounge-tool-card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const route = card.getAttribute("data-route");
      const cleanRoute = route.startsWith("/") ? route : `/${route}`;
      window.open(`${devloungeBaseUrl}${cleanRoute}`, "_blank");
    });
  });

  // Open Main App Button
  shadowRoot.getElementById("dl-open-full").addEventListener("click", () => {
    window.open(devloungeBaseUrl, "_blank");
  });

  // Close Button
  shadowRoot.getElementById("dl-close").addEventListener("click", () => {
    toggleOverlay(false);
  });

  // Position Buttons
  shadowRoot.querySelectorAll(".devlounge-pos-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const pos = btn.getAttribute("data-pos");
      setPositionClass(pos);
    });
  });

  // --- STANDALONE INLINE IMAGE CONVERTER LOGIC ---
  const dropzone = shadowRoot.getElementById("img-dropzone");
  const imgInput = shadowRoot.getElementById("img-input");
  const imgControls = shadowRoot.getElementById("img-controls");
  const btnConvertImg = shadowRoot.getElementById("btn-convert-img");
  const imgStatus = shadowRoot.getElementById("img-status");
  let selectedFile = null;

  dropzone.addEventListener("click", () => imgInput.click());
  imgInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) {
      selectedFile = e.target.files[0];
      dropzone.querySelector(".devlounge-dropzone-text").textContent = `Selected: ${selectedFile.name}`;
      imgControls.style.display = "block";
    }
  });

  btnConvertImg.addEventListener("click", () => {
    if (!selectedFile) return;
    const format = shadowRoot.getElementById("img-format").value;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          const ext = format.split("/")[1];
          a.href = url;
          a.download = `converted-${Date.now()}.${ext}`;
          a.click();
          URL.revokeObjectURL(url);

          imgStatus.style.display = "block";
          imgStatus.textContent = `Converted to ${ext.toUpperCase()} (${(blob.size / 1024).toFixed(1)} KB)`;
        }, format, 0.9);
      };
      img.src = evt.target.result;
    };
    reader.readAsDataURL(selectedFile);
  });

  // --- DRAGGABLE OVERLAY HEADER LOGIC ---
  const header = shadowRoot.getElementById("dl-header");
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  header.addEventListener("mousedown", (e) => {
    if (e.target.closest("button")) return;
    isDragging = true;
    const rect = container.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    container.style.right = "auto";
    container.style.bottom = "auto";
    container.style.left = `${rect.left}px`;
    container.style.top = `${rect.top}px`;
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    container.style.left = `${e.clientX - offsetX}px`;
    container.style.top = `${e.clientY - offsetY}px`;
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // --- LISTEN FOR MESSAGES FROM BACKGROUND ---
  chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "toggle-devlounge-dock") {
      toggleOverlay();
    }
  });

  console.log("🚀 DevLounge Pure SVG Dock Ready.");
})();
