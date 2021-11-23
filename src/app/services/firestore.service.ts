import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) { }

  agregarUsuario(uid: string, usuario: any): Promise<any> {
    return this.firestore.collection('usersData').doc(uid).set(usuario);
  }

  agregarReceta(receta: any): Promise<any> {
    return this.firestore.collection('recipes').add(receta);
  }

  editarFoto(idReceta: string, recetaActualizada: any): Promise<any> {
    return this.firestore.collection('recipes').doc(idReceta).update(recetaActualizada);
  }

  obtenerTipoDeUsuario(uid: string) {
    return this.firestore.collection('usersData').doc(uid).get();
  }

  obtenerTodasLasRecetas(): Observable<any>{
    return this.firestore.collection('recipes', ref => ref.orderBy('fechaDeActualizacion', 'desc')).snapshotChanges();
  }

  obtenerTodosLosUsuarios(): Observable<any> {
    return this.firestore.collection('usersData', ref => ref.orderBy('nombreDelUsuario', 'asc')).snapshotChanges();
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

  eliminarUsuario(uid: string): Promise<any> {
    return this.firestore.collection('usersData').doc(uid).delete();
  }

  actualizarReceta(idReceta: string, receta: any) {
    return this.firestore.collection('recipes').doc(idReceta).update(receta);
  }

  actualizarTipo(uid: string, datos: any) {
    return this.firestore.collection('usersData').doc(uid).update(datos);
  }

}
