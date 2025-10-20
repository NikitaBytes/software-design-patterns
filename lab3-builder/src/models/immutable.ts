/**
 * Тип идентификатора дома.
 */
export type HomeId = number;

/**
 * Immutable-модель дома.
 */
export interface Home {
  /** Уникальный идентификатор дома */
  readonly id: HomeId;
  /** Адрес дома */
  readonly address: string;
}

/**
 * Immutable-модель жителя.
 */
export interface Citizen {
  /** Уникальный идентификатор жителя */
  readonly id: number;
  /** Имя жителя */
  readonly name: string;
  /** Возраст жителя */
  readonly age: number;
  /** Идентификатор дома или null (если бездомный) */
  readonly homeId: HomeId | null;
}

/**
 * Immutable-модель города.
 */
export interface City {
  /** Список домов */
  readonly homes: ReadonlyArray<Home>;
  /** Список жителей */
  readonly citizens: ReadonlyArray<Citizen>;
}

/**
 * Получить дом по идентификатору.
 * @param city Город
 * @param id Идентификатор дома (или null/undefined)
 * @returns Home или undefined
 */
export const getHome = (city: City, id: HomeId | null | undefined) =>
  id == null ? undefined : city.homes.find(h => h.id === id);

/**
 * Получить жителя по идентификатору.
 * @param city Город
 * @param id Идентификатор жителя
 * @returns Citizen или undefined
 */
export const getCitizen = (city: City, id: number) =>
  city.citizens.find(c => c.id === id);