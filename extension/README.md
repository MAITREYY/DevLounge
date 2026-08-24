# 🚀 DevLounge — Chrome Extension (Manifest V3)

> **Instant Floating Developer Utility Suite & Quick Tool Dock for any Webpage**

The **DevLounge Chrome Extension** brings all 8 DevLounge developer utilities directly to your active browser tabs. Open floating micro-tools, generate fluid CSS `clamp()` rules on the fly, convert images locally, extract Tailwind CSS classes, and jump to full DevLounge tools with 1-click.

---

## ✨ Features

- 📌 **Floating Customizable Overlay Dock**: Press `Alt + Shift + L` on any webpage to toggle the floating dock. Position it at Top-Right, Top-Center, Center-Center, Top-Left, Bottom-Right, or drag it anywhere.
- 🧰 **All 8 DevLounge Utilities**:
  - ⚡ **Tailwind Extractor** (`/tailwind-extractor`)
  - 🔤 **Fluid Clamp** (`/fluid-clamp`)
  - 🖼️ **Image Converter** (`/image-converter`)
  - 🎬 **Video Converter** (`/video-converter`)
  - 🛡️ **Code Vault** (`/code-vault`)
  - 📦 **Fluid Box Studio** (`/fluid-box`)
  - 🔤 **Fluid Font** (`/font-converter`)
  - 🧩 **Fluid SVG** (`/svg-converter`)
- ⚡ **Inline Micro-Tools (No Page Switching Required)**:
  - **Mini Fluid Clamp Generator**: Calculate min/max viewports & font sizes into CSS `clamp()` with 1-click clipboard copy.
  - **Mini Image Converter**: Convert & compress PNG, JPEG, and WebP images locally directly inside the floating popup.
  - **Mini PX to REM Converter**: Convert pixel lengths to REM units based on base font size.
- ⚙️ **Customizable Base Target URL**: Seamlessly switch between local dev (`http://localhost:3000`) or deployed production app URLs.
- 🛡️ **Shadow DOM Isolation**: Built with isolated Shadow DOM so floating dock styles never conflict with host webpage CSS.

---

## 🛠️ Installation Guide (Chrome / Edge / Brave / Arc)

1. **Open Extension Manager**:
   - In Chrome, navigate to `chrome://extensions/`
   - Enable **Developer mode** toggle in the top right corner.

2. **Load Unpacked Extension**:
   - Click the **Load unpacked** button in the top left.
   - Select the `extension` folder inside the DevLounge project directory:
     `c:\Users\MAITERY\OneDrive\Desktop\Expi\DevLounge\extension`

3. **Pin Extension**:
   - Click the puzzle piece icon in Chrome's top right toolbar and pin **DevLounge — Developer Utility Suite**.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>L</kbd> | Toggle Floating Overlay Dock on active page |
| <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>D</kbd> | Open DevLounge Toolbar Popup |

> *To customize shortcuts, navigate to `chrome://extensions/shortcuts` in your browser.*

---

## ⚙️ Configuration & Customization

- **Target App Base URL**: Open the toolbar popup, enter your DevLounge web app URL (default: `http://localhost:3000`), and click **Save**.
- **Dock Position**: Use the position selector buttons (`Top-L`, `Top-C`, `Top-R`, `Center`, `Btm-R`) or drag the floating header to place the overlay anywhere.
