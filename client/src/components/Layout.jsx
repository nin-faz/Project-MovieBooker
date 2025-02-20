import Header from "./Header";
import Footer from "./Footer";
import PropTypes from "prop-types";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
};
Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
