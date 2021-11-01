import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private almacenamiento: AngularFireStorage ) { }
  
  cargarFotoDePerfil(uid: string) {
    const path = `fotosDePefil/${uid}`;
    return this.almacenamiento.storage.ref(path);
  }
}
