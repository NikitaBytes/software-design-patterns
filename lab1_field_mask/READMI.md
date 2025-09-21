# Лабораторная работа №1

## Тема

**Field Mask (маски полей)**

---

## Студент

- **Имя и фамилия:** Савка Никита (Savca Nichita)
- **Группа:** I2302
- **Платформа разработки:** macOS (Apple M3), Node.js/TypeScript
- **Дата выполнения:** 20 сентября 2025

---

## Цель и постановка задачи

**Цель:**  
Освоить концепт field mask выборочную работу с полями доменной модели, а также закрепить принципы инкапсуляции и построения простых абстракций поверх абстракций.

**Задачи по условию:**

1. Создать domain model с ≥5 полями (int, string, float, enum).
2. Реализовать абстракцию «БД» (in-memory массив).
3. Создать маску полей на bool-флагах.
4. Добавить метод поиска по одному полю (например, FindByName).
5. Реализовать статическую функцию печати по маске.
6. Протестировать программу.

**Дополнительные задания (минимум 3 по выбору):**

- JSON REST (ASP.NET Core) c возвратом частичных объектов
- merge по маске
- копирование полей по двум маскам
- unit-tests на фреймворке
- битовая маска
- 3 метода работы с масками (комбинирование и т. п.)

---

## Краткое описание решения

Реализация на TypeScript:

- **Enum StudentStatus** — статусы: Active, Inactive, Graduated, Expelled.
- **Domain model Student** — поля:
  - `id: number`
  - `name: string`
  - `gpa: number`
  - `age: number`
  - `status: StudentStatus`
- **Маска полей FieldMask** — bool-флаги для каждого поля.
- **Битовая маска BitFieldMask** — хранение флагов в одном числе, операции union, intersect, invert.
- **In-memory “БД” StudentDatabase** — хранение массива студентов, методы: add, getAll, findByName.
- **mergeByMask(mask)** — объединение записей по маске (gpa — среднее).
- **copyFieldsByMask(compareMask, source, copyMask)** — копирование выбранных полей из source в записи, равные source по compareMask.
- **Печать по маске:** `StudentPrinter.printWithMask(student, mask)`
- **JSON-представление по маске:** `studentToJSON(student, mask)`
- **Операции над масками:** unionMasks, intersectMasks, invertMask.
- **Тесты:** функция `runTests()` (8 кейсов: поиск, маски, merge/copy, JSON, операции).
- **Демонстрация main():** добавление данных, поиск, печать, JSON, битовые маски, слияние.

---

## Структура решения

```
field-mask-lab/
├─ package.json
├─ tsconfig.json
├─ README.md
├─ src/
│  ├─ enums/
│  │  └─ StudentStatus.ts          # enum StudentStatus
│  ├─ domain/
│  │  └─ Student.ts                # domain model Student (id, name, gpa, age, status)
│  ├─ masks/
│  │  ├─ FieldMask.ts              # булевая маска полей
│  │  └─ BitFieldMask.ts           # битовая маска (union/intersect/invert, сеттеры)
│  ├─ database/
│  │  └─ StudentDatabase.ts        # in-memory «БД»: add, getAll, findByName, mergeByMask, copyFieldsByMask
│  ├─ utils/
│  │  ├─ StudentPrinter.ts         # статическая печать по маске
│  │  ├─ studentToJSON.ts          # преобразование студента в частичный JSON по маске
│  │  └─ maskOps.ts                # unionMasks, intersectMasks, invertMask (булевые маски)
│  ├─ tests-runtime/
│  │  └─ runTests.ts               # твой текущий самописный assert + сценарии тестов
│  │  └─ student.test.ts           # тесты на domain model, маски, JSON, БД, операции
│  │
│  └─ index.ts                     # демонстрация: наполнение БД, поиск, печать, JSON, битовые маски, merge
```

---

## Ключевые компоненты и логика

### 1. Domain Model

- **Student** — 5 полей разных типов (number как int/float, string, enum).

### 2. Маски полей

- **FieldMask** — bool-маска для каждого поля.
- **BitFieldMask** — компактная битовая маска, поддержка union/intersect/invert.
  - Можно добавить сеттеры для всех полей для симметрии.

### 3. In-Memory «БД»

- **StudentDatabase:**
  - `add(student)`
  - `getAll()`
  - `findByName(name)`
  - `mergeByMask(mask)` — группировка и слияние по маске (gpa — среднее, остальные — из базовой записи).
  - `copyFieldsByMask(compareMask, source, copyMask)` — копирование выбранных полей.

### 4. Вывод и сериализация

- **StudentPrinter.printWithMask** — печать выбранных полей.
- **studentToJSON** — частичный JSON по маске.

### 5. Операции над масками

- **unionMasks, intersectMasks, invertMask** — три основных операции.

---

## Демонстрация работы (main)

1. Добавление 5 студентов (дубли по именам «Алексей», «Елена»).
2. Поиск `findByName("Елена")` — 2 записи.
3. Печать с маской (ID, Name, GPA) — вывод только этих полей.
4. JSON по маске (ID, Name, Status) — частичный объект.
5. Битовые маски — включение, инверсия, union.
6. Слияние по маске (по имени): 5 записей → 3 (Алексей и Елена слиты, Дмитрий без изменений).

---

## Тестирование

**Функция runTests() — 8 тестов:**

1. Добавление и получение всех — размер массива.
2. findByName — поиск дубликатов.
3. FieldMask — проверка флагов.
4. BitFieldMask — включение и инверсия.
5. mergeByMask — уменьшение числа записей.
6. copyFieldsByMask — копирование отмеченных полей.
7. studentToJSON — только поля из маски.
8. Операции над масками — union, intersect, invert.

---

## Соответствие заданию

- **Обязательная часть:** выполнена полностью.
- **Дополнительные пункты (≥3):** выполнено 4 из 6:
  - merge по маске — ✅
  - копирование по маске — ✅
  - битовая маска — ✅
  - 3 операции над масками — ✅
  - (REST ASP.NET Core — не делался, тест-фреймворк — самописный assert)

---

## Пример запуска

Учебный файл можно запустить через ts-node:

```bash
npm i -D ts-node typescript
npx ts-node index.ts
```

Скрипт сначала выполнит тесты (`runTests()`), затем продемонстрирует работу (`main()`).

> Для модульной структуры:
>
> - Добавить `tsconfig.json` со `strict: true`
> - Точка входа: `src/index.ts`
>
> ```bash
> npm run start      # или npx ts-node src/index.ts
> npx jest
> ```

---

## Выводы

1. Реализована учебная система Field Mask на TypeScript: доменная модель, две разновидности масок, in-memory репозиторий, операции поиска/слияния/копирования, печать и частичная сериализация.
2. Обязательная часть выполнена полностью; из дополнительных — реализовано 4 пункта из 6.
3. Решение демонстрирует инкапсуляцию, работу с доменной моделью и построение абстракций поверх простых (маски → операции → действия над коллекцией).
4. Код легко масштабируется при разнесении по файлам и подключении тестового фреймворка; это база для REST-слоя с выборочной выдачей полей.
