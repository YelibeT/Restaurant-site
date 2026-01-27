import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Retrieve cart from navigation state
  const cart = location.state?.cart || []; 

  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        customerName: formData.name,
        customerPhone: formData.phone,
        items: cart.map(item => ({ 
            menuItem: item.menuItem, 
            quantity: item.quantity 
        }))
      };

      // Inside your handleSubmit function in Checkout.jsx
        const response = await axios.post("http://localhost:5000/api/orders", orderData);

// Instead of redirecting by ID, we redirect to the status page 
// and pass the phone number in the "state"
        navigate("/order-success", { state: { phone: formData.phone } }); 
    } catch (err) {
      console.error(err);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // EMPTY STATE LOGIC
  if (cart.length === 0) {
    return (
      <div className="empty-cart-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2>Your cart is empty</h2>
        <p>You haven't selected any delicious dishes yet.</p>
        <Link to="/menu" style={{ color: '#e67e22', fontWeight: 'bold', textDecoration: 'underline' }}>
          Click here to order
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2>Complete Your Order</h2>
      
      <div className="order-summary">
        <h3>Summary</h3>
        {cart.map(item => (
          <div key={item.menuItem} className="summary-item">
            <span>{item.name} x {item.quantity}</span>
            <span>{item.price * item.quantity} birr</span>
          </div>
        ))}
        <hr />
        <p className="total-price"><strong>Total: {totalPrice} birr</strong></p>
      </div>

      <form className="checkout-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input 
            required 
            placeholder="Enter your name" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
          />
        </div>
        
        <div className="form-group">
          <label>Phone Number</label>
          <input 
            required 
            type="tel" 
            placeholder="09..." 
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})} 
          />
        </div>

        <button type="submit" className="confirm-btn" disabled={loading}>
          {loading ? "Processing..." : "Confirm & Order"}
        </button>
      </form>
    </div>
  );
}