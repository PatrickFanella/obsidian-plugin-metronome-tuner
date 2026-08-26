import { readFileSync, writeFileSync } from "node:fs";

const manifest = JSON.parse(readFileSync("manifest.json", "utf8"));
const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
const versions = JSON.parse(readFileSync("versions.json", "utf8"));

manifest.version = packageJson.version;
const existingMinAppVersion = versions[packageJson.version];
if (existingMinAppVersion !== undefined && existingMinAppVersion !== manifest.minAppVersion) {
  throw new Error(
    `versions.json already maps ${packageJson.version} to ${existingMinAppVersion}; refusing to replace it with ${manifest.minAppVersion}.`
  );
}
versions[packageJson.version] = manifest.minAppVersion;
writeFileSync("manifest.json", `${JSON.stringify(manifest, null, 2)}\n`);
writeFileSync("versions.json", `${JSON.stringify(versions, null, 2)}\n`);
