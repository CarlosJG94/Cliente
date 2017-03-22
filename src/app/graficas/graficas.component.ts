import { Component, OnInit } from '@angular/core';
import { SharedService } from "./../shared.service";
import { ConfigurationService } from './../configuration.service';
import { Grafica } from './grafica.model';
import { GraficaComponent } from './grafica.component';
import { AlertModule } from 'ng2-bootstrap/alert';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { Configuracion } from '../configuracion/configuracion.model';

@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.component.html',
  styles: []
})
export class GraficasComponent implements OnInit {

    signal: boolean = false;
    alerts: any = []; 
    visualizar: boolean[] = [];
    graficas: Grafica[] = [];
    desplazamiento: number;
    from:number;
    to:number;
    registro: string;
    duracion: number;

  constructor(private _sharedService: SharedService,private router: Router,private route: ActivatedRoute, private _configurationService: ConfigurationService) { }

  ngOnInit() {

    this.desplazamiento  = this._configurationService.configuracion.desplazamiento;
    this._configurationService.configuracionChange.subscribe((configuracion: Configuracion) => {
        this.desplazamiento = configuracion.desplazamiento;        
    });
    this.registro = this.route.snapshot.params['id'];
    this.duracion = Number.parseInt(this.route.snapshot.queryParams['duracion']);
    this.from = 0,
    this.to = this.desplazamiento,
    this.obtenerInicial(); 
  }

  obtenerInicial() { 

        this._sharedService.getGraficas(this.registro, this.from.toString(),this.to.toString())
            .subscribe(
            lstresult => { 
                this.graficas = lstresult;
                var i;
                for(i=0;i<this.graficas.length;i++){
                    this.visualizar.push(true);
                }
            },
            error => {
                 this.notificar('El parametro introducido excede el tamaño del registro');
                 this.from = this.from - this.desplazamiento,
                 this.to = this.to - this.desplazamiento;
            }
            ); 
    }


    obtener() { 

        this._sharedService.getGraficas(this.registro,this.from.toString(),this.to.toString())
            .subscribe(
            lstresult => { 
                this.graficas = lstresult;
                var i;
                for(i=0;i<this.graficas.length;i++){
                    this.visualizar.push(true);
                }
            },
            error => {
                this.notificar('El parametro introducido excede el tamaño del registro');
                 this.from = this.from - this.desplazamiento,
                 this.to = this.to - this.desplazamiento;
            }
            ); 
    }

    avanzar(){
        this.from = this.from + this.desplazamiento,
        this.to = this.to + this.desplazamiento;
        this.obtener();
    }
    
    retroceder(){
        if(this.from - this.desplazamiento < 0){
            this.from = 0;
            this.to = this.desplazamiento;
        }else{
            this.from = this.from - this.desplazamiento,
            this.to = this.to - this.desplazamiento;
        }
        this.obtener();
    }

    principio(){
        this.from = 0;
        this.to = this.desplazamiento;
        this.obtener();
    }

    final(){
        this.from = this.duracion - this.desplazamiento;
        this.to = this.duracion;
        this.obtener();
    }


    getIntervalo(desde: string,hasta: string){
      
        if(desde == '' || hasta == '') this.notificar("El intervalo introducido no es valido")
        else if(Number.parseInt(desde) < 0 || Number.parseInt(hasta) <= Number.parseInt(desde)) this.notificar("El intervalo introducido no es valido");
        else{
            this.from = Number.parseInt(desde);
            this.to = Number.parseInt(hasta);
            this.obtener();
        }
    }

    ocultar(i: number){
        
        if(this.visualizar[i] == true){
            this.visualizar[i] = false;
        }else{
            this.visualizar[i] = true;
        }
    }

    notificar(mensaje: string): void {
        this.alerts.push({msg: mensaje});
    }

    signals(){
      if(this.signal == true){
            this.signal = false;
        }else{
            this.signal = true;
        }
    }
}
