// src/components/ProductList.jsx
import { useState } from 'react'; // ¡Añadimos useState!

function ProductList({ products, onDeleteProduct, onEditClick }) {
  // Por ahora, solo devolveremos un título.
return (
    <div className="product-list-container">
      <h2>Lista de Productos</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id}>
              <td data-label="Nombre">{product.name}</td>
              <td data-label="Cantidad" className="cell-center">{product.quantity}</td>
              <td data-label="Precio">
                {product.price.toLocaleString('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </td>
              <td data-label="Acciones">
                <div className="product-actions">
                  <button onClick={() => onEditClick(product)} className="edit-button">
                    Editar
                  </button>
                  <button onClick={() => onDeleteProduct(product._id)} className="delete-button">
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList; // ¡Muy importante! Esto permite que otros archivos usen este componente.