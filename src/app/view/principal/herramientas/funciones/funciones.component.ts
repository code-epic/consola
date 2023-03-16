import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiService, IAPICore } from '../../../../service/apicore/api.service';

import JSONFormatter from 'json-formatter-js';
import { FormControl } from '@angular/forms';

declare var $: any;
import { FregistrarComponent } from './fregistrar/fregistrar.component'
import { IFunciones } from '../../../../service/herramientas/funciones.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-funciones',
  templateUrl: './funciones.component.html',
  styleUrls: ['./funciones.component.scss']
})
export class FuncionesComponent implements OnInit {

  // selected = new FormControl(0);
  selected = 0
  lstFnx = []
  public focus;
  lengthOfi = 0;
  pageSizeOfi = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  sectionConsultar = ''
  sectionRegistar = 'none'

  contenido = ''


  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: ''
  }


  data: any;
  public Fnx: any
  public selectedIndex = 0;
  public active: boolean = false
  public closeResult: string = ''
  public id: string = ''
  public tipo: string = 'S'
  public nombre: string = ''
  public version: string = '0.0.1'
  public lenguaje: string = 'S'
  public categoria: string = 'S'
  public retorno: string = 'S'
  public codigo: string = ''
  public descripcion: string = ''
  public parametros: string = ''
  public fecha: string = ''
  public tiempo: string = ''
  public estatus: number = 0

  @ViewChild(FregistrarComponent) fregistraApi: FregistrarComponent



  constructor(private apiService: ApiService,
    private ruta: Router,
    private modalService: NgbModal,
    private ngxService: NgxUiLoaderService) {


  }

  ngOnInit(): void {
    this.Listar(0)
  }

  tabActive(event) {
    // obtenemos el index del tab
    // console.log(event.index);
    // actualizamos el index seleccionado
    this.selectedIndex = event.index;
    // console.log(this.active)
    if (!this.active) {
      this.Limpiar()
      this.Listar(0)
      const base = btoa(JSON.stringify(this.Fnx))
      this.Fnx = base
    } else {
      this.active = !this.active
    }

  }

  editar(e) {
    const base = btoa(JSON.stringify(e))
    this.Fnx = base
    this.selectedIndex = 1
    this.active = true

  }



  Limpiar() {
    this.Fnx = {
      id: '',
      tipo: 'S',
      nombre: '',
      version: '0.0.1',
      lenguaje: 'S',
      categoria: 'S',
      retorno: 'S',
      codigo: '',
      descripcion: '',
      parametros: '',
      fecha: new Date(),
      tiempo: ''
    }

  }

  Listar(e) {
    this.ngxService.startLoader('loader-c')
    this.xAPI.funcion = "SSB_LFunciones";
    this.xAPI.parametros = '';

    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.ngxService.stopLoader('loader-c')
        this.lstFnx = data
      },
      (error) => {

        console.log(error)
      }
    )
  }

  seccionRegistrar(valor) {
    if (valor != '') {
      this.sectionConsultar = ''
      this.sectionRegistar = 'none'
    } else {
      this.sectionConsultar = 'none'
      this.sectionRegistar = ''

    }
  }

  configurar(frm, item) {
    this.modalService.open(frm, {
      centered: true,
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title'
    }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    this.id = item.id
    this.tiempo = item.tiempo
    this.tipo = item.tipo
    this.nombre = item.nombre
    this.version = item.version
    this.lenguaje = item.lenguaje
    this.categoria = item.categoria
    this.retorno = item.retorno
    this.descripcion = item.descripcion
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  EjecutarFnx(pid: string) {

  }

  obtenerEstatus(estatus: number): string {
    let cadena = 'INACTIVO'
    switch (estatus) {
      case 0:
        cadena = 'INACTIVO'
        break;
      case 1:
        cadena = 'ACTIVO'
        break;
      case 2:
        cadena = 'EJECUTANDOSE'
        break;
      case 3:
        cadena = 'ZOMBIE'
        break;

      default:
        break;
    }
    return cadena
  }
}
