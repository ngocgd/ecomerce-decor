module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    // Main API Hosting
    {
      name: 'ECO',
      script: './server.js',
      env: {
      },
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      autorestart: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    }
  ]
};