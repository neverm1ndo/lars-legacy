export const AppConfig = {
  production: false,
  environment: 'DEV',
  links: {
    resource: 'https://www.gta-liberty.ru/',
    server_monitor: 'https://apps.nmnd.ru/api/samp'
  },
  api: {
    socket: 'wss://localhost:8443/',
    main: 'https://localhost:8443/v2/',
    auth: 'https://localhost:8443/v2/auth/login',
    user: 'https://localhost:8443/v2/login/user',
    validation: 'https://localhost:8443/v2/login/check-token'
  }
};
