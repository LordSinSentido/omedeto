import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, updateProfile } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  
  constructor(public autenticacion: AngularFireAuth, private redireccionar: Router, private snackbar: MatSnackBar) { }

  iniciarSesion(correo: string, contrasenna: string) {
    this.autenticacion.signInWithEmailAndPassword(correo, contrasenna).then(result => {
      this.snackbar.open("Hola " + result.user?.displayName, "", {duration: 3000});
      this.redireccionar.navigate(['/']);
    }).catch(error => {
      this.snackbar.open(error.message, "Aceptar", {duration: 7000});
    });
  }

  registarUsuario(correo: string, contrasenna: string): Promise<any> {
    return this.autenticacion.createUserWithEmailAndPassword(correo, contrasenna);
  }

  obtenerUsuario(){
    return getAuth().currentUser;
  }

  actualizarNombre(nombreUsuario: string) {
    const usuario = this.obtenerUsuario();
    if(usuario){
      updateProfile(usuario, {
        displayName: nombreUsuario
      });
      return true;
    }else{
      return false;
    }
  }

  actualizarFoto(url: string){
    const usuario = this.obtenerUsuario();
    if(usuario){
      updateProfile(usuario, {
        photoURL: url
      });
      return true;
    }else{
      return false;
    }
  }

  cerrarSesion(): Promise<any> {
    return this.autenticacion.signOut();
  }
}
