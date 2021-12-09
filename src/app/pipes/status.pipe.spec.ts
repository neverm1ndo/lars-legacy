import { StatusPipe } from './status.pipe';

describe('StatusPipe', () => {
  it('create an instance', () => {
    const pipe = new StatusPipe();
    expect(pipe).toBeTruthy();
  });
  it('should transform status into the readable form', () => {
    const pipe = new StatusPipe();
    expect(pipe.transform('rebooting')).toBe('Перезагружается');
    expect(pipe.transform('live')).toBe('Запущен');
    expect(pipe.transform('stoped')).toBe('Остановлен');
    expect(pipe.transform('loading')).toBe('Загружается');
    expect(pipe.transform('error')).toBe('Ошибка сервера');
  });
});
