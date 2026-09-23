import { useState } from "react";
import { useCars } from "./hooks/useCars";
import { SearchBar } from "./components/SearchBar";
import { CarList } from "./components/CarsList";
import type { Car, NewCarData } from "./types";
import { CarDetailsDialog } from "./components/CarDetailsDialog";
import { CarFormDialog } from "./components/CarFormDialog";

function App() {
  const { cars, isLoading, error, add, update, remove } = useCars();
  const [searchText, setSearchText] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  const filteredCars = cars.filter(car => (car.brand + ' ' + car.model).toLowerCase().includes(searchText));
  const sortedCars = sortCars(filteredCars, sortOption);

  async function handleSubmit(carData: NewCarData) {
    if (editingCar) {
      await update(editingCar.id, carData);
    } else {
      await add(carData);
    }
    setIsFormOpen(false);
    setEditingCar(null);
  }


  return (
    <>
      <h1 id="mainTitle">Auto Catalog</h1>
      <div id="controls">
        <SearchBar
          searchText={searchText}
          onSearchChange={setSearchText}
          sortOption={sortOption}
          onSortOption={setSortOption}
        />
        <button
          id="addCarBtn"
          onClick={() => {
            setEditingCar(null)
            setIsFormOpen(true)
          }}>
          Добавить автомобиль
        </button>
      </div>
      <CarList
        cars={sortedCars}
        onShowDetails={(car) => { setSelectedCar(car) }}
        onEdit={(car) => {
          setEditingCar(car)
          setIsFormOpen(true)
        }}
        onDelete={async (car) => {
          const confirmed = confirm(`Удалить ${car.brand} ${car.model}?`);
          if (!confirmed) {
            return;
          }
          await remove(car.id);
        }}
      />
      <CarDetailsDialog
        car={selectedCar}
        onClose={() => setSelectedCar(null)}
      />
      <CarFormDialog
        isOpen={isFormOpen}
        editingCar={editingCar}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCar(null);
        }}
        onSubmit={handleSubmit}
      />
    </>
  )
}

function sortCars(cars: Car[], sortOption: string): Car[] {
  const result = [...cars];
  switch (sortOption) {
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

export default App;