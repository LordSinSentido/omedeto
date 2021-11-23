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
  fotoUrl = '';

  meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  fecha: string = '';
  hora: string = '';

  constructor(private ServicioDeFirestore: FirestoreService, private idDeLaReceta: ActivatedRoute) { }

  ngOnInit(): void {
    this.recetaId = this.idDeLaReceta.snapshot.paramMap.get('id');

    if(this.recetaId) {
      this.ServicioDeFirestore.obtenerReceta(this.recetaId).subscribe(receta => {
        this.receta.push(receta.payload.data());
        this.comprobarAdmin();

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

  comprobarAdmin() {
    if(this.recetaId) {
      this.ServicioDeFirestore.obtenerTipoDeUsuario(this.receta[0].autorID).subscribe(datos => {
        let usuario: any = [];
        usuario.push(datos.data());
        this.fotoUrl = usuario[0].fotoUrl;
      });
    }
  }
}
