import { Component, OnInit } from '@angular/core';
import { SharedService } from "./../shared.service";
import { Router } from '@angular/router';
import {NgForm} from '@angular/forms';

@Component({
	selector: 'upload',
    templateUrl: './upload.component.html' 
})

export class UploadComponent implements OnInit{

    aux: string;
    cabecera: File;
    files: File[];
    alerts: any = []; 

    constructor(private _sharedService: SharedService,private router: Router) { }

    ngOnInit() {
		
	}

    submitForm(value: any){
        let formData: FormData = new FormData();
        if(this.files.length == 0) this.notificar('Se debe adjuntar al menos un Archivo adicional', "warning");
        else{
        for (let i = 0; i < this.files.length; i++) {
            formData.append("files", this.files[i], this.files[i].name);
        }
        formData.append("cabecera",this.cabecera,this.cabecera.name);
        this._sharedService.uploadRegister(formData)
            .subscribe(
            response => { 
                this.notificar(response,"success");
            },
            error => {  
                if(error.status == 401){
                    this.router.navigate(['Login']);
                }else{
                    this.notificar(error.text(),"danger");
                }
            }
            );
        }
    }   

    onChangeFiles(event) {
        var files = event.srcElement.files;
        this.files = files;
    }

    onChangeCabecera(event) {    
        var aux = event.srcElement.files;
        this.cabecera = aux[0];
        this.aux= this.cabecera.name;
    }

    notificar(mensaje: string,tipo: string): void {
        this.alerts.push({msg: mensaje,type: tipo});
    }
    
}