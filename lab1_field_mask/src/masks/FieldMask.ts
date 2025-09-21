
// МАСКА ПОЛЕЙ (BOOLEAN)

/**
 * Маска полей на основе boolean значений
 * Определяет, какие поля объекта активны
 */
export class FieldMask {
    /**
     * Конструктор маски
     * @param id - Включить поле id
     * @param name - Включить поле name
     * @param gpa - Включить поле gpa
     * @param age - Включить поле age
     * @param status - Включить поле status
     */
    constructor(
        public id: boolean = false,
        public name: boolean = false,
        public gpa: boolean = false,
        public age: boolean = false,
        public status: boolean = false
    ) {}
}
