import { readFile, stat } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const errors = [];
const semverPattern = /^\d+\.\d+\.\d+$/;

async function readJson(path) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    errors.push(`${path}: could not read valid JSON (${error instanceof Error ? error.message : String(error)})`);
    return {};
  }
}

function requireString(object, field, file) {
  const value = object[field];
  if (typeof value !== "string" || value.trim() === "") {
    errors.push(`${file}: ${field} must be a nonempty string`);
  }
}

async function requireNonemptyFile(path) {
  try {
    if ((await stat(path)).size === 0) errors.push(`${path}: release artifact is empty`);
  } catch {
    errors.push(`${path}: release artifact is missing; run npm run build:clean first`);
  }
}

const packageJson = await readJson("package.json");
const manifest = await readJson("manifest.json");
const versions = await readJson("versions.json");
const suppliedTag = process.argv[2] ?? (process.env.GITHUB_REF_TYPE === "tag" ? process.env.GITHUB_REF_NAME : undefined);
const tagRequired = process.env.GITHUB_ACTIONS === "true" && process.env.GITHUB_REF_TYPE === "tag";

for (const [value, location] of [
  [packageJson.version, "package.json version"],
  [manifest.version, "manifest.json version"],
  ...(suppliedTag === undefined ? [] : [[suppliedTag, "release tag"]]),
]) {
  if (typeof value !== "string" || !semverPattern.test(value)) {
    errors.push(`${location}: expected strict x.y.z semver without a v prefix, got ${JSON.stringify(value)}`);
  }
}

if (tagRequired && suppliedTag === undefined) {
  errors.push("release tag: required for a GitHub Actions tag build");
}
if (packageJson.version !== manifest.version) {
  errors.push(`version mismatch: package.json has ${packageJson.version}, manifest.json has ${manifest.version}`);
}
if (suppliedTag !== undefined && suppliedTag !== manifest.version) {
  errors.push(`version mismatch: release tag ${suppliedTag} does not equal manifest.json ${manifest.version}`);
}
if (versions[manifest.version] !== manifest.minAppVersion) {
  errors.push(
    `versions.json: expected ${JSON.stringify(manifest.version)} to map to manifest minAppVersion ${JSON.stringify(manifest.minAppVersion)}, got ${JSON.stringify(versions[manifest.version])}`
  );
}

for (const field of ["id", "name", "version", "minAppVersion", "description", "author"]) {
  requireString(manifest, field, "manifest.json");
}
if (manifest.id !== "metronome-tuner") {
  errors.push(`manifest.json: id must remain "metronome-tuner", got ${JSON.stringify(manifest.id)}`);
}
if (typeof manifest.id === "string" && !/^[a-z0-9][a-z0-9-]*$/.test(manifest.id)) {
  errors.push("manifest.json: id may contain only lowercase letters, numbers, and hyphens");
}
if (typeof manifest.name === "string" && manifest.name.includes("&")) {
  errors.push('manifest.json: name must not contain "&"');
}
if (typeof manifest.description === "string") {
  if (manifest.description.length > 250) errors.push("manifest.json: description must be at most 250 characters");
  if (!manifest.description.trim().endsWith(".")) errors.push("manifest.json: description must end with a period");
  if (/\bobsidian\b/i.test(manifest.description)) errors.push('manifest.json: description must not include the redundant word "Obsidian"');
}
if (manifest.fundingUrl !== undefined) {
  try {
    if (typeof manifest.fundingUrl !== "string") throw new Error("not a string");
    const fundingUrl = new URL(manifest.fundingUrl);
    if (fundingUrl.protocol !== "https:") throw new Error("not HTTPS");
  } catch {
    errors.push("manifest.json: fundingUrl must be a valid HTTPS URL");
  }
}
if (typeof manifest.isDesktopOnly !== "boolean") {
  errors.push("manifest.json: isDesktopOnly must be a boolean");
}

await Promise.all(["main.js", "manifest.json", "styles.css"].map(requireNonemptyFile));

try {
  const styles = await readFile("styles.css", "utf8");
  if (styles.includes("!important")) errors.push("styles.css: avoid !important; use selector specificity or CSS variables");
} catch {
  // Missing styles.css is reported by the release artifact check above.
}

const ignored = spawnSync("git", ["check-ignore", "--quiet", "--", "main.js"], { stdio: "ignore" });
if (ignored.error) {
  errors.push(`main.js: could not check .gitignore (${ignored.error.message})`);
} else if (ignored.status !== 0) {
  errors.push("main.js: must be ignored by git; add it to .gitignore");
}

if (errors.length > 0) {
  console.error(`Release verification failed:\n- ${errors.join("\n- ")}`);
  process.exitCode = 1;
} else {
  process.stdout.write(`Release verification passed for ${manifest.version}${suppliedTag ? ` (tag ${suppliedTag})` : ""}.\n`);
}
