export const AppConfig = {
  production: false,
  environment: 'DEV',
  links: {
    forum: 'https://gta-liberty.ru/forum'
  },
  api: { // Dev server
    main: 'http://localhost:8080/api/',
    auth: 'http://instr.gta-liberty.ru/login',
    user: 'http://instr.gta-liberty.ru/user',
  }
};
