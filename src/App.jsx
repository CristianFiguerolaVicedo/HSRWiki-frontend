import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import ErrorBoundary from './components/ErrorBoundary'

const CharList = lazy(() => import('./pages/CharList'));
const CharDetails = lazy(() => import('./components/CharDetails'));
const Lightcones = lazy(() => import('./pages/Lightcones'));
const LightconeDetails = lazy(() => import('./components/LightconeDetails'));
const Relics = lazy(() => import('./pages/Relics'));
const RelicsDetails = lazy(() => import('./components/RelicsDetails'));
const PlanarsDetails = lazy(() => import('./components/PlanarsDetails'));
const Planets = lazy(() => import('./pages/Planets'));
const PlanetDetails = lazy(() => import('./components/PlanetDetails'));
const Factions = lazy(() => import('./pages/Factions'));
const FactionDetails = lazy(() => import('./components/FactionDetails'));
const Items = lazy(() => import('./pages/Items'));
const ItemDetails = lazy(() => import('./components/ItemDetails'));
const TierList = lazy(() => import('./pages/TierList'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <div className="text-text-primary text-xl">Loading...</div>
  </div>
);

const App = () => {
  return (
    <>
      <BrowserRouter>
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path='/char/:id' element={<CharDetails />}/>
              <Route path='/' element={<CharList />}/>
              <Route path='/lightcones' element={<Lightcones />}/>
              <Route path='/lightcones/:id' element={<LightconeDetails />}/>
              <Route path='/relics' element={<Relics />}/>
              <Route path='/relics/:name' element={<RelicsDetails />}/>
              <Route path='/planars/:name' element={<PlanarsDetails />}/>
              <Route path='/planets' element={<Planets />}/>
              <Route path='/planets/:id' element={<PlanetDetails />}/>
              <Route path='/factions' element={<Factions />}/>
              <Route path='/factions/:id' element={<FactionDetails />}/>
              <Route path='/items' element={<Items />}/>
              <Route path='/items/:id' element={<ItemDetails />}/>
              <Route path='/tier-list' element={<TierList />}/>
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
      <div className="floating-gif">
        <img 
          src="/assets/Dance Evernight GIF.gif" 
          alt="Floating Gif" 
          className='gif-image'
        />
      </div>
    </>
  )
}

export default App
