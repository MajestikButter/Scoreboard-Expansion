const fs = require("fs");
const path = require("path");
const packsDir = path.resolve(__dirname, "../packs");
const BPManifest = require(packsDir + "/BP/manifest.json");
const RPManifest = require(packsDir + "/RP/manifest.json");
const BPlang = fs.readFileSync(packsDir + "/BP/texts/en_US.lang", "utf8");
const RPlang = fs.readFileSync(packsDir + "/RP/texts/en_US.lang", "utf8");

const a = process.argv[2];

if (!["minor", "major", "patch"].includes(a)) {
  throw new Error(`Invalid bump type: ${a}`);
}

const place = a == "major" ? 0 : a == "minor" ? 1 : 2;

const version = BPManifest.header.version;
version[place] = version[place] + 1;
if (place == 0) {
  version[1] = 0;
  version[2] = 0;
} else if (place == 1) {
  version[2] = 0;
}

BPManifest.header.version = version;
BPManifest.modules[0].version = version;

RPManifest.header.version = version;
RPManifest.modules[0].version = version;

fs.writeFileSync(packsDir + "/BP/manifest.json", JSON.stringify(BPManifest));
fs.writeFileSync(packsDir + "/RP/manifest.json", JSON.stringify(RPManifest));

const bls = BPlang.split("\n");
bls[0] = `pack.name=§l§3MB Scoreboard Expansion v${version.join(".")}§r`;

const rls = RPlang.split("\n");
rls[0] = `pack.name=§l§3MB Scoreboard Expansion v${version.join(".")}§r`;

fs.writeFileSync(packsDir + "/BP/texts/en_US.lang", bls.join("\n"));
fs.writeFileSync(packsDir + "/RP/texts/en_US.lang", rls.join("\n"));

console.log(`Bumped to v${version.join(".")}`);
