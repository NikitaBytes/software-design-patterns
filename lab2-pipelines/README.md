# Лабораторная работа №2 — Pipelines

## Тема

**Pipelines (конвейер шагов)** — реализация паттерна «конвейер» на TypeScript с декораторами, интроспекцией и высокоуровневыми операциями над шагами.

---

## Студент

- **Имя и фамилия:** Савка Никита (Savca Nichita)
- **Группа:** I2302
- **Платформа разработки:** macOS (Apple M3), Node.js / TypeScript
- **Дата выполнения:** 3 октября 2025

---

## Цель и постановка задачи

**Цель:** освоить архитектуру pipeline и продемонстрировать поведенческие паттерны: абстракция шагов, адаптер/стратегия, декоратор, интроспекция, chain of responsibility и операции конфигурации конвейера.

**Требования (выполнены):**

1. Создать pipeline по выбранной тематике.
2. Сконфигурировать и продемонстрировать pipeline в `src/main.ts`.
3. Реализовать минимум 4 дополнительных задания (generics, 2 контекста, интроспекция, декораторы, singleton для stateless шагов, unit-tests и т.д.).

---

## Краткое описание решения

- Универсальное ядро: `Pipeline<TContext>`, `IPipelineStep<TContext>`.
- Лёгкие шаги: `FunctionStep<T>` — обёртка над функцией-стратегией.
- Декораторы: `WrapStep`, `LogStep` для добавления поведения «до/после».
- Интроспекция: `printPipeline(steps)` и метод описания шага.
- High-level операции: `replaceFirst`, `replaceAll`, `wrapAll`, `moveTo`.
- Chain of responsibility: прерывание выполнения по `ctx.isDone`.
- Два доменных адаптера: `postAdapter` и `seminarAdapter`.
- Singleton для stateless шага печати поста.
- Unit-тесты на Vitest (`test/pipeline.spec.ts`).

---

## Структура проекта (важные файлы)

lab2-pipelines/

- src/
  - core/
    - types.ts — интерфейсы шагов и вспомогательные типы
    - pipeline.ts — реализация Pipeline<T>
    - steps.ts — FunctionStep
    - decorators.ts — WrapStep, LogStep
    - introspection.ts — printPipeline
  - adapters/
    - postAdapter.ts — шаги для PostContext, PRINT_POST_SINGLETON
    - seminarAdapter.ts — шаги для SeminarContext
  - contexts/
    - post.ts — PostContext
    - seminar.ts — SeminarContext
  - main.ts — демонстрации (post и seminar)
- test/
  - pipeline.spec.ts — Vitest тесты

---

## Ключевые компоненты и поведение

- IPipelineStep<T> — единый контракт: step.name и step.execute(ctx).
- Pipeline.execute(ctx) — выполняет шаги по порядку, прекращает при ctx.isDone.
- FunctionStep — компактный способ инкапсулировать доменную логику.
- LogStep — декоратор, логирует состояние до и после выполнения шага в ctx.log.
- High-level методы позволяют изменить конфигурацию пайплайна как данных (перестановка, замена, обёртка).

---

## Демонстрация в main.ts

1. Post pipeline:

   - Начальный контекст: Post{title="ZNAPSTER launch", author=undefined}.
   - Шаги: StopIfDraft, ChangeAuthor("Nikita"), ChangeTitle(...), PRINT_POST_SINGLETON, PrintAuthors.
   - Операции: wrapAll для Change\*, moveTo для PrintAuthors, replaceFirst/replaceAll — показаны примеры.
   - Вывод: интроспекция до/после, лог выполнения, итоговый объект post.

2. Seminar pipeline:
   - Начальный контекст: Seminar{topic="[DRAFT] Functional Patterns", speaker=undefined}.
   - StopIfDraft выставляет `isDone = true` и останавливает конвейер — демонстрация цепочки обязанностей.

---

## Примеры команд (локально)

Установить зависимости:

```bash
pnpm install
```

Запустить демонстрации:

```bash
pnpm run dev   # выполняет src/main.ts
```

Запустить тесты:

```bash
pnpm run test  # запускает Vitest
```

Скрипты в package.json:

```json
{
	"scripts": {
		"dev": "tsx src/main.ts",
		"test": "vitest --run"
	}
}
```

---

## Примеры ожидаемых выводов

- Интроспекция конвейера (до/после операций): читаемый список шагов с именами и вложениями (LogStep(…)).
- Лог выполнения (ctx.log): последовательность «-> StepName» и «<- StepName» для обёрнутых шагов, плюс итоговые печатные шаги.
- Для Seminar-пайплайна — если тема содержит `[DRAFT]`, `StopIfDraft` прерывает выполнение (ctx.isDone = true) и последующие шаги не выполняются.

---

## Тестирование

Файл: `test/pipeline.spec.ts`  
Покрытие:

- Выполнение шагов и остановка по `isDone`.
- wrapAll + moveTo — проверка перестановки и логирования.
- replaceFirst / replaceAll — замены шагов.

---

## Выводы

1. Построен универсальный pipeline-фреймворк на TypeScript с поддержкой декораторов, интроспекции и управления шагами как данными.
2. Реализованы два прикладных контекста (Post и Seminar) для демонстрации повторного использования инфраструктуры.
3. Добавлены high-level операции, singleton-шаг, chain of responsibility и unit-тесты.

---
