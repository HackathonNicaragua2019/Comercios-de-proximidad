import {AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { GooglemapsService } from './../../services/googlemaps.service';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

declare var google;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
  
  mapRef = null;
  private marcadores: any = [];

  constructor(private geolocation: Geolocation,
    private loadCtrl: LoadingController,
    public router: Router,
    private googleMaps: GooglemapsService, 
    private permisos: AndroidPermissions) {}

  ngOnInit()
  {
    this.googleMaps.getMarcadores().subscribe(marker => {
      this.marcadores = marker;
      console.log(this.marcadores);

      this.permisos.checkPermission(this.permisos.PERMISSION.Geolocation).then(
        result => console.log('Has permission?', result.hasPermission),
        err => this.permisos.requestPermission(this.permisos.PERMISSION.Geolocation)
      );
      
      this.permisos.requestPermissions([this.permisos.PERMISSION.Geolocation, 
        this.permisos.PERMISSION.GET_ACCOUNTS]);

      this.geolocation.getCurrentPosition().then((resp) => {
         resp.coords.latitude;
         resp.coords.longitude;
         alert(resp.coords.latitude + " " + resp.coords.longitude);
        this.loadMap(this.marcadores, resp.coords.latitude, resp.coords.longitude);
      }).catch((error) => {
        alert("No hay permisos");
      });
    });
  }

  async loadMap(marker, lat, lng)
  {
    const loading = await this.loadCtrl.create();
    loading.present();
    const myLatLng = {lat, lng};
    const mapEle: HTMLElement = document.getElementById('map');

    this.mapRef = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 18,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      zoomControl: true
    });

    google.maps.event.addListenerOnce(this.mapRef, 'idle', () => {
      loading.dismiss();
      marker.forEach(elemento => {
        let mark = parseInt(this.getKilometros(myLatLng.lat, myLatLng.lng, elemento.lat, elemento.long));
        if (mark <= 2)
        {
          this.addMarker(elemento);
        }
      });
    });
  }

  private addMarker(marcador: any)
  {
    let texto = '<h2>'+ marcador.nombre +'</h2>' + '<p>' + marcador.descripcion + '</p>'+
        '<img src="'+ marcador.imagen +'" style="width: 100%" /><hr />'+
    '<input type="button" id="clickableItem" style="background: #038C8C; color: #D0E3E9" value="Ver comercio"\'>';

    const marker = new google.maps.Marker({
      position: {
        lat: Number(marcador.lat),
        lng: Number(marcador.long)
      },
      zoom: 8,
      map: this.mapRef,
      animation: google.maps.Animation.DROP,
      title: marcador.nombre
    });
    const informacion = new google.maps.InfoWindow({
      content: texto
    });

    google.maps.event.addListener(informacion, 'domready', () => {
      const  clickableItem = document.getElementById('clickableItem');
      clickableItem.addEventListener('click', () => {
        this.router.navigate(['/home', marcador.id]);
      });

    });

    marker.addListener('click', () => {
      informacion.open(this.mapRef, marker);
    });
  }

  private getKilometros (lat1, lon1, lat2, lon2)
  {
    let radio = (x) => x * Math.PI / 180;
    let R = 6378.137; //Radio de la tierra en km
    let dLat = radio( lat2 - lat1 );
    let dLong = radio( lon2 - lon1 );
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(radio(lat1)) * Math.cos(radio(lat2)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    let d = R * c;
    return d.toFixed(3); //Retorna tres decimales
  }
}
