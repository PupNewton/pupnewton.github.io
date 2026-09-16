/* ============================================================
   Font options for customizable text fields.

   TO ADD A FONT:
     Add an object to FONTS below: { id, label, family }
     - id: short unique identifier, used internally
     - label: what shows up in the font picker button
     - family: a valid CSS font-family value. Web-safe fonts (below)
       work with zero setup since they're already installed on most
       systems. To use a real custom font instead, see the note
       at the bottom of this file.

   TO REMOVE A FONT:
     Just delete its object from the array below.

   TO CHANGE THE DEFAULT:
     The first entry in the array is used as the default selection.
   ============================================================ */

const FONTS = [
  { id: "system",  label: "System Default", family: "Geneva, Verdana, sans-serif" },
  { id: "serif",   label: "Classic Serif",  family: "Georgia, 'Times New Roman', serif" },
  { id: "mono",    label: "Typewriter",     family: "'Courier New', Courier, monospace" },
  { id: "script",  label: "Script",         family: "'Brush Script MT', cursive" },
  { id: "impact",  label: "Bold Impact",    family: "Impact, 'Arial Narrow', sans-serif" }
];

/* ------------------------------------------------------------
   Using a real custom font file instead of a web-safe font:

   1. Get a .woff2 file for the font and place it in assets/fonts/,
      e.g. assets/fonts/my-font.woff2
   2. Add this to the top of assets/css/style.css (once, not per font):

        @font-face {
          font-family: "My Font";
          src: url("../fonts/my-font.woff2") format("woff2");
        }

   3. Reference it here as its own entry:

        { id: "myfont", label: "My Font", family: "'My Font', sans-serif" }

   Keep it self-hosted (a file in assets/fonts/) rather than a CDN
   link, so the site keeps working with no external dependencies.
   ------------------------------------------------------------ */
