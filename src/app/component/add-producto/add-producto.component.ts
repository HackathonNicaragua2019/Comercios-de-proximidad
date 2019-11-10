import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { File } from '@ionic-native/file/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Router } from '@angular/router';
import { AngularFirestore } from '@Angular/fire/firestore';
import { ModalController, NavParams, AlertController, Platform, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-producto',
  templateUrl: './add-producto.component.html',
  styleUrls: ['./add-producto.component.scss'],
})
export class AddProductoComponent implements OnInit {

  urlFire: string;
  producto: string;
  precio: string;
  id: string;

  public downloadurl: Observable<string>;

  constructor(private modalController: ModalController, private db: AngularFirestore,
              private  navParams: NavParams, private route: Router, private alertController: AlertController,
              private camera: Camera, private platform: Platform,
              private file: File, private afstorage: AngularFireStorage, private loadCtrl: LoadingController) { }

  ngOnInit() {
    this.id = this.navParams.get('id');
  }

  closeChat() {
    this.modalController.dismiss();
  }


  //AGREGAR PRODUCTO//
  //##################

  agregarProducto()
  {
      this.db.collection("/productos").add({
        idnegocio: this.id,
        id: "",
        precio: this.precio,
        image: this.urlFire,
        producto: this.producto
      }).then(docRef => {
        this.db.collection('/productos').doc(docRef.id).update(
            { id: docRef.id});
      });
    this.presentAlert();
    this.modalController.dismiss();
  }

  async openGalery(){
    const option: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true
    };

    try {
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

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Información',
      message: 'Producto agregado.',
      buttons: ['OK']
    });

    await alert.present();
  }

}
