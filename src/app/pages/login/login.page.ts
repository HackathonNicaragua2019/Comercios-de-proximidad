import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string;
  pass: string;
  constructor(private ls: LoginService, private router: Router) { }

  ngOnInit() {
  }

  onSubmitLogin()
  {

    this.ls.login(this.email, this.pass).then(res=>{
      this.router.navigate(['']);
    }).catch(err=>{
      alert("Los datos son incorrectos o no existe el usuario");
    });
  }

  logout()
  {
    this.ls.logout().then(
      () => { this.router.navigate(['/login']); }
  )
  }

}
