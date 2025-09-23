import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AddProductForm from '../components/AddProductForm.jsx';
import ProductList from '../components/ProductList.jsx';
// 1. Importamos las funciones centralizadas desde nuestro servicio de API
import { getInventory, addProduct, deleteProduct, updateProduct } from '../services/api.js';

function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // La función getAuthHeaders() ya no es necesaria aquí.
  // Su lógica ahora vive dentro de /services/api.js y se usa automáticamente.

  // 2. Usamos las nuevas funciones, haciendo el código más limpio
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getInventory(); // <-- MÁS SIMPLE
        setProducts(data);
      } catch (error) {
        console.error(error.message);
        // Si el token es inválido o no existe, el error lo indicará y cerramos sesión
        if (error.message.includes('inválido') || error.message.includes('denegada')) {
          handleLogout();
        }
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = async (productData) => {
    try {
      const newData = await addProduct(productData); // <-- MÁS SIMPLE
      setProducts(prev => [...prev, newData.product]);
    } catch (error) {
      console.error(error.message);
      // Aquí podrías añadir una notificación de error para el usuario
    }
  };

  const handleDeleteProduct = async (id) => {
    // Añadimos una confirmación para mejorar la experiencia de usuario
    if (window.confirm('¿Estás seguro de que quieres eliminar este equipo?')) {
      try {
        await deleteProduct(id); // <-- MÁS SIMPLE
        setProducts(products.filter(p => p._id !== id));
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  const handleUpdateProduct = async (id, updatedData) => {
    try {
      const { product: updatedProduct } = await updateProduct(id, updatedData); // <-- MÁS SIMPLE
      setProducts(products.map(p => (p._id === id ? updatedProduct : p)));
      setProductToEdit(null); // Limpiamos el formulario
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleEditClick = (product) => {
    setProductToEdit(product);
    window.scrollTo(0, 0); // Sube la vista al formulario de edición
  };

  // 3. El JSX se mantiene, pero envolvemos los botones para un mejor estilo
  return (
    <>
      <div className="inventory-header">
        <div className="user-actions">
          <Link to="/change-password" className="action-link">Cambiar Contraseña</Link>
          <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
        </div>
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