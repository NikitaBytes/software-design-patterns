
// DOMAIN MODEL

/**
 * Domain Model класс - Студент
 * Содержит 5 полей разных типов согласно заданию
 */
import { StudentStatus } from '../enums/StudentStatus';
export class Student {
    /**
     * Конструктор студента
     * @param id - Идентификатор (int)
     * @param name - Имя студента (string)
     * @param gpa - Средний балл (float)
     * @param age - Возраст (int)
     * @param status - Статус студента (enum)
     */
    constructor(
        public id: number,        // int
        public name: string,       // string
        public gpa: number,        // float
        public age: number,        // int
        public status: StudentStatus  // enum
    ) {}
}
