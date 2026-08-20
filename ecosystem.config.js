module.exports = {
  apps: [
    {
      name: "lcm-auth",

      script: "./dist/services/auth-service/index.js",

      exec_mode: "fork",
      instances: 1,


      env: {
        NODE_ENV: "production"
      },

      autorestart: true,
      watch: false,

      max_memory_restart: "500M",

      error_file: "./logs/auth-error.log",
      out_file: "./logs/auth-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",

      restart_delay: 3000,

      max_restarts: 10,
      wait_ready: false
    }
  ]
};