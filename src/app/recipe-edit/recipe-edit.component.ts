import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  conexionDelUsuario: Observable<any> = this.ServicioDeAutenticacion.autenticacion.user;
  formularioDeReceta: FormGroup;

  usuarioID: any;
  usuarioNombre: any;
  recetaId: any;
  tiempoHoras: string[] = [];
  tiempoMinutos: string[] = ['00', '15', '30', '45']
  fotoDeReceta: any;
  progresoDeCarga: number = 0;

  procesando: boolean = false;

  constructor(private ServicioDeBase: FirestoreService, private receta: FormBuilder, private ServicioDeAutenticacion: AuthService, private ServicioDeAlmacenamiento: StorageService, private snackbar: MatSnackBar, private redireccionar: Router, private idDeLaReceta: ActivatedRoute) {
    this.conexionDelUsuario.subscribe(user => {
      this.usuarioID = user.uid;
      this.usuarioNombre = user.displayName;
    });

    for(let i:number = 0; i < 25; i++){
      this.tiempoHoras.push('' + i);
    }

    this.formularioDeReceta = this.receta.group({
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
    
    this.recetaId = this.idDeLaReceta.snapshot.paramMap.get('id');

    if(this.idDeLaReceta.snapshot.paramMap.get('id')) {
      this.ServicioDeBase.obtenerReceta(this.recetaId).subscribe(receta => {
        this.formularioDeReceta = this.receta.group({
          autorID: receta.payload.data().autorID,
          autorNombre: receta.payload.data().autorNombre,
          nombre: [receta.payload.data().nombre, Validators.required],
          descripcion: [receta.payload.data().descripcion, Validators.required],
          dificultad: [receta.payload.data().dificultad, Validators.required],
          tiempo: this.receta.group({
            horas: [`${receta.payload.data().tiempo.horas}`, Validators.required],
            minutos: [`${receta.payload.data().tiempo.minutos}`, Validators.required]
          }),
          ingredientes: this.receta.array([]),
          pasos: this.receta.array([]),
          fotos: [receta.payload.data().fotos, !Validators.required],
          fechaDeCreacion: receta.payload.data().fechaDeCreacion,
          fechaDeActualizacion: receta.payload.data().fechaDeActualizacion
        });

        for(let ingrediente of receta.payload.data().ingredientes) {
          const ingredientesFormulario = this.receta.group({
            cantidad: [ingrediente.cantidad, Validators.required],
            ingrediente: [ingrediente.ingrediente, Validators.required]
          });
          this.ingredientes.push(ingredientesFormulario);
        }
        
        for(let paso of receta.payload.data().pasos) {
          const pasosFormulario = this.receta.group({
            paso: [paso.paso, Validators.required]
          });
          this.pasos.push(pasosFormulario);
        }

      });
    }
  }

  ngOnInit(): void {
    
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
    this.formularioDeReceta.value.fechaDeActualizacion = new Date();
    this.procesando = true;

    if(this.formularioDeReceta.invalid){
      this.snackbar.open("Faltan algunos datos", "Aceptar", {duration: 7000});
      this.procesando = false;
    }else{
      if(this.fotoDeReceta == undefined) {
        this.actualizarReceta();
      }else{
        this.ServicioDeAlmacenamiento.eliminarFotoDeReceta(this.usuarioID, this.recetaId).then(() => {
          const cargar = this.ServicioDeAlmacenamiento.cargarFotoDeReceta(this.fotoDeReceta, this.recetaId, this.usuarioID);
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
                this.actualizarReceta();
              });
            }
          );
        }).catch(error => {
          console.log(error.message);
        });
      };
    }
  }

  actualizarReceta() {
    this.ServicioDeBase.actualizarReceta(this.recetaId, this.formularioDeReceta.value).then(() => {
      this.snackbar.open("¡Listo!, tu receta ha sido actualizada", "", {duration: 3000});
      this.redireccionar.navigate(['/recipeView/', this.recetaId]);
    }).catch(error => {
      this.snackbar.open(error.message, "", {duration: 3000});
      this.procesando = false;
    });
  }
}
