import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  FormularioDeInicioDeSesion = new FormGroup({
    correo: new FormControl(''),
    contrasenna: new FormControl('')
  });

  constructor(private ServicioDeAutenticacion: AuthService, private redireccionar: Router, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
  }

  async iniciarSesion() {
    try {
      const {correo, contrasenna} = this.FormularioDeInicioDeSesion.value;
      const seInicioSesion = await this.ServicioDeAutenticacion.iniciarSesion(correo, contrasenna);
  
      if (seInicioSesion) {
        this.redireccionar.navigate(['/']);
        this.snackbar.open("Sesión iniciada", "", {duration: 3000});
      } else {
        this.snackbar.open("No se pudo iniciar la sesión, revise su correo o contraseña e intentelo nuevamente", "Aceptar", {duration: 5000});
      }
    } catch (error: any) {
      
    }
  }
}
