import type { MutableHomeModel, MutableCitizenModel } from "../models/mutable";

/**
 * Интерфейс билдера дома.
 */
export interface IHomeBuilder {
  /**
   * Устанавливает адрес дома.
   * @param value Адрес
   * @returns this
   */
  address(value: string): this;
  /**
   * Устанавливает источник/примечание для дома.
   * @param note Необязательное примечание
   * @returns this
   */
  source(note?: string): this;
  /**
   * Возвращает индекс дома внутри билдера.
   */
  index(): number;
  /**
   * Возвращает внутреннюю изменяемую модель дома.
   */
  model(): MutableHomeModel;
}

/**
 * Интерфейс билдера жителя.
 */
export interface ICitizenBuilder {
  /**
   * Устанавливает имя жителя.
   * @param value Имя
   * @returns this
   */
  name(value: string): this;
  /**
   * Устанавливает возраст жителя.
   * @param n Возраст
   * @returns this
   */
  age(n: number): this;
  /**
   * Привязывает жителя к дому по индексу.
   * @param index Индекс дома или null (бездомный)
   * @returns this
   */
  homeByIndex(index: number | null): this;
  /**
   * Устанавливает имя и возраст одновременно.
   * @param name Имя
   * @param age Возраст
   * @returns this
   */
  setNameAndAge(name: string, age: number): this;
  /**
   * Копирует данные из другого билдера жителя.
   * @param other Другой билдер
   * @returns this
   */
  copyFrom(other: ICitizenBuilder): this;
  /**
   * Устанавливает источник/примечание для жителя.
   * @param note Необязательное примечание
   * @returns this
   */
  source(note?: string): this;
  /**
   * Возвращает индекс жителя внутри билдера.
   */
  index(): number;
  /**
   * Возвращает внутреннюю изменяемую модель жителя.
   */
  model(): MutableCitizenModel;
}