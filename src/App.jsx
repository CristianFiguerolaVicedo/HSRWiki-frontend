import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import CharList from './pages/CharList'
import CharDetails from './components/CharDetails'

const App = () => {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/char/:id' element={<CharDetails />}/>
          <Route path='/' element={<CharList />}/>
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
