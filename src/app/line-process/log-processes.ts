export class Processes {
  readonly sched2 = [
    {
      process: '<connection/connect>',
      translate: 'Соединение с сервером',
      type: 'dark',
      control: 'connect'
    },
    {
      process: '<disconnect/time_out>',
      translate: 'Выход с сервера после ожидания',
      type: 'dark',
      control: 'disconnectTimeout'
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
      process: '<cmd/pre_error/player>',
      translate: 'Команда не найдена',
      type: 'danger',
      control: 'cmdPreerrNotF'
    },
    {
      process: '<cmd/pre_error/preload>',
      translate: 'Ввод команды до загрузки',
      type: 'danger',
      control: 'cmdPreerrPre'
    },
    {
      process: '<cmd/pre_error/not_in_game>',
      translate: 'Ввод команды до входа',
      type: 'danger',
      control: 'cmdPreerrNotInGame'
    },
    {
      process: '<cmd/pre_error/value>',
      translate: 'Команда содержит ошибку значения',
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
      type: 'usual',
      control: 'weapBuy'
    },
    {
      process: '<weapon/pickup>',
      translate: 'Подбор оружия',
      type: 'usual',
      control: 'weapPick'
    },
    {
      process: '<armour/buy>',
      translate: 'Покупка брони',
      type: 'usual',
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
      process: '<time_out/backup/load>',
      translate: 'Загрузка бэкапа состояния',
      type: 'info',
      control: 'toBackupLoad'
    },
    {
      process: '<chat/main>',
      translate: 'Общий чат',
      type: 'light',
      control: 'chatMain'
    },
    {
      process: '<chat/block/blocked>',
      translate: 'Блокировка чата',
      type: 'warning',
      control: 'chatBlock'
    },
    {
      process: '<chat/unmute/hand>',
      translate: 'Ручная разблокировка чата',
      type: 'adm',
      control: 'chatHandUnBlock'
    },
    {
      process: '<chat/mute/hand>',
      translate: 'Ручная блокировка чата',
      type: 'info',
      control: 'chatHandBlock'
    },
    {
      process: '<spectate/leave>',
      translate: 'Выход из наблюдения',
      type: 'adm',
      control: 'spectateLeave'
    },
    {
      process: '<check/explosion/player>',
      translate: 'Проверка взрывом',
      type: 'adm',
      control: 'checkExpl'
    },
    {
      process: '<check/scroll/false>',
      translate: 'Проверка автоскролла: FALSE',
      type: 'adm',
      control: 'checkScroll'
    },
    {
      process: '<check/scroll/true>',
      translate: 'Проверка автоскролла: TRUE',
      type: 'adm',
      control: 'checkScroll'
    },
    {
      process: '<spectate/change>',
      translate: 'Смена цели наблюдения',
      type: 'adm',
      control: 'spectateChange'
    },
    {
      process: '<dev/weapon>',
      translate: 'DEV: Оружие',
      type: 'dev',
      control: 'devWeap'
    },
    {
      process: '<dev/click_map>',
      translate: 'DEV: Телепорт к точке',
      type: 'dev',
      control: 'devClickMap'
    },
    {
      process: '<dev/vehicle/add>',
      translate: 'DEV: Спавн транспорта',
      type: 'dev',
      control: 'devVeh'
    },
    {
      process: '<pickup/artifact>',
      translate: 'PICKUP: Артефакт',
      type: 'pickup',
      control: 'pickArt'
    },
    {
      process: '<death_match/leave>',
      translate: 'Выход из DM',
      type: 'dm',
      control: 'dmLeave'
    },
    {
      process: '<death_match/enter>',
      translate: 'Вход в DM',
      type: 'dm',
      control: 'dmEnter'
    },
    {
      process: '<death_match/create>',
      translate: 'Создание DM',
      type: 'dm',
      control: 'dmCreate'
    },
    {
      process: '<team_death_match/enter>',
      translate: 'Вход в TDM',
      type: 'tdm',
      control: 'tdmEnter'
    },
    {
      process: '<team_death_match/leave>',
      translate: 'Выход из TDM',
      type: 'tdm',
      control: 'tdmLeave'
    },
    {
      process: '<team_death_match/create>',
      translate: 'Создание TDM',
      type: 'tdm',
      control: 'tdmCreate'
    },
    {
      process: '<clothes_shop/enter>',
      translate: 'Вход в Магазин одежды',
      type: 'clothes',
      control: 'clotEnter'
    },
    {
      process: '<clothes_shop/enter>',
      translate: 'Вход в Магазин одежды',
      type: 'clothes',
      control: 'clotEnter'
    }
  ];
}
