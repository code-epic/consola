import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-cerrar',
  templateUrl: './cerrar.component.html',
  styleUrls: ['./cerrar.component.scss']
})
export class CerrarComponent implements OnInit {

  constructor(private ruta : Router) { }

  ngOnInit(): void {
  }

  cerrar(){
    sessionStorage.removeItem('token')
    Swal.fire({
      title: 'Esta seguro?',
      text: "de salir del sistema!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, desconectarme!'
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = '/consola/';
      }
    })    
  }
}
