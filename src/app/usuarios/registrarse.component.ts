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

    if(value.password == value.password2){
        let formData: FormData = new FormData();
        formData.append("username",value.username);
        formData.append("password",value.password);
        formData.append('email',value.email);

        this._sharedService.registrarse(formData)
            .subscribe(
            result => {
                this.router.navigate(['Upload']);
            },
            error => {
                if(error.status == 409){
                    this.notificar('El Nombre de usuario ya se encuentra en uso');
                }
            }
        ); 
    }else{
        this.notificar('Las contraseñas no coinciden');
    }
    

  }

    notificar(mensaje: string): void {
        this.alerts = [];
        this.alerts.push({msg: mensaje});
    }
}