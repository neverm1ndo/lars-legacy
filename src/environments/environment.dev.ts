export const AppConfig = {
  production: false,
  environment: 'DEV',
  links: {
    forum: 'https://gta-liberty.ru/index.php'
  },
  api: {
    ws: 'wss://instr.gta-liberty.ru/',
    main: 'https://instr.gta-liberty.ru/v2/',
    auth: 'https://instr.gta-liberty.ru/v2/login',
    user: 'https://instr.gta-liberty.ru/v2/login/user',
    validation: 'https://instr.gta-liberty.ru/v2/login/check-token'
  }
};
