import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirestoreService } from '../services/firestore.service';
import { DeleteRecipeComponent } from '../dialog/delete-recipe/delete-recipe.component';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  conexionDelUsuario: Observable<any> = this.ServicioDeAutenticacion.autenticacion.user;
  datosDelUsuario = {
    uid: ''
  };
  recetas: any[] = [];
  usuarios: any[] = [];
  procesandoRecetas: boolean = true;
  procesandoUsuarios: boolean = true;

  constructor(private ServicioDeAutenticacion: AuthService, private ServicioDeFirestore: FirestoreService, private ServicioDeAlamacenamiento: StorageService, public dialogo: MatDialog, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.traerDatos();
    this.conexionDelUsuario.subscribe(usuario => {
      this.datosDelUsuario.uid = usuario.uid;
    });
  }

  traerDatos() {

    this.ServicioDeFirestore.obtenerTodosLosUsuarios().subscribe(datos => {      
      this.usuarios = [];
      datos.forEach((receta: any) => {
        this.usuarios.push({
          id: receta.payload.doc.id,
          ...receta.payload.doc.data()
        });
      });
    //console.log(this.recetas, this.usuarios);
    this.procesandoRecetas = false;
    });

    this.ServicioDeFirestore.obtenerTodasLasRecetas().subscribe(datos => {      
      this.recetas = [];
      datos.forEach((receta: any) => {
        this.recetas.push({
          id: receta.payload.doc.id,
          ...receta.payload.doc.data()
        });
      });
    //console.log(this.recetas, this.usuarios);
    this.procesandoRecetas = false;
    });

  };

  confirmarBorrado(UidDelUsuario: string, idReceta: string) {
    let referencia = this.dialogo.open(DeleteRecipeComponent);
    referencia.afterClosed().subscribe((resultado: string) => {
      if(resultado == 'true') {
        console.log(UidDelUsuario, idReceta);
        this.ServicioDeAlamacenamiento.eliminarFotoDeReceta(UidDelUsuario, idReceta).then(() => {
          this.ServicioDeFirestore.eliminarReceta(idReceta).then(() => {
            this.snackbar.open("¡Listo! Receta eliminada", "", {duration: 3000});
          }).catch(error => {
            this.snackbar.open(error.message, "Aceptar", {duration: 7000});
          });
        }).catch(error => {
          this.snackbar.open(error.message, "Aceptar", {duration: 7000});
        });
      };
    });
  };

  hacerAdmin(uid: string, i: number) {
    this.usuarios[i].tipo = "administrador";
    console.log(this.usuarios[i]);
    
    this.ServicioDeFirestore.actualizarTipo(uid, this.usuarios[i]).then(() => {
      this.snackbar.open(`¡Listo! Ahora ${this.usuarios[i].nombreDelUsuario} es administrador`, "", {duration: 3000});
    }).catch(error => {
      this.usuarios[i].tipo = "usuario";
      this.snackbar.open(error.message, "Aceptar", {duration: 7000});
    });
  }

  hacerUsuario(uid: string, i: number) {
    this.usuarios[i].tipo = "usuario";
    console.log(this.usuarios[i]);
    
    this.ServicioDeFirestore.actualizarTipo(uid, this.usuarios[i]).then(() => {
      this.snackbar.open(`¡Listo! Ahora ${this.usuarios[i].nombreDelUsuario} es usuario`, "", {duration: 3000});
    }).catch(error => {
      this.usuarios[i].tipo = "administrador";
      this.snackbar.open(error.message, "Aceptar", {duration: 7000});
    });
  }
}
