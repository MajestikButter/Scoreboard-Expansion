const path = require("path");
const AdmZip = require("adm-zip");

const buildDir = path.resolve(__dirname, "../build");

const BPManifest = require(buildDir + "/BP/manifest.json");

const version = BPManifest.header.version;
const fileName = `MB_Scoreboard_Expansion-v${version.join(".")}`;

async function bundle() {
  const zip = new AdmZip();
  await zip.addLocalFolderPromise(buildDir + "/BP", { zipPath: "BP" });
  await zip.addLocalFolderPromise(buildDir + "/RP", { zipPath: "RP" });
  await zip.writeZip(buildDir + `/${fileName}.zip`);
  await zip.writeZip(buildDir + `/${fileName}.mcaddon`);
}
bundle();
