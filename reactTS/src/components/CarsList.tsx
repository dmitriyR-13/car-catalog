import type { Car } from '../types';
import { CarCard } from './CarCard';

interface CarListProps {
    cars: Car[];
    onShowDetails: (car: Car) => void;
    onEdit: (car: Car) => void;
    onDelete: (car: Car) => void;
}

export function CarList({ cars, onShowDetails, onEdit, onDelete }: CarListProps) {
    return (
        <section id='catalog'>
            {cars.map(car => (
                <CarCard
                    key={car.id}
                    car={car}
                    onShowDetails={onShowDetails}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </section>
    )
}