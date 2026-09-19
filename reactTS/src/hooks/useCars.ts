import { useState, useEffect, useCallback } from "react";
import type { Car, NewCarData } from "../types";
import { getCars, addCar, updateCar, deleteCar } from "../api";

export function useCars() {
    const [cars, setCars] = useState<Car[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadCars = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getCars();
            setCars(data);
        } catch (err) {
            console.error('Ошибка при загрузке автомобилей:', err)
            setError('Не удалось загрузить автомобили');
        } finally {
            setIsLoading(false);
        }
    }, []);
    useEffect(() => {
        //eslint-disable-next-line react-hooks/set-state-in-effect -- 
        loadCars();
    }, [loadCars]);
    return {
        cars, isLoading, error, loadCars
    };

    const add = useCallback(async (carData: NewCarData) => {
        const newCar = await addCar(carData);
        setCars(prev => [...prev, newCar]);
    }, []);

    const update = useCallback(async (id: number, carData: NewCarData) => {
        const updatedCar = await updateCar(id, carData);
        setCars(prev => prev.map(car => car.id === id ? updatedCar : car));
    }, []);

    const remove = useCallback(async (id: number) => {
        await deleteCar(id);
        setCars(prev => prev.filter(car => car.id !== id));
    }, []);

    return {
        cars, isLoading, error, add, update, remove
    }
}