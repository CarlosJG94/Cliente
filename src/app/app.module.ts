import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpModule, JsonpModule } from '@angular/http';
import { ChartModule } from 'angular2-highcharts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { AlertModule } from 'ng2-bootstrap/alert';
import { AppComponent } from './app.component';
import { GraficaComponent } from './graficas/grafica.component';
import { GraficasComponent } from './graficas/graficas.component';
import { RegistrosComponent } from './registros/registros.component';
import { RegistrarseComponent } from './usuarios/registrarse.component';
import { SidebarModule } from 'ng-sidebar';
import { UploadComponent } from './upload/upload.component';
import { LoginComponent } from'./usuarios/login.component';
import { MenuComponent } from './menu.component';
import { CONST_ROUTING } from './app.routing'; 
import { SharedService } from "./shared.service";
import { ConfigurationService } from './configuration.service';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import { DerivadaComponent } from './graficas/derivada.component'



export function highchartsFactory() {
  return require('highcharts/highstock');
} 

@NgModule({
  declarations: [AppComponent, GraficaComponent, MenuComponent,GraficasComponent,DerivadaComponent, RegistrarseComponent, RegistrosComponent ,UploadComponent, LoginComponent],
  imports: [
    BrowserModule, 
    FormsModule, 
    HttpModule, 
    JsonpModule,
    CONST_ROUTING,
    AlertModule.forRoot(),
    NgbModule.forRoot(),
    ChartModule
  ],
  providers: [SharedService, ConfigurationService,
  {
      provide: HighchartsStatic,
      useFactory: highchartsFactory
    },
  ],
  bootstrap: [AppComponent]
})


export class AppModule { }
