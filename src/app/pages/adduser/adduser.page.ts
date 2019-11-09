import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.page.html',
  styleUrls: ['./adduser.page.scss'],
})
export class AdduserPage implements OnInit {

  public email: string;
  public pass: string;
  public nombre: string;
  public apellido: string;
  public repass: string;
  public arregloUser: any;
  public BAND = false;

  constructor(private auth: LoginService, private router: Router,
    private general: GeneralService) { }

  ngOnInit() {
  }

  onSubmitRegister()
  {
    if (this.pass == this.repass)
    {
      this.auth.registrar(this.email, this.pass).then(
          auth => {
            this.arregloUser = auth;
            this.auth.agregarusuario(this.arregloUser.user.uid, this.nombre, this.apellido, this.email);
            this.general.mensaje('Información', 'Usuario creado');
            this.email = "";
            this.nombre = "";
            this.pass = "";
            this.repass = "";
            this.apellido = "";
          }
      ).catch(err => this.general.mensaje('Información', 'Hubo un error al momento de crear el usuario'));
    }else
    {
      this.general.mensaje('Alerta','Contraseña erroneas');
    }
  }

  backLogin()
  {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
