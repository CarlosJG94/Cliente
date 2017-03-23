import { Component, OnInit } from '@angular/core';
import { SharedService } from './shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styles: []
})
export class MenuComponent implements OnInit {

  usuario: string;
  loginLogoutText: string = 'Login';

  constructor(private _sharedService: SharedService,private router: Router ) { }

    ngOnInit() {       
        this.usuario = this._sharedService.usuario;
        this.setLoginLogoutText(this._sharedService.conectado);
        
        this._sharedService.authChanged.subscribe((loggedIn: boolean) => {
            this.setLoginLogoutText(loggedIn);
        });

        this._sharedService.userChanged.subscribe((usuario: string) => {
            this.usuario = usuario;
        });
    }

    loginOrOut() {
        const isAuthenticated = this._sharedService.conectado;
        if (isAuthenticated) { 
            this.setLoginLogoutText(!isAuthenticated);
            this._sharedService.logout();
        }
        else {
            this.router.navigate(['/Login']);
        }
    };
    
    setLoginLogoutText(loggedIn: boolean) {
        this.loginLogoutText = (loggedIn) ? 'Logout' : 'Login';
    }
    
}
