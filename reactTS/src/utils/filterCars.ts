import type { Car } from "../types";

export function filterCars(cars: Car[], searchText: string): Car[] {
    return cars.filter(car => (car.brand + ' ' + car.model).toLowerCase().includes(searchText.toLowerCase()));
}