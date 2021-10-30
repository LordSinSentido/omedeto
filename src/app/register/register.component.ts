import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  FormularioDeRegistro = new FormGroup({
    correo: new FormControl(''),
    contrasenna: new FormControl('')
  });

  cargando: boolean = false;

  constructor(private ServicioDeAutenticacion: AuthService, private redireccionar: Router) { }

  ngOnInit(): void {
  }

  registrar() {
    const {correo, contrasenna, nombre} = this.FormularioDeRegistro.value;
    this.ServicioDeAutenticacion.registarUsuario(correo, contrasenna);
    this.cargando = true;
  }
}
