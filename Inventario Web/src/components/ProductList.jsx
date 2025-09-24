// Define el componente 'ProductList', que recibe la lista de productos y funciones como props.
function ProductList({ products, onDeleteProduct, onEditClick }) {
  // Renderiza el JSX del componente.
  return (
    <div className="product-list-container">
      <h2>Lista de Equipos</h2>
      {/* Crea una tabla para mostrar los datos de forma estructurada. */}
      <table className="product-table">
        {/* Cabecera de la tabla. */}
        <thead>
          <tr>
            {/* Define las columnas de la tabla. */}
            <th>Tipo</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Serial</th>
            <th>Usuario Asignado</th>
            {/* Columna para los botones de acciones, centrada. */}
            <th className="cell-center">Acciones</th>
          </tr>
        </thead>
        {/* Cuerpo de la tabla. */}
        <tbody>
          {/* Itera sobre el array 'products' recibido por props. */}
          {products.map(computer => (
            // Cada fila de la tabla necesita una 'key' única, usamos el '_id' del producto.
            <tr key={computer._id}>
              {/* Muestra los datos de cada producto en su celda correspondiente. */}
              <td data-label="Tipo">{computer.tipo}</td>
              <td data-label="Marca">{computer.marca}</td>
              <td data-label="Modelo">{computer.modelo}</td>
              <td data-label="Serial">{computer.serial}</td>
              {/* Si 'usuarioAsignado' no existe, muestra 'Sin asignar'. */}
              <td data-label="Usuario">{computer.usuarioAsignado || 'Sin asignar'}</td>
              <td data-label="Acciones">
                <div className="product-actions">
                  {/* Botón de "Editar". Al hacer clic, llama a la función 'onEditClick' pasada por props, enviando el objeto completo del producto. */}
                  <button onClick={() => onEditClick(computer)} className="edit-button">
                    Editar
                  </button>
                  {/* Botón de "Eliminar". Al hacer clic, llama a la función 'onDeleteProduct' con el ID del producto. */}
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

// Exporta el componente para que pueda ser utilizado en la página de inventario.
export default ProductList;