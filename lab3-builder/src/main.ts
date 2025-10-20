import { CityBuilder } from "./builder/CityBuilder";
import { getHome } from "./models/immutable";

/**
 * Демонстрация работы билдера города, жителей и домов.
 * Создаёт город, добавляет дома и жителей с использованием scope дефолтов,
 * выводит результат в консоль.
 */
function demo() {
  const b = new CityBuilder();

  // Создаём дом и фиксируем его индекс
  const h1 = b.home(h => h.address("Str. 123").source("main:home#1"));
  const homeIndex = h1.index();

  // Глобальные дефолты через scope (из видео идея "скоупов")
  b.scope({ citizenAge: 32 }, () => {
    // Citizen #0 — fluent + делегат
    const john = b.citizen(c =>
      c.setNameAndAge("John", 18).homeByIndex(homeIndex).source("main:citizen#john")
    );

    // Citizen #1 — унаследует age=32 из scope, дом не задан (бездомный)
    b.citizen(c => c.name("Joe").source("main:citizen#joe"));

    // Ещё один с тем же домом
    b.citizen(c => c.name("Mary").homeByIndex(homeIndex).source("main:citizen#mary"));
  });

  const city = b.build();
  console.log("City:", JSON.stringify(city, null, 2));

  const maryHome = getHome(city, city.citizens[2].homeId);
  console.log("Mary's home:", maryHome?.address);
}

demo();