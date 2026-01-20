import axios from 'axios';
import { useState, useEffect } from 'react';

export default function Menu() {
  const [query, setQuery]=useState("");
  const [fasting, setFasting]=useState(false);
  const [menuItem, setMenuItems]=useState([]);
  const [loading, setLoading]= useState(false)

  useEffect(()=>{
    const fetchMenu= async()=>{
      try{
        setLoading(true)
        let url = "http://localhost:5000/api/menu/items";
        if(query){
          url= `/api/menu/search?q=${encodeURIComponent(query)}`
        }
        if (fasting){
          url+=query ? "&fasting=true":"?fasting=true"
        }
        const result=await axios.get(url);
        setMenuItems(result.data);
      }
      catch(error){
        console.error(error);
      }finally{
        setLoading(false);
      }
    }
    fetchMenu();
  }, [query, fasting]);
  return (
    <div>
      <section>
        <form
          onSubmit={(e)=>e.preventDefault()}
          className='menu-search-form'
          >
        <input
          type="text"
          placeholder="Search menu..."
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={fasting}
            onChange={(e)=>setFasting(e.target.checked)}
          />{" "}
          Fasting
        </label>
        </form>
        <h1>Menu</h1>

        {loading ? (
          <p>Loading menu...</p>
        ): (
          <div className='dishes'>
            {["Non-fasting", "Fasting"].map((type)=>(
              <div
                key={type}
                id={type}
                className={type==="Fasting" ? "fasting": ""}
                >
                <h2>{type}</h2>
                {menuItem.filter((item)=>(type==="Fasting" && item.fasting)||
                (type==="Non-fasting" && !item.fasting)
              ).map((item)=>(
                <div key={item._id} className="food">
                  <a href="#popup-$item._id" title="click for more details">
                    <img src={item.image} alt={item.name}/>
                    <h3>{item.name}</h3>
                  </a>
                  <div className='popup' id={`popup-${item._id}`}>
                    <div className='popup-window'>
                      <a href="#" className='close'>&times;</a>
                      <p>{item.description||"No description"}</p>
                      <p>Price:{item.price} birr</p>
                      <button id="popup-btn">Order</button>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
