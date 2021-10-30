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

  iniciarSesion() {
    const {correo, contrasenna} = this.FormularioDeInicioDeSesion.value;
    this.ServicioDeAutenticacion.iniciarSesion(correo, contrasenna);
  }
}
