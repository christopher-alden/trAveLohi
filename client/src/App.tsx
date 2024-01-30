import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {MappedRoutes} from './layout/routes.layout';
import {UserProvider} from './context/userContext';

function App() {

	return (
		<UserProvider>
			<Router>
				<Routes>
					{MappedRoutes.map((route, index) => (
						<Route
							key={index}
							path={route.path}
							element={<React.Suspense fallback={<div>Loading...</div>}>{route.element}</React.Suspense>}
						/>
					))}
				</Routes>
			</Router>
		</UserProvider>
	);
}

export default App;
