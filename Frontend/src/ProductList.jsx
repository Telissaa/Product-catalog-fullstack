import React, { useEffect, useState } from 'react';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Używamy Twojego portu z terminala: 5249
        fetch('http://localhost:5249/api/products')
            .then(response => {
                if (!response.ok) throw new Error('Błąd połączenia z API');
                return response.json();
            })
            .then(data => setProducts(data))
            .catch(err => setError(err.message));
    }, []);

    if (error) return <div style={{color: 'red'}}>Błąd: {error}</div>;

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1>Katalog Produktów (Dane z SQL Server)</h1>
            <div style={{ display: 'grid', gap: '10px' }}>
                {products.length === 0 ? <p>Brak produktów w bazie.</p> : 
                    products.map(p => (
                        <div key={p.id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
                            <h3>{p.title}</h3>
                            <p>{p.description}</p>
                            <small>Data dodania: {new Date(p.creationDate).toLocaleDateString()}</small>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default ProductList;