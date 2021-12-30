type ProcessTypeColor = 'dark' | 'danger' | 'success' | 'primary' | 'info' | 'usual' | 'pickup' | 'secondary' | 'warning' | 'light' | 'adm' | 'dev' | 'dm' | 'tdm' | 'derby' | 'clothes';

export interface Process {
  process: string;
  translate: string;
  type: ProcessTypeColor;
  control: string;
}

export class Processes { // FIXME: convert all this stuff to enums
  /* istambul ignore next */
  readonly sched2: Process[] = [
    {
      process: '<connection/connect>',
      translate: 'Соединение с сервером',
      type: 'dark',
      control: 'connect'
    },
    {
      process: '<connection/deny/name_chars>',
      translate: 'Недопустимые символы в нике',
      type: 'danger',
      control: 'connectDenyNameChars'
    },
    {
      process: '<connection/deny/name_length>',
      translate: 'Недопустимое кол-во символов в нике',
      type: 'danger',
      control: 'connectDenyNameLength'
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
      process: '<disconnect/kickban>',
      translate: 'Кикбан',
      type: 'danger',
      control: 'disconnectKickBan'
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
      process: '<auth/correct/user>',
      translate: 'ИГРОК: Успешная аутентификация',
      type: 'success',
      control: 'authCorrectUsr'
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
      process: '<cmd/pre_error/syntax>',
      translate: 'Ошибка синтаксиса команды',
      type: 'danger',
      control: 'cmdPreerrSynt'
    },
    {
      process: '<cmd/pre_error/flood>',
      translate: 'Флуд',
      type: 'danger',
      control: 'cmdPreerrFlood'
    },
    {
      process: '<cmd/pre_error/not_found>',
      translate: 'Команда не найдена',
      type: 'danger',
      control: 'cmdPreerrNotF'
    },
    {
      process: '<cmd/pre_error/player>',
      translate: '????',
      type: 'danger',
      control: 'cmdPreerrPlayer'
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
      type: 'pickup',
      control: 'weapPick'
    },
    {
      process: '<health/pickup>',
      translate: 'Подбор здоровья',
      type: 'pickup',
      control: 'healthPick'
    },
    {
      process: '<health/buy>',
      translate: 'Покупка здоровья',
      type: 'usual',
      control: 'healthBuy'
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
      process: '<chat/close>',
      translate: 'Ближний чат',
      type: 'light',
      control: 'chatClose'
    },
    {
      process: '<chat/team>',
      translate: 'Командный чат',
      type: 'light',
      control: 'chatTeam'
    },
    {
      process: '<chat/admin>',
      translate: 'Админ чат',
      type: 'light',
      control: 'chatAdm'
    },
    {
      process: '<chat/block/blocked>',
      translate: 'Блокировка чата',
      type: 'warning',
      control: 'chatBlock'
    },
    {
      process: '<chat/block/flood>',
      translate: 'Блокировка чата: флуд',
      type: 'warning',
      control: 'chatBlockFlood'
    },
    {
      process: '<chat/block/not_in_game>',
      translate: 'Блокировка чата: не в игре',
      type: 'warning',
      control: 'chatBlockNin'
    },
    {
      process: '<chat/block/repeated>',
      translate: 'Блокировка чата: повторение',
      type: 'warning',
      control: 'chatBlockRep'
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
      process: '<spectate/enter>',
      translate: 'Вход в наблюдение',
      type: 'adm',
      control: 'spectateEnter'
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
      control: 'checkScrollF'
    },
    {
      process: '<check/scroll/true>',
      translate: 'Проверка автоскролла: TRUE',
      type: 'adm',
      control: 'checkScrollT'
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
      process: '<dev/vehicle/remove>',
      translate: 'DEV: Удаление транспорта',
      type: 'dev',
      control: 'devVehRm'
    },
    {
      process: '<dev/keylog>',
      translate: 'DEV: Захват кодов клавиш',
      type: 'dev',
      control: 'devKeylog'
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
      process: '<death_match/restore>',
      translate: 'Восстановление DM',
      type: 'dm',
      control: 'dmRestore'
    },
    {
      process: '<death_match/kick>',
      translate: 'Кик с DM',
      type: 'dm',
      control: 'dmKick'
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
      process: '<death_match/owner>',
      translate: 'Владение DM',
      type: 'dm',
      control: 'dmOwn'
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
      process: '<derby/leave>',
      translate: 'Выход с дерби',
      type: 'derby',
      control: 'derbyLeave'
    },
    {
      process: '<derby/enter>',
      translate: 'Вход на дерби',
      type: 'derby',
      control: 'derbyEnter'
    },
    {
      process: '<spectate/derby/bug/spawn>',
      translate: 'Спавн багги из наблюдения',
      type: 'adm',
      control: 'spectateDerbyBugSpawn'
    },
    {
      process: '<spectate/derby/enter>',
      translate: 'Наблюдение за дерби',
      type: 'adm',
      control: 'spectateDerbyEnter'
    },
    {
      process: '<spectate/derby/enter>',
      translate: 'Наблюдение за дерби',
      type: 'adm',
      control: 'spectateDerbyEnter'
    },
    {
      process: '<spectate/derby/change>',
      translate: 'Смена цели наблюдения на дерби',
      type: 'adm',
      control: 'spectateDerbyChange'
    },
    {
      process: '<clothes_shop/enter>',
      translate: 'Вход в Магазин одежды',
      type: 'clothes',
      control: 'clotEnter'
    },
    {
      process: '<player/cn/get>',
      translate: 'CN GET',
      type: 'info',
      control: 'playerCnGet'
    },
    {
      process: '<player/cn/response>',
      translate: 'CN RES',
      type: 'info',
      control: 'playerCnRes'
    },
  ];
}
