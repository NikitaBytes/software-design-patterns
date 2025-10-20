/**
 * Мутируемая модель дома (используется при построении).
 */
export interface MutableHomeModel {
  /** Адрес дома */
  address?: string;
  /** Подсказка источника создания */
  sourceHint?: string; // "место" создания (проще, чем парсить stack)
}

/**
 * Мутируемая модель жителя (используется при построении).
 */
export interface MutableCitizenModel {
  /** Имя жителя */
  name?: string;
  /** Возраст жителя */
  age?: number;
  /** Индекс дома в массиве домов или null (если бездомный) */
  homeIndex?: number | null; // индекс в модельном массиве домов
  /** Подсказка источника создания */
  sourceHint?: string;
}

/**
 * Мутируемая модель города (используется при построении).
 */
export interface MutableCityModel {
  /** Массив домов */
  homes: MutableHomeModel[];
  /** Массив жителей */
  citizens: MutableCitizenModel[];
}

/**
 * Создаёт пустую мутируемую модель города.
 * @returns Новый объект MutableCityModel
 */
export const createEmptyModel = (): MutableCityModel => ({
  homes: [],
  citizens: [],
});