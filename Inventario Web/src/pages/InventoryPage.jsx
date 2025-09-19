// src/pages/InventoryPage.jsx

import { useState, useEffect } from 'react';
import AddProductForm from '../components/AddProductForm.jsx';
import ProductList from '../components/ProductList.jsx';

function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);

  // Cargar productos al iniciar
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error al cargar los productos:', error);
      }
    };
    fetchProducts();
  }, []);

  // Funciones para manejar CRUD (Crear, Leer, Actualizar, Borrar)
  const handleAddProduct = async (productData) => {
    // ... (lógica para añadir producto que ya teníamos)
  };

  const handleDeleteProduct = async (id) => {
    // ... (lógica para eliminar producto que ya teníamos)
  };

  const handleUpdateProduct = async (id, updatedData) => {
    // ... (lógica para actualizar producto que ya teníamos)
  };
  
  const handleEditClick = (product) => {
    setProductToEdit(product);
  };

  return (
    <>
      <h1>Mi Gestor de Inventario</h1>
      <AddProductForm
        onAddProduct={handleAddProduct}
        productToEdit={productToEdit}
        onUpdateProduct={handleUpdateProduct}
      />
      <ProductList
        products={products}
        onDeleteProduct={handleDeleteProduct}
        onEditClick={handleEditClick}
      />
    </>
  );
}

export default InventoryPage;