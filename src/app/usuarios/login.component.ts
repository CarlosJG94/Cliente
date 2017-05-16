import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../shared.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
})
export class LoginComponent {

  alerts: any = []; 

  constructor(private _sharedService: SharedService, private router: Router) {}

  onSubmit(value: any) {

    let formData: FormData = new FormData();
    formData.append("username",value.username);
    formData.append("password",value.password);
    
    this._sharedService.login(formData)
    .subscribe(
        result => {
            this.router.navigate(['Records']);
        },
        error => {
            this.notificar('Usuario o contraseña incorrectos');
        }
        ); 
  }

    notificar(mensaje: string): void {
        this.alerts = [];
        this.alerts.push({msg: mensaje});
    }

}