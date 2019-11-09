import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate} from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from "@angular/fire/auth"
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class NologinGuard implements CanActivate {

  constructor(private AFauth : AngularFireAuth, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean > | boolean {
    
    return this.AFauth.authState.pipe(map(auth => {
      if (auth === null || auth === undefined)
      {
        return true;
      }
      else {
        this.router.navigate(['']);
        return false;
      }
    }));
  }
}
