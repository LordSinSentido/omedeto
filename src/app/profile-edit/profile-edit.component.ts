import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FirestoreService } from '../services/firestore.service';
import { StorageService } from '../services/storage.service';
import { AuthService } from './../services/auth.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  conexionDelUsuario: Observable<any> = this.ServicioDeAutenticacion.autenticacion.user;
  formularioNombre: FormGroup;
  seCambioNombre: boolean = false;

  fotoDePerfil: any;
  progresoDeCarga: number = 0;
  procesando: boolean = false;

  formularioFoto: FormGroup;
  seCambioFoto: boolean = false;
  
  formularioEliminar: FormGroup;
  deAcuerdo: boolean = false;

  constructor(private ServicioDeBase: FirestoreService, private ServicioDeAutenticacion: AuthService, private ServicioDeAlmacenamiento: StorageService, private formulario: FormBuilder, private redireccionar: Router, private snackbar: MatSnackBar) {
    this.formularioNombre = this.formulario.group({
      nombreDelUsuario: ['', Validators.required]
    });

    this.formularioFoto = this.formulario.group({
      fotoUrl: ['', Validators.required]
    });

    this.formularioEliminar = this.formulario.group({
      deAcuerdo: [false, Validators.required]
    });
  }

  ngOnInit(): void {
    this.conexionDelUsuario.subscribe(usuario => {
      this.formularioNombre.setValue({
        nombreDelUsuario: usuario.displayName
      })
    })
  }

  obtenerImagen(evento:any){
    this.fotoDePerfil = evento.target?.files[0];
  }

  actualizarNombre() {
    this.procesando = true;
    if(this.ServicioDeAutenticacion.actualizarNombre(this.formularioNombre.value.nombreDelUsuario)) {
      this.seCambioNombre = true;
      this.snackbar.open("¡Listo! Nombre de usuario cambiado", "", {duration: 3000});
    }else{
      this.snackbar.open("No se pudo actualizar tu nombre de usuario", "Aceptar", {duration: 7000});
    }

    this.procesando = false;
  }

  async actualizarFoto() {
    this.procesando = true;
    const usuario = this.ServicioDeAutenticacion.obtenerUsuario();

    if(usuario && this.fotoDePerfil != undefined){
      await this.ServicioDeAlmacenamiento.eliminarFotoPerfil(usuario.uid);

      const cargar = this.ServicioDeAlmacenamiento.cargarFotoDePerfil(this.fotoDePerfil, usuario.uid)
      cargar.on(
        'state_changed',
      snapshot => {
        let progresoDeCarga = snapshot.bytesTransferred / snapshot.totalBytes * 100;
        this.progresoDeCarga = progresoDeCarga;
      },
      error => {
        this.procesando = false;
        this.snackbar.open(error.message, "Aceptar", {duration: 7000});
      },
      () => {
        cargar.snapshot.ref.getDownloadURL().then(url => {
          this.formularioFoto.value.fotoUrl = url;

          if(this.ServicioDeAutenticacion.actualizarFoto(this.formularioFoto.value.fotoUrl)) {
            this.snackbar.open("¡Listo! Foto cambiada", "", {duration: 3000});
          }else {
            this.snackbar.open("No se pudo actualizar tu foto de perfil", "Aceptar", {duration: 7000});
          }

          this.ServicioDeAutenticacion.actualizarFoto(this.formularioFoto.value.fotoUrl);
          this.seCambioFoto = true;
          this.procesando = false;
          
        }).catch(error => {
          this.snackbar.open(error.message, "Aceptar", {duration: 7000});
          this.procesando = false;
        });

      });
    }else{
      this.snackbar.open("Selecciona una foto para subir", "Aceptar", {duration: 7000});
      this.procesando = false;
    }
  }

  cagarFoto() {
    
  }

  eliminarCuenta() {
    this.procesando = true;

    const usuario = this.ServicioDeAutenticacion.obtenerUsuario();

    if(usuario) {
      this.ServicioDeBase.eliminarUsuario(usuario.uid).then(() => {
        this.ServicioDeAutenticacion.eliminarUsuario();
        this.snackbar.open("¡Listo! Tu usuario ha sido eliminado", "", {duration: 3000});
        this.redireccionar.navigate(['/principal']);

      }).catch(error => {
        this.snackbar.open("Selecciona una foto para subir", "Aceptar", {duration: 7000});
        this.procesando = false;
      });
    }
    
  }

}
