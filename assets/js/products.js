/* ============================================================
   Shop product data.
   Add a new product by adding an object to PRODUCTS below.
   - customizable: false  -> shown in the shop grid only, no customizer page
   - customizable: true   -> needs a "components" array; each component
     needs an "options" array of {label, image} pairs (one image per
     color, rendered as a transparent-background layer that stacks on
     top of the other components in the preview stage).
   ============================================================ */

const PRODUCTS = [
  {
    id: "sample-canister",
    name: "Sample Canister",
    price: "$28",
    blurb: "A small stackable canister — placeholder demo product for the customizer.",
    customizable: true,
    components: [
      {
        id: "base",
        label: "Base",
        options: [
          { label: "Forest Green", image: "assets/img/customizer/base-forest.svg", swatch: "#3F5D45" },
          { label: "Cream", image: "assets/img/customizer/base-cream.svg", swatch: "#EFE7D5" },
          { label: "Charcoal", image: "assets/img/customizer/base-charcoal.svg", swatch: "#33312C" },
          { label: "Slate Blue", image: "assets/img/customizer/base-slate.svg", swatch: "#52657A" }
        ]
      },
      {
        id: "lid",
        label: "Lid",
        options: [
          { label: "Forest Green", image: "assets/img/customizer/lid-forest.svg", swatch: "#3F5D45" },
          { label: "Cream", image: "assets/img/customizer/lid-cream.svg", swatch: "#EFE7D5" },
          { label: "Charcoal", image: "assets/img/customizer/lid-charcoal.svg", swatch: "#33312C" },
          { label: "Slate Blue", image: "assets/img/customizer/lid-slate.svg", swatch: "#52657A" }
        ]
      },
      {
        id: "handle",
        label: "Handle",
        options: [
          { label: "Forest Green", image: "assets/img/customizer/handle-forest.svg", swatch: "#3F5D45" },
          { label: "Cream", image: "assets/img/customizer/handle-cream.svg", swatch: "#EFE7D5" },
          { label: "Charcoal", image: "assets/img/customizer/handle-charcoal.svg", swatch: "#33312C" },
          { label: "Slate Blue", image: "assets/img/customizer/handle-slate.svg", swatch: "#52657A" }
        ]
      }
    ]
  },
  {
    id: "retro-coasters",
    name: "Retro Coaster Set",
    price: "$14",
    blurb: "Set of 4 coasters — placeholder demo product, no customization offered.",
    customizable: false
  }
];
