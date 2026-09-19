import type { Car, NewCarData } from "./types";
export class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

async function request(url: string, options?: RequestInit): Promise<Response> {
    let response: Response;
    try {
        response = await fetch(url, options);
    } catch {
        throw new Error('Сервер недоступен');
    }

    if (!response.ok) {
        let message = `Ошибка HTTP: ${response.status}`;
        try {
            const errorData = await response.json();
            if (errorData.message) message = errorData.message;
        } catch {
            //сервер не прислал валидный json
        }
        throw new ApiError(message, response.status);
    }

    return response;
}

export async function getCars(): Promise<Car[]> {
    const response = await request('/api/cars');
    const cars: Car[] = await response.json();
    return cars;
}

export async function addCar(carData: NewCarData): Promise<Car> {
    const response = await request('/api/cars', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(carData)
    });
    const newCar: Car = await response.json();
    return newCar;
}

export async function updateCar(id: number, carData: NewCarData): Promise<Car> {
    const response = await request(`/api/cars/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(carData)
    });
    const updatedCar: Car = await response.json();
    return updatedCar;
}

export async function deleteCar(id: number): Promise<void> {
    await request(`/api/cars/${id}`, {
        method: 'DELETE'
    });
}