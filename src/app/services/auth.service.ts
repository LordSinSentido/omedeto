import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  
  constructor(public autenticacion: AngularFireAuth, private redireccionar: Router, private snackbar: MatSnackBar) { }

  iniciarSesion(correo: string, contrasenna: string) {
    this.autenticacion.signInWithEmailAndPassword(correo, contrasenna).then(result => {
      this.snackbar.open("Hola " + result.user?.email, "", {duration: 3000});
      this.redireccionar.navigate(['/']);
    }).catch(error => {
      this.snackbar.open(error.message, "Aceptar", {duration: 7000});
    });
  }

  registarUsuario(correo: string, contrasenna: string) {
    this.autenticacion.createUserWithEmailAndPassword(correo, contrasenna).then(usuario => {
      this.snackbar.open("¡Listo!, ahora puedes iniciar sesión", "", {duration: 3000});
      this.redireccionar.navigate(['/login']);
      this.autenticacion.signOut();
    }).catch(error => {
      this.snackbar.open(error.message, "Aceptar", {duration: 7000});
    });
  }

  comprobarEstado() {
    const usuario = this.autenticacion.currentUser;
    return usuario;
  }

  cerrarSesion() {
    this.autenticacion.signOut().then(() => {
      this.snackbar.open("Cerraste sesión", "", {duration: 3000});
      this.redireccionar.navigate(['/']);
    }).catch(error => {
      this.snackbar.open(error.message, "Aceptar", {duration: 7000});
    });
  }
}
