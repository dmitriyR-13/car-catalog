export interface Car {
    id: number;
    brand: string;
    model: string;
    year: number;
    engine: number;
    power: number;
    price: number;
}


export type NewCarData = Omit<Car, 'id'>;