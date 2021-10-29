import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public datosDelUsuario: Observable<any> = this.ServicioDeAutenticacion.autenticacion.user;

  constructor(private ServicioDeAutenticacion: AuthService) { }

  ngOnInit(): void {
  }

  async cerrarSesion() {
    await this.ServicioDeAutenticacion.cerrarSesion();
  }
}
