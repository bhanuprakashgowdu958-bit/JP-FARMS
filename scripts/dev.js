const { spawn, exec } = require('child_process');
const http = require('http');

const port = process.env.PORT || 3000;
const url = `http://localhost:${port}`;
let opened = false;

// Start Next.js dev server
const nextDev = spawn('npx', ['next', 'dev'], {
  stdio: 'inherit',
  shell: true,
});

// Function to open default browser
const openBrowser = (targetUrl) => {
  if (opened) return;
  opened = true;
  console.log(`\n🚀 Server is ready! Automatically opening preview in your browser: ${targetUrl}\n`);

  const cmd = process.platform === 'win32'
    ? `start "" "${targetUrl}"`
    : process.platform === 'darwin'
    ? `open "${targetUrl}"`
    : `xdg-open "${targetUrl}"`;

  exec(cmd, (err) => {
    if (err) {
      console.log(`Could not automatically open browser. Please open manually at: ${targetUrl}`);
    }
  });
};

// Poll server until ready
const checkServer = () => {
  if (opened) return;

  const req = http.get(url, (res) => {
    openBrowser(url);
  });

  req.on('error', () => {
    setTimeout(checkServer, 400);
  });
};

// Start probing after 800ms
setTimeout(checkServer, 800);

// Clean exit handlers
nextDev.on('close', (code) => {
  process.exit(code || 0);
});

process.on('SIGINT', () => {
  nextDev.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  nextDev.kill('SIGTERM');
  process.exit(0);
});
