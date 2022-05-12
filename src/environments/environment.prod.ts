export const AppConfig = {
  production: true,
  environment: 'PROD',
  links: {
    resource: 'https://gta-liberty.ru/',
    server_monitor: 'https://apps.nmnd.ru/api/samp'
  },
  api: { // Dev server
    socket: 'wss://svr.gta-liberty.ru/',
    main: 'https://svr.gta-liberty.ru/v2/',
    auth: 'https://svr.gta-liberty.ru/v2/login',
    user: 'https://svr.gta-liberty.ru/v2/login/user',
    validation: 'https://svr.gta-liberty.ru/v2/login/check-token'
  }
};
