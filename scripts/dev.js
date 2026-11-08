const { spawn, exec, execSync } = require('child_process');
const http = require('http');
const net = require('net');
const os = require('os');

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

// Retrieve local Wi-Fi / Ethernet IPv4
const getLocalNetworkIp = () => {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal loopback addresses
      if (net.family === 'IPv4' && !net.internal && !net.address.startsWith('169.254')) {
        return net.address;
      }
    }
  }
  return null;
};

// Free up or find an open port
const resolvePort = async (preferredPort = 3000) => {
  let port = preferredPort;
  
  if (await isPortAvailable(port)) {
    return port;
  }

  // Attempt to terminate orphaned node process on Windows if holding port
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
            execSync(`taskkill /F /PID ${pid} >nul 2>&1`);
            killed = true;
          }
        }
      }
      if (killed) {
        await new Promise((r) => setTimeout(r, 600));
        if (await isPortAvailable(port)) {
          return port;
        }
      }
    } catch {
      // Fallback
    }
  }

  while (!(await isPortAvailable(port))) {
    port++;
  }
  return port;
};

// Main launcher
async function start() {
  const defaultPort = parseInt(process.env.PORT || '3000', 10);
  const port = await resolvePort(defaultPort);
  const localUrl = `http://localhost:${port}/`;
  const networkIp = getLocalNetworkIp();
  const networkUrl = networkIp ? `http://${networkIp}:${port}/` : null;
  const startTime = Date.now();

  const isWin = process.platform === 'win32';
  const bin = isWin ? 'cmd.exe' : 'npx';
  const args = isWin
    ? ['/d', '/s', '/c', `npx next dev -p ${port}`]
    : ['next', 'dev', '-p', String(port)];

  // Spawn Next.js dev server with piped stdio to filter out noisy HTTP request logs
  const nextDev = spawn(bin, args, {
    stdio: ['inherit', 'pipe', 'pipe'],
  });

  let printedBanner = false;
  let openedBrowser = false;

  const printCleanViteBanner = () => {
    if (printedBanner) return;
    printedBanner = true;
    const readyMs = Math.max(Date.now() - startTime, 860);

    // Clear console and print clean, beautiful Vite-style banner
    console.log(`\n  \x1b[32m\x1b[1m▲ Next.js 14.2.35\x1b[0m  \x1b[2mready in\x1b[0m \x1b[1m${readyMs} ms\x1b[0m\n`);
    console.log(`  \x1b[32m➜\x1b[0m  \x1b[1mLocal:\x1b[0m   \x1b[36m${localUrl}\x1b[0m`);
    if (networkUrl) {
      console.log(`  \x1b[32m➜\x1b[0m  \x1b[1mNetwork:\x1b[0m \x1b[36m${networkUrl}\x1b[0m`);
    } else {
      console.log(`  \x1b[32m➜\x1b[0m  \x1b[2mNetwork: use --host to expose\x1b[0m`);
    }
    console.log(`  \x1b[2m➜  press \x1b[1mh + enter\x1b[0m\x1b[2m to show help\x1b[0m\n`);
  };

  const openBrowserOnce = () => {
    if (openedBrowser) return;
    openedBrowser = true;
    printCleanViteBanner();

    const cmd = process.platform === 'win32'
      ? `start "" "${localUrl}"`
      : process.platform === 'darwin'
      ? `open "${localUrl}"`
      : `xdg-open "${localUrl}"`;

    exec(cmd, () => {});
  };

  // Filter stdout: suppress repetitive GET / 200 logs while keeping critical messages
  nextDev.stdout.on('data', (data) => {
    const text = data.toString();
    
    // Detect when Next.js is compiled / ready
    if (text.includes('Ready in') || text.includes('Compiled') || text.includes('✓')) {
      printCleanViteBanner();
    }

    // Suppress spammy request logs (GET / 200 in 15ms, etc.)
    const isRequestLog = /GET\s+\//.test(text) || /Compiling\s+\//.test(text);
    if (!isRequestLog) {
      // Only print actual errors or important notices
      if (text.includes('error') || text.includes('Error') || text.includes('Warning') || text.includes('warn')) {
        process.stdout.write(data);
      }
    }
  });

  nextDev.stderr.on('data', (data) => {
    const text = data.toString();
    // Only forward real errors, not deprecation warnings
    if (!text.includes('DEP0190') && !text.includes('ExperimentalWarning')) {
      process.stderr.write(data);
    }
  });

  // Probe server to auto-print banner and open browser
  const probe = () => {
    const req = http.get(localUrl, (res) => {
      if (res.statusCode === 200) {
        printCleanViteBanner();
        openBrowserOnce();
      } else {
        setTimeout(probe, 500);
      }
    });
    req.on('error', () => {
      setTimeout(probe, 500);
    });
  };

  setTimeout(probe, 1200);

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

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
