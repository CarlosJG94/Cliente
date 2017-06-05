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
    from: number;
    to: number;
    desplazamiento: number;
    alerts: any = [];

    constructor(private _sharedService: SharedService,private router: Router){ }

    ngOnInit() {

      const isAuthenticated = this._sharedService.conectado;
      this.from = 0;
      this.to = 6;
      this.desplazamiento = 6;
      if (!isAuthenticated) { 
          this.router.navigate(['/Login']);
      }else{
          this.obtenerRegistro(); 
      }
    }

    obtenerRegistro(){

      this._sharedService.getRegistros(this.from,this.to)
            .subscribe(
            lstresult => { 
              this.registros = lstresult;
              if(this.registros.length == 0){
                  this.notificar('No se enuentran más segmentos');
                  this. from =  this.from - this.desplazamiento;
                    this.to = this.to - this.desplazamiento;
                    this.obtenerRegistro();
              }
            },
            error => {
                
            }
            ); 
    }

    avanzar(){
        this.from = this.from + this.desplazamiento;
        this.to = this.to + this.desplazamiento;
        this.obtenerRegistro();
    }

    retroceder(){
        if(this.from - this.desplazamiento <= 0 ){
            this.from = 0;
            this.to = this.from + this.desplazamiento;
        }
        else{
            this. from =  this.from - this.desplazamiento;
            this.to = this.to - this.desplazamiento;
        }
        this.obtenerRegistro();
    }


    notificar(mensaje: string): void {
        this.alerts = [];
        this.alerts.push({ msg: mensaje });
    }


    signals(registro: string,longitud: string){
        this.router.navigate(['/Graficas',registro], {queryParams: {duracion: longitud}});
    }

    derivada(registro: string, longitud: string){
        this.router.navigate(['/Derivada',registro], {queryParams: {duracion: longitud}});
    }

    calculados(registro: string, longitud: string){
        this.router.navigate(['/Calculados',registro],{queryParams: {duracion: longitud}});
    }


}