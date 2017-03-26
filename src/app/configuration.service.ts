import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers, Response,RequestOptions, URLSearchParams } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { Configuracion } from './configuracion/configuracion.model';
import { ConfiguracionY } from './configuracion/configuracionY.model';

@Injectable()
export class ConfigurationService {
   
    configuracion: Configuracion =  { activa: 0.5, desplazamiento: 10, escalaX: 1};

    @Output()
    configuracionChange: EventEmitter<Configuracion> = new EventEmitter<Configuracion>();

    @Output()
    configuracionYChange: EventEmitter<ConfiguracionY> = new EventEmitter<ConfiguracionY>();

    constructor() { } 

    changeConfiguracion(configuracion: Configuracion){
        this.configuracion = configuracion;
        this.configuracionChange.emit(this.configuracion);
    }

    changeConfigurationY(configuracion: ConfiguracionY){
        this.configuracionYChange.emit(configuracion);
    }

    hideEscalas(){
        if(this.configuracion.activa == 0){
            this.configuracion.activa = 0.5;
        }else{
            this.configuracion.activa = 0;
        }
        this.configuracionChange.emit(this.configuracion);
    }

    changeEscala(valor: number){
        this.configuracion.escalaX = valor;
        this.configuracionChange.emit(this.configuracion);
    }
}