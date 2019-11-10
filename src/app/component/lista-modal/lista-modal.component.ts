import { Router } from '@angular/router';
import { AngularFirestore } from '@Angular/fire/firestore';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lista-modal',
  templateUrl: './lista-modal.component.html',
  styleUrls: ['./lista-modal.component.scss'],
})
export class ListaModalComponent implements OnInit {

  private id : any;
  arregloPedido : any = [];
  mostrarProducto : any = [];
  private i : number = 0;
  private total: number = 0;

  constructor(private modalController : ModalController, private db : AngularFirestore,
              private  navParams : NavParams, private route : Router, private alertController : AlertController) { }

  ngOnInit() {
    this.id = this.navParams.get('id');
    this.obtenerListaPedido(this.id);
  }

  closeChat()
  {
    this.modalController.dismiss();
  }

  obtenerListaPedido(idcarrito)
  {
    let carritoQuery = this.db.collection('/carrito_has_productos',
        ref => ref.where('idcarrito', '==', idcarrito));
    carritoQuery.valueChanges().subscribe(a => {this.arregloPedido = a;
      this.arregloPedido.forEach(a => {
        this.obtenerProductos(a.idproducto, a.cantidad, a.id);
      });
    });
  }

  obtenerProductos(valor : string, cantidad : string, idpedido: string)
  {
    let productoQuery = this.db.collection('/productos',
        ref => ref.where('id', '==', valor));
    productoQuery.valueChanges().subscribe(a => {
      if (this.mostrarProducto.length == 0 || this.mostrarProducto.length < 0)
      {
        this.mostrarProducto = a;
        this.mostrarProducto[this.i].cantidad = cantidad;
        this.mostrarProducto[this.i].idpedido = idpedido;
        this.total += parseFloat(this.mostrarProducto[this.i].precio) * parseFloat(cantidad);
        this.i++;
      }
      else {
        this.mostrarProducto.push(a[0]);
        this.mostrarProducto[this.i].cantidad = cantidad;
        this.mostrarProducto[this.i].idpedido = idpedido;
        this.total += parseFloat(this.mostrarProducto[this.i].precio) * parseFloat(cantidad);
        this.i++;
      }
    });
  }

  eliminarProducto(idpedido : string)
  {
    console.log(idpedido);
    this.db.collection("carrito_has_productos").doc(idpedido).delete();
    this.modalController.dismiss();
  }

  updateEnviarCarrito(carrito_id : string)
  {
    console.log(carrito_id);
    this.db.collection('/carrito').doc(carrito_id).update(
        { enviar: true });
    this.presentAlert();
    this.modalController.dismiss();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Mensaje',
      message: 'Pedido enviado',
      buttons: ['OK']
    });

    await alert.present();
  }

}
