import { StudentDatabase } from './database/StudentDatabase';
import { StudentStatus } from './enums/StudentStatus';
import { BitFieldMask } from './masks/BitFieldMask';
import { studentToJSON } from './utils/studentToJSON';
import { StudentPrinter } from './utils/StudentPrinter';

// ДЕМОНСТРАЦИЯ ПРОГРАММЫ

/**
 * Главная функция для демонстрации работы
 */
function main(): void {
    console.log("- ДЕМОНСТРАЦИЯ РАБОТЫ -\n");
    
    // Создаем базу данных
    const database = new StudentDatabase();
    
    // Добавляем студентов
    console.log("1. Добавление студентов в базу данных:");
    const students = [
        { id: 1, name: "Алексей", gpa: 3.7, age: 20, status: StudentStatus.Active },
        { id: 2, name: "Елена",   gpa: 4.0, age: 21, status: StudentStatus.Active },
        { id: 3, name: "Алексей", gpa: 3.5, age: 22, status: StudentStatus.Graduated },
        { id: 4, name: "Дмитрий", gpa: 3.2, age: 20, status: StudentStatus.Active },
        { id: 5, name: "Елена",   gpa: 3.9, age: 19, status: StudentStatus.Active }
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
    const printMask = { id: true, name: true, gpa: true, age: false, status: false };
    database.getAll().forEach(s => {
        process.stdout.write("  ");
        StudentPrinter.printWithMask(s, printMask);
    });
    
    // JSON с маской для API
    console.log("\n4. JSON представление для API (ID, имя, статус):");
    const apiMask = { id: true, name: true, gpa: false, age: false, status: true };
    const [firstStudent] = database.getAll();
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
    const mergeMask = { id: false, name: true, gpa: false, age: false, status: false };
    database.mergeByMask(mergeMask);
    console.log(`  После слияния: ${database.getAll().length} студентов`);
    
    // Вывод результата слияния
    console.log("  Результаты после слияния:");
    database.getAll().forEach(s => {
        console.log(`    ${s.name}: GPA=${s.gpa.toFixed(2)}`);
    });
    
    console.log("\n-КОНЕЦ-\n");
}

// ЗАПУСК ПРОГРАММЫ

// Запускаем демонстрацию
main();
