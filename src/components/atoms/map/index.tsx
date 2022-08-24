/* eslint-disable @next/next/no-img-element */
import "leaflet/dist/leaflet.css";
import marker from "./marker.png";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import { useEffect } from "react";

interface GetCenterProps {
  lanLng: [number, number];
  sendPosition?: (lanLng: { lat: number; lng: number }) => void;
  zoom?: number;
}

const GetCenter = ({ sendPosition, lanLng, zoom }: GetCenterProps) => {
  const map = useMapEvents({
    dragend: () => {
      sendPosition && sendPosition(map.getCenter());
    },
    locationfound: (location: any) => {
      sendPosition && sendPosition(location.latlng);
    },
  });

  useEffect(() => {
    const { lat, lng } = map.getCenter();
    if (lanLng[0] !== lat && lanLng[1] !== lng) {
      map.setView(lanLng, zoom ?? map.getZoom());
    }
  }, [lanLng]);

  useEffect(() => {
    setTimeout(() => !lanLng[0] && !lanLng[1] && map.locate({ maxZoom: 20 }), 1000);
  }, []);

  return (
    <div
      className="absolute bottom-3 left-3 z-[400] w-10 h-10 rounded-lg shadow-lg flex justify-center items-center bg-white"
      onClick={() => map.locate({ maxZoom: 20 })}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 1.25C12.4142 1.25 12.75 1.58579 12.75 2V3.28169C16.9842 3.64113 20.3589 7.01581 20.7183 11.25H22C22.4142 11.25 22.75 11.5858 22.75 12C22.75 12.4142 22.4142 12.75 22 12.75H20.7183C20.3589 16.9842 16.9842 20.3589 12.75 20.7183V22C12.75 22.4142 12.4142 22.75 12 22.75C11.5858 22.75 11.25 22.4142 11.25 22V20.7183C7.01581 20.3589 3.64113 16.9842 3.28169 12.75H2C1.58579 12.75 1.25 12.4142 1.25 12C1.25 11.5858 1.58579 11.25 2 11.25H3.28169C3.64113 7.01581 7.01581 3.64113 11.25 3.28169V2C11.25 1.58579 11.5858 1.25 12 1.25ZM12 19.25C16.0041 19.25 19.25 16.0041 19.25 12C19.25 7.99594 16.0041 4.75 12 4.75C7.99594 4.75 4.75 7.99594 4.75 12C4.75 16.0041 7.99594 19.25 12 19.25ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
          fill="#22282F"
        />
      </svg>
    </div>
  );
};

interface MapProps {
  lat?: number;
  lng?: number;
  zoom?: number;
  setZoom?: (zoom: number | undefined) => void;
  sendPosition?: (lanLng: { lat: number; lng: number }) => void;
}

const Map = ({ lat = 0, lng = 0, sendPosition, zoom = 20 }: MapProps) => {
  return (
    <MapContainer
      className="h-full w-full relative flex flex-col justify-center items-center"
      center={[35.71709406629546, 51.360106784450196]}
      zoom={zoom}
      scrollWheelZoom
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <img src={marker.src} alt="" className="absolute z-infinity transition-all" />
      <GetCenter sendPosition={sendPosition} lanLng={[lat, lng]} zoom={zoom} />
    </MapContainer>
  );
};

export default Map;
