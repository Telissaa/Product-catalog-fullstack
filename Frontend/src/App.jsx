import { useState } from 'react'
import './App.css'
import ProductList from './ProductList' // Importujesz swoją listę

function App() {
  return (
    <>
      <section id="center">
        <div>
          <h1>Katalog Produktów</h1>
          <p>Dane pobrane prosto z API .NET + SQL Server</p>
        </div>
        
        {/* TUTAJ WRZUCAMY TWOJĄ LISTĘ */}
        <div style={{ marginTop: '40px' }}>
          <ProductList />
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App