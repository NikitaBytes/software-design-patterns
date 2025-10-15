import type { IPipelineStep } from "./types";

/**
 * Универсальный шаг конвейера, реализующий IPipelineStep<T>.
 * Позволяет обернуть произвольную функцию-стратегию в шаг с именем.
 * @template T - тип контекста
 */
export class FunctionStep<T> implements IPipelineStep<T> {
  /**
   * @param name Имя шага (для интроспекции и отладки)
   * @param fn   Функция, реализующая логику шага
   */
  constructor(
    public readonly name: string,
    private readonly fn: (ctx: T) => void
  ) {}
  /** Выполняет шаг, вызывая функцию-стратегию */
  execute(ctx: T) { this.fn(ctx); }
  /** Добавляет имя шага в массив для интроспекции */
  introspect(out: string[]) { out.push(this.name); }
}