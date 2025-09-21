
// АБСТРАКЦИЯ БАЗЫ ДАННЫХ

import { Student } from '../domain/Student';
import { FieldMask } from '../masks/FieldMask';
export class StudentDatabase {
    // Массив для хранения студентов
    private students: Student[] = [];
    
    /**
     * Добавить студента в базу данных
     * @param student - Студент для добавления
     */
    add(student: Student): void {
        this.students.push(student);
    }
    
    /**
     * Найти всех студентов по имени
     * @param name - Имя для поиска
     * @returns Массив найденных студентов
     */
    findByName(name: string): Student[] {
        return this.students.filter(s => s.name === name);
    }
    
    /**
     * Получить всех студентов
     * @returns Массив всех студентов
     */
    getAll(): Student[] {
        return [...this.students];
    }
    
    /**
     * Слияние объектов с одинаковыми значениями полей согласно маске
     * @param mask - Маска для определения полей сравнения
     */
    mergeByMask(mask: FieldMask): void {
        const merged: Student[] = [];
        const used = new Set<number>();
        
        for (let i = 0; i < this.students.length; i++) {
            // Пропускаем уже обработанные
            if (used.has(i)) continue;
            
            const current = this.students[i];
            const group: Student[] = [current];
            used.add(i);
            
            // Ищем похожие объекты
            for (let j = i + 1; j < this.students.length; j++) {
                if (used.has(j)) continue;
                
                const other = this.students[j];
                
                // Сравниваем по маске
                let equal = true;
                if (mask.id && current.id !== other.id) equal = false;
                if (mask.name && current.name !== other.name) equal = false;
                if (mask.gpa && current.gpa !== other.gpa) equal = false;
                if (mask.age && current.age !== other.age) equal = false;
                if (mask.status && current.status !== other.status) equal = false;
                
                if (equal) {
                    group.push(other);
                    used.add(j);
                }
            }
            
            // Если в группе больше одного элемента - сливаем
            if (group.length > 1) {
                // Берем первый объект как основу
                const mergedStudent = new Student(
                    current.id,
                    current.name,
                    // Для GPA берем среднее значение
                    group.reduce((sum, s) => sum + s.gpa, 0) / group.length,
                    current.age,
                    current.status
                );
                merged.push(mergedStudent);
            } else {
                merged.push(current);
            }
        }
        
        this.students = merged;
    }
    
    /**
     * Копирование данных для всех объектов, которые равны согласно маске
     * @param compareMask - Маска для сравнения объектов
     * @param source - Объект-источник данных
     * @param copyMask - Маска полей для копирования
     */
    copyFieldsByMask(compareMask: FieldMask, source: Student, copyMask: FieldMask): void {
        this.students.forEach(student => {
            // Проверяем соответствие по маске сравнения
            let match = true;
            if (compareMask.id && student.id !== source.id) match = false;
            if (compareMask.name && student.name !== source.name) match = false;
            if (compareMask.gpa && Math.abs(student.gpa - source.gpa) > 0.01) match = false;
            if (compareMask.age && student.age !== source.age) match = false;
            if (compareMask.status && student.status !== source.status) match = false;
            
            // Если объект подходит - копируем поля согласно copyMask
            if (match) {
                if (copyMask.id) student.id = source.id;
                if (copyMask.name) student.name = source.name;
                if (copyMask.gpa) student.gpa = source.gpa;
                if (copyMask.age) student.age = source.age;
                if (copyMask.status) student.status = source.status;
            }
        });
    }
}
