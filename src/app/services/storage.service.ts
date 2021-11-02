import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private almacenamiento: AngularFireStorage ) { }
  
  cargarFotoDePerfil(archivo: File, uid: string) {
    const path = this.almacenamiento.storage.ref(`fotosDePerfil/${uid}`);
    const subir = path.put(archivo);
    return subir;
  }

  cargarFotoDeReceta(archivo: File, receta: string, uid: string) {
    const path = this.almacenamiento.storage.ref(`fotosDeReceta/${uid}/${receta}`);
    const subir = path.put(archivo);
    return subir;
  }
}
