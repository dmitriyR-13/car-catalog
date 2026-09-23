import type { Car } from "../types";

interface CarDetailsDialogProps {
    car: Car | null;
    onClose: () => void;
}

export function CarDetailsDialog({ car, onClose }: CarDetailsDialogProps) {
    if (!car) {
        return null;
    }
    return (
        <dialog open>
            <h2>{car.brand} {car.model}</h2>
            <div>
                <p>Год: {car.year}</p>
                <p>Объем: {car.engine}</p>
                <p>Мощность: {car.power} л.с.</p>
                <p>{car.price}</p>
            </div>
            <button onClick={onClose}>Закрыть</button>
        </dialog>
    )
}