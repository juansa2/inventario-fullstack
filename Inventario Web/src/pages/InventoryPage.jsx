// src/pages/InventoryPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- 1. Importar useNavigate
import AddProductForm from '../components/AddProductForm.jsx';
import ProductList from '../components/ProductList.jsx';

function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);
  const navigate = useNavigate(); // <-- 2. Inicializar el hook de navegación

  // --- 3. NUEVA FUNCIÓN PARA CERRAR SESIÓN ---
  const handleLogout = () => {
    localStorage.removeItem('token'); // Borramos el token
    navigate('/login');               // Redirigimos al login
  };
  
  // ... (tu useEffect para cargar productos y tus funciones CRUD no cambian)
  useEffect(() => {
    const fetchProducts = async () => {
      // ... tu código para cargar productos
    };
    fetchProducts();
  }, []);

  const handleAddProduct = async (productData) => { /* ... tu código ... */ };
  const handleDeleteProduct = async (id) => { /* ... tu código ... */ };
  const handleUpdateProduct = async (id, updatedData) => { /* ... tu código ... */ };
  const handleEditClick = (product) => { /* ... tu código ... */ };


  return (
    <>
      <div className="inventory-header">
        <h1>Mi Gestor de Inventario</h1>
        <button onClick={handleLogout} className="logout-button"> {/* <-- 4. EL NUEVO BOTÓN */}
          Cerrar Sesión
        </button>
      </div>
      
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