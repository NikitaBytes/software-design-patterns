
// JSON DTO ДЛЯ REST API

/**
 * Преобразование студента в JSON с учетом маски полей
 * @param student - Студент для преобразования
 * @param mask - Маска полей
 * @returns JSON объект с выбранными полями
 */
import { Student } from '../domain/Student';
import { FieldMask } from '../masks/FieldMask';
export function studentToJSON(student: Student, mask: FieldMask): any {
    const json: any = {};
    
    // Добавляем только поля из маски
    if (mask.id) json.id = student.id;
    if (mask.name) json.name = student.name;
    if (mask.gpa) json.gpa = student.gpa;
    if (mask.age) json.age = student.age;
    if (mask.status) json.status = student.status;
    
    return json;
}
