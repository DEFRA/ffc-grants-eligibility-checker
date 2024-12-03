// istanbul ignore file
import { schema } from './cache-schema.js';

const config = {
  useRedis: process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development',
  expiresIn: process.env.SESSION_CACHE_TTL,
  catboxOptions: {
    host: process.env.REDIS_HOSTNAME,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    partition: process.env.REDIS_PARTITION,
    tls: process.env.NODE_ENV === 'production' ? {} : undefined
  }
};

// Validate config
const result = schema.validate(config, {
  abortEarly: false
});

// Throw if config is invalid
if (result.error) {
  throw new Error(`The cache config is invalid. ${result.error.message}`);
}

const value = result.value;
export { value as cacheConfig };
