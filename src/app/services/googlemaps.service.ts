import { map } from 'rxjs/operators';
import {AngularFirestore } from '@Angular/fire/firestore';
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

@Injectable({
  providedIn: 'root'
})
export class GooglemapsService {

  constructor(private db: AngularFirestore) { }

  getMarcadores()
  {
    return this.db.collection('negocios').snapshotChanges().pipe(map(neg =>{
      return neg.map(a => {
        const data = a.payload.doc.data() as negocios;
        data.id = a.payload.doc.id;
        return data;
      });
    }));
  }
}
