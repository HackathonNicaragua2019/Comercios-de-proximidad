import { VerpComponent } from './../../component/verp/verp.component';
import { AddProductoComponent } from './../../component/add-producto/add-producto.component';
import { PedidoComponent } from './../../component/pedido/pedido.component';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { File } from '@ionic-native/file/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { ModalController, AlertController, ActionSheetController, Platform, LoadingController } from '@ionic/angular';
import { AngularFirestore } from '@Angular/fire/firestore';
import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

declare var google;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  private idUsuario : string;
  private arregloComercio : any = [];
  private BAND = true;
  arregloPedidos:any = [];
  private i: number = 0;
  private arregloUser: any = [];
  options: any;
  public nombre: string;
  public description: string;
  urlFire: string;

  public downloadurl: Observable<string>;

  //Parametros agregar comercio
  private lat: any;
  private lng: any;

  constructor(
    private geolocation: Geolocation,
    private db : AngularFirestore,
    private auth : AngularFireAuth,
    private mc : ModalController,
    private camera: Camera,
    private platform: Platform,
    private file: File,
    private afstorage: AngularFireStorage,
    private androidPermissions: AndroidPermissions,
    private alertCtrl: AlertController,
    public actionSheetController: ActionSheetController,
    private loadCtrl: LoadingController
    ) { }

    ngOnInit() {

      this.auth.authState.subscribe( user => {
        if (user) { 
          this.idUsuario = user.uid;
          this.getComercio(this.idUsuario);
          this.getLatLng();
        }
      });
    }

    async getComercio(idUsuario)
    {
      let comercioQuery = this.db.collection('/negocios',
      ref => ref.where('idusuario', '==', idUsuario));
      comercioQuery.valueChanges().subscribe(valores => {
      if (valores.length > 0)
      {
        this.arregloComercio = valores;
        this.getCarrito(this.arregloComercio[0].id);
        this.BAND = true;
      }
      else {
        this.BAND = false;
      }
      });
    }

  verLista(idcarrito : string)
  {
    this.mc.create({
      component: PedidoComponent,
      componentProps : {
      id: idcarrito
    }
    }).then((modal) => modal.present());
  }

  getCarrito(idcomercio : string)
  {
  let carritoQuery = this.db.collection('/carrito',
  ref => ref.where('idcomercio', '==', idcomercio).where("enviar",
    "==", true).where("entregado", "==", false));

  this.arregloPedidos = [];

  carritoQuery.valueChanges().subscribe(carritos =>
  {
    this.arregloPedidos = carritos;
  });
  }

register(form) {
}

async getLatLng()
{

  await this.geolocation.getCurrentPosition().then((resp) => {
    this.lat = resp.coords.latitude;
    this.lng = resp.coords.longitude;
  }).catch((error) => {
    console.log('Error getting location', error);
  });
}

async openGalery(){
  const option: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    correctOrientation: true
  };

  try {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
      result => console.log('Has permission?',result.hasPermission),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
    );
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.GET_ACCOUNTS]);

    const fileuri: string = await this.camera.getPicture(option);
    let file: string;
    if (this.platform.is('ios')){
      file = fileuri.split('/').pop();
    }
    else {
      file = fileuri.substring(fileuri.lastIndexOf('/') + 1, fileuri.indexOf('?'));
    }
    const path: string = fileuri.substring(0, fileuri.lastIndexOf('/'));
    const buffer: ArrayBuffer = await this.file.readAsArrayBuffer(path, file);
    const blob: Blob = new Blob([buffer], {type: 'image/jpeg'});
    this.uploadPicture(blob);
  }catch (e) {
    console.log(e);
  }
}

async uploadPicture(blob: Blob)
{
  let numero = Math.floor(Math.random() * 100000000000000) + 1;
  let name = 'ionic'+ numero+ '.jpg';
  const ref = this.afstorage.ref(name);
  const task = ref.put(blob);
  const loading = await this.loadCtrl.create();
  loading.present();
  task.snapshotChanges().pipe(
    finalize(() => {
      this.downloadurl = ref.getDownloadURL();
      this.downloadurl.subscribe(value => {
        this.urlFire = value;
        loading.dismiss();
    });
  })
  ).subscribe();
}

async agregarNegocio()
{
  await this.db.collection('negocios').add({
    idusuario: this.idUsuario,
    nombre: this.nombre,
    descripcion: this.description,
    id: "",
    imagen: this.urlFire,
    lat: this.lat,
    long: this.lng
  }).then(docRef => {
    this.db.collection('negocios').doc(docRef.id).update({ id: docRef.id});
    this.presentAlert();
  });
}

async presentAlert() {
const alert = await this.alertCtrl.create({
header: 'Información',
message: 'Comercio creado.',
buttons: ['OK']
});

await alert.present();
}

async presentActionSheet() {
const actionSheet = await this.actionSheetController.create({
header: 'Productos',
buttons: [{
text: 'Agregar productos',
icon: 'add-circle',
handler: () => {
this.abrirListaAddP();
}
}, {
text: 'Ver productos',
icon: 'ios-clipboard',
handler: () => {
this.abrirListaVerP();
}
}, {
text: 'Cancel',
icon: 'close',
role: 'cancel',
handler: () => {
}
}]
});
await actionSheet.present();
}

abrirListaVerP()
{
this.mc.create({
component: VerpComponent,
componentProps : {
id: this.arregloComercio[0].id
}
}).then((modal) => modal.present());
}

abrirListaAddP()
{
this.mc.create({
component: AddProductoComponent,
componentProps : {
id: this.arregloComercio[0].id
}
}).then((modal) => modal.present());
}

}
