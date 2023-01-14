export const AppConfig = {
  production: true,
  environment: 'PROD',
  links: {
    resource: 'https://www.gta-liberty.ru/',
    server_monitor: 'https://apps.nmnd.ru/api/samp'
  },
  api: {
    socket: 'wss://svr.gta-liberty.ru/',
    main: 'https://svr.gta-liberty.ru/v2/lars/',
    auth: 'https://svr.gta-liberty.ru/v2/auth/',
    user: 'https://svr.gta-liberty.ru/v2/auth/user',
    validation: 'https://svr.gta-liberty.ru/v2/login/check-token'
  }
};
