import { AngularFirestore } from '@Angular/fire/firestore';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.scss'],
})
export class PedidoComponent implements OnInit {

  private id : string;
  private arregloCarritos : any = [];
  private chp : any = [];
  productos : any = [];
  private i: number = 0;
  total: number = 0;

  constructor(private mc : ModalController, private db : AngularFirestore,
              private np : NavParams, private alertController : AlertController,
              private modalController : ModalController) {

  }

  ngOnInit() {
    this.id = this.np.get('id');
    this.getProductosTable(this.id);
  }

  closeChat()
  {
    this.mc.dismiss();
  }

  getProductosTable(idcarrito : string)
  {
    let carritoQuery = this.db.collection('/carrito_has_productos',
        ref => ref.where('idcarrito', '==', idcarrito));

    carritoQuery.valueChanges().subscribe(carritos =>
    {
      this.arregloCarritos = carritos;
      this.arregloCarritos.forEach(value =>
      {
        this.getProductos(value.idproducto, value.cantidad);
      });
    });
  }

  getProductos(idproducto : string, cantidad: number)
  {
    let carritoQuery = this.db.collection('/productos',
        ref => ref.where('id', '==', idproducto));

    carritoQuery.valueChanges().subscribe(productos =>
    {
      this.productos.push(productos[0]);
      this.productos[this.i].cantidad = cantidad;
      this.total += parseFloat(this.productos[this.i].precio) * cantidad;
      this.i++;
    });
  }

  updateEnviarCarrito(carrito_id : string)
  {
    this.db.collection('/carrito').doc(carrito_id).update(
        { entregado: true });
    this.presentAlert();
    this.modalController.dismiss();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Mensaje',
      message: 'Pedido entregado',
      buttons: ['OK']
    });

    await alert.present();
  }
}
