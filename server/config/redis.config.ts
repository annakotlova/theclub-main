export const getRedisURI = () => `redis://` + process.env.REDIS_HOST + ':' + process.env.REDIS_PORT;
