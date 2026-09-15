(function () {
  const grid = document.getElementById("shop-grid");
  const status = document.getElementById("shop-status");

  function placeholderIcon() {
    return '<svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">' +
      '<rect x="6" y="10" width="28" height="22" fill="none" stroke="#1A1A18" stroke-width="1.5"/>' +
      '<line x1="6" y1="16" x2="34" y2="16" stroke="#1A1A18" stroke-width="1.5"/>' +
      '</svg>';
  }

  function cardFor(product) {
    const href = product.customizable
      ? `customizer.html?product=${encodeURIComponent(product.id)}`
      : `mailto:you@example.com?subject=${encodeURIComponent("Inquiry: " + product.name)}`;

    const thumbInner = product.customizable
      ? `<img src="${product.components[0].options[0].image}" alt="${product.name} preview" />`
      : placeholderIcon();

    const badge = product.customizable
      ? '<span class="badge">Customizable</span>'
      : "";

    const a = document.createElement("a");
    a.className = "product-card";
    a.href = href;
    a.innerHTML = `
      <div class="thumb">${thumbInner}</div>
      <div class="info">
        <span class="name">${product.name}</span>
        <span class="price">${product.price}</span>
        ${badge}
      </div>
    `;
    return a;
  }

  const products = typeof PRODUCTS !== "undefined" ? PRODUCTS : [];

  if (!products.length) {
    status.textContent = "No items yet.";
  } else {
    products.forEach((p) => grid.appendChild(cardFor(p)));
    status.textContent = `${products.length} item${products.length === 1 ? "" : "s"}`;
  }
})();
