const Header = () => {
  return (
    <header className="bg-gray-800 text-white py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold">🎥 MovieBooking</h1>
        <nav className="space-x-4">
          <a href="#" className="hover:text-yellow-500">
            Accueil
          </a>
          <a href="#" className="hover:text-yellow-500">
            Réservations
          </a>
          <a href="#" className="hover:text-yellow-500">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
