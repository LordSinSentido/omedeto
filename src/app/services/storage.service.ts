import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private almacenamiento: AngularFireStorage ) { }
  
  cargarFotoDePerfil(archivo: File, idUsuario: string) {
    const path = this.almacenamiento.storage.ref(`fotosDePerfil/${idUsuario}`);
    const subir = path.put(archivo);
    return subir;
  }

  eliminarFotoPerfil(idUsuario: string): Promise<any> {
    return this.almacenamiento.storage.ref(`fotosDePerfil/${idUsuario}`).delete();
  }
  
  cargarFotoDeReceta(archivo: File, idReceta: string, idUsuario: string) {
    const path = this.almacenamiento.storage.ref(`fotosDeReceta/${idUsuario}/${idReceta}`);
    const subir = path.put(archivo);
    return subir;
  }

  eliminarFotoDeReceta(idUsuario: string, idReceta: string): Promise<any> {
    return this.almacenamiento.storage.ref(`fotosDeReceta/${idUsuario}/${idReceta}`).delete();
  }

}
