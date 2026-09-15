/* ============================================================
   Shop product data.
   Add a new product by adding an object to PRODUCTS below.

   - customizable: false  -> shown in the shop grid only, no customizer page
   - customizable: true   -> needs "components" and (optionally) "features"

   PRICING:
   - basePrice is a plain number (no currency symbol, no formatting)
   - each component option can add its own priceDelta (number, default 0)
   - each feature (checkbox) can add its own priceDelta (number, default 0)
   - final price = basePrice + sum of selected component priceDeltas
                             + sum of checked feature priceDeltas

   COMPONENTS (color pickers, one selection each):
   - "options" is an array of { label, image, swatch, priceDelta }
     - image: the layer shown in the preview stage for this choice
     - swatch: hex color for the picker button itself
     - priceDelta: optional, defaults to 0 if omitted

   FEATURES (independent checkboxes):
   - "features" is an array of { id, label, priceDelta, image }
     - image is optional — only needed if checking the box should add
       a visible layer to the preview stage
   ============================================================ */

const PRODUCTS = [
  {
    id: "sample-canister",
    name: "Sample Canister",
    blurb: "A small stackable canister — placeholder demo product for the customizer.",
    customizable: true,
    basePrice: 28,
    components: [
      {
        id: "base",
        label: "Base",
        options: [
          { label: "Forest Green", image: "assets/img/customizer/base-forest.svg", swatch: "#3F5D45", priceDelta: 0 },
          { label: "Cream",        image: "assets/img/customizer/base-cream.svg", swatch: "#EFE7D5", priceDelta: 0 },
          { label: "Charcoal",     image: "assets/img/customizer/base-charcoal.svg", swatch: "#33312C", priceDelta: 0 },
          { label: "Slate Blue",   image: "assets/img/customizer/base-slate.svg", swatch: "#52657A", priceDelta: 3 }
        ]
      },
      {
        id: "lid",
        label: "Lid",
        options: [
          { label: "Forest Green", image: "assets/img/customizer/lid-forest.svg", swatch: "#3F5D45", priceDelta: 0 },
          { label: "Cream",        image: "assets/img/customizer/lid-cream.svg", swatch: "#EFE7D5", priceDelta: 0 },
          { label: "Charcoal",     image: "assets/img/customizer/lid-charcoal.svg", swatch: "#33312C", priceDelta: 0 },
          { label: "Slate Blue",   image: "assets/img/customizer/lid-slate.svg", swatch: "#52657A", priceDelta: 3 }
        ]
      },
      {
        id: "handle",
        label: "Handle",
        options: [
          { label: "Forest Green", image: "assets/img/customizer/handle-forest.svg", swatch: "#3F5D45", priceDelta: 0 },
          { label: "Cream",        image: "assets/img/customizer/handle-cream.svg", swatch: "#EFE7D5", priceDelta: 0 },
          { label: "Charcoal",     image: "assets/img/customizer/handle-charcoal.svg", swatch: "#33312C", priceDelta: 0 },
          { label: "Slate Blue",   image: "assets/img/customizer/handle-slate.svg", swatch: "#52657A", priceDelta: 3 }
        ]
      }
    ],
    features: [
      { id: "engraving", label: "Engraved nameplate (+$5)", priceDelta: 5, image: "assets/img/customizer/feature-engraving.svg" },
      { id: "giftbox",   label: "Gift box packaging (+$4)", priceDelta: 4 }
    ]
  },
  {
    id: "retro-coasters",
    name: "Retro Coaster Set",
    blurb: "Set of 4 coasters — placeholder demo product, no customization offered.",
    customizable: false,
    basePrice: 14
  }
];
