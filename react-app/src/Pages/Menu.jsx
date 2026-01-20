import axios from "axios";
import { useState, useEffect ,useCallback } from "react";

export default function Menu() {
  const [query, setQuery] = useState("");
  const [fasting, setFasting] = useState(false);
  const [menuItem, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cart,setCart]=useState([]);

  const fetchMenu = useCallback(async () => {
      try {
        setLoading(true);
        let url = "http://localhost:5000/api/menu/items";
        if (query) {
          url = `http://localhost:5000/api/menu/search?q=${encodeURIComponent(query)}`;
        }
        if (fasting) {
          url += query ? "&fasting=true" : "?fasting=true";
        }
        
        const result = await axios.get(url);
        setMenuItems(result.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
  }, [query, fasting]);
  useEffect(()=>{
    const timeout=setTimeout(()=>{
      fetchMenu();
    },300);
    return ()=>clearTimeout(timeout)
  }, [query, fasting, fetchMenu])

  const addToCart=(item)=>{
    const existing=cart.find(i=>i.menuItem===item._id);
    if(existing){
      setCart(cart.map(i=>i.menuItem===item._id ? {...i,quantity:i.quantity+1}:i))
    }
    else{
      setCart([...cart, {menuItem: item._id, name: item.name, price:item.price, quantity:1}])
    };
  }

  const placeOrder=async()=>{
    if(!cart.length) return alert("cart is empty!")
      const customerName=prompt("Enter your name: ")
      const customerPhone=prompt("Enter your phone: ")
    try{
      const res=await axios.post("http://localhost:5000/api/orders", {
        items:cart, customerName, customerPhone,
      })
      alert(res.data.message)
      setCart([]);
    }catch(err){
      console.error(err);
      alert("Failed to place order.")
    }
  };
  return (
    <div>
      <section>
        <form onSubmit={(e) => e.preventDefault()} className="menu-search-form">
          <input
            type="text"
            id="search-input"
            placeholder="Search menu..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            id="search-btn"
            type="submit"
            onClick={fetchMenu}
          >Search</button>
        </form>
        <h1 id="menu">Menu</h1>

        {loading ? (
          <p>Loading menu...</p>
        ) : (
          <div className="dishes">
            {["Non-fasting", "Fasting"].map((type) => (
              <div
                key={type}
                id={type}
                className={type === "Fasting" ? "fasting" : ""}
              >
                <h2>{type}</h2>
                {menuItem
                  .filter(
                    (item) =>
                      (type === "Fasting" && item.isFasting) ||
                      (type === "Non-fasting" && !item.isFasting),
                  )
                  .map((item) => (
                    <div key={item._id} className="food">
                      <a
                        href={`#popup-${item._id}`}
                        title="click for more details"
                      >
                        <img src={item.image} alt={item.name} />
                        <h3>{item.name}</h3>
                      </a>
                      <div className="popup" id={`popup-${item._id}`}>
                        <div className="popup-window">
                          <a href="#" className="close">
                            &times;
                          </a>
                          <h4>{item.name}</h4>
                          <p>{item.description || "No description"}</p>
                          <p>Price:{item.price} birr</p>
                          <button id="popup-btn" onClick={()=>addToCart(item)}>Add to Cart</button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        )}
          {cart.length > 0 && (
          <div className="cart-footer">
            <p>Items in cart: {cart.reduce((acc, i) => acc + i.quantity, 0)}</p>
            <button onClick={placeOrder}>Place Order</button>
          </div>
          )}
      </section>
    </div>
  );
}
