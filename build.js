const { spawn } = require("child_process");
const path = require("path");

// Definir variáveis de ambiente para evitar problemas de permissão
process.env.NODE_OPTIONS = "--max-old-space-size=4096";
process.env.NEXT_TELEMETRY_DISABLED = "1";

// Executar o build do Next.js
const nextBuild = spawn("npx", ["next", "build"], {
  stdio: "inherit",
  shell: true,
  cwd: process.cwd(),
  env: {
    ...process.env,
    // Tentar limitar o escopo do file watching
    CHOKIDAR_USEPOLLING: "true",
    CHOKIDAR_INTERVAL: "1000",
  },
});

nextBuild.on("close", (code) => {
  console.log(`Build process exited with code ${code}`);
  process.exit(code);
});

nextBuild.on("error", (error) => {
  console.error("Build error:", error);
  process.exit(1);
});
