import express from 'express';
import fs from 'fs/promises';
const app = express()

function pickCarFields(carData) {
    return {
        brand: carData.brand,
        model: carData.model,
        year: carData.year,
        engine: carData.engine,
        power: carData.power,
        price: carData.price
    };
}

function validateCar(carData) {
    if (typeof carData.brand !== 'string' || carData.brand.trim() === '') {
        return 'Введите корректный бренд';
    }
    if (typeof carData.model !== 'string' || carData.model.trim() === '') {
        return 'Введите корректную модель';
    }
    if (typeof carData.year !== 'number' || Number.isNaN(carData.year) ||
        carData.year < 1900 || carData.year > new Date().getFullYear()) {
        return 'Введите верный год';
    }
    if (typeof carData.engine !== 'number' || Number.isNaN(carData.engine) ||
        carData.engine <= 0) {
        return 'Введите объем двигателя';
    }
    if (typeof carData.power !== 'number' || Number.isNaN(carData.power) ||
        carData.power <= 0) {
        return 'Введите мощность двигателя';
    }
    if (typeof carData.price !== 'number' || Number.isNaN(carData.price) ||
        carData.price <= 0) {
        return 'Введите стоимость автомобиля';
    }
    return null;
}

app.use(express.json())

app.get('/api/cars', async (req, res, next) => {
    try {
        const data = await fs.readFile('./data/cars.json', 'utf-8');
        const cars = JSON.parse(data);
        res.json(cars);
    } catch (error) {
        next(error);
    }
})

app.post('/api/cars', async (req, res, next) => {
    try {
        const data = await fs.readFile('./data/cars.json', 'utf-8');
        const cars = JSON.parse(data);
        const carData = req.body;
        const error = validateCar(carData);
        if (error) {
            return res.status(400).json({
                message: error
            });
        }
        const newId = cars.length > 0
            ? Math.max(...cars.map(car => car.id)) + 1
            : 1;
        const newCar = {
            id: newId,
            ...pickCarFields(carData)
        };
        cars.push(newCar);
        await fs.writeFile('./data/cars.json', JSON.stringify(cars, null, 2));
        res.json(newCar);
    } catch (error) {
        next(error);
    }
})

app.patch('/api/cars/:id', async (req, res, next) => {
    try {
        const data = await fs.readFile('./data/cars.json', 'utf-8');
        const cars = JSON.parse(data);
        const carId = Number(req.params.id);
        const car = cars.find(car => car.id === carId);
        if (!car) {
            return res.status(404).json({
                message: 'Такого автомобиля нет'
            });
        };
        const carData = req.body;
        const error = validateCar(carData);
        if (error) {
            return res.status(400).json({
                message: error
            });
        }
        Object.assign(car, pickCarFields(carData));
        await fs.writeFile('./data/cars.json', JSON.stringify(cars, null, 2));
        res.json(car);
    } catch (error) {
        next(error);
    }
})

app.delete('/api/cars/:id', async (req, res, next) => {
    try {
        const data = await fs.readFile('./data/cars.json', 'utf-8');
        const cars = JSON.parse(data);
        const carId = Number(req.params.id);
        const newCars = cars.filter(car => car.id !== carId);
        if (cars.length === newCars.length) {
            return res.status(404).json({
                message: 'Такого автомобиля нет'
            });
        }
        await fs.writeFile('./data/cars.json', JSON.stringify(newCars, null, 2));
        res.status(204).send();
    } catch (error) {
        next(error);
    }
})

app.use(express.static('../vanillaJS'))

app.listen(3000)

app.use((error, req, res, next) => {
    console.error(error);
    return res.status(500).json({
        message: 'Внутренняя ошибка сервера'
    });
})