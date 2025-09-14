// src/components/AddProductForm.jsx

import { useState, useEffect } from 'react';

function AddProductForm({ onAddProduct, productToEdit, onUpdateProduct }) { // 1. Recibimos el producto a editar
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  // 2. Este useEffect se ejecuta cada vez que 'productToEdit' cambia
  useEffect(() => {
    if (productToEdit) {
      // Si hay un producto para editar, rellenamos los campos
      setName(productToEdit.name);
      setQuantity(productToEdit.quantity);
      setPrice(productToEdit.price);
    } else {
      // Si no, limpiamos los campos (para volver al modo "Añadir")
      setName('');
      setQuantity('');
      setPrice('');
    }
  }, [productToEdit]); // La dependencia es 'productToEdit'

const handleSubmit = (event) => {
  event.preventDefault();
  const productData = {
    name,
    quantity: parseInt(quantity),
    price: parseFloat(price)
  };

  if (productToEdit) {
    // Si estamos en modo edición, llamamos a la función de actualizar
    onUpdateProduct(productToEdit._id, productData);
  } else {
    // Si no, llamamos a la función de añadir
    onAddProduct(productData);
  }
};

  return (
    <div className="form-container">
      {/* 3. El título y el botón ahora cambian dinámicamente */}
      <h2>{productToEdit ? 'Editando Producto' : 'Añadir Nuevo Producto'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Cantidad:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Precio:</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <button type="submit">
          {productToEdit ? 'Actualizar Producto' : 'Añadir Producto'}
        </button>
      </form>
    </div>
  );
}

export default AddProductForm;