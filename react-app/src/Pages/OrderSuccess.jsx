import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 1. Get phone from navigation state (passed from Checkout)
  const customerPhone = location.state?.phone;
  
  // 2. Check if user is registered/logged in (for cancellation rights)
  const isRegistered = localStorage.getItem("userInfo"); 

  useEffect(() => {
    if (!customerPhone) {
      setLoading(false);
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/orders/my-orders?phone=${customerPhone}`);
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [customerPhone]);

  const handleCancel = async (orderId) => {
    if (!isRegistered) {
      alert("Please register or login to cancel orders.");
      navigate("/register"); // Redirect to your registration page
      return;
    }

    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await axios.patch(`http://localhost:5000/api/orders/cancel/${orderId}`);
        alert("Order cancelled successfully.");
        // Refresh the list to show updated status
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: 'cancelled' } : o));
      } catch (err) {
        alert(err.response?.data?.message || "Failed to cancel order.");
      }
    }
  };

  if (loading) return <div className="loader" style={{ textAlign: 'center', padding: '50px' }}>Checking your order status...</div>;

  // EMPTY STATE
  if (!customerPhone || orders.length === 0) {
    return (
      <div className="empty-state" style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2>No Active Orders Found</h2>
        <p>We couldn't find any pending orders for this phone number.</p>
        <Link to="/menu" style={{ color: "#e67e22", fontWeight: "bold", textDecoration: 'underline' }}>
          Go to Menu to Order
        </Link>

        <div className="location-info" style={{ marginTop: '60px', borderTop: '1px solid #eee', paddingTop: '30px' }}>
          <h3>Visit Us</h3>
          <p>📍 Bole Road, Addis Ababa | 🕒 8:00 AM - 10:00 PM</p>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5!2d38.7!3d9.0!" 
            width="100%" height="250" style={{ border: 0, borderRadius: '15px', maxWidth: '500px' }} 
            allowFullScreen="" loading="lazy">
          </iframe>
        </div>
      </div>
    );
  }

  return (
    <div className="order-status-page" style={{ padding: "40px 20px", backgroundColor: "#fdfefe", minHeight: "90vh" }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>Order Status</h1>
        <p style={{ textAlign: 'center', color: '#7f8c8d' }}>Phone: <strong>{customerPhone}</strong></p>

        {orders.map((order) => (
          <div key={order._id} className="order-card" style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "15px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            marginBottom: "25px",
            borderLeft: order.status === 'pending' ? "6px solid #e67e22" : "6px solid #95a5a6"
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <h3 style={{ margin: 0 }}>👤 {order.customerName}</h3>
              <span style={{ 
                padding: '4px 12px', 
                borderRadius: '20px', 
                fontSize: '0.8rem', 
                fontWeight: 'bold',
                backgroundColor: order.status === 'pending' ? '#fff3e0' : '#f4f4f4',
                color: order.status === 'pending' ? '#e67e22' : '#7f8c8d'
              }}>
                {order.status.toUpperCase()}
              </span>
            </div>

            <div className="order-items">
              {order.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>{item.name} x {item.quantity}</span>
                  <span>{item.price * item.quantity} birr</span>
                </div>
              ))}
            </div>

            <hr style={{ border: '0.5px solid #eee', margin: '15px 0' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem' }}>
              <span>Total Amount:</span>
              <span>{order.totalPrice} birr</span>
            </div>

            {/* CANCELLATION BUTTON */}
            {order.status === "pending" && (
              <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <button 
                  onClick={() => handleCancel(order._id)}
                  style={{
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: '0.3s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#c0392b'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#e74c3c'}
                >
                  Cancel Order
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}