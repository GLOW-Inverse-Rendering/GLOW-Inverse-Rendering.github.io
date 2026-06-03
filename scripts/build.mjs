import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import sharp from "sharp";

const root = new URL("..", import.meta.url).pathname;
const fromRoot = (...parts) => join(root, ...parts);

async function copyFile(source, destination) {
  await mkdir(dirname(destination), { recursive: true });
  await cp(source, destination);
}

async function copyDirectory(source, destination) {
  await mkdir(dirname(destination), { recursive: true });
  await cp(source, destination, { recursive: true });
}

const dist = fromRoot("dist");

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

await copyDirectory(fromRoot("public"), dist);
await copyFile(fromRoot("src", "index.html"), fromRoot("dist", "index.html"));
await copyDirectory(fromRoot("src", "css"), fromRoot("dist", "static", "css"));
await copyDirectory(fromRoot("src", "js"), fromRoot("dist", "static", "js"));

const logoSource = fromRoot("public", "static", "images", "glow-logo.png");
await sharp(logoSource)
  .resize(32, 32)
  .png()
  .toFile(fromRoot("dist", "static", "images", "favicon-32.png"));
await sharp(logoSource)
  .resize(180, 180)
  .png()
  .toFile(fromRoot("dist", "static", "images", "apple-touch-icon.png"));

await copyFile(
  fromRoot("node_modules", "bulma", "css", "bulma.min.css"),
  fromRoot("dist", "static", "vendor", "bulma", "bulma.min.css")
);

await copyFile(
  fromRoot("node_modules", "bulma-carousel", "dist", "css", "bulma-carousel.min.css"),
  fromRoot("dist", "static", "vendor", "bulma-carousel", "bulma-carousel.min.css")
);
await copyFile(
  fromRoot("node_modules", "bulma-carousel", "dist", "js", "bulma-carousel.min.js"),
  fromRoot("dist", "static", "vendor", "bulma-carousel", "bulma-carousel.min.js")
);

await copyFile(
  fromRoot("node_modules", "bulma-slider", "dist", "css", "bulma-slider.min.css"),
  fromRoot("dist", "static", "vendor", "bulma-slider", "bulma-slider.min.css")
);
await copyFile(
  fromRoot("node_modules", "bulma-slider", "dist", "js", "bulma-slider.min.js"),
  fromRoot("dist", "static", "vendor", "bulma-slider", "bulma-slider.min.js")
);

await copyFile(
  fromRoot("node_modules", "jquery", "dist", "jquery.min.js"),
  fromRoot("dist", "static", "vendor", "jquery", "jquery.min.js")
);

await copyFile(
  fromRoot("node_modules", "@fortawesome", "fontawesome-free", "css", "all.min.css"),
  fromRoot("dist", "static", "vendor", "fontawesome", "css", "all.min.css")
);
await copyFile(
  fromRoot("node_modules", "@fortawesome", "fontawesome-free", "js", "all.min.js"),
  fromRoot("dist", "static", "vendor", "fontawesome", "js", "all.min.js")
);
await copyDirectory(
  fromRoot("node_modules", "@fortawesome", "fontawesome-free", "webfonts"),
  fromRoot("dist", "static", "vendor", "fontawesome", "webfonts")
);

await copyFile(
  fromRoot("node_modules", "academicons", "css", "academicons.min.css"),
  fromRoot("dist", "static", "vendor", "academicons", "css", "academicons.min.css")
);
await copyDirectory(
  fromRoot("node_modules", "academicons", "fonts"),
  fromRoot("dist", "static", "vendor", "academicons", "fonts")
);
