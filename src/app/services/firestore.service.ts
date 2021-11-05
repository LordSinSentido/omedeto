import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) { }

  agregarReceta(receta: any): Promise<any> {
    return this.firestore.collection('recipes').add(receta);
  };

  editarFoto(idReceta: string, recetaActualizada: any): Promise<any> {
    return this.firestore.collection('recipes').doc(idReceta).update(recetaActualizada);
  }

  obtenerTodasLasRecetas(): Observable<any>{
    return this.firestore.collection('recipes', ref => ref.orderBy('fechaDeActualizacion', 'desc')).snapshotChanges();
  }

  obtenerMisRecetas(idUsuario: string): Observable<any> {
    return this.firestore.collection('recipes', ref => ref.orderBy('fechaDeActualizacion', 'desc').where('autorID', '==', idUsuario)).snapshotChanges();
  }

  obtenerReceta(id: string): Observable<any> {
    return this.firestore.collection('recipes').doc(id).snapshotChanges();
  }

  eliminarReceta(idReceta: string): Promise<any> {
    return this.firestore.collection('recipes').doc(idReceta).delete();
  }

}
