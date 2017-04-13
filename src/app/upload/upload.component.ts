import { Component, OnInit } from '@angular/core';
import { SharedService } from "./../shared.service";
import { Router } from '@angular/router';
import {NgForm} from '@angular/forms';

@Component({
	selector: 'upload',
    templateUrl: './upload.component.html' ,
    styleUrls: ['./upload.component.css']
})

export class UploadComponent implements OnInit{

    espera: boolean = false;
    aux: string;
    cabecera: File;
    files: File[]  = [];
    alerts: any = []; 
    nombres: string;

    constructor(private _sharedService: SharedService,private router: Router) { }

    ngOnInit() {
		this.nombres ='';
	}

    submitForm(value: any){
        
        let formData: FormData = new FormData();
        if(this.files.length == 0 || this.cabecera == null) this.notificar('Se debe adjuntar un archivo cabecera y sus adjuntos', "warning");
        else{
        this.espera = true;
        for (let i = 0; i < this.files.length; i++) {
            formData.append("files", this.files[i], this.files[i].name);
        }
        formData.append("cabecera",this.cabecera,this.cabecera.name);
        formData.append("sex", value.sex);
        formData.append("age",value.age);
        formData.append("height",value.height);
        formData.append('width',value.width);
        this._sharedService.uploadRegister(formData)
            .subscribe(
            response => { 
                this.espera = false;
                this.router.navigate(['Records']);
            },
            error => {  
                if(error.status == 401){
                    this.espera = false;
                    this.router.navigate(['Login']);
                }else{
                    this.espera = false;
                    this.notificar(error.text(),"danger");
                }
            }
            );
        }
    }   

    onChangeFiles(event) {
        var files = event.srcElement.files;
        this.files = files;
        var aux= '';
        for (let i = 0; i < this.files.length; i++) {
           aux = aux +' '+ this.files[i].name;
        }
        this.nombres = aux;

    }

    onChangeCabecera(event) {    
        var aux = event.srcElement.files;
        this.cabecera = aux[0];
        this.aux= this.cabecera.name;
    }

    notificar(mensaje: string,tipo: string): void {
        this.alerts.push({msg: mensaje,type: tipo});
    }

    getFiles(){
        var aux= '';
        for (let i = 0; i < this.files.length; i++) {
            aux = aux +','+this.files[i].name
        }
        return 'hola';
    }
    
}