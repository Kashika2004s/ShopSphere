import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import SecondaryNavbar from "./SecondaryNavbar";
import Navbar from "./Navbar";

const ProductList = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const categoryMapping = {
    beauty: "Beauty Products",
    footwear: "Footwear",
    bags: "Bags",
    clothing: "Clothing",
  };

  const normalizedCategory = categoryMapping[category.toLowerCase()] || category;

  useEffect(() => {
    setFilter("");
    setSortOption("");
    setSearchTerm("");
  }, [normalizedCategory]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3000/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data;
        const filteredProducts =
          normalizedCategory === "All"
            ? data
            : data.filter((product) => product.category === normalizedCategory);

        const filteredAndSortedProducts = filterProducts(filteredProducts);
        setProducts(filteredAndSortedProducts);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [normalizedCategory, filter, sortOption]);

  const filterProducts = (products) => {
    let filtered = products;

    if (filter) {
      filtered = filtered.filter((product) => {
        switch (filter) {
          case "low_carbon_footprint":
            return product.carbonFootprint < 5;
          case "material_sourcing_good":
            return product.materialSourcing === "good";
          case "material_sourcing_better":
            return product.materialSourcing === "better";
          case "material_sourcing_best":
            return product.materialSourcing === "best";
          case "high_recyclability":
            return product.recyclability >= 85;
          case "low_water_usage":
            return product.waterUsage === "low";
          case "high_energy_efficiency":
            return product.energyEfficiency === "high";
          case "high_biodegradability":
            return product.biodegradability > 90;
          default:
            return true;
        }
      });
    }

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  };

  const sortProducts = (products) => {
    if (sortOption === "price_low_high") {
      return products.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price_high_low") {
      return products.sort((a, b) => b.price - a.price);
    }
    return products;
  };

  const filteredAndSortedProducts = sortProducts(filterProducts(products));

  const getFilterTag = (product) => {
    switch (filter) {
      case "low_carbon_footprint":
        return `Low Carbon Footprint: ${product.carbonFootprint}`;
      case "material_sourcing_good":
        return "Material Sourcing: Good";
      case "material_sourcing_better":
        return "Material Sourcing: Better";
      case "material_sourcing_best":
        return "Material Sourcing: Best";
      case "high_recyclability":
        return `High Recyclability: ${product.recyclability}%`;
      case "low_water_usage":
        return "Low Water Usage";
      case "high_energy_efficiency":
        return "High Energy Efficiency";
      case "high_biodegradability":
        return `High Biodegradability: ${product.biodegradability}%`;
      default:
        return "";
    }
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error fetching products: {error.message}</p>;

  return (
    <div style={styles.outerContainer}>
      <SecondaryNavbar
        currentCategory={normalizedCategory}
        sortOption={sortOption}
        onSortSelect={(value) => setSortOption(value)}
        onFilterSelect={(value) => setFilter(value)}
      />
      <div style={styles.app}>
        <div style={styles.productGrid}>
          {filteredAndSortedProducts.length === 0 ? (
            <p>No products match the selected criteria.</p>
          ) : (
            filteredAndSortedProducts.map((product) => (
              <Link
                to={`/products/${category}/${product._id}`}
                key={product._id}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  style={styles.productCard}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={styles.productImage}
                  />
                  <h3 style={styles.productBrand}>{product.brand}</h3>
                  <p style={styles.productName}>{product.name}</p>
                  <div style={styles.rating}>{product.rating} ★★★★★ | {product.reviews} reviews</div>
                  <div style={styles.price}><span>$ {product.price}</span></div>
                  {filter && <div style={styles.filterTag}>{getFilterTag(product)}</div>}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};



const styles = {
  outerContainer: {
    background: "linear-gradient(135deg,rgb(241 230 234),rgb(227, 238, 247))",
  },
  app: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    width: "80%",
    margin: "0 auto",
  },
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", // Responsive grid
    gap: "30px",
    maxWidth: "1450px",
    margin: "0 auto",
  },
  productCard: {
    backgroundColor: "#fff",
    border: "2px solid #d0cce4",

    overflow: "hidden",
    textAlign: "center",
    padding: "30px",
    height: "300px", 
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    paddingBottom: "40px",
    borderRadius: "16px",
    cursor: "pointer",
    animation: "fadeIn 0.6s ease-in-out",
  },
  productCardHover: {
    transform: "scale(1.05)",
    boxShadow: "0 16px 32px rgba(0,0,0,0.2)",
  },
  '@keyframes fadeIn': {
    '0%': { opacity: 0, transform: 'translateY(20px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
  productImage: {
    width: "100%",
    height: "200px",
    objectFit: "contain",
    borderRadius: "12px",
    transition: "transform 0.3s ease",
  },
  productImageHover: {
    transform: "scale(1.08)",
  },
  productBrand: {
    fontSize: "16px",
    margin: "10px 0",
    color: "#333",
  },
  productName: {
    fontSize: "16px",
    color: "black",
    margin: "5px 0",
    fontWeight: "700",
  },
  rating: {
    fontSize: "12px",
    color: "#555",
    margin: "10px 0",
  },
  price: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "grey",
  },
  filterTag: {
    fontSize: "14px",
    padding: '10px',
    fontStyle: "italic",
    color: "#00796b",
    backgroundColor: "rgba(0,121,107,0.1)",
    borderRadius: "8px",
    display: "inline-block",
  },
};

export default ProductList;

