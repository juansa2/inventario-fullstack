// src/components/ProductList.jsx
import { useState } from 'react'; // ¡Añadimos useState!

function ProductList({ products, onDeleteProduct, onEditClick }) {
  // Por ahora, solo devolveremos un título.
  return (
    <div className="product-list">
      <h2>Lista de Productos</h2>
      {/* Aquí irá nuestra tabla o lista de productos más adelante */}
      <ul>
        {products.map((product) => (
            <li key={product._id} className="product-item">
            <div className="product-details">
                <span className="product-name">{product.name}</span>
                <span className="product-quantity">Cant: {product.quantity}</span>
                <span className="product-price">${product.price}</span>
            </div>
            <div className="product-actions">
                <button onClick={() => onEditClick(product)} className="edit-button">
                Editar
                </button>
                <button onClick={() => onDeleteProduct(product._id)} className="delete-button">
                Eliminar
                </button>
            </div>
            </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList; // ¡Muy importante! Esto permite que otros archivos usen este componente.