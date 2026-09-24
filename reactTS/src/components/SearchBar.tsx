interface SearchBarProps {
    searchText: string;
    onSearchChange: (text: string) => void;
    sortOption: string;
    onSortOption: (option: string) => void;
}

export function SearchBar({ searchText, onSearchChange, sortOption, onSortOption }: SearchBarProps) {
    return (
        <>
            <div>
                <label htmlFor="searchCar" className="visually-hidden">Поиск автомобиля</label>
                <input
                    type="text"
                    id="searchCar"
                    placeholder="Поиск автомобиля"
                    value={searchText}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="sortCars" className="visually-hidden">Сортировка</label>
                <select
                    id="sortCars"
                    value={sortOption}
                    onChange={(e) => onSortOption(e.target.value)}
                >
                    <option value="default">по умолчанию</option>
                    <option value="priceAsc">цена ↑</option>
                    <option value="priceDesc">цена ↓</option>
                    <option value="yearAsc">год ↑</option>
                    <option value="yearDesc">год ↓</option>
                </select>
            </div>
        </>
    )
}