
// UNIT ТЕСТЫ

import { StudentDatabase } from "../database/StudentDatabase";
import { Student } from "../domain/Student";
import { StudentStatus } from "../enums/StudentStatus";
import { FieldMask } from "../masks/FieldMask";
import { BitFieldMask } from "../masks/BitFieldMask";
import { studentToJSON } from "../utils/studentToJSON";
import { unionMasks, intersectMasks, invertMask } from "../utils/maskOps";

/**
 * Простой assert для тестирования
 * @param condition - Условие для проверки
 * @param message - Сообщение при ошибке
 */
function assert(condition: boolean, message: string): void {
    if (!condition) {
        throw new Error(`❌ Test failed: ${message}`);
    }
}

/**
 * Запуск unit тестов
 */
export function runTests(): void {
    console.log("========== ЗАПУСК ТЕСТОВ ==========\n");
    
    // Тест 1: Создание и добавление студентов
    console.log("Тест 1: Создание и добавление студентов");
    const db = new StudentDatabase();
    const student1 = new Student(1, "Иван", 3.5, 20, StudentStatus.Active);
    const student2 = new Student(2, "Мария", 4.0, 21, StudentStatus.Active);
    const student3 = new Student(3, "Иван", 3.8, 22, StudentStatus.Graduated);
    
    db.add(student1);
    db.add(student2);
    db.add(student3);
    
    assert(db.getAll().length === 3, "Должно быть 3 студента");
    console.log("✅ Тест 1 пройден\n");
    
    // Тест 2: Поиск по имени
    console.log("Тест 2: Поиск по имени");
    const ivans = db.findByName("Иван");
    assert(ivans.length === 2, "Должно найти 2 студентов с именем Иван");
    assert(ivans[0].name === "Иван", "Первый должен быть Иван");
    assert(ivans[1].name === "Иван", "Второй должен быть Иван");
    console.log("✅ Тест 2 пройден\n");
    
    // Тест 3: Маска полей (boolean)
    console.log("Тест 3: Маска полей (boolean)");
    const mask = new FieldMask(true, true, false, false, false);
    assert(mask.id === true, "ID должен быть включен");
    assert(mask.name === true, "Name должен быть включен");
    assert(mask.gpa === false, "GPA должен быть выключен");
    console.log("✅ Тест 3 пройден\n");
    
    // Тест 4: Битовая маска
    console.log("Тест 4: Битовая маска");
    const bitMask = new BitFieldMask();
    bitMask.setId(true);
    bitMask.setName(true);
    assert(bitMask.id === true, "ID должен быть включен");
    assert(bitMask.name === true, "Name должен быть включен");
    assert(bitMask.gpa === false, "GPA должен быть выключен");
    
    const inverted = bitMask.invert();
    assert(inverted.id === false, "ID должен быть выключен после инверсии");
    assert(inverted.gpa === true, "GPA должен быть включен после инверсии");
    console.log("✅ Тест 4 пройден\n");
    
    // Тест 5: Слияние по маске
    console.log("Тест 5: Слияние по маске");
    const db2 = new StudentDatabase();
    db2.add(new Student(1, "Петр", 3.0, 20, StudentStatus.Active));
    db2.add(new Student(2, "Петр", 3.5, 20, StudentStatus.Active));
    db2.add(new Student(3, "Анна", 4.0, 21, StudentStatus.Active));
    
    const mergeMask = new FieldMask(false, true, false, true, false);
    db2.mergeByMask(mergeMask);
    
    const allAfterMerge = db2.getAll();
    assert(allAfterMerge.length === 2, "После слияния должно остаться 2 студента");
    console.log("✅ Тест 5 пройден\n");
    
    // Тест 6: Копирование полей по маске
    console.log("Тест 6: Копирование полей по маске");
    const db3 = new StudentDatabase();
    db3.add(new Student(1, "Олег", 2.5, 19, StudentStatus.Active));
    db3.add(new Student(2, "Олег", 3.0, 20, StudentStatus.Inactive));
    
    const sourceStudent = new Student(99, "Олег", 4.5, 25, StudentStatus.Graduated);
    const compareMask = new FieldMask(false, true, false, false, false);
    const copyMask = new FieldMask(false, false, true, true, true);
    
    db3.copyFieldsByMask(compareMask, sourceStudent, copyMask);
    
    const updated = db3.getAll();
    assert(updated[0].gpa === 4.5, "GPA должен быть скопирован");
    assert(updated[0].age === 25, "Возраст должен быть скопирован");
    assert(updated[0].status === StudentStatus.Graduated, "Статус должен быть скопирован");
    console.log("✅ Тест 6 пройден\n");
    
    // Тест 7: JSON преобразование
    console.log("Тест 7: JSON преобразование с маской");
    const jsonMask = new FieldMask(true, true, false, false, true);
    const json = studentToJSON(student1, jsonMask);
    assert(json.id === 1, "ID должен быть в JSON");
    assert(json.name === "Иван", "Имя должно быть в JSON");
    assert(json.gpa === undefined, "GPA не должен быть в JSON");
    assert(json.status === StudentStatus.Active, "Статус должен быть в JSON");
    console.log("✅ Тест 7 пройден\n");
    
    // Тест 8: Комбинирование масок
    console.log("Тест 8: Комбинирование масок");
    const mask1 = new FieldMask(true, true, false, false, false);
    const mask2 = new FieldMask(false, true, true, false, false);
    
    const union = unionMasks(mask1, mask2);
    assert(union.id === true, "ID должен быть в объединении");
    assert(union.name === true, "Name должен быть в объединении");
    assert(union.gpa === true, "GPA должен быть в объединении");
    
    const intersection = intersectMasks(mask1, mask2);
    assert(intersection.id === false, "ID не должен быть в пересечении");
    assert(intersection.name === true, "Name должен быть в пересечении");
    assert(intersection.gpa === false, "GPA не должен быть в пересечении");
    
    const inverted2 = invertMask(mask1);
    assert(inverted2.id === false, "ID должен быть инвертирован");
    assert(inverted2.gpa === true, "GPA должен быть инвертирован");
    console.log("✅ Тест 8 пройден\n");
    
    console.log("========== ВСЕ ТЕСТЫ ПРОЙДЕНЫ! ==========\n");
}
