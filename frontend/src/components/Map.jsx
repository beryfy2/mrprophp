import React, { useState } from "react";
import indiaMap from "../assets/images/india-political-map.png";
import "../style/map.css";

const INDIA_BOUNDS = {
  minLat: 6.5,
  maxLat: 37.5,
  minLng: 68,
  maxLng: 97,
};

const locations = [
  {
    id: "Ghaziabad",
    title: "Head Office – Ghaziabad",
    address:
      "SF-1, Reliable City Center, Sector-6, Vasundhara, Ghaziabad – 201014",
    lat: 26.6692,
    lng: 81.4538,
  },
  {
    id: "GreaterNoida",
    title: "Greater Noida",
    address:
      "208, 2nd Floor, Harsha Mall, Alpha-I Commercial Belt – 201310",
    lat:26.36,
    lng: 80.8,
  },
  {
    id: "Prayagraj",
    title: "Prayagraj",
    address:
      "Gyan Surya Complex, Jhunsi Branch – 211019",
    lat: 25.4358,
    lng: 81.8463,
  },
  {
    id: "Handia",
    title: "Handia, Prayagraj",
    address:
      "Ward No. 8, Beside Shakuntala Hospital – 221503",
    lat: 25.26,
    lng: 82.01,
  },
  {
    id: "Sonbhadra",
    title: "Robertsganj, Sonbhadra",
    address:
      "Civil Line Road, Raymond Showroom – 231216",
    lat: 24.6886,
    lng: 83.067,
  },
  {
    id: "Almora",
    title: "Almora",
    address:
      "Near Jal Nigam Colony, Talla Kholta – 263601",
    lat: 27.5971,
    lng: 82.4,
  },
];

const latLngToPercent = (lat, lng) => ({
  top:
    ((INDIA_BOUNDS.maxLat - lat) /
      (INDIA_BOUNDS.maxLat - INDIA_BOUNDS.minLat)) *
      100 +
    "%",
  left:
    ((lng - INDIA_BOUNDS.minLng) /
      (INDIA_BOUNDS.maxLng - INDIA_BOUNDS.minLng)) *
      100 +
    "%",
});

export default function Map() {
  const [active, setActive] = useState("Ghaziabad");

  const activeLoc = locations.find((l) => l.id === active);

  return (
    <section className="map-section">
      <div className="map-card">
        {/* MAP */}
        <div className="map-left">
          <img src={indiaMap} alt="India Map" className="india-map" />

          {locations.map((loc) => {
            const pos = latLngToPercent(loc.lat, loc.lng);
            return (
              <div
                key={loc.id}
                className={`map-pin ${active === loc.id ? "active" : ""}`}
                style={pos}
                onClick={() => setActive(loc.id)}
              >
                <span className="pulse" />
              </div>
            );
          })}
        </div>

        {/* ADDRESS */}
        <div className="map-right">
          <h2>Our Presence</h2>

          <div className="city-tabs">
            {locations.map((loc) => (
              <button
                key={loc.id}
                className={active === loc.id ? "active" : ""}
                onClick={() => setActive(loc.id)}
              >
                {loc.id}
              </button>
            ))}
          </div>

          <div className="address-box">
            <h4>{activeLoc.title}</h4>
            <p>{activeLoc.address}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

