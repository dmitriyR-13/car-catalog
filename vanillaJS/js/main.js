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

const catalog = document.querySelector('#catalog');
const inputSearch = document.querySelector('#searchCar');
const sortSelect = document.querySelector('#sortCars');
const dialog = document.querySelector('#carDialog');
const closeBtn = document.querySelector('#closeBtn');
const catalogStatus = document.querySelector('#catalogStatus');
const addCarBtn = document.querySelector('#addCarBtn');
const addCarDialog = document.querySelector('#addCarDialog');
const addCarForm = document.querySelector('#addCarForm');
const cancelAddBtn = document.querySelector('#cancelAddBtn');
const brandInput = document.querySelector('#brandInput');
const modelInput = document.querySelector('#modelInput');
const yearInput = document.querySelector('#yearInput');
const engineInput = document.querySelector('#engineInput');
const powerInput = document.querySelector('#powerInput');
const priceInput = document.querySelector('#priceInput');
const submitBtn = addCarForm.querySelector('button[type="submit"]');
const formError = document.querySelector('#formError');

let cars = [];
let editingCarId = null;

function getErrorMessage(error) {
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
    const button = event.target;
    if (!button.matches('button')) {
        return;
    }
    const card = button.closest('.cardCar');
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
        yearInput.value = car.year;
        engineInput.value = car.engine;
        powerInput.value = car.power;
        priceInput.value = car.price;

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
        if (isEditing) {
            const updatedCar = await updateCar(editingCarId, carData);
            const car = cars.find(car => car.id === editingCarId);
            Object.assign(car, updatedCar);
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

function validateCar(carData) {
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

async function loadCars() {
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

function getCarFromForm() {
    const formData = new FormData(addCarForm);
    return {
        brand: formData.get('brand'),
        model: formData.get('model'),
        year: Number(formData.get('year')),
        engine: Number(formData.get('engine')),
        power: Number(formData.get('power')),
        price: Number(formData.get('price'))
    }
}

loadCars()