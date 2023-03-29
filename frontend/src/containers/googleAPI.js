import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  Circle,
  CircleF,
} from "@react-google-maps/api";
import "../utils/CSS/googleAPI.css";
import { Input, Button, Tag, Tabs } from "antd";
import axios from "../utils/others/api";
import { usePost } from "./hooks/usePost";
const center = {
  lat: 25.0175023,
  lng: 121.5395138,
};
function cal_distance(lat1, lon1, lat2, lon2) {
  if (lat1 == lat2 && lon1 == lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;

    dist = dist * 1.609344 * 1000;

    return dist;
  }
}
const Map = ({ setPostModalOpen, setModalPost }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "NOT AVAILABLE NOW",
  });
  const [pos, setPos] = useState([]);
  const [last, setLast] = useState(null);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [time, setTime] = useState(true);
  const {
    focusedBulletin,
    setFocusedBulletin,
    bulletinName,
    setBulletinName,
    circle,
    located,
    image,
    distance,
    setDistance,
    JWT,
    displayStatus,
  } = usePost();

  useEffect(() => {
    // console.log(JWT);
    //setPos(fetchData());
    fetchData();
    //console.log(pos);
    // console.log("visited");
    // navigator.geolocation.getCurrentPosition((position) => {
    //   // console.log("here");
    //   // console.log(position.coords);
    //   setLat(position.coords.latitude);
    //   setLng(position.coords.longitude);
    // });
  }, []);
  let error;
  const success = (position) => {
    setLat(position.coords.latitude);
    setLng(position.coords.longitude);
    console.log("inside", lat, lng);
  };
  const watcher = navigator.geolocation.getCurrentPosition(success);
  let options = { enableHighAccuracy: true };
  useEffect(() => {
    setTimeout(() => {
      if (time) setTime(false);
      else setTime(true);

      //navigator.geolocation.watchPosition(success, error);
      navigator.geolocation.clearWatch(watcher);
    }, 500);
    console.log("outside", lat, lng);
  }, [time]);

  const onClickHandler = () => {
    console.log(lat, lng);
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition((position) => {
    //     const pos = {
    //       lat: position.coords.latitude,
    //       lng: position.coords.longitude,
    //     };
    //     setLat(pos.lat);
    //     setLng(pos.lng);
    //   });
    // }
    setLat(25.0197);
    setLng(121.54225);
  };

  const fetchData = async () => {
    const { data } = await axios.get("/api/bulletin", {
      headers: { Authorization: JWT },
    });

    console.log(data);
    setPos(data);
  };

  const MarkerClickHandler = async (id, p) => {
    //console.log("last = ", last, "id = ", id);
    if (!last) {
      setLast(id);
      setPostModalOpen(true);
    }
    if (last === id) {
      setPostModalOpen(false);
      setLast(null);
    }
    if (last !== id) setLast(id);
    setBulletinName(p.name);
    setFocusedBulletin(id);

    setModalPost(id);
    if (
      cal_distance(lat, lng, p.bulletin_loc.lat, p.bulletin_loc.lng) < p.radius
    )
      setDistance(true);
    else setDistance(false);
    // console.log(cal_distance(lat, lng, p.bulletin_loc.lat, p.bulletin_loc.lng));
  };
  if (!isLoaded) return <div>Loading...</div>;
  return (
    <>
      <GoogleMap
        options={{
          mapId: "e58babd550dc1f3e",
          draggable: false,
          zoomControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
        zoom={16}
        center={center}
        mapContainerClassName="googleMap"
      >
        {pos ? (
          pos.map((p) => (
            <>
              <MarkerF
                position={p.bulletin_loc}
                key={p.name}
                icon={{
                  url: require("./../utils/image/bulletin.png"),
                  scaledSize: { width: 35, height: 35 },
                }}
                onClick={() => MarkerClickHandler(p.area, p)}
              />
              <CircleF
                center={p.bulletin_loc}
                radius={p.radius}
                visible={circle}
                options={{ strokeColor: "TRANSPARENT", fillColor: "#000000" }}
              />
            </>
          ))
        ) : (
          <></>
        )}
        <MarkerF
          position={{ lat: lat, lng: lng }}
          icon={{
            url: require("./../utils/image/image1.png"),
            scaledSize: { width: 45, height: 45 },
          }}
          visible={located && image === 1}
        />
        <MarkerF
          position={{ lat: lat, lng: lng }}
          icon={{
            url: require("./../utils/image/image2.png"),
            scaledSize: { width: 45, height: 45 },
          }}
          visible={located && image === 2}
        />
        <MarkerF
          position={{ lat: lat, lng: lng }}
          icon={{
            url: require("./../utils/image/image3.png"),
            scaledSize: { width: 45, height: 45 },
          }}
          visible={located && image === 3}
        />
      </GoogleMap>
      <div>
        <Button onClick={onClickHandler}>Test</Button>
      </div>
    </>
  );
};
export default Map;
