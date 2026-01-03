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
var form = document.getElementById('form')
var type_session = document.getElementById("type_session")
var movement_type = document.getElementById("movement_type")
var map = document.getElementById("map")
var add = document.getElementById("add")
var activities = document.getElementById("activities");

type_session.addEventListener('change',()=>{
  if(type_session.value == "cycling"){
    movement_type.innerHTML =""
    const label=document.createElement('label');
    label.textContent="Dénivelé (m)"
    label.htmlFor="denivele"

    const input=document.createElement("input");
    input.type="number"
    input.id="denivele"
    input.required = true

    movement_type.appendChild(label)
    movement_type.appendChild(input)
  }
  else if (type_session.value == "running"){
    movement_type.innerHTML =""
    const label=document.createElement('label');
    label.textContent="Cadence (pas/min)"
    label.htmlFor="cadence"

    const input=document.createElement("input");
    input.type="number"
    input.id="cadence"
    input.required = true

    movement_type.appendChild(label)
    movement_type.appendChild(input)
  }
  else{
    movement_type.innerHTML=""
  }
}) 
map.addEventListener("click",()=>{
  form.style.display="block"
})


class Session {
  constructor(coords, distance, duration){
    this.id = (Date.now()+ "").slice(-10);
    this.date = new Date().toLocaleDateString("fr-FR");
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
    this._setDescription();
  }
  _setDescription(){
    this.description = `Id : ${this.id} date : ${this.date} - Distance : ${this.distance} km, Durée : ${this.duration} min`;
  }
}

class RunSession extends Session{
  constructor(coords,distance,duration,cadence){
    super(coords,distance,duration);
    this.cadence = cadence;
    this.type = "running";
    this.pace=(duration/distance).toFixed(1);
  }
  _setDescription(){
    this.description = `Id : ${this.id}, type : ${this.type} date : ${this.date} - Distance : ${this.distance} km, Durée : ${this.duration} min, Allure : ${this.pace} min/km`;
  }
}

class BikeSession extends Session {
  constructor(coords, distance, duration, elevationGain){
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.type = "cycling";
    this.speed = (distance / (duration / 60)).toFixed(1);
  }
  _setDescription(){
    this.description = `Id : ${this.id}, type : ${this.type} date : ${this.date} - Distance : ${this.distance} km, Durée : ${this.duration} min, Vitesse : ${this.speed} km/h`;
  }
}


class ActivityManager {
  map;
  sessions = [];
  mapEvent; //  stocke le clic map
  markers = {};

  constructor() {
  this.mapContainer = document.getElementById("map");
  if (!this.mapContainer) return;

  this._getLocalStorage(); 
  this._getPosition();

  add.addEventListener("click", this._newSession.bind(this)); 
  activities.addEventListener("click", this._moveToMarker.bind(this));
}


  _getPosition() {
    if (!navigator.geolocation) {
      this._initMap([30.4278, -9.58]);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      this._onPositionSuccess.bind(this),
      this._onPositionError.bind(this)
    );
  }

  _onPositionSuccess(position) {
    const { latitude, longitude } = position.coords;
  const coords = [latitude, longitude];

  this._initMap(coords);
  this._showUserPosition(coords);
  this.sessions.forEach((s) => this._renderMarker(s));

  }

  _onPositionError() {
    this._initMap([30.4278, -9.58]);
    this.sessions.forEach((s) => this._renderMarker(s));

  }

  _initMap(coords) {
    this.map = L.map("map").setView(coords, 13);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      }
    ).addTo(this.map);

    this.map.on("click", this._showForm);
  }

  _showForm = (e) => {
  this.mapEvent = e;             
  form.style.display = "block";
};


  _showUserPosition(coords) {
    L.marker(coords)
      .addTo(this.map)
      .bindPopup("📍 Vous êtes ici")
      .openPopup();
  }

  _newSession() {
  if (!this.mapEvent) {
    alert("Clique sur la carte pour choisir un point 📍");
    return;
  }

  const distance = +document.getElementById("distance").value;
  const duration = +document.getElementById("duration").value;
  const type = type_session.value;

  // ✅ validation : pas de négatifs (PDF) :contentReference[oaicite:8]{index=8}
  if (!type || distance <= 0 || duration <= 0) {
    alert("Champs invalides : choisis le type et mets des valeurs positives.");
    return;
  }

  const { lat, lng } = this.mapEvent.latlng;
  let session;

  if (type === "running") {
    const cadence = +document.getElementById("cadence").value;
    if (cadence <= 0) return alert("Cadence invalide (valeur positive).");
    session = new RunSession([lat, lng], distance, duration, cadence);
  }

  if (type === "cycling") {
    const denivele = +document.getElementById("denivele").value;
    if (denivele <= 0) return alert("Dénivelé invalide (valeur positive).");
    session = new BikeSession([lat, lng], distance, duration, denivele);
  }

  this.sessions.push(session);

  this._renderSession(session);  // insertAdjacentHTML :contentReference[oaicite:9]{index=9}
  this._renderMarker(session);
  this._setLocalStorage();       // persistance :contentReference[oaicite:10]{index=10}

  form.style.display = "none";
  form.reset();
  movement_type.innerHTML = "";
  this.mapEvent = null;
}

_renderSession(session) {
  const html = `
    <li class="activity" data-id="${session.id}">
      ${session.description}
    </li>
  `;
  activities.insertAdjacentHTML("afterbegin", html);
}

_renderMarker(session) {
  const marker = L.marker(session.coords)
    .addTo(this.map)
    .bindPopup(session.description);

  this.markers[session.id] = marker;
}

_moveToMarker(e) {
  const item = e.target.closest(".activity");
  if (!item) return;

  const id = item.dataset.id;
  const session = this.sessions.find((s) => s.id === id);
  if (!session) return;

  this.map.setView(session.coords, 13, { animate: true });

  if (this.markers[id]) this.markers[id].openPopup();
}

_setLocalStorage() {
  localStorage.setItem("geotrakr_sessions", JSON.stringify(this.sessions));
}

_getLocalStorage() {
  const data = JSON.parse(localStorage.getItem("geotrakr_sessions"));
  if (!data) return;

  this.sessions = data;

  // afficher la liste maintenant (la map viendra après)
  this.sessions.forEach((s) => this._renderSession(s));
}


}


document.addEventListener("DOMContentLoaded", () => {
  new ActivityManager();
});

