import { StudentDatabase } from "../database/StudentDatabase";
import { Student } from "../domain/Student";
import { StudentStatus } from "../enums/StudentStatus";
import { FieldMask } from "../masks/FieldMask";
import { BitFieldMask } from "../masks/BitFieldMask";
import { studentToJSON } from "../utils/studentToJSON";
import { unionMasks, intersectMasks, invertMask } from "../utils/maskOps";

describe("StudentDatabase и маски", () => {
    // определение отдельного теста
    test("Создание и добавление студентов", () => {
        const db = new StudentDatabase();
        const student1 = { id: 1, name: "Иван", gpa: 3.5, age: 20, status: StudentStatus.Active };
        const student2 = { id: 2, name: "Мария", gpa: 4.0, age: 21, status: StudentStatus.Active };
        const student3 = { id: 3, name: "Иван", gpa: 3.8, age: 22, status: StudentStatus.Graduated };
        db.add(student1);
        db.add(student2);
        db.add(student3);
        expect(db.getAll().length).toBe(3);
    });

    test("Поиск по имени", () => {
        const db = new StudentDatabase();
        db.add({ id: 1, name: "Иван", gpa: 3.5, age: 20, status: StudentStatus.Active });
        db.add({ id: 2, name: "Мария", gpa: 4.0, age: 21, status: StudentStatus.Active });
        db.add({ id: 3, name: "Иван", gpa: 3.8, age: 22, status: StudentStatus.Graduated });
        const ivans = db.findByName("Иван");
        expect(ivans.length).toBe(2);
        expect(ivans[0].name).toBe("Иван");
        expect(ivans[1].name).toBe("Иван");
    });

    test("Маска полей (boolean)", () => {
        const mask = { id: true, name: true, gpa: false, age: false, status: false };
        expect(mask.id).toBe(true);
        expect(mask.name).toBe(true);
        expect(mask.gpa).toBe(false);
    });

    test("Битовая маска", () => {
        const bitMask = new BitFieldMask();
        bitMask.setId(true);
        bitMask.setName(true);
        expect(bitMask.id).toBe(true);
        expect(bitMask.name).toBe(true);
        expect(bitMask.gpa).toBe(false);
        const inverted = bitMask.invert();
        expect(inverted.id).toBe(false);
        expect(inverted.gpa).toBe(true);
    });

    test("Слияние по маске", () => {
        const db2 = new StudentDatabase();
        db2.add({
            id: 1,
            name: "Петр",
            gpa: 3.0,
            age: 20,
            status: StudentStatus.Active,
        })
        db2.add({
            id: 1,
            name: "Петр",
            gpa: 3.0,
            age: 20,
            status: StudentStatus.Active,
        });
        db2.add({
            id: 2,
            name: "Петр",
            gpa: 3.5,
            age: 20,
            status: StudentStatus.Active,
        });
        db2.add({
            id: 3,
            name: "Анна",
            gpa: 4.0,
            age: 21,
            status: StudentStatus.Active,
        });
        const mergeMask = { id: false, name: true, gpa: false, age: true, status: false };
        db2.mergeByMask(mergeMask);
        const allAfterMerge = db2.getAll();
        expect(allAfterMerge.length).toBe(2);
    });

    test("Копирование полей по маске", () => {
        const db3 = new StudentDatabase();
        db3.add({ id: 1, name: "Олег", gpa: 2.5, age: 19, status: StudentStatus.Active });
        db3.add({ id: 2, name: "Олег", gpa: 3.0, age: 20, status: StudentStatus.Inactive });
        const sourceStudent = { id: 99, name: "Олег", gpa: 4.5, age: 25, status: StudentStatus.Graduated };
        const compareMask = { id: false, name: true, gpa: false, age: false, status: false };
        const copyMask = { id: false, name: false, gpa: true, age: true, status: true };
        db3.copyFieldsByMask(compareMask, sourceStudent, copyMask);
        const updated = db3.getAll();
        expect(updated[0].gpa).toBe(4.5);
        expect(updated[0].age).toBe(25);
        expect(updated[0].status).toBe(StudentStatus.Graduated);
    });

    test("JSON преобразование с маской", () => {
        const student1 = { id: 1, name: "Иван", gpa: 3.5, age: 20, status: StudentStatus.Active };
        const jsonMask = { id: true, name: true, gpa: false, age: false, status: true };
        const json = studentToJSON(student1, jsonMask);
        expect(json.id).toBe(1);
        expect(json.name).toBe("Иван");
        expect(json.gpa).toBeUndefined();
        expect(json.status).toBe(StudentStatus.Active);
    });

    test("Комбинирование масок", () => {
        const mask1 = { id: true, name: true, gpa: false, age: false, status: false };
        const mask2 = { id: false, name: true, gpa: true, age: false, status: false };
        const union = unionMasks(mask1, mask2);
        expect(union.id).toBe(true);
        expect(union.name).toBe(true);
        expect(union.gpa).toBe(true);
        const intersection = intersectMasks(mask1, mask2);
        expect(intersection.id).toBe(false);
        expect(intersection.name).toBe(true);
        expect(intersection.gpa).toBe(false);
        const inverted2 = invertMask(mask1);
        expect(inverted2.id).toBe(false);
        expect(inverted2.gpa).toBe(true);
    });
});
