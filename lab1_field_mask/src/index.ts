

import { StudentDatabase } from './database/StudentDatabase';
import { Student } from './domain/Student';
import { StudentStatus } from './enums/StudentStatus';
import { FieldMask } from './masks/FieldMask';
import { BitFieldMask } from './masks/BitFieldMask';
import { studentToJSON } from './utils/studentToJSON';
import { StudentPrinter } from './utils/StudentPrinter';
import { runTests } from './tests-runtime/runTests';

// ДЕМОНСТРАЦИЯ ПРОГРАММЫ

/**
 * Главная функция для демонстрации работы
 */
function main(): void {
    console.log("========== ДЕМОНСТРАЦИЯ РАБОТЫ ==========\n");
    
    // Создаем базу данных
    const database = new StudentDatabase();
    
    // Добавляем студентов
    console.log("1. Добавление студентов в базу данных:");
    const students = [
        new Student(1, "Алексей", 3.7, 20, StudentStatus.Active),
        new Student(2, "Елена", 4.0, 21, StudentStatus.Active),
        new Student(3, "Алексей", 3.5, 22, StudentStatus.Graduated),
        new Student(4, "Дмитрий", 3.2, 20, StudentStatus.Active),
        new Student(5, "Елена", 3.9, 19, StudentStatus.Active)
    ];
    
    students.forEach(s => {
        database.add(s);
        console.log(`  Добавлен: ${s.name} (ID: ${s.id})`);
    });
    
    // Поиск по имени
    console.log("\n2. Поиск студентов по имени 'Елена':");
    const elenas = database.findByName("Елена");
    elenas.forEach(s => {
        console.log(`  Найден: ID=${s.id}, GPA=${s.gpa}`);
    });
    
    // Печать с маской
    console.log("\n3. Печать с маской (только ID, имя и GPA):");
    const printMask = new FieldMask(true, true, true, false, false);
    database.getAll().forEach(s => {
        process.stdout.write("  ");
        StudentPrinter.printWithMask(s, printMask);
    });
    
    // JSON с маской для API
    console.log("\n4. JSON представление для API (ID, имя, статус):");
    const apiMask = new FieldMask(true, true, false, false, true);
    const firstStudent = database.getAll()[0];
    const jsonData = studentToJSON(firstStudent, apiMask);
    console.log("  " + JSON.stringify(jsonData, null, 2).replace(/\n/g, "\n  "));
    
    // Битовая маска
    console.log("\n5. Работа с битовой маской:");
    const bitMask = new BitFieldMask();
    bitMask.setId(true);
    bitMask.setName(true);
    console.log(`  Битовая маска - ID: ${bitMask.id}, Name: ${bitMask.name}, GPA: ${bitMask.gpa}`);
    
    const bitMask2 = new BitFieldMask();
    bitMask2.setName(true);
    bitMask2.setId(false);
    
    const unionBit = bitMask.union(bitMask2);
    console.log(`  Объединение масок - ID: ${unionBit.id}, Name: ${unionBit.name}`);
    
    // Слияние по маске
    console.log("\n6. Слияние студентов с одинаковым именем:");
    console.log(`  До слияния: ${database.getAll().length} студентов`);
    const mergeMask = new FieldMask(false, true, false, false, false);
    database.mergeByMask(mergeMask);
    console.log(`  После слияния: ${database.getAll().length} студентов`);
    
    // Вывод результата слияния
    console.log("  Результаты после слияния:");
    database.getAll().forEach(s => {
        console.log(`    ${s.name}: GPA=${s.gpa.toFixed(2)}`);
    });
    
    console.log("\n========== КОНЕЦ ДЕМОНСТРАЦИИ ==========\n");
}

// ============================================
// ЗАПУСК ПРОГРАММЫ
// ============================================

// Запускаем тесты
runTests();

// Запускаем демонстрацию
main();