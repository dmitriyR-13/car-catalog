import type { Car } from "../types";
interface CarCardProps {
    car: Car;
    onShowDetails: (car: Car) => void;
    onEdit: (car: Car) => void;
    onDelete: (car: Car) => void;
}

export function CarCard({car, onShowDetails, onEdit, onDelete}: CarCardProps) {
    return (
        <div className="cardCar">
            <h3 className="car-model">{car.brand} {car.model}</h3>
            <div className="car-info">
                <p className="car-year">Год: {car.year}</p>
                <p className="car-engine">Объем: {car.engine}</p>
                <p className="car-power">Мощность: {car.power} л.с.</p>
            </div>
            <p className="car-price">{car.price} ₽</p>
            <button className="modalInfo" onClick={() => onShowDetails(car)}>подробнее</button>
            <button className="deleteBtn" onClick={() => onDelete}>удалить автомобиль</button>
            <button className="editBtn" onClick={() => onEdit}>редактировать данные</button>
        </div>
    );
}