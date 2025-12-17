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