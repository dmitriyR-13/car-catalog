export class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

async function request(url, options) {
    let response;
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
        } catch { }
        throw new ApiError(message, response.status);
    }

    return response;
}

export async function getCars() {
    const response = await request('/api/cars');
    const cars = await response.json();
    return cars;
}

export async function addCar(carData) {
    const response = await request('/api/cars', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(carData)
    });
    const newCar = await response.json();
    return newCar;
}

export async function updateCar(id, carData) {
    const response = await request(`/api/cars/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(carData)
    });
    const updatedCar = await response.json();
    return updatedCar;
}

export async function deleteCar(id) {
    await request(`/api/cars/${id}`, {
        method: 'DELETE'
    });
}
