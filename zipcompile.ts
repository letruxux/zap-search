/* this code is used by github actions to upload the exe to releases.
only releasing the exe because:
macos is not a priority rn
if you're using linux you probably don't need this, also not a priority rn */

/* logging made with ai (sowwy) */

import fs from "fs";
import path from "path";
import JSZip from "jszip";

const compiledExe = Bun.file("./packages/backend/server.exe");

async function main() {
  console.log("Starting the compilation process...");

  console.log("Checking if ./packages/backend/dist folder exists...");
  if (!fs.existsSync("./packages/backend/dist")) {
    console.error("Error: ./packages/backend/dist folder not found.");
    throw new Error(
      `"./packages/backend/dist" folder not found. Make sure you haven't moved the dist folder or the executable.`
    );
  }
  console.log("./packages/backend/dist folder found.");

  console.log("Checking if server.exe exists...");
  if (!compiledExe.exists()) {
    console.error("Error: server.exe not found.");
    throw new Error(
      `"${compiledExe.name}" file not found. Make sure you haven't moved the executable.`
    );
  }
  console.log("server.exe found.");

  console.log("Creating new JSZip instance...");
  const zip = new JSZip();

  console.log("Adding server.exe to zip...");
  zip.file("server.exe", compiledExe.arrayBuffer());

  console.log("Adding ./packages/backend/dist to zip...");
  addDirectoryToZip(zip, "./packages/backend/dist", "dist");

  console.log("Generating zip file...");
  const zipContent = await zip.generateAsync({ type: "nodebuffer" });

  console.log("Writing zip file to disk...");
  fs.writeFileSync("dist.zip", zipContent);

  console.log("Zip file created successfully.");

  console.log("Removing dist folder and exe...");
  fs.rmSync("./packages/backend/dist", { recursive: true, force: true });
  fs.rmSync("./packages/backend/server.exe", { force: true });
  console.log("dist folder and exe removed.");
}

function addDirectoryToZip(zip: JSZip, folderPath: string, zipPath: string) {
  console.log(`Adding directory ${folderPath} to zip...`);
  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isFile()) {
      console.log(`Adding file ${filePath} to zip...`);
      const fileContent = fs.readFileSync(filePath);
      zip.file(path.join(zipPath, file), fileContent);
    } else if (stats.isDirectory()) {
      console.log(`Recursively adding directory ${filePath} to zip...`);
      addDirectoryToZip(zip, filePath, path.join(zipPath, file));
    }
  }
}

main().catch((error) => {
  console.error("An error occurred during the compilation process:", error);
});
