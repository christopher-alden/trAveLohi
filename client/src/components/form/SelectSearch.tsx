import { useState, useEffect } from 'react';
import FloatingSearch from '@comp/navigation/FloatingSearch';
import styles from '@styles/global.module.scss';
import Label from '@comp/form/Label';
import { Airport } from '@myTypes/location.types';
import { useSearch } from 'src/context/searchContext';

type SelectSearchProps = {
    getSelected: (result: Airport) => void; 
    selectedLocation: Airport | null; // Accept the current selection as a prop
    mainTheme?: boolean
};

const SelectSearch = ({ getSelected, selectedLocation, mainTheme=true }: SelectSearchProps) => {
    const { handleSearch, searchResults } = useSearch();
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const handleLocationSelect = (location: Airport) => {
        getSelected(location); // Notify parent component
        setIsSearchVisible(false); // Close the search modal
    };

    return (
        <>
            <Label
                onClick={() => setIsSearchVisible(true)}
                fontSize={styles.f3xl}
                fontWeight="700"
                color={mainTheme ? styles.black: styles.white}
                className="pointer"
            >
                {selectedLocation ? `${selectedLocation.city}` : 'Select'}
            </Label>
            {isSearchVisible && (
                <FloatingSearch handleClose={() => setIsSearchVisible(false)} onSearchChange={handleSearch}>
                    {searchResults.map((result, index) => (
                        <Label
                            className="search-results pointer" 
                            key={index}
                            onClick={() => handleLocationSelect(result)}
                            color={styles.white}
                        >
                            {`${result.city}, ${result.country}`}
                        </Label>
                    ))}
                </FloatingSearch>
            )}
        </>
    );
};


export default SelectSearch;
