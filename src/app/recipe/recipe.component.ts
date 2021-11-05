import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormGroupName, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})


export class RecipeComponent implements OnInit {
  conexionDelUsuario: Observable<any> = this.ServicioDeAutenticacion.autenticacion.user;
  formularioDeReceta = this.receta.group({
    autorID: '',
    autorNombre: '',
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    dificultad: ['', Validators.required],
    tiempo: this.receta.group({
      horas: ['', Validators.required],
      minutos: ['', Validators.required]
    }),
    ingredientes: this.receta.array([]),
    pasos: this.receta.array([]),
    fotos: ['', !Validators.required],
    fechaDeCreacion: '',
    fechaDeActualizacion: ''
  });

  usuarioID: any;
  usuarioNombre: any;
  tiempoHoras: string[] = [];
  tiempoMinutos: string[] = ['00', '15', '30', '45']
  fotoDeReceta: any;
  progresoDeCarga: number = 0;

  procesando: boolean = false;

  constructor(private ServicioDeBase: FirestoreService, private receta: FormBuilder, private ServicioDeAutenticacion: AuthService, private ServicioDeAlmacenamiento: StorageService, private snackbar: MatSnackBar, private redireccionar: Router) {
    this.conexionDelUsuario.subscribe(user => {
      this.usuarioID = user.uid;
      this.usuarioNombre = user.displayName;
    });
  }

  ngOnInit(): void {
    for(let i:number = 0; i < 25; i++){
      this.tiempoHoras.push('' + i);
    }
  }

  get ingredientes() {
    return this.formularioDeReceta.controls["ingredientes"] as FormArray;
  }

  get pasos() {
    return this.formularioDeReceta.controls["pasos"] as FormArray;
  }
  
  agregarIngrediente() {
    const ingredientesFormulario = this.receta.group({
      cantidad: ['', Validators.required],
      ingrediente: ['', Validators.required]
    });
    this.ingredientes.push(ingredientesFormulario);
  }

  eliminarIngrediente(indice: number) {
    this.ingredientes.removeAt(indice);
  }

  agregarPaso() {
    const pasosFormulario = this.receta.group({paso: ['', Validators.required]});
    this.pasos.push(pasosFormulario);
  }

  eliminarPaso(indice: number) {
    this.pasos.removeAt(indice);
  }

  obtenerImagen(evento:any){
    this.fotoDeReceta = evento.target?.files[0];
  }

  guardarReceta() {
    this.formularioDeReceta.value.autorID = this.usuarioID;
    this.formularioDeReceta.value.autorNombre = this.usuarioNombre;
    this.formularioDeReceta.value.fechaDeCreacion = new Date();
    this.formularioDeReceta.value.fechaDeActualizacion = this.formularioDeReceta.value.fechaDeCreacion;

    this.procesando = true;

    if(this.formularioDeReceta.invalid){
      this.snackbar.open("Faltan algunos datos", "Aceptar", {duration: 7000});
      this.procesando = false;
      console.log(this.formularioDeReceta.value);
    }else{
      this.ServicioDeBase.agregarReceta(this.formularioDeReceta.value).then(elemento => {
        const cargar = this.ServicioDeAlmacenamiento.cargarFotoDeReceta(this.fotoDeReceta, elemento.id, this.usuarioID);
        cargar.on(
          'state_changed',
          snapshot => {
            let progresoDeCarga = snapshot.bytesTransferred / snapshot.totalBytes * 100;
            this.progresoDeCarga = progresoDeCarga;
          },
          error => {
            this.snackbar.open(error.message, "Aceptar", {duration: 7000});
            this.procesando = false;
          },
          () => {
            cargar.snapshot.ref.getDownloadURL().then(url => {
              this.formularioDeReceta.value.fotos = url;
              this.ServicioDeBase.editarFoto(elemento.id, this.formularioDeReceta.value);
              this.procesando = false;
              this.snackbar.open("¡Listo!, tu receta ha sido publicada", "", {duration: 3000});
              this.redireccionar.navigate(['/recipeView/', elemento.id]);
            });
          }
        );
      }).catch(error => {
        this.snackbar.open(error.message, "", {duration: 3000});
        this.procesando = false;
      })
    }
    

      
  }
}
