import { ListaModalComponent } from './../../component/lista-modal/lista-modal.component';
import { ComercioService } from './../../services/comercio.service';
import { GeneralService } from 'src/app/services/general.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-comerce',
  templateUrl: './comerce.page.html',
  styleUrls: ['./comerce.page.scss'],
})
export class ComercePage implements OnInit {

  txtfitro: string = "";

  private comercioId: string;
  comercio : any = [];
  private carritoId: any = -1;
  private idUser: string = "";
  private prod: any = [];
  filtro : any = [];
  private BAND = false;

  constructor(private activateRoute : ActivatedRoute,
              private comercioService : ComercioService, private route : Router,
              private fireAuth : AngularFireAuth, private g: GeneralService,
              private modalCtrl: ModalController, private alertCtrl: AlertController){
  }

  filtrarCaracter()
  {
    this.filtro = this.prod;
    if (this.txtfitro.length > 0)
    {
      let query = this.txtfitro.toLowerCase();
      this.filtro = this.filtro.filter(item =>
          item.producto.toLowerCase().indexOf(query) >= 0
      );
    }
    else {
      this.filtro = this.prod;
    }
  }

  ngOnInit()
  {
    this.comercioId = this.activateRoute.snapshot.paramMap.get('id');
    if (this.comercioId != "" && this.comercioId != undefined)
    {
      this.comercioService.getComercio(this.comercioId).subscribe(comercio => {
        this.comercio = comercio;
      });
    }
    else {
      this.route.navigate(['/mapa']);
    }
    this.comercioService.actualizarIDComercio(this.comercioId);

    /*this.comercioService.getProducto().subscribe(datos => {
      this.prod = datos;
      this.filtro = datos;
    });*/

    this.comercioService.getProducto2(this.comercioId).valueChanges().subscribe(a => {
    this.prod = a;
    this.filtro = a;
  });

    this.idUser = this.fireAuth.auth.currentUser.uid;
    this.comercioService.getCarrito(this.idUser, this.comercioId, false).
    valueChanges().subscribe(a => {
     if (a.length > 0)
     {
        a.forEach(valores => {
          this.carritoId = valores;
        });
        this.BAND = true;
      }
     else {
       this.carritoId = -1;
       this.BAND = false;
     }
    });
  }

  async agregarCarritoProductos(id : string) {
    if (!this.BAND)
    {
      
      this.comercioService.getNombre(this.idUser).valueChanges().subscribe((nombre: any) => {
          const nombreCompleto = nombre[0].nombre + " " + nombre[0].apellido;
          this.comercioService.agregarCarrito(this.idUser, this.comercioId, false, nombreCompleto);
       });
       
    }

    const alert = await this.alertCtrl.create({
      header: 'Ingrese la cantidad!',
      backdropDismiss: false,
      inputs: [
        {
          name: 'cantidad',
          type: 'number',
          value: 0,
          placeholder: 'Cantidad'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (data) => {
              this.comercioService.obtenerCantidadPedido(this.carritoId.id).valueChanges().subscribe(a => {
                if (a.length <= 0)
                {
                  this.comercioService.eliminarCarrito(this.carritoId.id);
                }
              });
            }
        },
        {
          text: 'Agregar',
          handler: (data) => {
            if (this.BAND)
            {
              this.comercioService.agregarCarritoProducto(id, this.carritoId.id, data.cantidad);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  eliminarCarrito()
  {
    if (this.carritoId == -1)
    {
      this.mensaje('Advertencia', 'No existen carritos');
    }
    else
    {
      this.comercioService.eliminarCarrito(this.carritoId.id);
      this.carritoId = -1;
      this.mensaje('Información', 'Carrito eliminado');
    }
  }

  back(){
    this.route.navigate(['']);
  }

  abrirLista()
  {
    if (this.carritoId == -1)
    {
      this.mensaje('Error!', 'No hay productos agregados al carrito.');
    }
    else {
      this.modalCtrl.create({
        component: ListaModalComponent,
        componentProps : {
          id: this.carritoId.id
        }
      }).then((modal) => modal.present());
    }
  }

  async mensaje(titulo: string, mensaje: string) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

}
