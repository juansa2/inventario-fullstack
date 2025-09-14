// src/App.jsx

import { useState, useEffect } from 'react'; // 1. Importamos useEffect
import './App.css';
import ProductList from './components/ProductList.jsx';
import AddProductForm from './components/AddProductForm.jsx';

function App() {
  const [products, setProducts] = useState([]); // 2. El estado inicial ahora es una lista vacía
  const [productToEdit, setProductToEdit] = useState(null); // null significa que no estamos editando nada
  // 3. useEffect para cargar los productos del servidor cuando el componente se monta
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        setProducts(data); // Actualizamos el estado con los datos del backend
      } catch (error) {
        console.error('Error al cargar los productos:', error);
      }
    };

    fetchProducts();
  }, []); // El array vacío [] significa que este efecto se ejecuta solo una vez, al principio.

  const handleAddProduct = (newProduct) => {
    setProducts([...products, newProduct]);
  };

 // 3. NUEVA FUNCIÓN para manejar la eliminación
  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Si se elimina en el backend, lo quitamos del estado en el frontend
        setProducts(products.filter(product => product._id !== id));
      } else {
        console.error('Error al eliminar el producto');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  const handleEditClick = (product) => {
    console.log("Editando:", product); // Pondremos esto para probar que funciona
    setProductToEdit(product);
  };

  const handleUpdateProduct = async (id, updatedData) => {
  try {
    const response = await fetch(`http://localhost:5000/api/products/${id}`, {
      method: 'PUT', // Usamos el método PUT para actualizar
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      const updatedProduct = await response.json();
      // Actualizamos la lista de productos
      setProducts(products.map(p => 
        p._id === id ? updatedProduct.product : p
      ));
      setProductToEdit(null); // Salimos del modo edición
    } else {
      console.error('Error al actualizar el producto');
    }
  } catch (error) {
    console.error('Error de red:', error);
  }
};

  return (
    <div className="app-container">
      <h1>Mi Gestor de Inventario</h1>
      <AddProductForm onAddProduct={handleAddProduct} productToEdit={productToEdit} onUpdateProduct={handleUpdateProduct}/>
      <ProductList products={products} onDeleteProduct={handleDeleteProduct} onEditClick={handleEditClick} />
    </div>
  );
}

export default App;
