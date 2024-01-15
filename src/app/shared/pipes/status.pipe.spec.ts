import { StatusPipe } from "./status.pipe";

describe("StatusPipe", () => {
  it("create an instance", () => {
    const pipe = new StatusPipe();
    expect(pipe).toBeTruthy();
  });

  it("should transform status into the readable form", () => {
    const pipe = new StatusPipe();
    expect(pipe.transform(2)).toBe("Перезагружается");
    expect(pipe.transform(3)).toBe("Запущен");
    expect(pipe.transform(1)).toBe("Остановлен");
    expect(pipe.transform(4)).toBe("Загружается");
    expect(pipe.transform(0)).toBe("Ошибка сервера");
  });
});
