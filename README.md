
# ![logo](https://nmnd.ru/assets/lbg-lars2.png) LARS
**LARS** - программа для чтения логов сервера, записи и изменения конфигурационных файлов игрового сервера.


## Рабочий процесс
Далее будут описаны основные моменты, связанные с работой клиента для конечного пользователя.  
### Поисковые запросы
Нужные строки в логах можно искать с помощью происковых запросов, которые могут состоять из сегментов с префиксами, указывающими на тип запроса. Запрос должен состоять не менее, чем из 3-х символов.
По умолчанию  любое значение, введенное в поисковую строку, будет рассчитываться как поиск по никнейму.
Например ввод `hidden` запустит поиск по никнейму **hidden**.

Разрешается осуществлять поиск сразу по нескольким никам. Для этого нужно вводить никнеймы через `&`.
Ввод `nmnd&neverm1ndo` запустит поиск по никнеймам **nmnd** и **neverm1ndo**.
#### Префиксы
Для особых запросов существуют специальные префиксы, которые укажут на тип запроса. Ниже приведена таблица с возможными префиксами и их комбинациями.
|  **Префикс**|**Описание** |**Пример** |
|--|--|--|
| nickname: | Специальный префикс для поиска по нику.  | nickname:neverm1ndo
|nn:|Алиас для nickname:|nn:neverm1ndo|
|ip:| Префикс для поиска по IP|ip:127.0.0.1|
|serial:|Префикс для поиска по связке серийных номеров| serial:12345*FBDFCFVJGBGYCDHFHVVFGCHVBFKV
|srl:|Алиас для serial:|srl:12345*FBDFCFVJGBGYCDHFHVVFGCHVBFKV

Мультипоиск с префиксами производится аналогично с рядовым поиском по никнеймам, т.е через `&`.

## Комбинации клавиш
Для удобства были добавлены комбинации клавиш для редактора конфигов и загрузчика карт.
#### Редактор конфигурационных файлов
Редактор использует [CodeMirror](https://codemirror.net/) c кастомными аддонами.
| Комбинация | Действие |
|--|--|
| `Ctrl+S` | Сохранить изменения |
| `Ctrl+F` | Поиск в текущем буфере |
| `Ctrl+D` | Удалить строку |
| `Ctrl+Z` | Отменить |
| `Ctrl+Y` | Повторить |
| `Ctrl+{` | Сместить отступ влево |
| `Ctrl+}` | Сместить отступ вправо |
| `Shift+Tab` | Автоматические отступы |
| `Ctrl+Space` | Автозаполнение и подсказки |
| `Shift+Del` | Удалить файл с сервера |

#### Редактор карт
| Комбинация | Действие |
|--|--|
| `Ctrl+S` | Загрузить карту с сервера на локальный диск |
| `Alt+X` | Удалить выбранную карту |
