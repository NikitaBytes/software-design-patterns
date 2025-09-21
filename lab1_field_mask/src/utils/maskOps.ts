
// МЕТОДЫ ДЛЯ КОМБИНИРОВАНИЯ МАСОК

/**
 * Объединение двух масок (логическое ИЛИ)
 * @param mask1 - Первая маска
 * @param mask2 - Вторая маска
 * @returns Новая маска с объединением
 */
import { FieldMask } from '../masks/FieldMask';
export function unionMasks(mask1: FieldMask, mask2: FieldMask): FieldMask {
    return new FieldMask(
        mask1.id || mask2.id,
        mask1.name || mask2.name,
        mask1.gpa || mask2.gpa,
        mask1.age || mask2.age,
        mask1.status || mask2.status
    );
}

/**
 * Пересечение двух масок (логическое И)
 * @param mask1 - Первая маска
 * @param mask2 - Вторая маска
 * @returns Новая маска с пересечением
 */
export function intersectMasks(mask1: FieldMask, mask2: FieldMask): FieldMask {
    return new FieldMask(
        mask1.id && mask2.id,
        mask1.name && mask2.name,
        mask1.gpa && mask2.gpa,
        mask1.age && mask2.age,
        mask1.status && mask2.status
    );
}

/**
 * Инверсия маски (логическое НЕ)
 * @param mask - Исходная маска
 * @returns Инвертированная маска
 */
export function invertMask(mask: FieldMask): FieldMask {
    return new FieldMask(
        !mask.id,
        !mask.name,
        !mask.gpa,
        !mask.age,
        !mask.status
    );
}
