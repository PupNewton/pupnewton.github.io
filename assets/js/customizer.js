(function () {
  // Replace with your own handle — shown as the "send this via Telegram" instruction.
  const TELEGRAM_HANDLE = "yourhandle";

  const root = document.getElementById("customizer-root");
  const pageTitle = document.getElementById("page-title");

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("product");
  const allProducts = typeof PRODUCTS !== "undefined" ? PRODUCTS : [];
  const product = allProducts.find((p) => p.id === productId);

  if (!product || !product.customizable) {
    root.innerHTML = `
      <div class="notice">
        Couldn't find that customizable product.
        <a href="shop.html">Back to shop ▸</a>
      </div>
    `;
    return;
  }

  document.title = `Customize ${product.name} — pupnewton`;
  pageTitle.textContent = product.name;

  const components = product.components || [];
  const features = product.features || [];
  const textFields = product.textFields || [];
  const allFonts = typeof FONTS !== "undefined" ? FONTS : [];

  // current selection: componentId -> option index
  const selection = {};
  components.forEach((c) => { selection[c.id] = 0; });

  // current feature state: featureId -> boolean
  const featureState = {};
  features.forEach((f) => { featureState[f.id] = false; });

  // current text field state: fieldId -> { value, fontId }
  const textState = {};
  textFields.forEach((f) => {
    textState[f.id] = { value: "", fontId: allFonts.length ? allFonts[0].id : null };
  });

  function fontFamilyFor(fontId) {
    const f = allFonts.find((x) => x.id === fontId);
    return f ? f.family : "inherit";
  }

  function fontLabelFor(fontId) {
    const f = allFonts.find((x) => x.id === fontId);
    return f ? f.label : "Default";
  }

  const galleryHtml = (product.gallery && product.gallery.length)
    ? `
      <div class="gallery-strip">
        ${product.gallery.map((src, i) => `<img src="${src}" alt="${product.name} photo ${i + 1}" loading="lazy" />`).join("")}
      </div>
    `
    : "";

  root.innerHTML = `
    <h2>${product.name}</h2>
    <p>${product.blurb || ""}</p>

    ${galleryHtml}

    <div class="customizer">
      <div class="stage-wrap">
        <div class="stage" id="stage"></div>
      </div>
      <div class="controls" id="controls"></div>
    </div>

    <div class="summary-box">
      <strong>Your selection:</strong>
      <div class="summary-line" id="summary-line"></div>
      <div class="summary-price" id="summary-price"></div>
      <a class="request-btn" id="request-btn" href="#">Generate summary image &#9662;</a>
      <p class="telegram-note">
        Once it appears below, screenshot it (or right-click it and choose "Copy Image"),
        then send it to me on
        <a href="https://t.me/${TELEGRAM_HANDLE}" target="_blank" rel="noopener">Telegram (@${TELEGRAM_HANDLE})</a>
        to place your order.
      </p>
      <div class="canvas-wrap" id="canvas-wrap" style="display:none;">
        <canvas id="summary-canvas" width="600" height="720"></canvas>
      </div>
    </div>
  `;

  const stage = document.getElementById("stage");
  const controls = document.getElementById("controls");
  const summaryLine = document.getElementById("summary-line");
  const summaryPrice = document.getElementById("summary-price");
  const requestBtn = document.getElementById("request-btn");
  const canvas = document.getElementById("summary-canvas");
  const canvasWrap = document.getElementById("canvas-wrap");

  function activeLayers() {
    const layers = components.map((c) => c.options[selection[c.id]].image);
    features.forEach((f) => {
      if (featureState[f.id] && f.image) layers.push(f.image);
    });
    return layers;
  }

  function computeTotal() {
    let total = product.basePrice || 0;
    components.forEach((c) => {
      total += c.options[selection[c.id]].priceDelta || 0;
    });
    features.forEach((f) => {
      if (featureState[f.id]) total += f.priceDelta || 0;
    });
    return total;
  }

  function formatPrice(n) {
    return `$${n.toFixed(2).replace(/\.00$/, "")}`;
  }

  function selectionParts() {
    const parts = components.map((c) => {
      const opt = c.options[selection[c.id]];
      return `${c.label}: ${opt.label}`;
    });
    features.forEach((f) => {
      if (featureState[f.id]) parts.push(f.label.replace(/\s*\(\+\$\d+(\.\d+)?\)\s*$/, ""));
    });
    textFields.forEach((f) => {
      const state = textState[f.id];
      if (state && state.value.trim()) {
        const fontNote = f.fontPicker ? ` (Font: ${fontLabelFor(state.fontId)})` : "";
        parts.push(`${f.label}: "${state.value.trim()}"${fontNote}`);
      }
    });
    return parts;
  }

  function renderStage() {
    stage.innerHTML = "";
    activeLayers().forEach((src) => {
      const img = document.createElement("img");
      img.className = "layer";
      img.src = src;
      img.alt = "";
      stage.appendChild(img);
    });
    refreshCanvasIfVisible();
  }

  function renderSummary() {
    summaryLine.textContent = selectionParts().join(" · ");
    summaryPrice.textContent = `Total: ${formatPrice(computeTotal())}`;
  }

  function renderControls() {
    controls.innerHTML = "";

    components.forEach((c) => {
      const group = document.createElement("div");
      group.className = "component-group";

      const heading = document.createElement("h3");
      heading.textContent = c.label;
      group.appendChild(heading);

      const row = document.createElement("div");
      row.className = "swatch-row";

      c.options.forEach((opt, i) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "swatch";
        btn.style.background = opt.swatch || "#ccc";
        btn.title = opt.priceDelta ? `${opt.label} (+$${opt.priceDelta})` : opt.label;
        btn.setAttribute("aria-label", btn.title);
        btn.setAttribute("aria-pressed", String(selection[c.id] === i));
        btn.addEventListener("click", () => {
          selection[c.id] = i;
          renderStage();
          renderSummary();
          [...row.children].forEach((b, bi) => b.setAttribute("aria-pressed", String(bi === i)));
        });
        row.appendChild(btn);
      });

      group.appendChild(row);
      controls.appendChild(group);
    });

    textFields.forEach((f) => {
      const group = document.createElement("div");
      group.className = "component-group text-field-group";

      const heading = document.createElement("h3");
      heading.textContent = f.label;
      group.appendChild(heading);

      const inputRow = document.createElement("div");
      inputRow.className = "text-input-row";

      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = f.maxLength || 30;
      input.placeholder = f.placeholder || "";
      input.value = textState[f.id].value;
      input.className = "text-input";

      const charCount = document.createElement("span");
      charCount.className = "char-count";
      charCount.textContent = `${input.value.length}/${input.maxLength}`;

      let fontToggleBtn = null;
      let fontOptions = null;
      let preview = null;

      function updatePreview() {
        if (!preview) return;
        const val = textState[f.id].value.trim();
        preview.textContent = val || f.placeholder || "";
        preview.style.fontFamily = fontFamilyFor(textState[f.id].fontId);
        preview.classList.toggle("is-placeholder", !val);
      }

      input.addEventListener("input", () => {
        textState[f.id].value = input.value;
        charCount.textContent = `${input.value.length}/${input.maxLength}`;
        updatePreview();
        renderSummary();
        refreshCanvasIfVisible();
      });

      inputRow.appendChild(input);
      inputRow.appendChild(charCount);

      if (f.fontPicker && allFonts.length) {
        fontToggleBtn = document.createElement("button");
        fontToggleBtn.type = "button";
        fontToggleBtn.className = "font-toggle-btn";
        fontToggleBtn.textContent = `Font: ${fontLabelFor(textState[f.id].fontId)} ▾`;
        inputRow.appendChild(fontToggleBtn);

        fontOptions = document.createElement("div");
        fontOptions.className = "font-options";
        fontOptions.hidden = true;

        allFonts.forEach((font) => {
          const opt = document.createElement("button");
          opt.type = "button";
          opt.className = "font-option";
          opt.style.fontFamily = font.family;
          opt.textContent = font.label;
          opt.addEventListener("click", () => {
            textState[f.id].fontId = font.id;
            fontToggleBtn.textContent = `Font: ${font.label} ▾`;
            fontOptions.hidden = true;
            updatePreview();
            renderSummary();
            refreshCanvasIfVisible();
          });
          fontOptions.appendChild(opt);
        });

        fontToggleBtn.addEventListener("click", () => {
          fontOptions.hidden = !fontOptions.hidden;
        });

        preview = document.createElement("div");
        preview.className = "text-preview";
      }

      group.appendChild(inputRow);
      if (fontOptions) group.appendChild(fontOptions);
      if (preview) {
        group.appendChild(preview);
        updatePreview();
      }

      controls.appendChild(group);
    });

    if (features.length) {
      const group = document.createElement("div");
      group.className = "component-group";

      const heading = document.createElement("h3");
      heading.textContent = "Add-ons";
      group.appendChild(heading);

      features.forEach((f) => {
        const label = document.createElement("label");
        label.className = "feature-toggle";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = featureState[f.id];
        checkbox.addEventListener("change", () => {
          featureState[f.id] = checkbox.checked;
          renderStage();
          renderSummary();
        });

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(" " + f.label));
        group.appendChild(label);
      });

      controls.appendChild(group);
    }
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  function generateSummaryImage() {
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const stageH = 500;

    ctx.clearRect(0, 0, W, canvas.height);
    // paper background
    ctx.fillStyle = "#F5F3EC";
    ctx.fillRect(0, 0, W, canvas.height);

    return Promise.all(activeLayers().map(loadImage)).then((images) => {
      images.forEach((img) => ctx.drawImage(img, 0, 0, W, stageH));

      // divider
      ctx.strokeStyle = "#1A1A18";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, stageH);
      ctx.lineTo(W, stageH);
      ctx.stroke();

      // text block
      ctx.fillStyle = "#1A1A18";
      ctx.font = "bold 22px monospace";
      ctx.fillText(product.name, 24, stageH + 40);

      ctx.font = "16px monospace";
      let y = stageH + 74;
      const plainParts = components.map((c) => {
        const opt = c.options[selection[c.id]];
        return `${c.label}: ${opt.label}`;
      }).concat(
        features.filter((f) => featureState[f.id]).map((f) => f.label.replace(/\s*\(\+\$\d+(\.\d+)?\)\s*$/, ""))
      );
      plainParts.forEach((line) => {
        ctx.fillText(line, 24, y);
        y += 26;
      });

      textFields.forEach((f) => {
        const state = textState[f.id];
        if (!state || !state.value.trim()) return;
        ctx.font = `18px ${fontFamilyFor(state.fontId)}`;
        ctx.fillText(`${f.label}: "${state.value.trim()}"`, 24, y);
        y += 28;
      });

      ctx.font = "bold 20px monospace";
      ctx.fillText(`Total: ${formatPrice(computeTotal())}`, 24, y + 14);

      // outer border
      ctx.strokeStyle = "#1A1A18";
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, W - 4, canvas.height - 4);

      return canvas.toDataURL("image/png");
    });
  }

  function refreshCanvasIfVisible() {
    if (canvasWrap.style.display === "block") {
      generateSummaryImage();
    }
  }

  requestBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const originalLabel = requestBtn.innerHTML;
    requestBtn.textContent = "Generating…";
    generateSummaryImage()
      .then(() => {
        canvasWrap.style.display = "block";
        canvasWrap.scrollIntoView({ behavior: "smooth", block: "nearest" });
        requestBtn.innerHTML = originalLabel;
      })
      .catch(() => {
        requestBtn.textContent = "Couldn't generate image — try again";
      });
  });

  renderStage();
  renderControls();
  renderSummary();
})();
