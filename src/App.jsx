import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import CharList from './pages/CharList'

const App = () => {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<CharList />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
