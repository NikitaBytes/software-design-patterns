import { createEmptyModel, MutableCityModel, MutableHomeModel, MutableCitizenModel } from "../models/mutable";
import type { City, Home, Citizen } from "../models/immutable";
import { validateCityModel, ValidationError } from "./validation";
import type { IHomeBuilder, ICitizenBuilder } from "./types";

// Простая подсказка места передаём вручную в .source(), но можно авто
const captureHint = () => undefined; 

type Defaults = {
  citizenAge?: number;
  homeAddress?: string;
};

/**
 * Строитель города, жителей и домов.
 * Позволяет создавать объекты с поддержкой scope дефолтов, валидацией и генерацией immutable модели.
 */
export class CityBuilder {
  private m: MutableCityModel = createEmptyModel();
  private defaultsStack: Defaults[] = [{}]; // поддержка scope

  /**
   * Устанавливает scope дефолтов для вложенных построений.
   * @param def Объект с дефолтными значениями.
   * @param fn Функция, внутри которой действуют дефолты.
   * @returns this
   */
  scope(def: Partial<Defaults>, fn: () => void): this {
    const top = this.defaultsStack[this.defaultsStack.length - 1];
    this.defaultsStack.push({ ...top, ...def });
    try { fn(); } finally { this.defaultsStack.pop(); }
    return this;
  }

  /**
   * Добавляет новый дом.
   * @param config Функция-конфигуратор для дома.
   * @param sourceHint Необязательная подсказка источника.
   * @returns IHomeBuilder для настройки дома.
   */
  home(config?: (b: IHomeBuilder) => void, sourceHint?: string): IHomeBuilder {
    const idx = this.m.homes.length;
    const model: MutableHomeModel = {};
    // применяем дефолт из scope (если есть)
    const defaults = this.defaultsStack[this.defaultsStack.length - 1];
    if (defaults.homeAddress) model.address = defaults.homeAddress;
    if (sourceHint) model.sourceHint = sourceHint;

    this.m.homes.push(model);

    const self = this;
    class HB implements IHomeBuilder {
      address(value: string) { model.address = value; return this; }
      source(note?: string)  { model.sourceHint = note ?? captureHint(); return this; }
      index() { return idx; }
      model() { return model; }
    }

    const b = new HB();
    config?.(b);
    return b;
  }

  /**
   * Добавляет нового жителя.
   * @param config Функция-конфигуратор для жителя.
   * @param sourceHint Необязательная подсказка источника.
   * @returns ICitizenBuilder для настройки жителя.
   */
  citizen(config?: (b: ICitizenBuilder) => void, sourceHint?: string): ICitizenBuilder {
    const idx = this.m.citizens.length;
    const model: MutableCitizenModel = {};
    const defaults = this.defaultsStack[this.defaultsStack.length - 1];
    if (defaults.citizenAge != null) model.age = defaults.citizenAge;
    if (sourceHint) model.sourceHint = sourceHint;

    this.m.citizens.push(model);

    class CB implements ICitizenBuilder {
      name(value: string) { model.name = value; return this; }
      age(n: number) { model.age = n; return this; }
      homeByIndex(index: number | null) { model.homeIndex = index ?? null; return this; }
      setNameAndAge(name: string, age: number) { model.name = name; model.age = age; return this; }
      copyFrom(other: ICitizenBuilder) {
        const o = other.model();
        if (o.name != null) model.name = o.name;
        if (o.age != null) model.age = o.age;
        if ("homeIndex" in o) model.homeIndex = o.homeIndex ?? null;
        return this;
      }
      source(note?: string) { model.sourceHint = note ?? captureHint(); return this; }
      index() { return idx; }
      model() { return model; }
    }

    const b = new CB();
    config?.(b);
    return b;
  }

  /**
   * Собирает и возвращает immutable модель города.
   * Валидирует данные, выбрасывает ValidationError при ошибках.
   * @throws ValidationError если есть ошибки валидации.
   * @returns Immutable City
   */
  build(): City {
    const issues = validateCityModel(this.m);
    if (issues.length) throw new ValidationError(issues);

    const homes: Home[] = this.m.homes.map((h, i) => ({
      id: i,
      address: h.address!, // валидация уже гарантировала наличие
    }));

    const citizens: Citizen[] = this.m.citizens.map((c, i) => ({
      id: i,
      name: c.name!,
      age: c.age!,
      homeId: c.homeIndex ?? null,
    }));

    const city: City = Object.freeze({
      homes: Object.freeze(homes),
      citizens: Object.freeze(citizens),
    });

    return city;
  }
}