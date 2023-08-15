import { Component, OnInit } from '@angular/core';
import { ApiService, IAPICore, WkfEstado } from '../../../../../service/apicore/api.service';
import Swal from 'sweetalert2';
import { WorkflowService } from '../../../../../service/workflow/workflow.service';


@Component({
  selector: 'app-estados',
  templateUrl: './estados.component.html',
  styleUrls: ['./estados.component.scss']
})
export class EstadosComponent implements OnInit {

  public xAPI : IAPICore = {
    funcion: '',
    parametros: '',
    valores : {},
  };


  public wkfEstado : WkfEstado = {
    wkf: 0,
    nombre: '',
    descripcion: '',
    estatus: 0
  }

  public estatus = '-'

  xidW : number = 0

  rowEstado : []

  isDisabledInput : boolean = false


  constructor( private apiService : ApiService,
    private wkf : WorkflowService ) { }

  ngOnInit(): void {
    this.wkf.msjText$.subscribe(e => {
      if ( e == 'CLEAN') this.rowEstado = []
      this.lstEstados(e)
      this.xidW = parseInt(e)

    })
  }

  lstEstados(idw : string) : any {
    this.xAPI.funcion = 'WKF_CEstados'
    this.xAPI.parametros = idw
    this.xAPI.valores = {}
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.rowEstado = data.Cuerpo
      },
      (err) => {
        console.error(err)
      }
    )
  }

  deleteEstado(id: any) {
    Swal.fire({
      title: 'Esta seguro?',
      text: "de eliminar este registro!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.xAPI.funcion = 'Wk_DEstado'
        this.xAPI.parametros = id
        this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            console.log(data)
          },
          (err) => {
            console.error(err)
          }
        )
      }
    }) 
  }

  Guardar(): any {
    this.xAPI.funcion = 'WKF_IEstados'
    this.wkfEstado.wkf = this.xidW
    this.wkfEstado.estatus = parseInt(this.estatus)
    this.xAPI.valores = JSON.stringify(this.wkfEstado)

    // this.limpiar()   
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.Ok(data.msj)
        this.limpiar()
      },
      (err) => {
        console.error(err)
      }
    ) 
  }


  Ok(id: any) {
    Swal.fire({
      title: 'Creando Estado del Workflow ',
      text: "El estado ha sido creado con exito (#" + id + ") ",
      icon: 'info',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar / Continuar',
      cancelButtonText: 'No'
    }).then((result) => {
      if (!result.isConfirmed)
        return
    })
  }


  limpiar () {
    this.wkfEstado = {
      wkf: 0,
      nombre: '',
      descripcion: '',
      estatus: 0
    }
    this.rowEstado = []
    this.wkf.msjText$.emit( this.xidW.toString() )
    // this.lstEstados(this.xidW.toString())

  }

}
