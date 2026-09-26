import { describe, it, expect } from "vitest";
import { filterCars } from "./filterCars";
import type { Car } from "../types";

describe('filterCars', () => {
    const cars: Car[] = [
        { id: 1, brand: 'BMW', model: 'X5', year: 2015, engine: 3.0, power: 250, price: 3000000 },
        { id: 2, brand: 'Audi', model: 'A4', year: 2020, engine: 2.0, power: 190, price: 2500000 },
        { id: 3, brand: 'Toyota', model: 'Camry', year: 2018, engine: 2.5, power: 180, price: 2100000 },
    ];
    it ('находит машину по бренду', () => {
        const result = filterCars(cars, 'bmw')
        expect(result.length).toBe(1)
        expect(result[0].brand).toBe('BMW')
    })
    it ('назодит машину по моделе', () => {
        const result = filterCars(cars, 'a4')
        expect(result.length).toBe(1)
        expect(result[0].model).toBe('A4')
    })
    it ('поиск не чувствительный к регистру', () => {
        const result = filterCars(cars, 'TOYOTA')
        expect(result.length).toBe(1)
        expect(result[0].brand).toBe('Toyota')
    })
    it ('пустая строка возвращает все машины', () => {
        const result = filterCars(cars, '')
        expect(result.length).toBe(3)
    })
    it ('несуществующий запрос возвращает пустой массив', () => {
        const result = filterCars(cars, 'ferrari')
        expect(result.length).toBe(0)
    })
})