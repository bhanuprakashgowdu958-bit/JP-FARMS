const { spawn, exec, execSync } = require('child_process');
const http = require('http');
const net = require('net');

// Check if a given port is available
const isPortAvailable = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port);
  });
};

// Free up or find an open port
const resolvePort = async (preferredPort = 3000) => {
  let port = preferredPort;
  
  // Try preferred port first
  if (await isPortAvailable(port)) {
    return port;
  }

  // If on Windows, attempt to terminate orphaned process on port
  if (process.platform === 'win32') {
    try {
      const output = execSync(`netstat -ano | findstr :${port}`).toString();
      const lines = output.trim().split('\n');
      let killed = false;
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if (parts[3] === 'LISTENING') {
          const pid = parts[parts.length - 1];
          if (pid && pid !== '0' && pid !== String(process.pid)) {
            console.log(`🧹 Freeing stale process (PID: ${pid}) holding port ${port}...`);
            execSync(`taskkill /F /PID ${pid}`);
            killed = true;
          }
        }
      }
      if (killed) {
        await new Promise((r) => setTimeout(r, 1000));
        if (await isPortAvailable(port)) {
          console.log(`✓ Port ${port} is now free and ready.`);
          return port;
        }
      }
    } catch {
      // If taskkill fails or no process found, seamlessly fall back to next open port
    }
  }

  // Find next available open port
  while (!(await isPortAvailable(port))) {
    port++;
  }

  console.log(`ℹ️ Port ${preferredPort} is in use; using available port ${port}.`);
  return port;
};

// Main launcher
async function start() {
  const defaultPort = parseInt(process.env.PORT || '3000', 10);
  const port = await resolvePort(defaultPort);
  const url = `http://localhost:${port}`;
  let opened = false;
  let checkCount = 0;
  const MAX_CHECKS = 40;

  console.log(`\n🌾 Starting JP Farms Dev Server on ${url} ...\n`);

  // Use cmd.exe on Windows to run npx cleanly without EINVAL or DEP0190 warnings
  const isWin = process.platform === 'win32';
  const bin = isWin ? 'cmd.exe' : 'npx';
  const args = isWin
    ? ['/d', '/s', '/c', `npx next dev -p ${port}`]
    : ['next', 'dev', '-p', String(port)];

  const nextDev = spawn(bin, args, {
    stdio: 'inherit',
  });

  // Browser launcher
  const openBrowser = (targetUrl) => {
    if (opened) return;
    opened = true;
    console.log(`\n🚀 Server is fully compiled & ready! Automatically opening preview: ${targetUrl}\n`);

    const cmd = process.platform === 'win32'
      ? `start "" "${targetUrl}"`
      : process.platform === 'darwin'
      ? `open "${targetUrl}"`
      : `xdg-open "${targetUrl}"`;

    exec(cmd, (err) => {
      if (err) {
        console.log(`\n👉 Please open your browser at: ${targetUrl}\n`);
      }
    });
  };

  // Verify page & compiled CSS stylesheet before launching browser
  const verifyAndOpen = () => {
    if (opened) return;
    checkCount++;

    const req = http.get(url, (res) => {
      if (res.statusCode !== 200) {
        if (checkCount < MAX_CHECKS) setTimeout(verifyAndOpen, 700);
        return;
      }

      let html = '';
      res.on('data', (chunk) => { html += chunk; });
      res.on('end', () => {
        // Look for compiled Next.js stylesheet
        const cssMatch = html.match(/href="(\/_next\/static\/css\/[^"]+\.css[^"]*)"/);

        if (cssMatch && cssMatch[1]) {
          const cssUrl = `http://localhost:${port}${cssMatch[1]}`;
          http.get(cssUrl, (cssRes) => {
            if (cssRes.statusCode === 200) {
              setTimeout(() => openBrowser(url), 600);
            } else {
              if (checkCount < MAX_CHECKS) setTimeout(verifyAndOpen, 700);
            }
          }).on('error', () => {
            if (checkCount < MAX_CHECKS) setTimeout(verifyAndOpen, 700);
          });
        } else {
          // If HTML content compiled (> 1500 chars), wait buffer and open
          if (html.length > 1500) {
            setTimeout(() => openBrowser(url), 1000);
          } else {
            if (checkCount < MAX_CHECKS) setTimeout(verifyAndOpen, 700);
          }
        }
      });
    });

    req.on('error', () => {
      if (checkCount < MAX_CHECKS) {
        setTimeout(verifyAndOpen, 700);
      } else {
        openBrowser(url);
      }
    });
  };

  // Start warmup probing after 2.5s
  setTimeout(verifyAndOpen, 2500);

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
}

start();
