import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable()
export class AuthService {
  //public usuario: User | undefined;

  constructor(public autenticacion: AngularFireAuth) { }

  async iniciarSesion(correo: string, contrasenna: string) {
    try{
      return await this.autenticacion.signInWithEmailAndPassword(correo, contrasenna);
    } catch(error){
      return false;
    }
  }

  async registarUsuario(correo: string, contrasenna: string) {
    try {
      return await this.autenticacion.createUserWithEmailAndPassword(correo, contrasenna);
    } catch (error) {
      return console.log(error);
    }
  }

  async comprobarEstado() {
    try {
      return await this.autenticacion.authState.pipe(first()).toPromise();
    } catch (error) {
      return console.log(error);
    }
  }

  async cerrarSesion() {
    try {
      return await this.autenticacion.signOut();
    } catch (error) {
      return console.log(error);
    }
  }
}
