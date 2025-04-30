// src/components/ProductQuickSelect.jsx
export default function ProductQuickSelect({ onSelect }) {
    const productMap = {
      1: "5 MM Clr. Float Glass",
      2: "Aluminium Frame",
      3: "MS Pipe",
      4: "UPVC Window",
      5: "Roofing Sheet",
      6: "Gutter Pipe",
    };
  
    return (
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Quick Products</h3>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(productMap).map(([key, label]) => (
            <button
              key={key}
              onClick={() => onSelect(Number(key))}
              className="bg-blue-100 hover:bg-blue-200 text-sm text-gray-800 rounded px-3 py-1 text-center"
            >
              {key}
            </button>
          ))}
        </div>
        <ul className="mt-4 text-sm text-gray-600 space-y-1">
          {Object.entries(productMap).map(([key, label]) => (
            <li key={key}>
              <strong>{key}</strong>: {label}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  