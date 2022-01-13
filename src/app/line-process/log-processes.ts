type ProcessTypeColor = 'dark' | 'danger' | 'success' | 'primary' | 'info' | 'usual' | 'pickup' | 'secondary' | 'warning' | 'light' | 'adm' | 'dev' | 'dm' | 'tdm' | 'derby' | 'clothes';

export interface Process {
  translate: string;
  type: ProcessTypeColor;
  control: string;
}

const UnknownProcess: Process = {
  translate: 'Неизвестная команда',
  type: 'warning',
  control: 'UnknownProcess'
}
/* istambul ignore next */
const Processes = { // FIXME: convert all this stuff to enums ???
    '<connection/connect>': {
      translate: 'Соединение с сервером',
      type: 'dark',
      control: 'connect'
    },
    '<connection/deny/name_chars>': {
      translate: 'Недопустимые символы в нике',
      type: 'danger',
      control: 'connectDenyNameChars'
    },
    '<connection/deny/serial>': {
      translate: 'Блокировка входа по SS',
      type: 'danger',
      control: 'connectDenySerial'
    },
    '<connection/deny/name_length>': {
      translate: 'Недопустимое кол-во символов в нике',
      type: 'danger',
      control: 'connectDenyNameLength'
    },
    '<disconnect/time_out>': {
      translate: 'Выход с сервера после ожидания',
      type: 'dark',
      control: 'disconnectTimeout'
    },
    '<disconnect/leave>': {
      translate: 'Выход с сервера',
      type: 'dark',
      control: 'disconnect'
    },
    '<disconnect/kickban>': {
      translate: 'Кикбан',
      type: 'danger',
      control: 'disconnectKickBan'
    },
    '<auth/incorrect>': {
      translate: 'Неудачная аутентификация',
      type: 'danger',
      control: 'authIncorrect'
    },
    '<auth/correct/admin>': {
      translate: 'АДМИН: Успешная аутентификация',
      type: 'success',
      control: 'authCorrectAdm'
    },
    '<auth/correct/user>': {
      translate: 'ИГРОК: Успешная аутентификация',
      type: 'success',
      control: 'authCorrectUsr'
    },
    '<auth/correct/guest>': {
      translate: 'ГОСТЬ: Успешная аутентификация',
      type: 'success',
      control: 'authCorrectGue'
    },
    '<cmd/pre_process>': {
      translate: 'Препроцесс',
      type: 'primary',
      control: 'cmdPreproc'
    },
    '<cmd/pre_error/blocked>': {
      translate: 'Ошибка синтаксиса команды',
      type: 'danger',
      control: 'cmdPreerrBlock'
    },
    '<cmd/pre_error/syntax>': {
      translate: 'Ошибка синтаксиса команды',
      type: 'danger',
      control: 'cmdPreerrSynt'
    },
    '<cmd/pre_error/flood>': {
      translate: 'Флуд',
      type: 'danger',
      control: 'cmdPreerrFlood'
    },
    '<cmd/pre_error/not_found>': {
      translate: 'Команда не найдена',
      type: 'danger',
      control: 'cmdPreerrNotF'
    },
    '<cmd/pre_error/player>': {
      translate: '????',
      type: 'danger',
      control: 'cmdPreerrPlayer'
    },
    '<cmd/pre_error/preload>': {
      translate: 'Ввод команды до загрузки',
      type: 'danger',
      control: 'cmdPreerrPre'
    },
    '<cmd/pre_error/not_in_game>': {
      translate: 'Ввод команды до входа',
      type: 'danger',
      control: 'cmdPreerrNotInGame'
    },
    '<cmd/pre_error/not_spawn>': {
      translate: 'Ввод команды до спавна',
      type: 'danger',
      control: 'cmdPreerrNotSpawn'
    },
    '<cmd/pre_error/value>': {
      translate: 'Команда содержит ошибку значения',
      type: 'danger',
      control: 'cmdPreerrNotF'
    },
    '<cmd/success>': {
      translate: 'Успешное выполнение команды',
      type: 'success',
      control: 'cmdSuccess'
    },
    '<pause/start>': {
      translate: 'Вход в паузу',
      type: 'info',
      control: 'pauseStart'
    },
    '<pause/end>': {
      translate: 'Выход из паузы',
      type: 'info',
      control: 'pauseEnd'
    },
    '<weapon/buy>': {
      translate: 'Покупка оружия',
      type: 'usual',
      control: 'weapBuy'
    },
    '<weapon/pickup>': {
      translate: 'Подбор оружия',
      type: 'pickup',
      control: 'weapPick'
    },
    '<health/pickup>': {
      translate: 'Подбор здоровья',
      type: 'pickup',
      control: 'healthPick'
    },
    '<health/buy>': {
      translate: 'Покупка здоровья',
      type: 'usual',
      control: 'healthBuy'
    },
    '<armour/buy>': {
      translate: 'Покупка брони',
      type: 'usual',
      control: 'armBuy'
    },
    '<ammo/enter>': {
      translate: 'Вход в аммо',
      type: 'secondary',
      control: 'ammoEnt'
    },
    '<ammo/leave>': {
      translate: 'Выход из аммо',
      type: 'secondary',
      control: 'ammoLeav'
    },
    '<guard/block/on>': {
      translate: 'Блокировка',
      type: 'warning',
      control: 'guardBlockOn'
    },
    '<guard/block/off>': {
      translate: 'Отключение блокировки',
      type: 'warning',
      control: 'guardBlockOff'
    },
    '<rcon/login/true>': {
      translate: 'Успешный вход в RCON',
      type: 'success',
      control: 'rconLogTrue'
    },
    '<time_out/backup/save>': {
      translate: 'Сохраниение состояния',
      type: 'info',
      control: 'toBackupSave'
    },
    '<time_out/backup/load>': {
      translate: 'Загрузка бэкапа состояния',
      type: 'info',
      control: 'toBackupLoad'
    },
    '<chat/main>': {
      translate: 'Общий чат',
      type: 'light',
      control: 'chatMain'
    },
    '<chat/close>': {
      translate: 'Ближний чат',
      type: 'light',
      control: 'chatClose'
    },
    '<chat/team>': {
      translate: 'Командный чат',
      type: 'light',
      control: 'chatTeam'
    },
    '<chat/admin>': {
      translate: 'Админ чат',
      type: 'light',
      control: 'chatAdm'
    },
    '<chat/block/blocked>': {
      translate: 'Блокировка чата',
      type: 'warning',
      control: 'chatBlock'
    },
    '<chat/block/flood>': {
      translate: 'Блокировка чата: флуд',
      type: 'warning',
      control: 'chatBlockFlood'
    },
    '<chat/block/not_in_game>': {
      translate: 'Блокировка чата: не в игре',
      type: 'warning',
      control: 'chatBlockNin'
    },
    '<chat/block/repeated>': {
      translate: 'Блокировка чата: повторение',
      type: 'warning',
      control: 'chatBlockRep'
    },
    '<chat/block/domain>': {
      translate: 'Блокировка чата: ссылка',
      type: 'warning',
      control: 'chatBlockDomain'
    },
    '<chat/unmute/hand>': {
      translate: 'Ручная разблокировка чата',
      type: 'adm',
      control: 'chatHandUnBlock'
    },
    '<chat/mute/hand>': {
      translate: 'Ручная блокировка чата',
      type: 'info',
      control: 'chatHandBlock'
    },
    '<chat/mute/auto>': {
      translate: 'Автоматическая блокировка чата',
      type: 'info',
      control: 'chatAutoBlock'
    },
    '<spectate/leave>': {
      translate: 'Выход из наблюдения',
      type: 'adm',
      control: 'spectateLeave'
    },
    '<spectate/enter>': {
      translate: 'Вход в наблюдение',
      type: 'adm',
      control: 'spectateEnter'
    },
    '<spectate/bug/spawn>': {
      translate: 'BUG:Респавн в наблюдении',
      type: 'adm',
      control: 'spectateBugSpawn'
    },
    '<check/explosion/player>': {
      translate: 'Проверка взрывом',
      type: 'adm',
      control: 'checkExpl'
    },
    '<check/scroll/false>': {
      translate: 'Проверка автоскролла: FALSE',
      type: 'adm',
      control: 'checkScrollF'
    },
    '<check/scroll/true>': {
      translate: 'Проверка автоскролла: TRUE',
      type: 'adm',
      control: 'checkScrollT'
    },
    '<spectate/change>': {
      translate: 'Смена цели наблюдения',
      type: 'adm',
      control: 'spectateChange'
    },
    '<dev/weapon>': {
      translate: 'DEV: Оружие',
      type: 'dev',
      control: 'devWeap'
    },
    '<dev/click_map>': {
      translate: 'DEV: Телепорт к точке',
      type: 'dev',
      control: 'devClickMap'
    },
    '<dev/vehicle/add>': {
      translate: 'DEV: Спавн транспорта',
      type: 'dev',
      control: 'devVeh'
    },
    '<dev/vehicle/remove>': {
      translate: 'DEV: Удаление транспорта',
      type: 'dev',
      control: 'devVehRm'
    },
    '<dev/keylog>': {
      translate: 'DEV: Захват кодов клавиш',
      type: 'dev',
      control: 'devKeylog'
    },
    '<pickup/artifact>': {
      translate: 'PICKUP: Артефакт',
      type: 'pickup',
      control: 'pickArt'
    },
    '<death_match/leave>': {
      translate: 'Выход из DM',
      type: 'dm',
      control: 'dmLeave'
    },
    '<death_match/restore>': {
      translate: 'Восстановление DM',
      type: 'dm',
      control: 'dmRestore'
    },
    '<death_match/kick>': {
      translate: 'Кик с DM',
      type: 'dm',
      control: 'dmKick'
    },
    '<death_match/enter>': {
      translate: 'Вход в DM',
      type: 'dm',
      control: 'dmEnter'
    },
    '<death_match/create>': {
      translate: 'Создание DM',
      type: 'dm',
      control: 'dmCreate'
    },
    '<death_match/owner>': {
      translate: 'Владение DM',
      type: 'dm',
      control: 'dmOwn'
    },
    '<team_death_match/enter>': {
      translate: 'Вход в TDM',
      type: 'tdm',
      control: 'tdmEnter'
    },
    '<team_death_match/leave>': {
      translate: 'Выход из TDM',
      type: 'tdm',
      control: 'tdmLeave'
    },
    '<team_death_match/create>': {
      translate: 'Создание TDM',
      type: 'tdm',
      control: 'tdmCreate'
    },
    '<derby/leave>': {
      translate: 'Выход с дерби',
      type: 'derby',
      control: 'derbyLeave'
    },
    '<derby/enter>': {
      translate: 'Вход на дерби',
      type: 'derby',
      control: 'derbyEnter'
    },
    '<spectate/derby/bug/spawn>': {
      translate: 'BUG:Респавн в наблюдении за дерби',
      type: 'adm',
      control: 'spectateDerbyBugSpawn'
    },
    '<spectate/derby/enter>': {
      translate: 'Наблюдение за дерби',
      type: 'adm',
      control: 'spectateDerbyEnter'
    },
    '<spectate/derby/change>': {
      translate: 'Смена цели наблюдения на дерби',
      type: 'adm',
      control: 'spectateDerbyChange'
    },
    '<shop/enter>': {
      translate: 'Вход в Магазин одежды',
      type: 'clothes',
      control: 'clotEnter'
    },
    '<cn/request>': {
      translate: 'Запрос CN',
      type: 'info',
      control: 'сnReq'
    },
    '<cn/response/success>': {
      translate: 'CN RES',
      type: 'success',
      control: 'CnResSuccess'
    },
    '<cn/response/not_found>': {
      translate: 'CN не найден',
      type: 'danger',
      control: 'сnResNotFound'
    },
    '<unban/cn/auto>': {
      translate: 'Авторазбан CN',
      type: 'info',
      control: 'unbanCnAuto'
    },
}

export const getProcessTranslation = (processname: keyof typeof Processes): Process => {
  if (!Processes[processname as string]) return UnknownProcess;
  return Processes[processname as string];
}

export default Processes;
