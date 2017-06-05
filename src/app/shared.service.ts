import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers, Response,RequestOptions, URLSearchParams } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { Grafica } from './graficas/grafica.model';

@Injectable()
export class SharedService {

    usuariosURL = 'http://localhost:8080/Web-Service/api/BD/Usuarios/';
    registrosURL = 'http://localhost:8080/Web-Service/api/BD/Registros/';

    conectado = false;
    usuario = '';

    @Output()
    userChanged: EventEmitter<string> = new EventEmitter<string>();

    @Output()
    authChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private _http: Http) { 
        if(localStorage.getItem('token') != null){
            this.usuario = localStorage.getItem('usuario');
            this.conectado = true;
        } 
    }
 
    getGraficas(registro:string, from:string, to:string) {
   
        let params = new URLSearchParams();
        params.set('from', from);
        params.set('to',to);
        let headers = new Headers();
        headers.append('authorization',localStorage.getItem('token'))
        let options = new RequestOptions({
              headers: headers,
              search: params
          });
        
        return this._http.get(this.registrosURL+'/'+registro,options)
            .map(response => {
                { return response.json() };
            })
            .catch(error => Observable.throw(error.json()));
    }

    getCalulados(registro:string,from, to) {
   

        let params = new URLSearchParams();
        params.set('from', from);
        params.set('to',to);
        let headers = new Headers();
        headers.append('authorization',localStorage.getItem('token'))
        let options = new RequestOptions({
              headers: headers,
              search: params
          });
        
        return this._http.get(this.registrosURL+'/'+registro+'/Calculated',options)
            .map(response => {
                { return response.json() };
            })
            .catch(error => Observable.throw(error.json()));
    }

    getDerivada(registro:string, segmento) {
   
        let params = new URLSearchParams();
        params.set('segmento', segmento);
        let headers = new Headers();
        headers.append('authorization',localStorage.getItem('token'))
        let options = new RequestOptions({
              headers: headers,
              search: params
        });
        
        return this._http.get(this.registrosURL+'/'+registro+'/Averaged',options)
            .map(response => {
                { return response.json() };
            })
            .catch(error => Observable.throw(error.json()));
    }

    putDerivada(registro:string, segmento: string, grafica: Grafica){

        let params = new URLSearchParams();
        params.set('segmento', segmento);
        let headers = new Headers();
        headers.append('authorization',localStorage.getItem('token'))
        let options = new RequestOptions({
              headers: headers,
              search: params
        });

        return this._http.put(this.registrosURL+'/'+registro+'/Averaged',grafica,options)
            .map(response => {
                {  return response; };
            })
            .catch(error => Observable.throw(error));
    }

    getRegistros(from, to){
        let params = new URLSearchParams();
        params.set('from', from);
        params.set('to',to);
        let headers = new Headers();
        headers.append('authorization',localStorage.getItem('token'))
        let options = new RequestOptions({
              headers: headers,
              search: params
          });
        return this._http.get(this.registrosURL,options)
            .map(response => {
                {  return response.json(); };
            })
            .catch(error => Observable.throw(error.json()));
    }

    uploadRegister(formData: FormData){

        return this._http.post(this.registrosURL,formData,this.obtenerCabecera())
            .map(response => {  
                 return response;
            })
            .catch(error => Observable.throw(error));        
    }
    

    login(formData: FormData) {
        
        return this._http.post(this.usuariosURL+'/login', formData)
            .map(res => {
                localStorage.setItem('token',res.json().token);
                this.changeUser(res.json().nombre);;
                this.changeAuth(true);
                return res;
            })
            .catch(error => Observable.throw(error));
    }

    registrarse(formData: FormData){
        return this._http.post(this.usuariosURL, formData)
            .map(res => {
                localStorage.setItem('token',res.json().token);
                this.changeUser(res.json().nombre);;
                this.changeAuth(true);
                return res;
            })
            .catch(error => Observable.throw(error));
    }

    obtenerCabecera(){
        let headers = new Headers();
        headers.append('authorization',localStorage.getItem('token'))
        let options = new RequestOptions({ headers: headers });
        return options;
    }


    changeAuth(loggedIn: boolean) {
        this.conectado = loggedIn;
        this.authChanged.emit(loggedIn); 
    }
    

    changeUser(usuario: string){
        localStorage.setItem('usuario',usuario);
        this.userChanged.emit(usuario);
    }

  
    logout() {
        this.changeAuth(false);
        this.changeUser('');
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
    }


    getUsuario(){
        return localStorage.getItem('usuario');
    }
}
