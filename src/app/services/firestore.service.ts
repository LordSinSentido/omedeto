import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) { }

  agregarReceta(receta: any): Promise<any> {
    return this.firestore.collection('recipes').add(receta);
  };

  editarFoto(idReceta: string, recetaActualizada: any) {
    return this.firestore.collection('recipes').doc(idReceta).update(recetaActualizada);
  }

}
