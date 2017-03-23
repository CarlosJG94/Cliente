import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Grafica } from './grafica.model';
import { ChartModule } from 'angular2-highcharts'; 
import { ConfigurationService } from '../configuration.service';
import { Configuracion } from '../configuracion/configuracion.model';
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

    constructor(private _configurationService: ConfigurationService){ }

	ngOnInit() {

        this.configuracion  = this._configurationService.configuracion;
        this._configurationService.configuracionChange.subscribe((configuracion: Configuracion) => {
            this.configuracion = configuracion;     
            this.reload();  
        });
		this.reload();
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
                tickInterval: 1,
            },
            yAxis: {
                gridLineColor: 'black',
                gridLineWidth: 0.5,
                title: {
                    text: this.grafica.valorEscala
                },
            },

            series: [{ 
                data: this.obtenerDatos(),
                color: '#08088A',
                allowPointSelect: true,
                type: 'spline'
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
        this.pintarEscalas();
    }

    pintarEscalas(){
        //this.chart.xAxis[0].removePlotLine('escalas');
        for(var i=this.grafica.y[0]; i<this.grafica.x.length; i = i + this.configuracion.escalaX){
            this.chart.xAxis[0].addPlotLine({
                value: i,
                color: 'black',
                width: 0.5,
                id: 'escalas',
            });
        }
    }

}

