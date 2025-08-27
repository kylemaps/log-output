const Koa = require('koa');
const fs = require('fs');
const crypto = require('crypto');
const axios = require('axios');

const app = new Koa();
const PORT = process.env.PORT || 3002;

// Paths to shared file and ConfigMap-mounted file
const SHARED_FILE_PATH = '/usr/src/app/files/timestamp.txt';
const CONFIG_FILE_PATH = '/usr/src/app/data/information.txt';
const PINGPONG_URL = 'http://pingpong-svc:3001/ping'; //this should be an ENV variable ideally
const MESSAGE = process.env.MESSAGE;

app.use(async (ctx, next) => {
  if (ctx.path === '/healthz') {
    try {
      const ping = await axios.get(PINGPONG_URL);
      ctx.status = ping.status === 200 ? 200 : 500;
      ctx.body = ping.status === 200 ? 'OK' : 'Pingpong Not Ready';
    } catch {
      ctx.status = 500;
      ctx.body = 'Pingpong Not Ready';
    }
  } else {
    await next(); // fallback to original logic
  }
});


app.use(async (ctx) => {
  try {
    // Read the shared file (timestamp.txt)
    let timestampFileContent = '';
    try {
      timestampFileContent = fs.readFileSync(SHARED_FILE_PATH, 'utf8').trim();
    } catch (err) {
      console.error(`Error reading shared file: ${err.message}`);
    }

    // Read the ConfigMap-mounted file (information.txt)
    let configFileContent = '';
    try {
      configFileContent = fs.readFileSync(CONFIG_FILE_PATH, 'utf8').trim();
    } catch (err) {
      console.error(`Error reading config file: ${err.message}`);
    }

    // Fetch ping count from the PingPong service
    const pingResponse = await axios.get(PINGPONG_URL);
    const pingCount = pingResponse.data.pong;

    // Generate a hash from the timestamp content
    const hash = crypto.createHash('sha256').update(timestampFileContent).digest('hex');

    // Generate the response output
    ctx.body = `file content: ${configFileContent}\n` +
               `env variable: MESSAGE=${MESSAGE}\n` +
               `timestamp file content: ${timestampFileContent}\n` +
               `${new Date().toISOString()}: ${hash}\n` +
               `Ping / Pongs: ${pingCount}`;
  } catch (err) {
    console.error(`Error processing request: ${err.message}`);
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
});

app.listen(PORT, () => {
  console.log(`Reader app listening on port ${PORT}`);
});
