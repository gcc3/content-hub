import { useEffect, useState } from "react";
import meta from "./meta.json";

// The newest Pob release, resolved in the browser so the button on the page
// always hands over the current zip for the machine the visitor is on.
// Asset names carry the version (Pob-0.2.0-macos.zip), so the file cannot be
// guessed from a fixed URL — GitHub has to be asked.
const { github, download } = meta.repositories[0];

const repo = github.replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, "");
const LATEST = `https://api.github.com/repos/${repo}/releases/latest`;

const PLATFORMS = ["windows", "macos", "linux"];

// The architectures builds are cut for, in the order they are offered.
const ARCHES = [
  { id: "amd64", label: "x64" },
  { id: "arm64", label: "ARM64" },
];

// Which of the three desktops this is. Phones get no platform: there is
// nothing here for them to run, so they are sent to the releases page.
const detectPlatform = () => {
  const ua = `${navigator.userAgent} ${navigator.platform || ""}`.toLowerCase();
  if (/android|iphone|ipad|ipod/.test(ua)) return null;
  if (ua.includes("win")) return "windows";
  if (ua.includes("mac")) return "macos";
  if (ua.includes("linux") || ua.includes("cros") || ua.includes("x11")) return "linux";
  return null;
};

// Windows on ARM reports itself as x64 in the user agent string, so ask for the
// real architecture where the browser offers it and read the string otherwise.
// The guess is only a starting point — the page lets it be changed by hand.
const detectArch = async () => {
  const hints = navigator.userAgentData;
  if (hints && hints.getHighEntropyValues) {
    try {
      const { architecture } = await hints.getHighEntropyValues(["architecture"]);
      if (architecture === "arm") return "arm64";
      if (architecture === "x86") return "amd64";
    } catch {
      // hints can be refused; the user agent string is the fallback
    }
  }
  return /arm64|aarch64/.test(navigator.userAgent.toLowerCase()) ? "arm64" : "amd64";
};

// Which architecture an asset is built for, or null for a universal build that
// names none — macOS ships one of those.
const archOf = (name) => {
  const lower = name.toLowerCase();
  if (/arm64|aarch64/.test(lower)) return "arm64";
  if (/amd64|x86_64|x64/.test(lower)) return "amd64";
  return null;
};

const zips = (assets) => assets.filter((asset) => asset.name.toLowerCase().endsWith(".zip"));

// The zip for one platform: the build matching this architecture, else the
// build that names no architecture. Nothing otherwise — handing over the other
// architecture's binary would be worse than pointing at the releases page,
// now that the architecture is something the visitor picks.
const pickAsset = (assets, platform, arch) => {
  const candidates = zips(assets).filter((asset) => asset.name.toLowerCase().includes(platform));
  return (
    candidates.find((asset) => archOf(asset.name) === arch)
    || candidates.find((asset) => archOf(asset.name) === null)
    || null
  );
};

// Only the architectures this release actually carries a build for, so the
// choice on the page is never a choice between a zip and nothing.
const archesIn = (assets) => ARCHES.filter(
  (arch) => zips(assets).some((asset) => archOf(asset.name) === arch.id),
);

// One request per page load, however many times the hook is used.
let pending = null;

const fetchLatest = () => {
  if (!pending) {
    pending = fetch(LATEST, { headers: { Accept: "application/vnd.github+json" } })
      .then((response) => {
        if (!response.ok) throw new Error(`github said ${response.status}`);
        return response.json();
      });
  }
  return pending;
};

// Returns a link for every platform plus the one for this machine, and the
// architecture switch that moves them all. Until the release is known — and if
// it never is — every link is the releases page, which is a working answer
// rather than a dead button.
const useRelease = () => {
  const [release, setRelease] = useState(null);
  const [detected] = useState(detectPlatform);
  const [arch, setArch] = useState(ARCHES[0].id);

  useEffect(() => {
    let alive = true;

    Promise.all([fetchLatest(), detectArch()])
      .then(([latest, machineArch]) => {
        if (!alive) return;
        setRelease({
          version: (latest.tag_name || "").replace(/^v/, ""),
          assets: Array.isArray(latest.assets) ? latest.assets : [],
        });
        // Safe to overwrite: the switch is only rendered once a release is
        // known, so there is no choice of the visitor's to lose here.
        setArch(machineArch);
      })
      .catch(() => {
        // offline, rate limited, or no release yet — the page keeps its links
      });

    return () => {
      alive = false;
    };
  }, []);

  const assets = (release && release.assets) || [];

  const urls = {};
  PLATFORMS.forEach((name) => {
    const asset = pickAsset(assets, name, arch);
    if (asset) urls[name] = asset.browser_download_url;
  });

  const hrefFor = (name) => urls[name] || download;
  // A platform we detected but cannot serve is not a platform to offer.
  const platform = !release || urls[detected] ? detected : null;

  return {
    platform,
    version: release ? release.version : null,
    platforms: PLATFORMS,
    arch,
    arches: archesIn(assets),
    setArch,
    hrefFor,
    href: platform ? hrefFor(platform) : download,
    releasesHref: download,
  };
};

export { useRelease };
