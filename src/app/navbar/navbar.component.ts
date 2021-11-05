import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public conexionDelUsuario: Observable<any> = this.ServicioDeAutenticacion.autenticacion.user;
  
  constructor(private ServicioDeAutenticacion: AuthService, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
  }

  async cerrarSesion() {
    await this.ServicioDeAutenticacion.cerrarSesion().then(() => {
      this.snackbar.open("Se ha cerrado tu sesión", "", {duration: 3000});
    }).catch(error => {
      this.snackbar.open(error.message, "Aceptar", {duration: 7000});
    });
  }
}
