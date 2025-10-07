// АБСТРАКЦИЯ БАЗЫ ДАННЫХ

import { Student } from '../domain/Student';
import { FieldMask } from '../masks/FieldMask';

function isEqualByMask(a: Student, b: Student, mask: FieldMask): boolean {
    if (mask.id && a.id !== b.id) return false;
    if (mask.name && a.name !== b.name) return false;
    if (mask.gpa && Math.abs(a.gpa - b.gpa) > 0.01) return false;
    if (mask.age && a.age !== b.age) return false;
    if (mask.status && a.status !== b.status) return false;
    return true;
}

export class StudentDatabase {
    // Массив для хранения студентов.  поле
    private students: Student[] = [];
    
    /**
     * Добавить студента в базу данных
     * @param student - Студент для добавления
     */
    add(student: Student): void {
        // Тип void означает, что метод ничего не возвращает, только добавляет студента в массив
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
     * Объединить объекты с одинаковыми значениями полей согласно маске
     * @param mask - Маска, определяющая, какие поля сравнивать
     */
    mergeByMask(mask: FieldMask): void {
        const merged: Student[] = [];
        const used = new Set<number>();
        
        for (let i = 0; i < this.students.length; i++) {
            // Пропустить объекты, которые уже были объединены
            if (used.has(i)) continue;
            
            const current = this.students[i];
            const group: Student[] = [current];
            used.add(i);
            
            for (let j = i + 1; j < this.students.length; j++) {
                if (used.has(j)) continue;
                
                const other = this.students[j];
                
                if (isEqualByMask(current, other, mask)) {
                    group.push(other); // Добавить похожий объект в группу
                    used.add(j); // Отметить объект как объединённый
                }
            }
            
            if (group.length > 1) {
                const averageGpa = group.reduce((sum, s) => sum + s.gpa, 0) / group.length;
                const mergedStudent = new Student(
                    current.id,
                    current.name,
                    averageGpa,
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
            if (isEqualByMask(student, source, compareMask)) {
                // Если объект подходит копируем поля согласно copyMask
                if (copyMask.id) student.id = source.id;
                if (copyMask.name) student.name = source.name;
                if (copyMask.gpa) student.gpa = source.gpa;
                if (copyMask.age) student.age = source.age;
                if (copyMask.status) student.status = source.status;
            }
        });
    }
}
