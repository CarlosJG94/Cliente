import { Component, OnInit } from '@angular/core';
import { SharedService } from "./../shared.service";
import { ConfigurationService } from './../configuration.service';
import { Configuracion } from '../configuracion/configuracion.model';
import { ConfiguracionY } from '../configuracion/configuracionY.model'
import { Grafica } from './grafica.model';
import { GraficaComponent } from './grafica.component';
import { AlertModule } from 'ng2-bootstrap/alert';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';


@Component({
  selector: 'derivada',
  templateUrl: './derivada.component.html',
})

export class DerivadaComponent implements OnInit {

    registro: string;
    grafica: Grafica;
    segmento: number;
    options: Object;
    chart: any;
    alerts: any = []; 
    alerts2: any = []; 
    SV: number;
    CO: number;
    SI: number;
    CI: number;
    sizeSegmento: number;
    pointSelected: number;
    aux: boolean;

    constructor(private _sharedService: SharedService, private route: ActivatedRoute){}

    ngOnInit() {
        this.registro = this.route.snapshot.params['id'];
        this.segmento = 1;
        this.aux = false;
        this.obtenerGrafica();
        
    }


     obtenerGrafica() { 

        this._sharedService.getDerivada(this.registro,this.segmento)
            .subscribe(
            lstresult => { 
                this.grafica = lstresult;
                this.sizeSegmento = this.grafica.sizeSegment;
                this.reload();
            },
            error => {
                this.segmento--;
                this.notificar('Error: No existen más segmentos',0,"danger");
            }
            ); 
        }

    modificarSegmento() {
        
        this._sharedService.putDerivada(this.registro,this.segmento.toString(),this.grafica)
            .subscribe(
            lstresult => { 
                if(this.aux) {
                    this.segmento = 1;
                    this.aux = false;
                }
                this.obtenerGrafica();
                document.getElementById("closeModal").click();
                document.getElementById("closeModal2").click();
            },
            error => {
                this.notificar('El Tamaño del segmento no es valido',1,"danger");
            }
            ); 
        }

    reload(){
 		this.options = {
             chart:{
                zoomType: 'x'
             },
             title: {    
                align: 'right',          
                text : this.grafica.titulo
            },          

             legend: {
                enabled: false
            },
            xAxis: {
                minRange: 100,
                gridLineColor: 'black',
                gridLineWidth: 0.5,
                labels: {
                    formatter: function () {
                        return (this.value) + 'ms';
                    }
                },  
            
                title: {
                    text: (this.segmento*this.sizeSegmento-this.sizeSegmento)+'-'+(this.segmento)*this.sizeSegmento+'sec'
                },
                tickInterval: 100,
            },
            yAxis: {
                gridLineColor: 'black',
                gridLineWidth: 0,
                title: {
                    text: 'Ohms/sec'
                },
                tickInterval: 1,
            },

            series: [{ 
                data: this.obtenerDatos(),
                color: '#08088A',
                allowPointSelect: true,
                type: 'spline',
                id: 'dataseries',
            }]
        };
    }

    obtenerDatos(){
        var mySeries = [];
        for (var i = 0; i < this.grafica.x.length; i++) {
            mySeries.push([this.grafica.y[i], this.grafica.x[i]]);
        }
        return mySeries;   
    }

    saveChart(chart) {
        this.chart = chart;
        this.anotaciones();
        this.corte();
    }

    anotaciones(){
       
        this.chart.addSeries({
                name: 'Events',
                            data: [],
                            onSeries: 'dataseries',
                            type: 'flags',
                            shape: 'circlepin',
                            width: 20,  
                            height: 15,          
        });
        this.SV = this.grafica.anotaciones[0].coordenada;
        this.CO = this.grafica.anotaciones[1].coordenada;
        this.SI = this.grafica.anotaciones[2].coordenada;
        this.CI = this.grafica.anotaciones[3].coordenada;
        for(var i=4; i<this.grafica.anotaciones.length;i++){
            this.chart.series[1].addPoint({
                x: this.grafica.anotaciones[i].coordenada,
                title: this.grafica.anotaciones[i].nombre,
        })

        }
    }

    corte(){
            this.chart.yAxis[0].addPlotLine({
                value: 0,
                color: 'black',
                width: 1.5,
            });
        
    }

    retrocederSegmento(){
        if(!(this.segmento == 1)){
            this.segmento--;
            this.obtenerGrafica();
        }
    }

    avanzarSegmento(){
        this.segmento++;
        this.obtenerGrafica();
    }

    changeSize(size: any){
        this.grafica.sizeSegment = size;
        this.aux = true;
        this.modificarSegmento();
    }

    notificar(mensaje: string,aux: number,tipo: string): void {
        if(aux == 0) this.alerts.push({msg: mensaje});
        else this.alerts2.push({msg: mensaje, type: tipo});
    }

    onPointSelect(e){
        this.pointSelected = e.context.x;
        document.getElementById("openModalButton").click();
    }

    changePoint(i:number,value: string){
        this.grafica.anotaciones[i].coordenada = this.pointSelected;
        this.modificarSegmento();
    }

    
}