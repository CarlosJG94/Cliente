import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Grafica } from './grafica.model';
import { ChartModule } from 'angular2-highcharts'; 
import { ConfigurationService } from '../configuration.service';
import { Configuracion } from '../configuracion/configuracion.model';
import { ConfiguracionY } from '../configuracion/configuracionY.model';

@Component({
	selector: 'grafica',
    templateUrl: './grafica.component.html' 
})

export class GraficaComponent implements OnInit{

	@Input()
	private grafica: Grafica;

    @Input()
    private mostrar: boolean;

    options: Object;
    chart: any;
    configuracion: Configuracion;
    maxAux: number;
    minAux: number;

    constructor(private _configurationService: ConfigurationService){ }

	ngOnInit() {

        this.configuracion  = this._configurationService.configuracion;
        this._configurationService.configuracionChange.subscribe((configuracion: Configuracion) => {
            this.configuracion = configuracion;
            if(!this.grafica.configuracionY.activa) this.reload()
            else this.reload2();           
        });
        if(!this.grafica.configuracionY.activa) this.reload();
        else this.reload2();
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

            xAxis: {

                labels: {
                    formatter: function () {
                        return (this.value) + 's';
                    }
                },  
                
            },
            yAxis: {
                gridLineColor: 'black',
                gridLineWidth: this.configuracion.activa,
                title: {
                    text: this.grafica.valorEscala
                },
                scrollbar: {
                    enabled: true,
                },
                
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

    reload2(){
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

            xAxis: {

                labels: {
                    formatter: function () {
                        return (this.value) + 's';
                    }
                },  
                tickInterval: 1,
            },
            yAxis: {
                max: this.grafica.configuracionY.max,
                min: this.grafica.configuracionY.min,
                tickInterval: this.grafica.configuracionY.tick,
                gridLineColor: 'black',
                gridLineWidth: this.configuracion.activa,
                title: {
                    text: this.grafica.valorEscala
                },
                scrollbar: {
                    enabled: true,
                }
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
        for(var i=0; i < this.grafica.latidos.length;i++){
            this.chart.xAxis[0].addPlotLine({
                value: this.grafica.latidos[i],
                color: '#FA5858',
                width: 1.5,
            });
        }
        if(this.configuracion.activa != 0) this.pintarEscalas();
    }

    pintarEscalas(){

        for(var i=this.grafica.y[0]; i<= this.grafica.y[this.grafica.y.length-1]; i = i + this.configuracion.escalaX){
            this.chart.xAxis[0].addPlotLine({
                value: i,
                color: 'black',
                width: 0.5,
                id: 'escalas',
            });
        }
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
                            draggableY: true,
                            dragMinY: 0,         
        });
        
        for(var i=0; i<this.grafica.anotaciones.length;i++){
            this.chart.series[1].addPoint({
                x: this.grafica.anotaciones[i].coordenada,
                title: this.grafica.anotaciones[i].nombre,
        })

        }
    }

    onSubmit(value:any){
        var extremes = this.chart.yAxis[0].getExtremes();
        this.maxAux = extremes.max;
        this.minAux = extremes.min;
        var configuracionAux: ConfiguracionY = { activa: true, id: this.grafica.configuracionY.id, max: Number.parseFloat(value.maximo), min: Number.parseFloat(value.minimo), tick: Number.parseFloat(value.tick)}; 
        this.grafica.configuracionY = configuracionAux;
        this._configurationService.changeConfigurationY(configuracionAux);
        this.reload2();
        document.getElementById("closeModal").click();
    }

    reset(){
        if(this.maxAux != null){
            this.grafica.configuracionY.activa = false;
            this._configurationService.changeConfigurationY(this.grafica.configuracionY);
            this.chart.yAxis[0].setExtremes(this.maxAux,this.minAux);
        }
        else{
            this.grafica.configuracionY.activa = false;
            this._configurationService.changeConfigurationY(this.grafica.configuracionY);
        }
    }
}



