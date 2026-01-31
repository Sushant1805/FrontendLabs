const { createClient } = require('redis');

// Support multiple environment configurations:
// - REDIS_URL (preferred): full connection string
// - Or REDIS_USERNAME, REDIS_PASSWORD, REDIS_HOST, REDIS_PORT, REDIS_TLS
const envUrl = process.env.REDIS_URL || process.env.REDIS_URI;

let clientOptions = {};

  const socket = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10)
  };
  if (String(process.env.REDIS_TLS || '').toLowerCase() === 'true') socket.tls = true;

  clientOptions = { socket };
  if (process.env.REDIS_USERNAME) clientOptions.username = process.env.REDIS_USERNAME;
  if (process.env.REDIS_PASSWORD) clientOptions.password = process.env.REDIS_PASSWORD;


const client = createClient(clientOptions);

client.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.warn('Redis Client Error', err && err.message ? err.message : err);
  if (err && String(err).toUpperCase().includes('NOAUTH')) {
    // eslint-disable-next-line no-console
    console.warn('Redis requires authentication. Provide REDIS_URL or REDIS_PASSWORD/REDIS_USERNAME env vars.');
  }
});

(async () => {
  try {
    await client.connect();
    // eslint-disable-next-line no-console
    console.info('Redis client connected');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Redis connect failed (continuing without cache):', e && e.message ? e.message : e);
  }
})();

module.exports = {
  client,
  get: async (key) => {
    if (!key) return null;
    try {
      return await client.get(key);
    } catch (e) {
      return null;
    }
  },
  set: async (key, value, ttlSeconds) => {
    if (!key) return;
    try {
      if (typeof ttlSeconds === 'number' && ttlSeconds > 0) {
        await client.set(key, value, { EX: ttlSeconds });
      } else {
        await client.set(key, value);
      }
    } catch (e) {
      // ignore write errors — cache is best-effort
    }
  }
};
