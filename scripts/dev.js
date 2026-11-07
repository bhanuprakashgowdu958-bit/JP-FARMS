const { spawn, exec } = require('child_process');
const http = require('http');

const port = process.env.PORT || 3000;
const url = `http://localhost:${port}`;
let opened = false;
let checkCount = 0;
const MAX_CHECKS = 40;

console.log(`\n🌾 Starting JP Farms Dev Server on http://localhost:${port} ...\n`);

// Start Next.js dev server with inherited stdout/stderr
const nextDev = spawn('npx', ['next', 'dev', '-p', String(port)], {
  stdio: 'inherit',
  shell: true,
});

// Function to open default browser
const openBrowser = (targetUrl) => {
  if (opened) return;
  opened = true;
  console.log(`\n🚀 Dev server ready with full styles! Opening preview: ${targetUrl}\n`);

  const cmd = process.platform === 'win32'
    ? `start "" "${targetUrl}"`
    : process.platform === 'darwin'
    ? `open "${targetUrl}"`
    : `xdg-open "${targetUrl}"`;

  exec(cmd, (err) => {
    if (err) {
      console.log(`\n👉 Open your browser manually at: ${targetUrl}\n`);
    }
  });
};

// Verify both HTML and compiled CSS stylesheet before launching browser
const verifyAndOpen = () => {
  if (opened) return;
  checkCount++;

  const req = http.get(url, (res) => {
    if (res.statusCode !== 200) {
      if (checkCount < MAX_CHECKS) setTimeout(verifyAndOpen, 800);
      return;
    }

    let html = '';
    res.on('data', (chunk) => { html += chunk; });
    res.on('end', () => {
      // Check for compiled Next.js stylesheet link
      const cssMatch = html.match(/href="(\/_next\/static\/css\/[^"]+\.css[^"]*)"/);

      if (cssMatch && cssMatch[1]) {
        const cssUrl = `http://localhost:${port}${cssMatch[1]}`;
        http.get(cssUrl, (cssRes) => {
          if (cssRes.statusCode === 200) {
            // CSS is compiled and ready; give small buffer for browser to load cleanly
            setTimeout(() => openBrowser(url), 800);
          } else {
            if (checkCount < MAX_CHECKS) setTimeout(verifyAndOpen, 800);
          }
        }).on('error', () => {
          if (checkCount < MAX_CHECKS) setTimeout(verifyAndOpen, 800);
        });
      } else {
        // If route has HTML compiled (> 1500 bytes), wait small buffer and open
        if (html.length > 1500) {
          setTimeout(() => openBrowser(url), 1200);
        } else {
          if (checkCount < MAX_CHECKS) setTimeout(verifyAndOpen, 800);
        }
      }
    });
  });

  req.on('error', () => {
    if (checkCount < MAX_CHECKS) {
      setTimeout(verifyAndOpen, 800);
    } else {
      openBrowser(url);
    }
  });
};

// Start probing after 3 seconds (giving Next.js time to initialize)
setTimeout(verifyAndOpen, 3000);

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
