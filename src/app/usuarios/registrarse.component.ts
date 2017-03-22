import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../shared.service';

@Component({
  selector: 'registrarse',
  templateUrl: './registrarse.component.html',
})
export class RegistrarseComponent {

      alerts: any = []; 

  constructor(private _sharedService: SharedService, private router: Router) {}

  onSubmit(value: any) {

    let formData: FormData = new FormData();
    formData.append("username",value.username);
    formData.append("password",value.password);
    formData.append('password2',value.password2);
    formData.append('email',value.email);

    this._sharedService.registrarse(formData)
        .subscribe(
        result => {
            this.router.navigate(['Records']);
        },
        error => {
            this.notificar('Error');
        }
    ); 
    

  }

    notificar(mensaje: string): void {
        this.alerts.push({msg: mensaje});
    }
}