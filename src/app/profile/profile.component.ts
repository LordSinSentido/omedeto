import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DeleteRecipeComponent } from '../dialog/delete-recipe/delete-recipe.component';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  procesando: boolean = true;
  hayRecetas: boolean = false;

  conexionDelUsuario: Observable<any> = this.ServicioDeAutenticacion.autenticacion.user;
  datosDelUsuario = {
    uid: '',
    nombreDelUsuario: '',
    correo: '',
    fotoUrl: '',
    tipo: ''
  };

  recetas: any[] = [];

  constructor(private ServicioDeAutenticacion: AuthService, private ServicioDeFirestore: FirestoreService, private ServicioDeAlamacenamiento: StorageService, private redireccionar: Router, public dialogo: MatDialog, private snackbar: MatSnackBar) { 

  }

  ngOnInit(): void {
    this.obtenerRecetas();
    
  }

  obtenerRecetas() {
    this.conexionDelUsuario.subscribe(usuario => {
      this.datosDelUsuario.uid = usuario.uid;
      this.datosDelUsuario.nombreDelUsuario = usuario.displayName;
      this.datosDelUsuario.correo = usuario.email;
      this.datosDelUsuario.fotoUrl = usuario.photoURL;

      this.comprobarAdmin();

      this.ServicioDeFirestore.obtenerMisRecetas(this.datosDelUsuario.uid).subscribe(datos => {      
        this.recetas = [];
        datos.forEach((receta: any) => {
          this.recetas.push({
            id: receta.payload.doc.id,
            ...receta.payload.doc.data()
          });
          this.hayRecetas = true;
        });
        
        this.procesando = false;
      });

      
    });
  }

  comprobarAdmin() {
    this.ServicioDeFirestore.obtenerTipoDeUsuario(this.datosDelUsuario.uid).subscribe(datos => {
      let usuario: any = [];
      usuario.push(datos.data());
      this.datosDelUsuario.tipo = usuario[0].tipo;
      console.log(this.datosDelUsuario.tipo);
    });
  }

  cerrarSesion() {
    this.ServicioDeAutenticacion.cerrarSesion().then(() => {
      this.redireccionar.navigate(['/principal']);
      this.snackbar.open("Se ha cerrado tu sesión", "", {duration: 3000});
    }).catch(error => {
      this.snackbar.open(error.message, "Aceptar", {duration: 7000});
    });
  }

  confirmarBorrado(idReceta: string) {
    let referencia = this.dialogo.open(DeleteRecipeComponent);
    referencia.afterClosed().subscribe((resultado: string) => {
      if(resultado == 'true') {
        this.ServicioDeAlamacenamiento.eliminarFotoDeReceta(this.datosDelUsuario.uid, idReceta).then(() => {
          this.ServicioDeFirestore.eliminarReceta(idReceta).then(() => {
            this.snackbar.open("¡Listo! Receta eliminada", "", {duration: 3000});
          }).catch(error => {
            this.snackbar.open(error.message, "Aceptar", {duration: 7000});
          });
        }).catch(error => {
          this.snackbar.open(error.message, "Aceptar", {duration: 7000});
        });
      }
    });
  }
}
