import React, { useEffect, useState } from "react";

export default function ProductQuickSelect({ onSelect }) {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        console.error("Failed to fetch products:", res.statusText);
        setProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Quick Products</h3>
      <div className="grid grid-cols-3 gap-2">
        {products.map((product, index) => (
          <button
            key={product._id}
            onClick={() => onSelect(product)}
            className="bg-blue-100 hover:bg-blue-200 text-sm text-gray-800 rounded px-3 py-1 text-center"
          >
            {index + 1}
          </button>
        ))}
      </div>
      <ul className="mt-4 text-sm text-gray-600 space-y-1">
        {products.map((product, index) => (
          <li key={product._id}>
            <strong>{index + 1}</strong>: {product.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
