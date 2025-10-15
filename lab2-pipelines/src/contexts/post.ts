/**
 * Тип данных для публикации (поста).
 */
export type Post = {
  /** Заголовок поста */
  title: string;
  /** Текущий автор (опционально) */
  author?: string;
  /** История авторов */
  previousAuthors: string[];
  /** Содержимое поста */
  content: string; // добавлено поле для содержимого поста
};

/**
 * Контекст выполнения pipeline для публикации.
 */
export type PostContext = {
  /** Данные поста */
  post: Post;
  /** Лог выполнения шагов */
  log: string[];
  /** Флаг завершения (для chain of responsibility) */
  isDone?: boolean; // для Chain of Responsibility
};