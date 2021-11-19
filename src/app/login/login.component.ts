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

  procesando: boolean = false;

  constructor(private ServicioDeAutenticacion: AuthService, private redireccionar: Router, private snackbar: MatSnackBar) { 

  }

  ngOnInit(): void {
  }

  iniciarSesion() {
    this.procesando = true;

    const {correo, contrasenna} = this.FormularioDeInicioDeSesion.value;
    this.ServicioDeAutenticacion.iniciarSesion(correo, contrasenna).then(result => {
      this.snackbar.open("Hola " + result.user?.displayName, "", {duration: 3000});
      this.procesando = false;
      this.redireccionar.navigate(['/']);
    }).catch(error => {
      this.snackbar.open(error.message, "Aceptar", {duration: 7000});
      this.procesando = false;
    });
  }
}
