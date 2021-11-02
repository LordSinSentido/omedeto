import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { AuthService } from './../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  formularioDeRegistro: FormGroup;
  cargando: boolean = false;
  fotoDePerfil: any;
  progresoDeCarga: number = 0;

  constructor(private ServicioDeAutenticacion: AuthService, private ServicioDeAlmacenamiento: StorageService, private datosDelUsuario: FormBuilder, private redireccionar: Router, private snackbar: MatSnackBar) {
    this.formularioDeRegistro = this.datosDelUsuario.group({
      nombreDelUsuario: ['', Validators.required],
      correo: ['', Validators.email],
      contrasenna: ['', Validators.required],
      confirmacionContrasenna: ['', Validators.required],
      fotoUrl: ['']
    });
   }

  ngOnInit(): void {
  }

  obtenerImagen(evento:any){
    this.fotoDePerfil = evento.target?.files[0];
  }

  registrar() {

    // Comprueba las contrasennas
    if(this.formularioDeRegistro.value.contrasenna != this.formularioDeRegistro.value.confirmacionContrasenna) {
      this.snackbar.open("Las contraseñas no coinciden, revisalas", "Aceptar", {duration: 7000});
      return
    }

    // Genera el usuario en Firebase
    this.ServicioDeAutenticacion.registarUsuario(this.formularioDeRegistro.value.correo, this.formularioDeRegistro.value.contrasenna).then(usuarioCreado => {

      // Carga de la imagen de perfil
      const cargar = this.ServicioDeAlmacenamiento.cargarFotoDePerfil(this.fotoDePerfil, usuarioCreado.user.uid);
      cargar.on(
        'state_changed',
        snapshot => {
          let progresoDeCarga = snapshot.bytesTransferred / snapshot.totalBytes * 100;
          this.progresoDeCarga = progresoDeCarga;
        },
        error => {
          this.snackbar.open(error.message, "Aceptar", {duration: 7000});
        },
        () => { /// <---- Hay que revisar esta parte, no está retornando la url de la imagen
           cargar.snapshot.ref.getDownloadURL().then(url => {
            this.formularioDeRegistro.value.fotoUrl = url;

            usuarioCreado.user.updateProfile({
              uid: this.formularioDeRegistro.value.nombreDelUsuario,
              displayName: this.formularioDeRegistro.value.nombreDelUsuario,
              photoURL: this.formularioDeRegistro.value.fotoUrl
            });

            this.snackbar.open("¡Listo!, ahora puedes iniciar sesión", "", {duration: 3000});
            this.redireccionar.navigate(['/login']);
            this.ServicioDeAutenticacion.cerrarSesion();

           });
        }
      );
    }).catch(error => {
      this.snackbar.open(error.message, "Aceptar", {duration: 7000});
    });
  }
}
