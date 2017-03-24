import { ConfiguracionY } from '../configuracion/configuracionY.model'

export interface Grafica {
	titulo: string;
	x: any[];
	y: any[];
	latidos: any[];
	valorEscala: string;
	configuracionY: ConfiguracionY;
}