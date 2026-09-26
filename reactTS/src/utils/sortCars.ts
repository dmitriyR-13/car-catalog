import type { Car } from "../types";

export function sortCars(cars: Car[], sortOption: string): Car[] {
  const result = [...cars];
  switch (sortOption) {
    case 'priceAsc':
      return result.sort((a, b) => a.price - b.price);
    case 'priceDesc':
      return result.sort((a, b) => b.price - a.price);
    case 'yearAsc':
      return result.sort((a, b) => a.year - b.year);
    case 'yearDesc':
      return result.sort((a, b) => b.year - a.year);
    default:
      return result;
  }
}
