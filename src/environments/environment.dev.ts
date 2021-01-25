export const AppConfig = {
  production: false,
  environment: 'DEV',
  links: {
    forum: 'https://gta-liberty.ru/index.php'
  },
  api: { // Dev server
    main: 'http://localhost:8080/v2/',
    auth: 'http://instr.gta-liberty.ru/v2/login',
    user: 'http://instr.gta-liberty.ru/v2/login/user'
  }
};
