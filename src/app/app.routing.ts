import { Routes, RouterModule,Params } from '@angular/router';
import { GraficasComponent } from "./graficas/graficas.component";
import { UploadComponent } from "./upload/upload.component";
import { LoginComponent } from "./usuarios/login.component";
import { RegistrosComponent } from './registros/registros.component';
import { RegistrarseComponent } from './usuarios/registrarse.component';

const MAINMENU_ROUTES: Routes = [

    { path: 'Records', component: RegistrosComponent},
    { path: 'Login', component: LoginComponent },
    { path: 'Graficas/:id', component: GraficasComponent },
    { path: 'Upload', component: UploadComponent },
    { path: 'Registrarse', component: RegistrarseComponent}
];
export const CONST_ROUTING = RouterModule.forRoot(MAINMENU_ROUTES);