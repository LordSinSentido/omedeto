import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {
  recetas: any[] = [];
  procesando: boolean = true;

  constructor(private ServicioDeFirestore: FirestoreService) { }

  ngOnInit(): void {
    this.ServicioDeFirestore.obtenerTodasLasRecetas().subscribe(datos => {      
      this.recetas = [];
      datos.forEach((receta: any) => {
        this.recetas.push({
          id: receta.payload.doc.id,
          ...receta.payload.doc.data()
        });
      });

      this.procesando = false;
    });
  }

}
