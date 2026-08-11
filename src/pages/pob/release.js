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

const ARCH_TOKENS = /amd64|arm64|x86_64|aarch64|x64/;

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

// The zip for one platform: the build matching this architecture, else the
// build that names no architecture (macOS ships a single universal one).
const pickAsset = (assets, platform, arch) => {
  const candidates = assets.filter((asset) => {
    const name = asset.name.toLowerCase();
    return name.endsWith(".zip") && name.includes(platform);
  });
  if (candidates.length === 0) return null;
  return (
    candidates.find((asset) => asset.name.toLowerCase().includes(arch))
    || candidates.find((asset) => !ARCH_TOKENS.test(asset.name.toLowerCase()))
    || candidates[0]
  );
};

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

// Returns a link for every platform plus the one for this machine. Until the
// release is known — and if it never is — every link is the releases page,
// which is a working answer rather than a dead button.
const useRelease = () => {
  const [release, setRelease] = useState(null);
  const [platform, setPlatform] = useState(detectPlatform);

  useEffect(() => {
    let alive = true;

    Promise.all([fetchLatest(), detectArch()])
      .then(([latest, arch]) => {
        if (!alive) return;
        const assets = Array.isArray(latest.assets) ? latest.assets : [];
        const urls = {};
        PLATFORMS.forEach((name) => {
          const asset = pickAsset(assets, name, arch);
          if (asset) urls[name] = asset.browser_download_url;
        });
        setRelease({ version: (latest.tag_name || "").replace(/^v/, ""), urls });
        // A platform we detected but cannot serve is not a platform to offer.
        setPlatform((current) => (current && !urls[current] ? null : current));
      })
      .catch(() => {
        // offline, rate limited, or no release yet — the page keeps its links
      });

    return () => {
      alive = false;
    };
  }, []);

  const urls = (release && release.urls) || {};
  const hrefFor = (name) => urls[name] || download;

  return {
    platform,
    version: release ? release.version : null,
    platforms: PLATFORMS,
    hrefFor,
    href: platform ? hrefFor(platform) : download,
    releasesHref: download,
  };
};

export { useRelease };
