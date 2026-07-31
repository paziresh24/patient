/**
 * Free the patient HTTPS port before `npm run dev`.
 * On Windows a stale `node server.js` often keeps :443 open — TLS accepts,
 * then hangs (CLOSE_WAIT) so https://local.paziresh24.com/* never loads.
 */
const { execSync } = require('child_process');

const port = Number(process.env.PORT || 443);

function pidsOnPort(p) {
  try {
    const out = execSync('netstat -ano', { encoding: 'utf8' });
    const pids = new Set();
    for (const line of out.split(/\r?\n/)) {
      if (!line.includes('LISTENING')) continue;
      // e.g. TCP    0.0.0.0:443    0.0.0.0:0    LISTENING    9164
      const m = line.match(new RegExp(`:${p}\\s+.*?LISTENING\\s+(\\d+)\\s*$`, 'i'));
      if (m) pids.add(m[1]);
    }
    return [...pids];
  } catch {
    return [];
  }
}

function killPid(pid) {
  try {
    execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
    console.log(`> freed port ${port}: killed PID ${pid}`);
  } catch {
    // already gone
  }
}

const pids = pidsOnPort(port);
if (!pids.length) {
  console.log(`> port ${port} is free`);
  process.exit(0);
}

pids.forEach(killPid);
process.exit(0);
