import { useState } from "react";
import { useCars } from "./hooks/useCars";
import { SearchBar } from "./components/SearchBar";
import { CarList } from "./components/CarsList";
import type { Car } from "./types";

function App() {
  const { cars, isLoading, error, add, update, remove } = useCars();
  const [searchText, setSearchText] = useState('');
  const [sortOption, setSortOption] = useState('default');

  const filteredCars = cars.filter(car => (car.brand + ' ' + car.model).toLowerCase().includes(searchText));
  const sortedCars = sortCars(filteredCars, sortOption);

  return (
    <>
      <div>
        <h1 id="mainTitle">Auto Catalog</h1>
        <SearchBar
          searchText={searchText}
          onSearchChange={setSearchText}
          sortOption={sortOption}
          onSortOption={setSortOption}
        />
        <CarList
          cars={sortedCars}
          onShowDetails={() => {}}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      </div>
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