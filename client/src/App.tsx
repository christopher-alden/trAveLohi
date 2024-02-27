import  { Suspense } from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {MappedRoutes} from './layout/routes.layout';
import {UserProvider} from './context/userContext';
import { SearchProvider } from './context/searchContext';
import { QueryClient, QueryClientProvider  } from 'react-query';
import { ReservationProvider } from './context/reservationContext';

export const queryClient = new QueryClient()

function App() {

	return (
	<Router>
		<QueryClientProvider client={queryClient}>
			<UserProvider>
				<SearchProvider>
					<ReservationProvider>
							<Routes>
								{MappedRoutes.map((route, index) => (
									<Route
										key={index}
										path={route.path}
										element={<Suspense fallback={<div>Loading...</div>}>{route.element}</Suspense>}
									/>
								))}
							</Routes>
						</ReservationProvider>
				</SearchProvider>
			</UserProvider>
		</QueryClientProvider>
	</Router>
	);
}

export default App;
