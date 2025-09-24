// Define el componente que muestra la lista de ingredientes.
function IngredientList({ items, onDelete, onEditClick }) {
  return (
    <div className="product-list-container">
      <h2>Lista de Ingredientes</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Unidad</th>
            <th className="cell-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item._id}>
              <td data-label="Nombre">{item.nombre}</td>
              <td data-label="Cantidad">{item.cantidad}</td>
              <td data-label="Unidad">{item.unidad}</td>
              <td data-label="Acciones">
                <div className="product-actions">
                  <button onClick={() => onEditClick(item)} className="edit-button">
                    Editar
                  </button>
                  <button onClick={() => onDelete(item._id)} className="delete-button">
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

export default IngredientList;