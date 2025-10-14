import type { IPipelineStep } from "./types";

/**
 * Формирует строковое представление пайплайна с интроспекцией каждого шага.
 * @param steps - массив шагов пайплайна
 * @returns строка с описанием всех шагов и их вложенности
 */
export function printPipeline<T>(steps: IPipelineStep<T>[]): string {
  const out: string[] = [];
  out.push(`Pipeline[${steps.length} steps]:`);
  steps.forEach((s, i) => {
    const b: string[] = [];
    s.introspect(b);
    out.push(`${i}. ${b.join(" | ")}`);
  });
  return out.join("\n");
}