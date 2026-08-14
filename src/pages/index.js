import { BASE_PATH } from "@constants";

import Gift from "./gift";
import Liveboard from "./liveboard";
import Pob from "./pob";
import Psl from "./psl";
import Q from "./q";
import SimpleAi from "./simple-ai";
import Stash from "./stash";
import Tikt from "./tikt";

// Landing pages, served at gcc3.com/<slug>.
// Each page is a self-contained folder — its own components, styles and meta.json.
const PAGES = {
  "gift": Gift,
  "liveboard": Liveboard,
  "pob": Pob,
  "psl": Psl,
  "q": Q,
  "simple-ai": SimpleAi,
  "stash": Stash,
  "tikt": Tikt,
};

// The page for a URL path, or null when the path is not a landing page.
const getPage = (pathname = "") => {
  const path = BASE_PATH && pathname.startsWith(BASE_PATH)
    ? pathname.slice(BASE_PATH.length)
    : pathname;
  const slug = path.replace(/^\/+|\/+$/g, "");
  return PAGES[slug] || null;
};

export { PAGES, getPage };
