import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})


export class RecipeComponent implements OnInit {
  public conexionDelUsuario: Observable<any> = this.ServicioDeAutenticacion.autenticacion.user;
  formularioDeReceta: FormGroup;
  autor: any;

  tiempoHoras: string[] = [];
  tiempoMinutos: string[] = ['00', '15', '30', '15']
  horas: number = -1;
  minutos: number = -1;
  dificultad: number = -1;
  ingredientes = Array;
  numeroDeIngrediente: number = 1;
  pasos = Array;
  numeroDePasos: number = 1;



  constructor(private receta: FormBuilder, private ServicioDeAutenticacion: AuthService, private snackbar: MatSnackBar) {
    this.conexionDelUsuario.subscribe(user => {
      this.autor = user.uid;
    });

    this.formularioDeReceta = this.receta.group({
      //autor: [this.autor, Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      dificultad: ['', Validators.required],
      tiempo: ['', Validators.required],
      ingredientes: ['', Validators.required],
      pasos:['', Validators.required],
    });
  }

  ngOnInit(): void {
    for(let i:number = 0; i < 25; i++){
      this.tiempoHoras.push('' + i);
    }
  }

  eliminarIngrediente() {
    if(this.numeroDeIngrediente == 1){
      this.snackbar.open("No puedes quitar todos los ingredientes", "Aceptar", {duration: 7000});
    }else{
      this.numeroDeIngrediente--;
    }
  }

  agregarIngrediente() {
    if(this.numeroDeIngrediente == 30){
      this.snackbar.open("Solo puedes agregar hasta 30 ingredientes", "Aceptar", {duration: 7000});
    }else{
      this.numeroDeIngrediente++;
    }
  }

  eliminarPaso() {
    if(this.numeroDePasos == 1){
      this.snackbar.open("No puedes quitar todos los pasos", "Aceptar", {duration: 7000});
    }else{
      this.numeroDePasos--;
    }
  }

  agregarPaso() {
    if(this.numeroDePasos == 60){
      this.snackbar.open("Solo puedes agregar hasta 60 pasos", "Aceptar", {duration: 7000});
    }else{
      this.numeroDePasos++;
    }
  }

  guardarReceta() {
    if(this.formularioDeReceta.invalid){
      this.snackbar.open("Faltan algunos datos", "Aceptar", {duration: 7000});
      console.log(this.formularioDeReceta.value);
    }else{
      this.snackbar.open("Listo", "", {duration: 3000});
      console.log(this.formularioDeReceta.value);
      
    }
  }
}
