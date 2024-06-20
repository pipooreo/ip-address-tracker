import axios from "axios";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import iconMarker from "/image/pin-map.png";

function InputMap() {
  const [address, setAddress] = useState([]);
  const [IpAddress, setIpAddress] = useState("");
  const customIcon = new Icon({
    iconUrl: iconMarker,
    iconSize: [40, 40],
  });

  const SetViewOnClick = ({ coords }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(coords, map.getZoom());
    }, [coords, map]);
    return null;
  };

  async function getAddress() {
    try {
      const results = await axios.get(
        `https://geo.ipify.org/api/v2/country,city?apiKey=${
          import.meta.env.VITE_IP_API_KEY
        }&ipAddress=`
      );
      setAddress(results.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function getIpAddress() {
    try {
      const results = await axios.get(
        `https://geo.ipify.org/api/v2/country,city?apiKey=${
          import.meta.env.VITE_IP_API_KEY
        }&ipAddress=${IpAddress}`
      );
      setAddress(results.data);
    } catch (error) {
      console.log(error);
    }
  }

  function handlePosition(event) {
    event.preventDefault();
    setTimeout;
    getIpAddress();
  }

  useEffect(() => {
    getAddress();
  }, []);

  return (
    <div className="map-tracker">
      <div className="header">
        <h1>IP Address Tracker</h1>
        <div className="search-box">
          <form onSubmit={handlePosition}>
            <input
              className="search-input"
              type="text"
              placeholder="Search for any IP address or domain"
              value={IpAddress}
              onChange={(event) => {
                setIpAddress(event.target.value);
              }}
            />
            <button className="search-button" type="submit">
              <img src="/image/Path.png" className="arrow" />
            </button>
          </form>
        </div>
        <div className="address-info">
          {address.location && (
            <ul className="ip-list">
              <li>
                <h6>IP ADDRESS</h6>
                <h3>{address.ip}</h3>
              </li>
              <hr />
              <li>
                <h6>LOCATION</h6>
                <h3>
                  {address.location.city}, {address.location.country}{" "}
                  {address.location.postalCode}
                </h3>
              </li>
              <hr />
              <li>
                <h6>TIMEZONE</h6>
                <h3>UTC {address.location.timezone}</h3>
              </li>
              <hr />
              <li>
                <h6>ISP</h6>
                <h3>{address.isp}</h3>
              </li>
            </ul>
          )}
        </div>
      </div>
      <div>
        {address.location ? (
          <MapContainer
            center={[address.location.lat, address.location.lng]}
            zoom={13}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker
              position={[address.location.lat, address.location.lng]}
              icon={customIcon}
            >
              <Popup className="popup">
                <h3>
                  {address.location.lat}, {address.location.lng}
                </h3>
              </Popup>
            </Marker>
            <SetViewOnClick
              coords={[address.location.lat, address.location.lng]}
            />
          </MapContainer>
        ) : (
          <div className="loading-box">
            <div className="spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InputMap;
