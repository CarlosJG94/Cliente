import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers, Response,RequestOptions, URLSearchParams } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { Configuracion } from './configuracion/configuracion.model';

@Injectable()
export class ConfigurationService {
   
    configuracion: Configuracion =  { activa: 0.5, desplazamiento: 10, escalaX: 1};

    @Output()
    configuracionChange: EventEmitter<Configuracion> = new EventEmitter<Configuracion>();

    constructor() { } 

    changeConfiguracion(configuracion: Configuracion){
        this.configuracion = configuracion;
        this.configuracionChange.emit(this.configuracion);
    }
}