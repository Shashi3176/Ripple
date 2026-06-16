import { spawn } from "node:child_process";

const port = process.env.PORT || "3000";

spawn("serve", ["-s", "dist", "-l", port], {
  stdio: "inherit",
  shell: true,
});
