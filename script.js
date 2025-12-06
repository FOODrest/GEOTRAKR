"use strict";

/*
  Fichier de base GeoTrakr
  TODO : 
  - Créer les classes Session, RunSession, BikeSession
  - Créer la classe ActivityManager
  - Gérer la géolocalisation et l'affichage de la carte Leaflet
  - Gérer le formulaire, les événements, le localStorage, etc.
*/

// Exemple : point d'entrée de l'application
// Vous déciderez si vous utilisez une classe principale ou une approche différente.

console.log("GeoTrakr - point de départ du projet");

/*
if ("geolocation" in navigator){
  navigator.geolocation.getCurrentPosition(
    function (position){
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log(`Position trouvée : ${latitude}, ${longitude}`);
      const map = L.map('map').setView([latitude,longitude],15);
      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
      }
      ).addTo(map);
      L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup("📍 You are here !")
        .openPopup();

    }
  )

}
*/

class Session{
  constructor({coords, distance, duration, type}){
    this.id = (Date.now()+'').slice(-10);
    this.date = new Date();
    this.coords = coords;//[lat,lng]
    this.distance =+distance;
    this.duration =+duration;
    this.type = type;
  }
  getSummary(){
    return {
      id: this.id,
      date: this.date.toISOString(),
      type: this.type,
      distance: this.distance,
      duration: this.duration
    };

  }

}