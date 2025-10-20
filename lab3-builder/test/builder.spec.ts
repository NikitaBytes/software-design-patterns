import { describe, it, expect } from "vitest";
import { CityBuilder } from "../src/builder/CityBuilder";

describe("Builder: city/citizen/home", () => {
  it("builds immutable city with IDs and validates data", () => {
    const b = new CityBuilder();
    const h = b.home(h => h.address("Str. 123").source("test:home#1"));
    const idx = h.index();

    b.citizen(c => c.name("John").age(20).homeByIndex(idx).source("test:john"));
    b.citizen(c => c.name("NoHome").age(30).homeByIndex(null));

    const city = b.build();
    expect(city.homes.length).toBe(1);
    expect(city.citizens.length).toBe(2);
    expect(city.citizens[0].homeId).toBe(0);
    expect(Object.isFrozen(city)).toBe(true);

    // snapshot вывода (стабильно по ID/порядку)
    expect(city).toMatchInlineSnapshot(`
      {
        "citizens": [
          {
            "age": 20,
            "homeId": 0,
            "id": 0,
            "name": "John",
          },
          {
            "age": 30,
            "homeId": null,
            "id": 1,
            "name": "NoHome",
          },
        ],
        "homes": [
          {
            "address": "Str. 123",
            "id": 0,
          },
        ],
      }
    `);
  });

  it("collects all validation errors", () => {
    const b = new CityBuilder();
    // Дом без адреса
    b.home(); // no address
    // Жители с ошибками
    b.citizen(c => c.age(-1).source("test:bad#1")); // name missing, age invalid
    b.citizen(c => c.name("").homeByIndex(99));     // name empty, invalid home index
    let msg = "";
    try { b.build(); } catch (e: any) { msg = e.message; }
    expect(msg).toContain("homes[0].address: Address is required");
    expect(msg).toContain("citizens[0].name: Name is required");
    expect(msg).toContain("citizens[0].age: Age must be a non-negative number");
    expect(msg).toContain("citizens[1].name: Name is required");
    expect(msg).toContain("citizens[1].homeIndex: Invalid home index: 99");
  });
});