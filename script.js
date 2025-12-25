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
add.addEventListener("click",()=>{
  form.style.display="none"
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
  


}
