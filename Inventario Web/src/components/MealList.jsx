// Define el componente que muestra la lista de comidas.
function MealList({ items, onDelete, onEditClick }) {
  return (
    <div className="product-list-container">
      <h2>Lista de Comidas</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th className="cell-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item._id}>
              <td data-label="Nombre">{item.nombre}</td>
              <td data-label="Descripción">{item.descripcion || '-'}</td>
              <td data-label="Precio">${Number(item.precio).toFixed(2)}</td>
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

export default MealList;