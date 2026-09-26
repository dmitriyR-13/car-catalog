import { describe, it, expect } from 'vitest';
import { sortCars } from './sortCars';
import type { Car } from '../types';

describe('sortCars', () => {
    const cars: Car[] = [
        { id: 1, brand: 'BMW', model: 'X5', year: 2015, engine: 3.0, power: 250, price: 3000000 },
        { id: 2, brand: 'Audi', model: 'A4', year: 2020, engine: 2.0, power: 190, price: 2500000 },
    ];

    it('сортирует по возрастанию цены', () => {
        const result = sortCars(cars, 'priceAsc');
        expect(result[0].price).toBe(2500000);
    });
    it('сортирует по убыванию цены', () => {
        const result = sortCars(cars, 'priceDesc');
        expect(result[0].price).toBe(3000000);
    });
    it('сортирует по возрастанию года', () => {
        const result = sortCars(cars, 'yearAsc');
        expect(result[0].year).toBe(2015)
    });
    it('не меняет порядок при sortOption "default"', () => {
        const result = sortCars(cars, 'default');
        expect(result[0].brand).toBe('BMW');
    });
});