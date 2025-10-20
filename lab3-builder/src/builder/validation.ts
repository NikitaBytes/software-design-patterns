import type { MutableCityModel } from "../models/mutable";

/**
 * Описывает одну проблему валидации.
 */
export interface ValidationIssue {
  /** Путь к полю с ошибкой (homes[0].address и т.д.) */
  path: string;
  /** Сообщение об ошибке */
  message: string;
  /** Необязательная подсказка источника */
  sourceHint?: string;
}

/**
 * Проверяет модель города на корректность данных.
 * @param m Мутируемая модель города
 * @returns Массив найденных проблем валидации
 */
export function validateCityModel(m: MutableCityModel): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  m.homes.forEach((h, i) => {
    if (!h.address || h.address.trim().length === 0) {
      issues.push({
        path: `homes[${i}].address`,
        message: "Address is required",
        sourceHint: h.sourceHint,
      });
    }
  });

  m.citizens.forEach((c, i) => {
    if (!c.name || c.name.trim().length === 0) {
      issues.push({
        path: `citizens[${i}].name`,
        message: "Name is required",
        sourceHint: c.sourceHint,
      });
    }
    if (c.age == null || Number.isNaN(c.age) || c.age < 0) {
      issues.push({
        path: `citizens[${i}].age`,
        message: "Age must be a non-negative number",
        sourceHint: c.sourceHint,
      });
    }
    if (c.homeIndex != null) {
      const idx = c.homeIndex;
      if (idx < 0 || idx >= m.homes.length) {
        issues.push({
          path: `citizens[${i}].homeIndex`,
          message: `Invalid home index: ${idx}`,
          sourceHint: c.sourceHint,
        });
      }
    }
  });

  return issues;
}

/**
 * Исключение, выбрасываемое при ошибках валидации.
 */
export class ValidationError extends Error {
  /** Список проблем валидации */
  issues: ValidationIssue[];
  /**
   * @param issues Массив ValidationIssue
   */
  constructor(issues: ValidationIssue[]) {
    super(
      "Validation failed:\n" +
        issues
          .map(
            (x) =>
              `- ${x.path}: ${x.message}` +
              (x.sourceHint ? ` (at ${x.sourceHint})` : "")
          )
          .join("\n")
    );
    this.issues = issues;
  }
}