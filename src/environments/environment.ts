export const AppConfig = {
  production: false,
  environment: 'DEV',
  links: {
    forum: 'https://gta-liberty.ru/index.php'
  },
  api: {
    socket: 'wss://localhost:8443/',
    main: 'https://localhost:8443/v2/',
    auth: 'https://localhost:8443/v2/login',
    user: 'https://localhost:8443/v2/login/user',
    validation: 'https://localhost:8443/v2/login/check-token'
  }
};
