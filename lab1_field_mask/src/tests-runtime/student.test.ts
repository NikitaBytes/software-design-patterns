import { StudentDatabase } from "../database/StudentDatabase";
import { Student } from "../domain/Student";
import { StudentStatus } from "../enums/StudentStatus";
import { FieldMask } from "../masks/FieldMask";
import { BitFieldMask } from "../masks/BitFieldMask";
import { studentToJSON } from "../utils/studentToJSON";
import { unionMasks, intersectMasks, invertMask } from "../utils/maskOps";

describe("StudentDatabase и маски", () => {
    test("Создание и добавление студентов", () => {
        const db = new StudentDatabase();
        const student1 = new Student(1, "Иван", 3.5, 20, StudentStatus.Active);
        const student2 = new Student(2, "Мария", 4.0, 21, StudentStatus.Active);
        const student3 = new Student(3, "Иван", 3.8, 22, StudentStatus.Graduated);
        db.add(student1);
        db.add(student2);
        db.add(student3);
        expect(db.getAll().length).toBe(3);
    });

    test("Поиск по имени", () => {
        const db = new StudentDatabase();
        db.add(new Student(1, "Иван", 3.5, 20, StudentStatus.Active));
        db.add(new Student(2, "Мария", 4.0, 21, StudentStatus.Active));
        db.add(new Student(3, "Иван", 3.8, 22, StudentStatus.Graduated));
        const ivans = db.findByName("Иван");
        expect(ivans.length).toBe(2);
        expect(ivans[0].name).toBe("Иван");
        expect(ivans[1].name).toBe("Иван");
    });

    test("Маска полей (boolean)", () => {
        const mask = new FieldMask(true, true, false, false, false);
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
        db2.add(new Student(1, "Петр", 3.0, 20, StudentStatus.Active));
        db2.add(new Student(2, "Петр", 3.5, 20, StudentStatus.Active));
        db2.add(new Student(3, "Анна", 4.0, 21, StudentStatus.Active));
        const mergeMask = new FieldMask(false, true, false, true, false);
        db2.mergeByMask(mergeMask);
        const allAfterMerge = db2.getAll();
        expect(allAfterMerge.length).toBe(2);
    });

    test("Копирование полей по маске", () => {
        const db3 = new StudentDatabase();
        db3.add(new Student(1, "Олег", 2.5, 19, StudentStatus.Active));
        db3.add(new Student(2, "Олег", 3.0, 20, StudentStatus.Inactive));
        const sourceStudent = new Student(99, "Олег", 4.5, 25, StudentStatus.Graduated);
        const compareMask = new FieldMask(false, true, false, false, false);
        const copyMask = new FieldMask(false, false, true, true, true);
        db3.copyFieldsByMask(compareMask, sourceStudent, copyMask);
        const updated = db3.getAll();
        expect(updated[0].gpa).toBe(4.5);
        expect(updated[0].age).toBe(25);
        expect(updated[0].status).toBe(StudentStatus.Graduated);
    });

    test("JSON преобразование с маской", () => {
        const student1 = new Student(1, "Иван", 3.5, 20, StudentStatus.Active);
        const jsonMask = new FieldMask(true, true, false, false, true);
        const json = studentToJSON(student1, jsonMask);
        expect(json.id).toBe(1);
        expect(json.name).toBe("Иван");
        expect(json.gpa).toBeUndefined();
        expect(json.status).toBe(StudentStatus.Active);
    });

    test("Комбинирование масок", () => {
        const mask1 = new FieldMask(true, true, false, false, false);
        const mask2 = new FieldMask(false, true, true, false, false);
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
