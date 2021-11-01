import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  conexionDelUsuario: Observable<any> = this.ServicioDeAutenticacion.autenticacion.user;
  datosDelUsuario = {
    uid: '',
    nombreDelUsuario: '',
    correo: '',
    fotoUrl: ''
  };

  constructor(private ServicioDeAutenticacion: AuthService,) { 

  }

  ngOnInit(): void {
    this.conexionDelUsuario.subscribe(usuario => {
      this.datosDelUsuario.uid = usuario.uid;
      this.datosDelUsuario.nombreDelUsuario = usuario.displayName;
      this.datosDelUsuario.correo = usuario.email;
      this.datosDelUsuario.fotoUrl = usuario.photoURL;
    })

    console.log(this.datosDelUsuario);
    
  }

}
