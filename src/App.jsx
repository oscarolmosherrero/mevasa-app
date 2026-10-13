import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Lines from './pages/Lines.jsx'
import LineDetail from './pages/LineDetail.jsx'
import LiveMap from './pages/LiveMap.jsx'
import Info from './pages/Info.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="lineas" element={<Lines />} />
        <Route path="lineas/:id" element={<LineDetail />} />
        <Route path="mapa" element={<LiveMap />} />
        <Route path="informacion" element={<Info />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}
