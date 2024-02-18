import  { Suspense } from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {MappedRoutes} from './layout/routes.layout';
import {UserProvider} from './context/userContext';
import { SearchProvider } from './context/searchContext';
import { QueryClient, QueryClientProvider, useQuery  } from 'react-query';

export const queryClient = new QueryClient()

function App() {

	return (
		<QueryClientProvider client={queryClient}>
			<UserProvider>
				<SearchProvider>
					<Router>
						<Routes>
							{MappedRoutes.map((route, index) => (
								<Route
									key={index}
									path={route.path}
									element={<Suspense fallback={<div>Loading...</div>}>{route.element}</Suspense>}
								/>
							))}
						</Routes>
					</Router>
				</SearchProvider>
			</UserProvider>
		</QueryClientProvider>
	);
}

export default App;
