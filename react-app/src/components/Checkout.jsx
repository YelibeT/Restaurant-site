import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";


export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state?.cart || [];

  const storedUser = JSON.parse(localStorage.getItem());

  const [customerName, setCustomerName] = useState(storedUser?.name || "");
  const [phone, setPhone] = useState(storedUser?.phone || "");
  

  useEffect(() => {
    if (storedUser) {
      setCustomerName(storedUser.name);
      setPhone(storedUser.phone);
    }
  }, []);

const handlePlaceOrder = async (e) => {
  e.preventDefault(); // Prevents the page from refreshing

  const orderData = {
    customerName,
    phone,
    items: cart,
    totalPrice: cart.reduce((acc, item) => acc + (item.price * item.quantity), 0),
    status: "pending"
  };

  try {
    const { data } = await axios.post("http://localhost:5000/api/orders/place", orderData);
    alert("Order placed successfully!");
    
    // 2. After ordering, send them to the success page
    navigate("/order-success", { state: { phone: data.phone } });
  } catch (err) {
    console.error("Order failed", err);
    alert("Could not place order. Please try again.");
  }
};

  return (
    <div className="checkout-container">
      <h2>Complete Your Order</h2>
      <form onSubmit={handlePlaceOrder}>
        <div className="form-group">
          <label>Full Name</label>
          <input 
            type="text" 
            value={customerName} 
            onChange={(e) => setCustomerName(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input 
            type="tel" 
            value={phone} // This is now autofilled!
            onChange={(e) => setPhone(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Confirm Order</button>
      </form>
    </div>
  );
}