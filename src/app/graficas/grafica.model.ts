import { ConfiguracionY } from '../configuracion/configuracionY.model'
import { Anotacion } from './anotacion.model';

export interface Grafica {
	titulo: string;
	x: any[];
	y: any[];
	latidos: any[];
	anotaciones: Anotacion[],
	valorEscala: string;
	sizeSegment: number;
	configuracionY: ConfiguracionY;
}