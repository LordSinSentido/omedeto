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

  constructor(private ServicioDeAutenticacion: AuthService, private redireccionar: Router) { }

  ngOnInit(): void {
  }

  async registrar() {
    try {
      const {correo, contrasenna} = this.FormularioDeRegistro.value;
      const seRegistro = await this.ServicioDeAutenticacion.registarUsuario(correo, contrasenna);

      if(seRegistro) {
        this.redireccionar.navigate(['/']);
      }
    } catch (error) {
      
    }
  }
}
