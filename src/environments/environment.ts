export const AppConfig = {
  production: false,
  environment: 'LOCAL',
  links: {
    forum: 'https://gta-liberty.ru/index.php'
  },
  api: { // Dev server
    ws: 'ws://instr.gta-liberty.ru/v2/ws',
    main: 'http://instr.gta-liberty.ru/v2/',
    auth: 'http://instr.gta-liberty.ru/v2/login',
    user: 'http://instr.gta-liberty.ru/v2/login/user',
    validation: 'http://instr.gta-liberty.ru/v2/login/check-token'
  }
};
