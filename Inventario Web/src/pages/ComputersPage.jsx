import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AddProductForm from '../components/AddProductForm.jsx';
import ProductList from '../components/ProductList.jsx';
import { getComputers, addProduct, deleteProduct, updateProduct } from '../services/api.js';

function ComputersPage() {
  const [products, setProducts] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getComputers();
        setProducts(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = async (productData) => {
    try {
      const newData = await addProduct(productData);
      setProducts(prev => [...prev, newData.product]);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este equipo?')) {
      try {
        await deleteProduct(id);
        setProducts(products.filter(p => p._id !== id));
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  const handleUpdateProduct = async (id, updatedData) => {
    try {
      const { product: updatedProduct } = await updateProduct(id, updatedData);
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
      <Link to="/inventory" className="back-to-menu">{"< Volver al Menú"}</Link>
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

export default ComputersPage;
