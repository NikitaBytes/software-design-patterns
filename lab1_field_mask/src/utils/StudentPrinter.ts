

import { Student } from '../domain/Student';
import { FieldMask } from '../masks/FieldMask';

// СТАТИЧЕСКАЯ ФУНКЦИЯ ДЛЯ ПЕЧАТИ

/**
 * Класс с утилитами для вывода информации
 */
export class StudentPrinter {
    /**
     * Печать полей студента согласно маске
     * @param student - Студент для вывода
     * @param mask - Маска полей для отображения
     */
    static printWithMask(student: Student, mask: FieldMask): void {
        const fields: string[] = [];
        
        // Добавляем только те поля, которые указаны в маске
        if (mask.id) fields.push(`ID: ${student.id}`);
        if (mask.name) fields.push(`Имя: ${student.name}`);
        if (mask.gpa) fields.push(`GPA: ${student.gpa.toFixed(2)}`);
        if (mask.age) fields.push(`Возраст: ${student.age}`);
        if (mask.status) fields.push(`Статус: ${student.status}`);
        
        console.log(fields.join(', '));
    }
}