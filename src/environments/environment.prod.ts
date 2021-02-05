export const AppConfig = {
  production: true,
  environment: 'PROD',
  links: {
    forum: 'https://gta-liberty.ru/index.php'
  },
  api: { // Dev server
    main: 'http://instr.gta-liberty.ru/v2/',
    auth: 'http://instr.gta-liberty.ru/v2/login',
    user: 'http://instr.gta-liberty.ru/v2/login/user',
    validation: 'http://instr.gta-liberty.ru/v2/login/check-token'
  }
};
