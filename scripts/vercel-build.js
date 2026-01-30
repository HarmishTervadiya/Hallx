const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

try {
  // Run the original build command
  console.log("Running Expo export...");
  execSync("npx expo export -p web", { stdio: "inherit" });

  const distServer = path.join(__dirname, "../dist/server");
  const distClient = path.join(__dirname, "../dist/client");

  // 1. Rename (tabs) -> tabs
  const tabsDir = path.join(distServer, "(tabs)");
  const newTabsDir = path.join(distServer, "tabs");

  if (fs.existsSync(tabsDir)) {
    console.log("Renaming (tabs) directory to tabs...");
    fs.renameSync(tabsDir, newTabsDir);
  } else {
    console.log("Warning: (tabs) directory not found in dist/server");
  }

  // 2. Copy client files to server directory (merging them)
  console.log("Copying client files to server directory...");
  if (fs.existsSync(distClient)) {
    // Windows friendly copy
    if (process.platform === "win32") {
      execSync(`xcopy "${distClient}" "${distServer}" /E /H /C /I /Y`, {
        stdio: "inherit",
      });
    } else {
      execSync(`cp -r "${distClient}/"* "${distServer}/"`, {
        stdio: "inherit",
      });
    }
  }
} catch (error) {
  console.error("Build script failed:", error);
  process.exit(1);
}
