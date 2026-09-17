import {
    getCars,
    addCar,
    deleteCar,
    updateCar,
    ApiError
} from "./api.js";

import {
    renderCars,
    updateCatalog,
    showCarDetails,
    getCarById,
} from "./catalog.js";

import type { Car, NewCarData } from "./types.js";

const catalog = document.querySelector('#catalog') as HTMLElement;
const inputSearch = document.querySelector('#searchCar') as HTMLInputElement;
const sortSelect = document.querySelector('#sortCars') as HTMLSelectElement;
const dialog = document.querySelector('#carDialog') as HTMLDialogElement;
const closeBtn = document.querySelector('#closeBtn') as HTMLButtonElement;
const catalogStatus = document.querySelector('#catalogStatus') as HTMLElement;
const addCarBtn = document.querySelector('#addCarBtn') as HTMLButtonElement;
const addCarDialog = document.querySelector('#addCarDialog') as HTMLDialogElement;
const addCarForm = document.querySelector('#addCarForm') as HTMLFormElement;
const cancelAddBtn = document.querySelector('#cancelAddBtn') as HTMLButtonElement;
const brandInput = document.querySelector('#brandInput') as HTMLInputElement;
const modelInput = document.querySelector('#modelInput') as HTMLInputElement;
const yearInput = document.querySelector('#yearInput') as HTMLInputElement;
const engineInput = document.querySelector('#engineInput') as HTMLInputElement;
const powerInput = document.querySelector('#powerInput') as HTMLInputElement;
const priceInput = document.querySelector('#priceInput') as HTMLInputElement;
const submitBtn = addCarForm.querySelector('button[type="submit"]') as HTMLButtonElement;
const formError = document.querySelector('#formError') as HTMLElement;

let cars: Car[] = [];
let editingCarId: number | null = null;

function getErrorMessage(error: unknown): string {
    if (error instanceof ApiError) {
        if (error.status === 404) {
            return 'Автомобиль не найден';
        }
        if (error.status === 400) {
            return error.message;
        }
        if (error.status === 500) {
            return 'Ошибка сервера';
        }
        return error.message;
    } else {
        return 'Сервер недоступен';
    }
}

inputSearch.addEventListener('input', () => {
    updateCatalog(cars);
})

sortSelect.addEventListener('change', () => {
    updateCatalog(cars);
})

catalog.addEventListener('click', async (event) => {
    const button = event.target as HTMLElement;
    if (!button.matches('button')) {
        return;
    }
    const card = button.closest('.cardCar') as HTMLElement | null;
    if (!card) {
        return;
    }
    const id = Number(card.dataset.id);
    if (button.classList.contains('modalInfo')) {
        const car = getCarById(cars, id);
        if (!car) {
            return;
        }
        showCarDetails(car);
    }
    if (button.classList.contains('deleteBtn')) {
        const car = getCarById(cars, id);
        if (!car) {
            return;
        }
        const confirmed = confirm(`Удалить ${car.brand} ${car.model}?`);
        if (!confirmed) {
            return;
        }
        try {
            await deleteCar(id);
            cars = cars.filter(car => car.id !== id);
            updateCatalog(cars);
            catalogStatus.textContent = '';
        } catch (error) {
            console.error('Ошибка при удалении автомобиля:', error);
            catalogStatus.textContent = getErrorMessage(error);
        }
    }
    if (button.classList.contains('editBtn')) {
        const car = getCarById(cars, id);
        if (!car) {
            catalogStatus.textContent = 'Автомобиль не найден';
            return;
        }

        editingCarId = id;

        brandInput.value = car.brand;
        modelInput.value = car.model;
        yearInput.value = String(car.year);
        engineInput.value = String(car.engine);
        powerInput.value = String(car.power);
        priceInput.value = String(car.price);

        submitBtn.textContent = 'Сохранить изменения';
        addCarDialog.showModal();
    }
})

closeBtn.addEventListener('click', () => dialog.close());

addCarBtn.addEventListener('click', () => {
    editingCarId = null;
    addCarForm.reset();
    addCarDialog.showModal();
    submitBtn.textContent = 'Добавить';
})

addCarForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const carData = getCarFromForm();
    const error = validateCar(carData);
    if (error) {
        formError.textContent = error;
        return;
    }
    submitBtn.disabled = true;
    submitBtn.textContent = 'Сохранение...';
    const isEditing = editingCarId !== null;
    try {
        if (isEditing && editingCarId !== null) {
            const updatedCar = await updateCar(editingCarId, carData);
            const car = cars.find(car => car.id === editingCarId);
            if (car) {
                Object.assign(car, updatedCar);
            }
        } else {
            const newCar = await addCar(carData);
            cars.push(newCar);
        }
        updateCatalog(cars);
        editingCarId = null;
        addCarForm.reset();
        addCarDialog.close();
    } catch (error) {
        console.error('Ошибка при сохранении', error);
        formError.textContent = getErrorMessage(error);
    } finally {
        submitBtn.disabled = false;
        if (isEditing) {
            submitBtn.textContent = 'Сохранить изменения';
        } else {
            submitBtn.textContent = 'Добавить';
        }
    }
})

function validateCar(carData: NewCarData): string | null {
    if (!carData.brand.trim() || !carData.model.trim()) {
        return 'Введите бренд и модель';
    }
    if (carData.year < 1900 || carData.year > new Date().getFullYear()) {
        return 'Введите корректный год';
    }
    if (carData.engine <= 0 || carData.power <= 0 || carData.price <= 0) {
        return 'Введите корректные данные';
    };
    return null;
}

cancelAddBtn.addEventListener('click', () => {
    editingCarId = null;
    addCarForm.reset();
    addCarDialog.close();
})

async function loadCars(): Promise<void> {
    catalogStatus.textContent = 'загрузка автомобилей';
    try {
        cars = await getCars();
        catalogStatus.textContent = '';
        renderCars(cars);
    } catch (error) {
        console.error(error);
        catalogStatus.textContent = getErrorMessage(error);
    }
}

function getCarFromForm(): NewCarData {
    const formData = new FormData(addCarForm);
    return {
        brand: formData.get('brand') as string,
        model: formData.get('model') as string,
        year: Number(formData.get('year')),
        engine: Number(formData.get('engine')),
        power: Number(formData.get('power')),
        price: Number(formData.get('price'))
    }
}

loadCars()