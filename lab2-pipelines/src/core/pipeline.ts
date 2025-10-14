import type { IPipelineStep, StepPredicate } from "./types";
import { hasIsDone } from "./types";

/**
 * Класс Pipeline<T> — универсальный конвейер шагов для любого контекста.
 * Позволяет выполнять, модифицировать и интроспектировать последовательность шагов.
 * @template T - тип контекста
 */
export class Pipeline<T> {
  /**
   * @param steps Массив шагов конвейера (по умолчанию пустой)
   */
  constructor(public steps: IPipelineStep<T>[] = []) {}

  /**
   * Добавить шаг в конец конвейера.
   * @param step - шаг для добавления
   * @returns this
   */
  add(step: IPipelineStep<T>) { this.steps.push(step); return this; }

  /**
   * Выполнить все шаги по порядку, пока не встретится ctx.isDone (chain of responsibility).
   * @param ctx - контекст выполнения
   */
  execute(ctx: T) {
    for (const step of this.steps) {
      if (hasIsDone(ctx) && ctx.isDone) break;
      step.execute(ctx);
    }
  }

  /**
   * Заменить первый шаг, удовлетворяющий предикату, на новый.
   * @param match - функция-предикат для поиска шага
   * @param next - новый шаг
   * @returns this
   */
  replaceFirst(match: StepPredicate<T>, next: IPipelineStep<T>) {
    const i = this.steps.findIndex(match);
    if (i >= 0) this.steps[i] = next;
    return this;
  }

  /**
   * Заменить все шаги, удовлетворяющие предикату, на результат фабрики.
   * @param match - функция-предикат для поиска шагов
   * @param factory - фабрика новых шагов
   * @returns this
   */
  replaceAll(match: StepPredicate<T>, factory: () => IPipelineStep<T>) {
    this.steps = this.steps.map(s => (match(s) ? factory() : s));
    return this;
  }

  /**
   * Обернуть все шаги, удовлетворяющие предикату, через функцию-обёртку (например, декоратор).
   * @param match - функция-предикат для поиска шагов
   * @param wrap - функция-обёртка
   * @returns this
   */
  wrapAll(match: StepPredicate<T>, wrap: (s: IPipelineStep<T>) => IPipelineStep<T>) {
    this.steps = this.steps.map(s => (match(s) ? wrap(s) : s));
    return this;
  }

  /**
   * Переместить первый шаг, удовлетворяющий предикату, на указанную позицию.
   * @param match - функция-предикат для поиска шага
   * @param index - новая позиция
   * @returns this
   */
  moveTo(match: StepPredicate<T>, index: number) {
    const i = this.steps.findIndex(match);
    if (i < 0 || index < 0 || index >= this.steps.length) return this;
    const [s] = this.steps.splice(i, 1);
    this.steps.splice(index, 0, s);
    return this;
  }
}