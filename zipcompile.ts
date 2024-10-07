/* this code is used by github actions to upload the exe to releases.
only releasing the exe because:
macos is not a priority rn
if you're using linux you probably don't need this, also not a priority rn */

import fs from "fs";
import path from "path";
import JSZip from "jszip";

const compiledExe = Bun.file("./packages/backend/server.exe");
const backendFolder = path.join("./packages", "backend");
const backendDist = path.join(backendFolder, "dist");

async function main() {
  if (!fs.existsSync(backendDist)) {
    throw new Error(
      `${backendDist} folder not found. Make sure you haven\'t moved the dist folder or the executable.`
    );
  }
  if (!compiledExe.exists()) {
    throw new Error(
      `"${compiledExe.name}" file not found. Make sure you haven\'t moved the executable.`
    );
  }

  const zip = new JSZip();

  zip.file("server.exe", compiledExe.arrayBuffer());

  function addDirectoryToZip(zip: JSZip, folderPath: string, zipPath: string) {
    const files = fs.readdirSync(folderPath);

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stats = fs.statSync(filePath);

      const bufferToArrayBuffer = (buffer: Buffer) => {
        const arrayBuffer = new ArrayBuffer(buffer.length);
        const view = new Uint8Array(arrayBuffer);
        for (let i = 0; i < buffer.length; i++) {
          view[i] = buffer[i];
        }
        return arrayBuffer;
      };

      if (stats.isFile()) {
        const fileContent = fs.readFileSync(filePath);
        zip.file(path.join(zipPath, file), bufferToArrayBuffer(fileContent));
      } else if (stats.isDirectory()) {
        addDirectoryToZip(zip, filePath, path.join(zipPath, file));
      }
    }
  }
  addDirectoryToZip(zip, backendDist, "dist");

  /* save zip file */
  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
  const zipFile = Bun.file("dist.zip");
  zipFile.writer().write(zipBuffer);

  /* remove built files */
  try {
    fs.rmSync(backendDist, { recursive: true, force: true });
    fs.rmSync(path.join(backendFolder, "server.exe"), { force: true });
  } catch {
    console.log("failed to remove built files");
  }
}

main();
