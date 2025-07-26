export const Buscador = ({ onSearch }) => {
  const handleSearch = (e) => {
    onSearch(e.target.value);
  };
  
  return (
    <form className="w-full max-w-md" onSubmit={e => e.preventDefault()}>   
      <div className="relative">
        {/* Icono de búsqueda */}

        {/* Input de búsqueda */}
        <input 
          type="text"
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-white border border-purple-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
          placeholder="Buscar por productos"
        />
      </div>
    </form>
  );
}