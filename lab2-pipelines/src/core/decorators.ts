import type { IPipelineStep } from "./types";

/**
 * Универсальный декоратор-обёртка для шага конвейера.
 * Позволяет добавить поведение до и после выполнения шага.
 * @template T - тип контекста
 */
export class WrapStep<T> implements IPipelineStep<T> {
  /**
   * @param name   Имя обёртки (для интроспекции)
   * @param inner  Внутренний шаг, который оборачивается
   * @param before Функция, вызываемая до inner.execute
   * @param after  Функция, вызываемая после inner.execute
   */
  constructor(
    public readonly name: string,
    private readonly inner: IPipelineStep<T>,
    private readonly before?: (ctx: T, step: IPipelineStep<T>) => void,
    private readonly after?: (ctx: T, step: IPipelineStep<T>) => void
  ) {}

  /** Выполняет before, затем inner, затем after */
  execute(ctx: T) {
    this.before?.(ctx, this.inner);
    this.inner.execute(ctx);
    this.after?.(ctx, this.inner);
  }
  /** Добавляет описание обёртки и вложенного шага */
  introspect(out: string[]) {
    out.push(`${this.name} -> wraps(${this.inner.name})`);
  }
}

/**
 * Декоратор для логирования выполнения шага (до и после).
 * Добавляет сообщения в ctx.log.
 */
export class LogStep<T> extends WrapStep<T> {
  /**
   * @param inner Внутренний шаг, который будет логироваться
   */
  constructor(inner: IPipelineStep<T>) {
    super(
      `Log(${inner.name})`,
      inner,
      (ctx: any, step) => ctx?.log?.push?.(`-> ${step.name}`),
      (ctx: any, step) => ctx?.log?.push?.(`<-${step.name}`)
    );
  }
}