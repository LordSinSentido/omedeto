import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  procesando: boolean = false;
  fotoDePerfil: any;
  progresoDeCarga: number = 0;

  constructor(private ServicioDeAutenticacion: AuthService, private ServicioDeAlmacenamiento: StorageService, private datosDelUsuario: FormBuilder, private redireccionar: Router, private snackbar: MatSnackBar) {
    this.formularioDeRegistro = this.datosDelUsuario.group({
      nombreDelUsuario: ['', Validators.required],
      correo: ['', [Validators.email, Validators.required]],
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

    this.procesando = true;

    if(this.formularioDeRegistro.value.contrasenna != this.formularioDeRegistro.value.confirmacionContrasenna) {
      this.procesando = false;
      this.snackbar.open("Las contraseñas no coinciden, revisalas", "Aceptar", {duration: 7000});
      return
    }

    this.ServicioDeAutenticacion.registarUsuario(this.formularioDeRegistro.value.correo, this.formularioDeRegistro.value.contrasenna).then(usuarioCreado => {
      const cargar = this.ServicioDeAlmacenamiento.cargarFotoDePerfil(this.fotoDePerfil, usuarioCreado.user.uid);
      cargar.on(
        'state_changed',
        snapshot => {
          let progresoDeCarga = snapshot.bytesTransferred / snapshot.totalBytes * 100;
          this.progresoDeCarga = progresoDeCarga;
        },
        error => {
          this.procesando = false;
          this.snackbar.open(error.message, "Aceptar", {duration: 7000});
        },
        () => {
           cargar.snapshot.ref.getDownloadURL().then(url => {
            this.formularioDeRegistro.value.fotoUrl = url;

            usuarioCreado.user.updateProfile({
              uid: this.formularioDeRegistro.value.nombreDelUsuario,
              displayName: this.formularioDeRegistro.value.nombreDelUsuario,
              photoURL: this.formularioDeRegistro.value.fotoUrl
            });

            this.snackbar.open("¡Listo!, ahora puedes iniciar sesión", "Aceptar", {duration: 7000});
            this.redireccionar.navigate(['/login']);
            this.ServicioDeAutenticacion.cerrarSesion();
            this.procesando = false;
           });
        }
      );
    }).catch(error => {
      this.procesando = false;
      this.snackbar.open(error.message, "Aceptar", {duration: 7000});
    });
  }
}
