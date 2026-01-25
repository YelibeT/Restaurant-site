import axios from "axios";
import { useState, useEffect, useCallback } from "react";

export default function Menu() {
  const [query, setQuery] = useState("");
  const [fasting, setFasting] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [cart, setCart] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [isOrdering, setIsOrdering] = useState(false);

  useEffect(() => {
    setCount(0);
  }, [activeItem]);

  const fetchMenu = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (query) params.append("q", query);
      if (fasting) params.append("fasting", "true");

      const endpoint = query ? "search" : "items";
      const { data } = await axios.get(`http://localhost:5000/api/menu/${endpoint}?${params.toString()}`);
      setMenuItems(data);
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  }, [query, fasting]);

  useEffect(() => {
    const timeout = setTimeout(fetchMenu, 300);
    return () => clearTimeout(timeout);
  }, [fetchMenu]);

  const addToCart = (item, quantity) => {
    if (quantity < 1) return;

    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.menuItem === item.id);
      if (existing) {
        return prevCart.map((i) =>
          i.menuItem === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prevCart, { menuItem: item.id, name: item.name, price: item.price, quantity }];
    });

    setActiveItem(null); 
  };

  return (
    <div className="menu-layout">
      <div className="menu-section">
        <form className="menu-search-form" onSubmit={(e) => e.preventDefault()}>
          <input
            id="search-input"
            placeholder="search for menu..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="dishes">
            {menuItems.map((item) => (
              <div
                key={item._id}
                className="food"
                onClick={() =>
                  setActiveItem({
                    id: item._id,
                    name: item.name,
                    description: item.description,
                    image: item.image,
                    price: item.price,
                  })
                }
              >
                <div>
                  <img src={item.image} alt={item.name} />
                  <h3>{item.name}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeItem !== null && (
          <div className="popup">
            <div className="popup-window">
              <a
                className="close"
                onClick={(e) => {
                  setActiveItem(null);
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                &times;
              </a>
              <img src={activeItem.image} alt="" />
              <h4>{activeItem.name}</h4>
              <p>Description: {activeItem.description}</p>
              <p>Price: {activeItem.price}</p>
              <div className="btns">
                <button id="btn" onClick={() => setCount(count + 1)}>
                  +
                </button>
                <input type="text" id="btn" value={count} readOnly />
                <button
                  id="btn"
                  onClick={() => setCount((c) => Math.max(0, c - 1))}
                  disabled={count === 0}
                >
                  -
                </button>
              </div>
              <button
                id="popup-btn"
                disabled={count === 0}
                onClick={() => addToCart(activeItem, count)}
              >
                Add to cart
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="cart-section">
        <h2>Cart</h2>

        {cart.length === 0 ? (
          <p>No items yet</p>
        ) : (
          <>
            {cart.map((item) => (
              <div key={item.menuItem} className="cart-item">
                <span>{item.name}</span>

                <div>
                  <button
                    onClick={() =>
                      setCart((prev) =>
                        prev
                          .map((i) =>
                            i.menuItem === item.menuItem
                              ? { ...i, quantity: i.quantity - 1 }
                              : i,
                          )
                          .filter((i) => i.quantity > 0),
                      )
                    }
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      setCart((prev) =>
                        prev.map((i) =>
                          i.menuItem === item.menuItem
                            ? { ...i, quantity: i.quantity + 1 }
                            : i,
                        ),
                      )
                    }
                  >
                    +
                  </button>
                </div>

                <span>{item.price * item.quantity} birr</span>
              </div>
            ))}

            <hr />

            <p>
              <strong>
                Total:{" "}
                {cart.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0,
                )}{" "}
                birr
              </strong>
            </p>
            <button>Place Order</button>
          </>
        )}
      </div>
    </div>
  );
}
