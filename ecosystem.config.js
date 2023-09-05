module.exports = {
  apps: [
    {
      name: 'secret',
      script: './server/dist/app.js',
      env_production: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
      },
      instances: 'max',
      exec_mode: 'cluster',
    },
  ],
};
