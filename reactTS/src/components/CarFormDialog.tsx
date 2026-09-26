import { useEffect, useState } from "react";
import type { Car, NewCarData } from "../types";
import { validateCar } from "../utils/validateCar";
interface CarFormDialogProps {
    isOpen: boolean;
    editingCar: Car | null;
    onClose: () => void;
    onSubmit: (carData: NewCarData) => Promise<void>;
}

export function CarFormDialog({ isOpen, editingCar, onClose, onSubmit }: CarFormDialogProps) {
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [engine, setEngine] = useState('');
    const [power, setPower] = useState('');
    const [price, setPrice] = useState('');
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        //eslint-disable-next-line react-hooks/set-state-in-effect -- 
        setBrand(editingCar?.brand ?? '');
        setModel(editingCar?.model ?? '');
        setYear(String(editingCar?.year ?? ''));
        setEngine(String(editingCar?.engine ?? ''));
        setPower(String(editingCar?.power ?? ''));
        setPrice(String(editingCar?.price ?? ''));
    }, [editingCar]);

    if (!isOpen) {
        return null;
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const carData: NewCarData = {
            brand,
            model,
            year: Number(year),
            engine: Number(engine),
            power: Number(power),
            price: Number(price)
        }
        const validationError = validateCar(carData);
        if (validationError) {
            setFormError(validationError);
            return;
        }
        try {
            await onSubmit(carData);
        } catch {
            setFormError('Ошибка сохранения')
        }
    }

    return (
        <dialog id="addCarDialog" open>
            <form id="addCarForm" onSubmit={handleSubmit}>
                <label htmlFor="brandInput" className="visually-hidden">Бренд автомобиля</label>
                <input
                    type="text"
                    id="brandInput"
                    placeholder="Бренд"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    required
                />
                <label htmlFor="modelInput" className="visually-hidden">Модель автомобиля</label>
                <input
                    type="text"
                    id="modelInput"
                    placeholder="Модель"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    required
                />
                <label htmlFor="yearInput" className="visually-hidden">Год выпуска</label>
                <input
                    type="number"
                    min="1900"
                    max="2026"
                    id="yearInput"
                    placeholder="Год"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                />
                <label htmlFor="engineInput" className="visually-hidden">Объем двигателя</label>
                <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    id="engineInput"
                    placeholder="Объем двигателя"
                    value={engine}
                    onChange={(e) => setEngine(e.target.value)}
                    required
                />
                <label htmlFor="powerInput" className="visually-hidden">Мощность двигателя</label>
                <input
                    type="number"
                    min="1"
                    id="powerInput"
                    placeholder="Мощность"
                    value={power}
                    onChange={(e) => setPower(e.target.value)}
                    required
                />
                <label htmlFor="priceInput" className="visually-hidden">Цена автомобиля</label>
                <input
                    type="number"
                    min="1"
                    id="priceInput"
                    placeholder="Цена"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
                {formError && <p>{formError}</p>}
                <button type="submit">
                    {editingCar ? 'Сохранить изменения' : 'Добавить'}
                </button>
                <button type="button" onClick={onClose}>Отмена</button>
            </form>
        </dialog>
    );
}