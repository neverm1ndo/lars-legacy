export class Processes {
  readonly sched2 = [
    {
      process: '<connection/connect>',
      translate: 'Соединение с сервером',
      type: 'dark',
      control: 'connect'
    },
    {
      process: '<disconnect/leave>',
      translate: 'Выход с сервера',
      type: 'dark',
      control: 'disconnect'
    },
    {
      process: '<auth/incorrect>',
      translate: 'Неудачная аутентификация',
      type: 'danger',
      control: 'authIncorrect'
    },
    {
      process: '<auth/correct/admin>',
      translate: 'АДМИН: Успешная аутентификация',
      type: 'success',
      control: 'authCorrectAdm'
    },
    {
      process: '<auth/correct/guest>',
      translate: 'ГОСТЬ: Успешная аутентификация',
      type: 'success',
      control: 'authCorrectGue'
    },
    {
      process: '<cmd/pre_process>',
      translate: 'Препроцесс',
      type: 'primary',
      control: 'cmdPreproc'
    },
    {
      process: '<cmd/pre_error/blocked>',
      translate: 'Ошибка синтаксиса команды',
      type: 'danger',
      control: 'cmdPreerrBlock'
    },
    {
      process: '<cmd/pre_error/not_found>',
      translate: 'Команда не найдена',
      type: 'danger',
      control: 'cmdPreerrNotF'
    },
    {
      process: '<cmd/success>',
      translate: 'Успешное выполнение команды',
      type: 'success',
      control: 'cmdSuccess'
    },
    {
      process: '<pause/start>',
      translate: 'Вход в паузу',
      type: 'info',
      control: 'pauseStart'
    },
    {
      process: '<pause/end>',
      translate: 'Выход из паузы',
      type: 'info',
      control: 'pauseEnd'
    },
    {
      process: '<weapon/buy>',
      translate: 'Покупка оружия',
      type: 'info',
      control: 'weapBuy'
    },
    {
      process: '<weapon/pickup>',
      translate: 'Подбор оружия',
      type: 'info',
      control: 'weapPick'
    },
    {
      process: '<armour/buy>',
      translate: 'Покупка брони',
      type: 'info',
      control: 'armBuy'
    },
    {
      process: '<ammo/enter>',
      translate: 'Вход в аммо',
      type: 'secondary',
      control: 'ammoEnt'
    },
    {
      process: '<ammo/leave>',
      translate: 'Выход из аммо',
      type: 'secondary',
      control: 'ammoLeav'
    },
    {
      process: '<guard/block/on>',
      translate: 'Блокировка',
      type: 'warning',
      control: 'guardBlockOn'
    },
    {
      process: '<guard/block/off>',
      translate: 'Отключение блокировки',
      type: 'warning',
      control: 'guardBlockOff'
    },
    {
      process: '<rcon/login/true>',
      translate: 'Успешный вход в RCON',
      type: 'success',
      control: 'rconLogTrue'
    },
    {
      process: '<time_out/backup/save>',
      translate: 'Сохраниение состояния',
      type: 'info',
      control: 'toBackupSave'
    },
    {
      process: '<chat/main>',
      translate: 'Общий чат',
      type: 'light',
      control: 'chatMain'
    }
  ];
}
