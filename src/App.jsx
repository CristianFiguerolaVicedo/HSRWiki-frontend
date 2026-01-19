import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import CharList from './pages/CharList'
import CharDetails from './components/CharDetails'
import Lightcones from './pages/Lightcones'
import LightconeDetails from './components/LightconeDetails'
import Relics from './pages/Relics'
import RelicsDetails from './components/RelicsDetails'
import PlanarsDetails from './components/PlanarsDetails'
import Planets from './pages/Planets'
import PlanetDetails from './components/PlanetDetails'

const App = () => {

  return (
    <>
      <BrowserRouter>
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
        </Routes>
      </BrowserRouter>
      <div className="floating-gif">
        <img 
          src="/public/assets/Dance Evernight GIF.gif" 
          alt="Floating Gif" 
          className='gif-image'
        />
      </div>
    </>
  )
}

export default App
