import type { NewCarData } from "../types";

export function validateCar(carData: NewCarData): string | null {
    if (!carData.brand.trim() || !carData.model.trim()) {
        return 'Введите бренд и модель автомобиля';
    }
    if (carData.year < 1900 || carData.year > new Date().getFullYear()) {
        return 'Введите корректный год';
    }
    if (carData.engine <= 0 || carData.power <= 0 || carData.price <= 0) {
        return 'Введите корректные данные'
    }
    return null;
}