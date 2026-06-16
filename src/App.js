import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import store from './store';
import GlobalStyles from './styles/GlobalStyles';
import './styles/tailwind.css';

// Routes
import Hub from './routes/Hub';
import ValentineGame from './routes/ValentineGame';
import ShadowGarden from './routes/ShadowGarden';
import ShadowGardenWelcome from './routes/ShadowGardenWelcome';
import MusicRoom from './routes/MusicRoom';

// Store
import { migrateFromLocalStorage } from './store/slices/valentineSlice';
import { STORAGE_KEYS, loadFromStorage } from './utils/constants';

/**
 * Migration Component
 * Handles moving old localStorage data to Redux on first load
 */
const DataMigration = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check for existing progress in old location
    const oldProgress = loadFromStorage(STORAGE_KEYS.progress);
    
    // Check if we've already migrated (by checking the new Redux key in storage or just checking if old exists)
    if (oldProgress && Object.keys(oldProgress).length > 0) {
      console.log("Migrating existing progress to Redux store...");
      dispatch(migrateFromLocalStorage(oldProgress));
    }
  }, [dispatch]);

  return children;
};

function App() {
  return (
    <Provider store={store}>
      <DataMigration>
        <Router>
          <GlobalStyles />
          <Routes>
            <Route path="/" element={<Hub />} />
            <Route path="/valentine" element={<ValentineGame />} />
            <Route path="/shadow-garden" element={<ShadowGarden />} />
            <Route path="/shadow-garden-welcome" element={<ShadowGardenWelcome />} />
            <Route path="/music-room" element={<MusicRoom />} />
          </Routes>
        </Router>
      </DataMigration>
    </Provider>
  );
}

export default App;
