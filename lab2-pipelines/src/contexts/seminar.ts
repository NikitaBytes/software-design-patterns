/**
 * Тип данных для семинара.
 */
export type Seminar = {
  /** Тема семинара */
  topic: string;
  /** Текущий докладчик (опционально) */
  speaker?: string;
  /** История докладчиков */
  previousSpeakers: string[];
};

/**
 * Контекст выполнения pipeline для семинара.
 */
export type SeminarContext = {
  /** Данные семинара */
  seminar: Seminar;
  /** Лог выполнения шагов */
  log: string[];
  /** Флаг завершения (для chain of responsibility) */
  isDone?: boolean;
};