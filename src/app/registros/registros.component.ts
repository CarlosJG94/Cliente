import { Component, OnInit } from '@angular/core';
import { SharedService } from "./../shared.service";
import { Registro } from './registro.model';
import { Router } from '@angular/router';


@Component({
  selector: 'register',
  templateUrl: './registros.component.html',
})

export class RegistrosComponent implements OnInit{

    registros: Registro[] = [];

    constructor(private _sharedService: SharedService,private router: Router){ }

    ngOnInit() {

      const isAuthenticated = this._sharedService.conectado;
      if (!isAuthenticated) { 
          this.router.navigate(['/Login']);
      }else{
          this.obtenerRegistro(); 
      }
    }

    obtenerRegistro(){

      this._sharedService.getRegistros()
            .subscribe(
            lstresult => { 
              this.registros = lstresult;
            },
            error => {
                alert('Errorr');
            }
            ); 
    }

    onClick(registro: string,longitud: string){
        this.router.navigate(['/Graficas',registro], {queryParams: {duracion: longitud}});
    }
}