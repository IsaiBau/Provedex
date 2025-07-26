export const Buscador = ({ onSearch }) => {
  const handleSearch = (e) => {
    onSearch(e.target.value);
  };
  
  return (
    <form className="w-full" onSubmit={e => e.preventDefault()}>   
      <div className="relative">
        <input 
          type="text" 
          onChange={handleSearch} 
          className="p-10 bg-gray-50 border border-purple-700 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full" 
          placeholder="    Buscar por productos" 
        />
      </div>
    </form>
  );
}