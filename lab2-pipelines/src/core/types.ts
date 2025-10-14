/**
 * Интерфейс для объектов, поддерживающих интроспекцию (вывод описания шага).
 */
export interface Introspectable {
  introspect(out: string[]): void;
}

/**
 * Интерфейс шага конвейера.
 * @template TContext - тип контекста, с которым работает шаг.
 */
export interface IPipelineStep<TContext> extends Introspectable {
  /** Имя шага (для интроспекции и отладки) */
  readonly name: string;
  /**
   * Выполнить шаг над контекстом.
   * @param ctx - контекст выполнения
   */
  execute(ctx: TContext): void;
}

/**
 * Тип предиката для поиска/выбора шагов по условию.
 */
export type StepPredicate<T> = (s: IPipelineStep<T>) => boolean;

/**
 * Проверяет, содержит ли объект поле isDone (для поддержки chain of responsibility).
 * @param x - произвольный объект
 * @returns true, если есть поле isDone
 */
export function hasIsDone(x: unknown): x is { isDone?: boolean } {
  return typeof x === "object" && x !== null && "isDone" in (x as any);
}