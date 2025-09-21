
// МАСКА ПОЛЕЙ (БИТОВАЯ)

/**
 * Битовая маска полей для оптимизации памяти
 * Использует биты для хранения состояния полей
 */
export class BitFieldMask {
    // Битовые флаги для каждого поля
    private static readonly ID_BIT = 0b00001;      // 1
    private static readonly NAME_BIT = 0b00010;    // 2
    private static readonly GPA_BIT = 0b00100;     // 4
    private static readonly AGE_BIT = 0b01000;     // 8
    private static readonly STATUS_BIT = 0b10000;  // 16
    
    /**
     * Конструктор битовой маски
     * @param mask - Битовое представление маски
     */
    constructor(private mask: number = 0) {}
    
    /**
     * Получить состояние поля id
     */
    get id(): boolean {
        return (this.mask & BitFieldMask.ID_BIT) !== 0;
    }
    
    /**
     * Получить состояние поля name
     */
    get name(): boolean {
        return (this.mask & BitFieldMask.NAME_BIT) !== 0;
    }
    
    /**
     * Получить состояние поля gpa
     */
    get gpa(): boolean {
        return (this.mask & BitFieldMask.GPA_BIT) !== 0;
    }
    
    /**
     * Получить состояние поля age
     */
    get age(): boolean {
        return (this.mask & BitFieldMask.AGE_BIT) !== 0;
    }
    
    /**
     * Получить состояние поля status
     */
    get status(): boolean {
        return (this.mask & BitFieldMask.STATUS_BIT) !== 0;
    }
    
    /**
     * Установить состояние поля id
     * @param value - Новое состояние
     */
    setId(value: boolean): void {
        if (value) {
            this.mask |= BitFieldMask.ID_BIT;
        } else {
            this.mask &= ~BitFieldMask.ID_BIT;
        }
    }
    
    /**
     * Установить состояние поля name
     * @param value - Новое состояние
     */
    setName(value: boolean): void {
        if (value) {
            this.mask |= BitFieldMask.NAME_BIT;
        } else {
            this.mask &= ~BitFieldMask.NAME_BIT;
        }
    }
    
    /**
     * Объединение масок (OR)
     * @param other - Другая маска
     * @returns Новая маска с объединением
     */
    union(other: BitFieldMask): BitFieldMask {
        return new BitFieldMask(this.mask | other.mask);
    }
    
    /**
     * Пересечение масок (AND)
     * @param other - Другая маска
     * @returns Новая маска с пересечением
     */
    intersect(other: BitFieldMask): BitFieldMask {
        return new BitFieldMask(this.mask & other.mask);
    }
    
    /**
     * Инверсия маски (NOT)
     * @returns Новая инвертированная маска
     */
    invert(): BitFieldMask {
        // Используем маску 0b11111 для ограничения только нашими 5 полями
        return new BitFieldMask((~this.mask) & 0b11111);
    }
}
