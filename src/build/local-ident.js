const path = require("path");

// The class name a CSS module local turns into. webpack asks for it while it
// builds main.css, and the prerender asks for it while it writes the static
// HTML — the markup on disk only lines up with the stylesheet because both
// sides go through here. Deterministic on purpose: a content hash would leave
// the prerender with no way to guess the name webpack settled on.
const ROOT = path.resolve(__dirname, "../..");

const localIdent = (resourcePath, localName) => {
  const scope = path.relative(ROOT, resourcePath)
    .replace(/\.module\.css$/, "")
    .replace(/^src[\\/]/, "")
    .replace(/[\\/]/g, "-")
    .replace(/[^a-zA-Z0-9_-]/g, "-");
  return `${scope}__${localName}`;
};

module.exports = { localIdent, ROOT };
