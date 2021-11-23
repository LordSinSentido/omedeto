import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, updateProfile, deleteUser } from '@angular/fire/auth';


@Injectable()
export class AuthService {
  
  constructor(public autenticacion: AngularFireAuth) { }

  iniciarSesion(correo: string, contrasenna: string) {
    return this.autenticacion.signInWithEmailAndPassword(correo, contrasenna);
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

  eliminarUsuario() {
    const usuario = this.obtenerUsuario();

    if(usuario) {
      deleteUser(usuario).then(() => {
        return true;
      }).catch((error) => {
        return false;
      });
    }
      return true;
  }
}
