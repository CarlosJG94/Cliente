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
    SV: number;
    CO: number;
    SI: number;
    CI: number;

    constructor(private _sharedService: SharedService, private route: ActivatedRoute){}

    ngOnInit() {
        this.registro = this.route.snapshot.params['id'];
        this.segmento = 1;
        this.obtenerGrafica();
    }


     obtenerGrafica() { 

        this._sharedService.getDerivada(this.registro,this.segmento)
            .subscribe(
            lstresult => { 
                this.grafica = lstresult;
                this.reload();
            },
            error => {
                this.segmento--;
                this.notificar('No existen más segmentos');
            }
            ); 
        }

    reload(){
 		this.options = {
             title: {    
                align: 'right',          
                text : this.grafica.titulo
            },            
			rangeSelector: {
            	selected: 1
        	},
             legend: {
                enabled: false
            },
            zoomType: 'x',
            xAxis: {
                gridLineColor: 'black',
                gridLineWidth: 0.5,
                labels: {
                    formatter: function () {
                        return (this.value) + 'ms';
                    }
                },  
                title: {
                    text: (this.segmento*30-30)+'-'+(this.segmento)*30+'sec'
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

    notificar(mensaje: string): void {
        this.alerts.push({msg: mensaje});
    }

    
}