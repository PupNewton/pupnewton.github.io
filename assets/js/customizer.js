(function () {
  const root = document.getElementById("customizer-root");
  const pageTitle = document.getElementById("page-title");

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("product");
  const product = (window.PRODUCTS || []).find((p) => p.id === productId);

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

  // current selection: componentId -> option index
  const selection = {};
  product.components.forEach((c) => { selection[c.id] = 0; });

  root.innerHTML = `
    <h2>${product.name}</h2>
    <p>${product.blurb || ""}</p>

    <div class="customizer">
      <div class="stage-wrap">
        <div class="stage" id="stage"></div>
      </div>
      <div class="controls" id="controls"></div>
    </div>

    <div class="summary-box">
      <strong>Your selection:</strong>
      <div class="summary-line" id="summary-line"></div>
      <a class="request-btn" id="request-btn" href="#">Request this ▸</a>
    </div>
  `;

  const stage = document.getElementById("stage");
  const controls = document.getElementById("controls");
  const summaryLine = document.getElementById("summary-line");
  const requestBtn = document.getElementById("request-btn");

  function renderStage() {
    stage.innerHTML = "";
    product.components.forEach((c) => {
      const opt = c.options[selection[c.id]];
      const img = document.createElement("img");
      img.className = "layer";
      img.src = opt.image;
      img.alt = `${c.label}: ${opt.label}`;
      stage.appendChild(img);
    });
  }

  function renderSummary() {
    const parts = product.components.map((c) => {
      const opt = c.options[selection[c.id]];
      return `${c.label}: ${opt.label}`;
    });
    summaryLine.textContent = parts.join(" · ");

    const subject = `Order request: ${product.name}`;
    const body = `Hi, I'd like to order the ${product.name} with this configuration:\n\n${parts.join("\n")}\n\nPlease let me know next steps. Thanks!`;
    requestBtn.href = `mailto:you@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function renderControls() {
    controls.innerHTML = "";
    product.components.forEach((c) => {
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
        btn.title = opt.label;
        btn.setAttribute("aria-label", `${c.label}: ${opt.label}`);
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
  }

  renderStage();
  renderControls();
  renderSummary();
})();
