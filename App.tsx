import { useState } from 'react'
import './src/App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="bg-blue-500 text-white p-4 rounded-lg">
        Konichiwa
      </div>
    </>
  )
}

export default App
