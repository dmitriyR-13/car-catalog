import { describe, it, expect } from "vitest";
import { validateCar } from "./validateCar";
import type { NewCarData } from "../types";

describe('validateCar', () => {
    const validCar: NewCarData = {
        brand: 'BMW',
        model: 'X5',
        year: 2020,
        engine: 3.0,
        power: 250,
        price: 3000000
    }
    it ('возвращает null для корректных даныых', () => {
        expect(validateCar(validCar)).toBe(null)
    })
    it ('возвращает ошибку если бренд пустой', () => {
        const invalidCar = {...validCar, brand: ''}
        const result = validateCar(invalidCar)
        expect(result).not.toBe(null)
    })
    it ('возвращает ошибку если модель пустая', () => {
        const invalidCar = {...validCar, model: ''}
        const result = validateCar(invalidCar)
        expect(result).not.toBe(null)
    })
    it ('возвращает ошибку если год < 1900', () => {
        const invalidCar = {...validCar, year: 1800}
        const result = validateCar(invalidCar)
        expect(result).not.toBe(null)
    })
    it ('возвращает ошибку если год > текущего', () => {
        const invalidCar = {...validCar, year: 2030}
        const result = validateCar(invalidCar)
        expect(result).not.toBe(null)
    })
    it ('возвращает ошибку если цена не корректна', () => {
        const invalidCar = {...validCar, price: -10}
        const result = validateCar(invalidCar)
        expect(result).not.toBe(null)
    })
})