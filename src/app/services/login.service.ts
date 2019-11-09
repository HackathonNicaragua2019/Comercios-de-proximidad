import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private auth: AngularFireAuth) { }

  login(email: string, pass: string)
  {
    return new Promise((resolve, rejected) => {
      this.auth.auth.signInWithEmailAndPassword(email, pass).then(
      res=> {
        resolve(res);
      }
    ).catch(
      err => {
        rejected(err);
      }
    );
    });
  }

  logout()
  {
    return this.auth.auth.signOut();
  }

  registrar(email: string, pass: string)
  {
    return new Promise((resolve, reject) => {
      this.auth.auth.createUserWithEmailAndPassword(email, pass).then(res => {
    resolve(res);
      }).catch(err => reject(err));
    });
  }

  agregarusuario(id: string, nombre: string, apellido: string, correo: string)
  {
    /* this.db.collection("usuarios").add({id: id,
      nombre: nombre, apellido: apellido, correo: correo, google: google, facebook: facebook}); */
  }
}
