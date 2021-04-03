export const AppConfig = {
  production: false,
  environment: 'LOCAL',
  links: {
    forum: 'https://gta-liberty.ru/index.php'
  },
  api: { // Dev server
    ws: 'wss://localhost:8443/',
    main: 'https://localhost:8443/v2/',
    auth: 'https://instr.gta-liberty.ru/v2/login',
    user: 'https://instr.gta-liberty.ru/v2/login/user',
    validation: 'https://instr.gta-liberty.ru/v2/login/check-token'
  }
};
