import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from "./../configuration.service";
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Configuracion } from './configuracion.model';

@Component({
	selector: 'configuracion',
    templateUrl: './configuracion.component.html' 
})

export class ConfiguracionComponent implements OnInit{

    configuracion: Configuracion;

    constructor(private _configurationService: ConfigurationService,private router: Router) { }

    ngOnInit() {
        this.configuracion = this._configurationService.configuracion;
    }

    onSubmit(value: any){
        let des = value.desplazamiento;
        this.configuracion = { activa: this._configurationService.configuracion.activa, desplazamiento: des, escalaX: Number.parseFloat(value.optionsRadios)};
        this._configurationService.changeConfiguracion(this.configuracion);
    }

}
