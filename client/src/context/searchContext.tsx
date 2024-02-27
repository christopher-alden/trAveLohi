import React, {createContext, useState, useContext, useEffect} from 'react';
import { Airport } from '@myTypes/location.types';
import {ApiEndpoints} from '@util/api.utils';
import debounce from 'lodash.debounce'
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
// This context is the main controller for all searching
// Its called in different search controllers
// searchTerm should be inputted in FloatingSearch
// searchResults should be displayed in FloatingSearch

interface SearchContextType {
	searchTerm: string;
	// setSearchTerm: (term: string) => void;
	searchResults: Airport[];
	setSearchResults: (results: Airport[]) => void;
	searchMode: 'hotels' | 'flights';
	setSearchMode: (mode: 'hotels' | 'flights') => void;
	performSearch: () => Promise<void>;
	handleSearch: (term:string) => void;
	execSearch: (url:string) => void
	isLoading: boolean
}

const SearchContextDefaultValues: SearchContextType = {
	searchTerm: '',
	searchResults: [],
	setSearchResults: () => {},
	searchMode: 'flights',
	setSearchMode: () => {},
	performSearch: async () => {},
	execSearch: ()=>{},
	handleSearch: () => {},
	isLoading: false,
};

const SearchContext = createContext<SearchContextType>(SearchContextDefaultValues);

// Use this to call
export const useSearch = () => useContext(SearchContext);

export const SearchProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [searchResults, setSearchResults] = useState<Airport[]>([]);
	const [searchMode, setSearchMode] = useState<'hotels' | 'flights'>('flights');

	const navigate = useNavigate()

	// use this to modify the search term, this debounces the search to avoid multiple API calls
	// search onChange
	const handleSearch = debounce((term:string)=>{
		setSearchTerm(term)
	},700)


	// only fetches data related to airports
	const fetchAirports = async () => {
		const url = `${ApiEndpoints.AirportSearch}?mode=${encodeURIComponent(searchMode)}&term=${encodeURIComponent(searchTerm)}`;
		const res = await fetch(url);
		if (!res.ok) throw new Error ('Failed to fetch search')
		return res.json();
	};
	

	// main logic on the flights and hotels mode
	// this is called inside react query 
	const performSearch = async () => {
		if (searchMode == 'flights') {
			return fetchAirports();
		}
		else if(searchMode == 'hotels'){

		}
	};

	// !! CALL THIS TO RUN SEARCH
	const execSearch = (searchQuery:string) =>{
		navigate(searchQuery)
        // window.location.reload();
	}

	// this will handle all the async state management
	// will be modified to handle different modes
	// main error and loading state will come from here
	const { error, isLoading } = useQuery(['performSearch', searchTerm, searchMode], performSearch,{
		retry:false,
		enabled: !!searchTerm,
		staleTime: 1 * 5 * 1000,
		cacheTime: 15 * 60 * 1000,
		onSuccess: (data) =>{
			if(searchMode == 'flights'){
				if(data == null) throw new Error('No data')
				const airports: Airport[] = data.map((item: any) => ({
					...item,
					ID:item.id,
				}));
				setSearchResults(airports)
			}
		},
		onError : (error) =>{
			console.error('Failed to fetch locations:', error);
			setSearchResults([]);
		},
	})


	return (
		<SearchContext.Provider
			value={{searchTerm, handleSearch, searchResults, setSearchResults, searchMode, setSearchMode, performSearch, execSearch, isLoading}}
		>
			{children}
		</SearchContext.Provider>
	);
};
