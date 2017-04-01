import { Component, OnInit } from '@angular/core';
import { SharedService } from "./../shared.service";
import { ConfigurationService } from './../configuration.service';
import { Configuracion } from '../configuracion/configuracion.model';
import { ConfiguracionY } from '../configuracion/configuracionY.model'
import { Grafica } from './grafica.model';
import { GraficaComponent } from './grafica.component';
import { AlertModule } from 'ng2-bootstrap/alert';
import { Router, Params, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.component.html',
})
export class GraficasComponent implements OnInit {

    signal: boolean = false;
    alerts: any = []; 
    visualizar: boolean[] = [];
    escalas: boolean;
    configuracionY: ConfiguracionY[] = [];
    graficas: Grafica[] = [];
    desplazamiento: number;
    from:number;
    to:number;
    registro: string;
    duracion: number;

  constructor(private _sharedService: SharedService,private router: Router,private route: ActivatedRoute, private _configurationService: ConfigurationService) { }

  ngOnInit() {

    this.desplazamiento  = this._configurationService.configuracion.desplazamiento;
    if(this._configurationService.configuracion.activa == 0) this.escalas = true;
    else this.escalas = false;
    this._configurationService.configuracionChange.subscribe((configuracion: Configuracion) => {
        if(configuracion.activa == 0) this.escalas = true;
        else this.escalas = false;
        this.desplazamiento = configuracion.desplazamiento;        
    });
    this._configurationService.configuracionYChange.subscribe((configuracion: ConfiguracionY) => {
        this.configuracionY[configuracion.id] = configuracion;        
    });
    this.registro = this.route.snapshot.params['id'];
    this.duracion = Number.parseInt(this.route.snapshot.queryParams['duracion']);
    this.from = 0,
    this.to = this.desplazamiento,
    this.obtenerInicial(); 
  }

       obtenerInicial() { 

        this._sharedService.getGraficas(this.registro,this.from.toString(),this.to.toString())
            .subscribe(
            lstresult => { 
                this.graficas = lstresult;
                var i = 0;
                this.visualizar.push(true);
                var configuracionAux: ConfiguracionY = { activa: false, id: i, max: 0, min: 0, tick: 0}; 
                this.configuracionY.push(configuracionAux);
                this.graficas[i].configuracionY = this.configuracionY[i];
                for(i=i+1;i<this.graficas.length;i++){
                    this.visualizar.push(false);
                    var configuracionAux: ConfiguracionY = { activa: false, id: i, max: 0, min: 0, tick: 0}; 
                    this.configuracionY.push(configuracionAux);
                    this.graficas[i].configuracionY = this.configuracionY[i];
                    
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
                for(var i=0;i<this.configuracionY.length;i++){
                    this.graficas[i].configuracionY = this.configuracionY[i];
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
        this.from = this.to,
        this.to = this.to + this.desplazamiento;
        this.obtener();
    }

    avanzarM(){
        let aux = (this.to-this.from)/2;
        this.from = this.from + aux,
        this.to = this.to + aux;
        this.obtener();
    }
    
    retroceder(){
        if(this.from - this.desplazamiento < 0){
            this.from = 0;
            this.to = this.desplazamiento;
        }else{
            this.to = this.from,
            this.from = this.to - this.desplazamiento;
        }
        this.obtener();
    }

    retrocederM(){
        let aux = (this.to - this.from)/2
        if(this.from - aux < 0){
            this.from = 0;
            this.to = this.desplazamiento;
        }else{
            this.to = this.to - aux,
            this.from = this.from - aux;
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
      
        if(Number.parseInt(desde) < 0 || Number.parseInt(hasta) <= Number.parseInt(desde)) this.notificar("El intervalo introducido no es valido");
        else{
            this.from = Number.parseInt(desde);
            this.to = Number.parseInt(hasta);
            this.obtener();
            this.desplazamiento = this.to - this.from;
        }
    }

    ocultar(i: number){
        
        if(this.visualizar[i] == true){
            this.visualizar[i] = false;
        }else{
            this.visualizar[i] = true;
        }
    }

    ocultarEscala(){
        this._configurationService.hideEscalas();
    }

    cambiarEscala(value: any){
        if(Number.parseFloat(value) !=0)
        this._configurationService.changeEscala(Number.parseFloat(value));
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
