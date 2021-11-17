import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-recipe-view',
  templateUrl: './recipe-view.component.html',
  styleUrls: ['./recipe-view.component.css']
})
export class RecipeViewComponent implements OnInit {
  recetaId: string | null = '';
  progreso: boolean = false;
  receta: any[] = [];

  meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  fecha: string = '';
  hora: string = '';

  constructor(private ServicioDeFirestore: FirestoreService, private idDeLaReceta: ActivatedRoute) { }

  ngOnInit(): void {
    let recetaId = this.idDeLaReceta.snapshot.paramMap.get('id');

    if(recetaId) {
      this.ServicioDeFirestore.obtenerReceta(recetaId).subscribe(receta => {
        this.receta.push(receta.payload.data());
        let fecha = this.receta[0].fechaDeActualizacion.toDate();
        let minutos;

        if (fecha.getMinutes() < 10){
          minutos = `0${fecha.getMinutes()}`;
        }else{
          minutos = fecha.getMinutes();
        }

        this.fecha = `${fecha.getDate()} de ${this.meses[fecha.getMonth()]} del ${fecha.getFullYear()} a las ${fecha.getHours()}:${minutos} horas`;
        
        this.progreso = true;
      })

      
    }
  }
}
