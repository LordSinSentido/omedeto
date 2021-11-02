import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormGroupName, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})


export class RecipeComponent implements OnInit {


  conexionDelUsuario: Observable<any> = this.ServicioDeAutenticacion.autenticacion.user;
  formularioDeReceta = this.receta.group({
    autor: ['', Validators.required],
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    dificultad: ['', Validators.required],
    tiempo: this.receta.group({
      horas: ['', Validators.required],
      minutos: ['', Validators.required]
    }),
    ingredientes: this.receta.array([]),
    pasos: this.receta.array([]),
    fotos: ['']
  });

  
  usuario: any;
  
  tiempoHoras: string[] = [];
  tiempoMinutos: string[] = ['00', '15', '30', '15']
  horas: number = -1;
  minutos: number = -1;
  dificultad: number = -1;
  
  fotoDeReceta: any;
  progresoDeCarga: number = 0;

  constructor(private fb:FormBuilder, private receta: FormBuilder, private ServicioDeAutenticacion: AuthService, private ServicioDeAlmacenamiento: StorageService, private snackbar: MatSnackBar) {
    this.conexionDelUsuario.subscribe(user => {
      this.usuario = user.uid;
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
    const ingredientesFormulario = this.fb.group({
      cantidad: ['', Validators.required],
      ingrediente: ['', Validators.required]
    });
    this.ingredientes.push(ingredientesFormulario);
  }

  eliminarIngrediente(indice: number) {
    this.ingredientes.removeAt(indice);
  }

  agregarPaso() {
    const pasosFormulario = this.fb.group({paso: ['', Validators.required]});
    this.pasos.push(pasosFormulario);
  }

  eliminarPaso(indice: number) {
    this.pasos.removeAt(indice);
  }

  obtenerImagen(evento:any){
    this.fotoDeReceta = evento.target?.files[0];
  }




  guardarReceta() {
    /*if(this.formularioDeReceta.invalid){
      this.snackbar.open("Faltan algunos datos", "Aceptar", {duration: 7000});
      console.log(this.formularioDeReceta.value);
    }else{
      this.snackbar.open("Listo", "", {duration: 3000});
      console.log(this.formularioDeReceta.value);
    }*/
    const cargar = this.ServicioDeAlmacenamiento.cargarFotoDeReceta(this.fotoDeReceta, this.usuario);
      cargar.on(
        'state_changed',
        snapshot => {
          let progresoDeCarga = snapshot.bytesTransferred / snapshot.totalBytes * 100;
          this.progresoDeCarga = progresoDeCarga;
        },
        error => {
          this.snackbar.open(error.message, "Aceptar", {duration: 7000});
        },
        () => { /// <---- Hay que revisar esta parte, no está retornando la url de la imagen
           cargar.snapshot.ref.getDownloadURL().then(url => {
            this.formularioDeReceta.value.fotos = url
            console.log(this.formularioDeReceta.value.fotos);
          });
          
        }
      );

      
      
  }

  mostarLog() {
    console.log(this.formularioDeReceta.value);
  }

}
