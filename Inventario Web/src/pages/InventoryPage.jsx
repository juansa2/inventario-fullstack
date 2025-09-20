// src/pages/InventoryPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AddProductForm from '../components/AddProductForm.jsx';
import ProductList from '../components/ProductList.jsx';

function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Función auxiliar para obtener los encabezados con el token
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
          headers: getAuthHeaders() // <-- USAR HEADERS
        });
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) handleLogout();
          throw new Error('No se pudo cargar el inventario.');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = async (productData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
        method: 'POST',
        headers: getAuthHeaders(), // <-- USAR HEADERS
        body: JSON.stringify(productData),
      });
      if (!response.ok) throw new Error('Error al añadir el equipo.');
      const newData = await response.json();
      setProducts([...products, newData.product]);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(), // <-- USAR HEADERS
      });
      if (!response.ok) throw new Error('Error al eliminar el equipo.');
      setProducts(products.filter(p => p._id !== id));
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleUpdateProduct = async (id, updatedData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(), // <-- USAR HEADERS
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) throw new Error('Error al actualizar el equipo.');
      const { product: updatedProduct } = await response.json();
      setProducts(products.map(p => (p._id === id ? updatedProduct : p)));
      setProductToEdit(null);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleEditClick = (product) => {
    setProductToEdit(product);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div className="inventory-header">
        <h1>Mi Gestor de Inventario</h1>
        <Link to="/change-password" className="action-link">Cambiar Contraseña</Link>
        <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
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