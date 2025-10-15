import { Pipeline } from "./core/pipeline";
import { LogStep } from "./core/decorators";
import { printPipeline } from "./core/introspection";

import { PostSteps, PRINT_POST_SINGLETON } from "./adapters/postAdapter";
import type { PostContext } from "./contexts/post";

import { SeminarSteps } from "./adapters/seminarAdapter";
import type { SeminarContext } from "./contexts/seminar";

/**
 * Демонстрация работы pipeline для публикации поста.
 * - Создаёт контекст поста.
 * - Конфигурирует pipeline с шагами изменения автора, заголовка, печати и проверки черновика.
 * - Демонстрирует интроспекцию, high-level операции (wrapAll, moveTo, replaceFirst).
 * - Выполняет pipeline и выводит лог и результат.
 */
function demoPostPipeline() {
  const ctx: PostContext = {
    post: { title: "ZNAPSTER launch", author: undefined, previousAuthors: [], content: "" },
    log: [],
  };

  const p = new Pipeline<PostContext>([
    PostSteps.StopIfDraft(),
    PostSteps.ChangeAuthor("Nikita"),
    PostSteps.ChangeTitle("ZNAPSTER — Web3 mini-app"),
    PostSteps.AppendContent("Первый релиз ZNAPSTER! "), // добавляем изменение данных
    PRINT_POST_SINGLETON,             // singleton
    PostSteps.PrintAuthors(),
  ]);

  // Интроспекция до модификаций
  console.log(printPipeline(p.steps));

  // High-level: заменить первый PrintAuthors на логируемый враппер, и сдвинуть
  p.replaceFirst(s => s.name === "PrintAuthors", PostSteps.PrintAuthors())
   .wrapAll(s => s.name.startsWith("Change"), (s) => new LogStep(s))
   .moveTo(s => s.name === "PrintAuthors", 1);

  console.log("---- после операций ----");
  console.log(printPipeline(p.steps));

  p.execute(ctx);
  console.log("ЛОГ:", ctx.log.join(" | "));
  console.log("РЕЗУЛЬТАТ:", ctx.post);
}

/**
 * Демонстрация работы pipeline для семинара.
 * - Создаёт контекст семинара.
 * - Конфигурирует pipeline с шагами изменения докладчика, темы, печати и проверки черновика.
 * - Демонстрирует остановку по chain of responsibility (StopIfDraft).
 * - Выполняет pipeline и выводит лог и результат.
 */
function demoSeminarPipeline() {
  const ctx: SeminarContext = {
    seminar: { topic: "[DRAFT] Functional Patterns", speaker: undefined, previousSpeakers: [] },
    log: [],
  };

  const p = new Pipeline<SeminarContext>([
    SeminarSteps.StopIfDraft(),            // остановит пайплайн из-за [DRAFT]
    SeminarSteps.ChangeSpeaker("Prof. Dodi"),
    SeminarSteps.ChangeTopic("Functional Patterns in TS"),
    SeminarSteps.PrintSeminar(),
    SeminarSteps.PrintSpeakers(),
  ]);

  console.log(printPipeline(p.steps));
  p.execute(ctx);
  console.log("ЛОГ:", ctx.log.join(" | "));
  console.log("РЕЗУЛЬТАТ:", ctx.seminar, "завершено:", ctx.isDone);
}

// Запуск демонстраций
demoPostPipeline();
console.log("\n===\n");
demoSeminarPipeline();