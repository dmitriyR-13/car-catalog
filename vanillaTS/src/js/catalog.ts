import type { Car } from "./types.js";

const catalog = document.querySelector('#catalog') as HTMLElement;
const inputSearch = document.querySelector('#searchCar') as HTMLInputElement;
const sortSelect = document.querySelector('#sortCars') as HTMLSelectElement;
const dialog = document.querySelector('#carDialog') as HTMLDialogElement;
const dialogTitle = document.querySelector('#dialogTitle') as HTMLElement;
const dialogInfo = document.querySelector('#dialogInfo') as HTMLElement;

function createInfoRow(text: string, className?: string): HTMLParagraphElement {
    const el = document.createElement('p');
    el.textContent = text;
    if (className) el.className = className;
    return el;
}

function createCarCard(car: Car): HTMLDivElement {
    const card = document.createElement('div');
    card.className = 'cardCar';
    card.dataset.id = String(car.id);

    const model = createInfoRow(`${car.brand} ${car.model}`, 'car-model');

    const info = document.createElement('div');
    info.className = 'car-info';
    info.append(
        createInfoRow(`Год: ${car.year}`, 'car-year'),
        createInfoRow(`Объем: ${car.engine}`, 'car-engine'),
        createInfoRow(`Мощность: ${car.power} л.с.`, 'car-power')
    );

    const price = createInfoRow(`${car.price} ₽`, 'car-price');

    const detailsBtn = document.createElement('button');
    detailsBtn.className = 'modalInfo';
    detailsBtn.textContent = 'подробнее';

    const delBtn = document.createElement('button');
    delBtn.className = 'deleteBtn';
    delBtn.textContent = 'удалить автомобиль';

    const editBtn = document.createElement('button');
    editBtn.className = 'editBtn';
    editBtn.textContent = 'редактировать данные';

    card.append(model, info, price, detailsBtn, delBtn, editBtn);
    return card;
}

export function renderCars(cars: Car[]): void {
    catalog.textContent = '';
    cars.forEach(car => catalog.append(createCarCard(car)));
}

export function sortCars(cars: Car[]): Car[] {
    const result = [...cars];
    switch (sortSelect.value) {
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

export function updateCatalog(cars: Car[]): void {
    const searchText = inputSearch.value.toLowerCase();
    let result = cars.filter(car => (
        car.brand + ' ' + car.model)
        .toLowerCase()
        .includes(searchText));
    result = sortCars(result);
    renderCars(result);
}

export function showCarDetails(car: Car | undefined): void {
    if (!car) {
        return;
    }
    dialogTitle.textContent = car.brand + ' ' + car.model;
    dialogInfo.textContent = '';
    dialogInfo.append(
        createInfoRow(`Год: ${car.year}`),
        createInfoRow(`Объем: ${car.engine}`),
        createInfoRow(`Мощность: ${car.power} л.с.`),
        createInfoRow(`${car.price} ₽`)
    );
    dialog.showModal();
}

export function getCarById(cars: Car[], id: number): Car | undefined {
    return cars.find(car => car.id === id);
}