import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AngularFirestore } from '@Angular/fire/firestore';
import { Injectable } from '@angular/core';

export interface negocios {
  descripcion: string;
  nombre: string;
  id: string;
  imagen: string;
  lat: string;
  long: string;
  idusuario: string;
}

export interface Productos {
  descripcion: string;
  producto: string;
  id: string;
  imagen: string;
  precio: string;
  idnegocio: string;
}

@Injectable({
  providedIn: 'root'
})
export class ComercioService {

  private arreglo : any = [];
  private arregloEliminar : any = [];
  private arregloCantidadProducto: any = [];

  constructor(private db : AngularFirestore, private route : Router) { }

  getComercio(comercio_id : string)
  {
    return this.db.collection('negocios').doc(comercio_id).valueChanges();
  }

  getCarrito(idUsuario: string, idComercio: string, enviar : boolean)
  {
    let carritoQuery = this.db.collection('/carrito',
        ref => ref.where('idusuario', '==', idUsuario).
        where('enviar', '==', false).where("idcomercio", "==", idComercio));
    return carritoQuery;
  }

  async agregarCarrito(idUsuario: string, idComercio: string, enviar: boolean)
  {
    await this.db.collection('carrito').add({
      idusuario: idUsuario,
      idcomercio: idComercio,
      enviar: enviar,
      id: "",
      entregado: false
    }).then(docRef => {
      this.db.collection('carrito').doc(docRef.id).update({ id: docRef.id});
    });
  }

  agregarCarritoProducto(idproducto: string, idcarrito: string, cantidad: string)
  {
    this.db.collection("carrito_has_productos").add({idcarrito: idcarrito,
      idproducto: idproducto, cantidad: cantidad}).then(docRef => {
      this.db.collection('carrito_has_productos').doc(docRef.id).update(
          { id: docRef.id});
    });
  }

  actualizarIDComercio(comercio_id : string)
  {
    this.db.collection('negocios').doc(comercio_id).update(
        { id: comercio_id });
  }

  getProducto()
  {
    return this.db.collection('productos').snapshotChanges().pipe( map(neg =>{
      return neg.map(a => {
        const data = a.payload.doc.data() as Productos;
        data.id = a.payload.doc.id;
        return data;
      });
    }));
  }

  getProducto2(comercio_id: string)
  {
    let carritoQuery = this.db.collection('/productos',
        ref => ref.where('idnegocio', '==', comercio_id));
    return carritoQuery;
  }

  updateIdProducto(producto_id : string)
  {
    this.db.collection('productos').doc(producto_id).update(
        { id: producto_id });
  }

  eliminarCarrito(idcarrito)
  {
    this.db.collection("carrito").doc(idcarrito).delete();
    let carritoQuery = this.db.collection('/carrito_has_productos',
        ref => ref.where('idcarrito', '==', idcarrito));
    carritoQuery.valueChanges().subscribe(a => {
      this.arregloEliminar = a;
      this.arregloEliminar.forEach(value => {
        this.db.collection("carrito_has_productos").doc(value.id).delete();
      });
    });
  }

  obtenerCantidadPedido(idcarrito)
  {
    let carritoQuery = this.db.collection('/carrito_has_productos',
        ref => ref.where('idcarrito', '==', idcarrito));
    return carritoQuery;
  }

}
