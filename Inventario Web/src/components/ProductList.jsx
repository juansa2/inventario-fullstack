// src/components/ProductList.jsx

function ProductList({ products, onDeleteProduct, onEditClick }) {
  // Cambiamos el nombre de la variable en el map a "computer" para más claridad
  return (
    <div className="product-list-container">
      <h2>Lista de Equipos</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Serial</th>
            <th>Usuario Asignado</th>
            <th className="cell-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map(computer => (
            <tr key={computer._id}>
              <td data-label="Tipo">{computer.tipo}</td>
              <td data-label="Marca">{computer.marca}</td>
              <td data-label="Modelo">{computer.modelo}</td>
              <td data-label="Serial">{computer.serial}</td>
              <td data-label="Usuario">{computer.usuarioAsignado || 'Sin asignar'}</td>
              <td data-label="Acciones">
                <div className="product-actions">
                  <button onClick={() => onEditClick(computer)} className="edit-button">
                    Editar
                  </button>
                  <button onClick={() => onDeleteProduct(computer._id)} className="delete-button">
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

export default ProductList;