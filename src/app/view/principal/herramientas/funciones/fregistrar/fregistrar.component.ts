import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';


import { ApiService, IAPICore } from '../../../../../service/apicore/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { IFunciones } from '../../../../../service/herramientas/funciones.service';

import { MatDialog } from '@angular/material/dialog';
import { UtilService } from '../../../../../service/util/util.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-fregistrar',
  templateUrl: './fregistrar.component.html',
  styleUrls: ['./fregistrar.component.scss']
})
export class FregistrarComponent implements OnInit {



  @Input() IFnx: any

  public fecha = new Date().toISOString()

  public xAPI: IAPICore = {
    funcion: '',
    coleccion: '',
    valores: ''
  }


  public Fnx: IFunciones = {
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
    fecha: this.fecha,
    tiempo: '',
    estatus: 0
  }
  public FnxAux: IFunciones = {
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
    fecha: this.fecha,
    tiempo: '',
    estatus: 0
  }




  codeMirrorOptions: any = {
    theme: 'idea',
    mode: 'text/x-idn',
    lineNumbers: true,
    lineWrapping: true,
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
    autoCloseBrackets: true,
    matchBrackets: true,
    lint: true,
    indentUnit: 2,
    tabSize: 2,
    indentWithTabs: true
  };
  codeMOEsquemaJson: any = {
    theme: 'idea',
    mode: 'application/ld+json',
    lineNumbers: true,
    lineWrapping: true,
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
    autoCloseBrackets: true,
    matchBrackets: true,
    lint: true
  };


  public existe: boolean = false

  public divTiempo: boolean = false
  public active: boolean = false
  public estatus: string = 'S'

  constructor(
    public dialog: MatDialog,
    private util: UtilService,
    private _snackBar: MatSnackBar,
    private apiService: ApiService,
    private toastrService: ToastrService,
    private ngxService: NgxUiLoaderService) {


  }

  setEditorContent(event) {
    // console.log(event, typeof event);
    this.clickRefresh(0)
  }

  ngOnInit(): void {



  }

  ngOnChanges() {
    if (this.IFnx != undefined && this.IFnx != "" && this.IFnx != "InVuZGVmaW5lZCI=") {
      this.existe = true
      this.Fnx = JSON.parse(atob(this.IFnx))
      this.FnxAux = JSON.parse(atob(this.IFnx))

      if (this.Fnx.nombre != "") {
        this.clickRefresh(0)
        this.estatus = "" + this.Fnx.estatus
        this.divTiempo = this.Fnx.tiempo!=""?true:false
      } else {
        this.Fnx.id = this.util.GenerarUnicId()
        this.FnxAux.id = this.Fnx.id
        this.existe = false

      }

    } else {
      this.limpiar()
      this.existe = false
      this.Fnx.id = this.util.GenerarUnicId()
    }
  }



  clickRefresh(event) {
    this.codeMirrorOptions = {
      theme: 'idea',
      mode: this.cambiarModo(),
      lineNumbers: true,
      lineWrapping: true,
      foldGutter: true,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
      autoCloseBrackets: true,
      matchBrackets: true,
      lint: true,
      indentUnit: 2,
      tabSize: 2,
      height: '80px',
      indentWithTabs: true
    };
    this.codeMOEsquemaJson = {
      height: '100px',
      theme: 'idea',
      mode: 'application/ld+json',
      lineNumbers: true,
      lineWrapping: true,
      foldGutter: true,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
      autoCloseBrackets: true,
      matchBrackets: true,
      lint: true
    };

  }

  cambiarModo(): string {
    var idioma = 'text/x-idn'
    switch (this.Fnx.lenguaje) {
      case "GO":
        idioma = 'text/x-go'
        break;
      case "PHP":
        idioma = 'text/x-php'
        break;
      case "SHELL":
        idioma = 'text/x-sh'
        break;
      case "BASH":
        idioma = 'text/x-sh'
        break;
      case "PYTHON":
        idioma = 'text/x-python'
        break;
      case "RUST":
        idioma = 'text/x-rustsrc'
        break;
      case "RDN":
        idioma = 'text/x-idn'
        break;
    }
    this.codeMirrorOptions.mode = idioma
    return idioma
  }


  limpiar() {
    this.Fnx = {
      id: this.util.GenerarUnicId(),
      tipo: 'S',
      nombre: '',
      version: '0.0.1',
      lenguaje: 'S',
      categoria: 'S',
      retorno: 'S',
      codigo: '',
      descripcion: '',
      parametros: '',
      fecha: this.fecha,
      tiempo: '',
      estatus: 0
    }

  }


  async Guardar() {
    if (this.Fnx.nombre == "") {
      this._snackBar.open('Debe verificar todos los campos...', 'Entiendo')
      return
    }

    this.ngxService.startLoader("loader")
    this.Fnx.version = this.existe ? this.validarVersion() : this.Fnx.version

    let obj = {
      "donde": `{\"id\":\"${this.Fnx.id}\"}`,
      "upsert": true,
      "coleccion": 'sys-function',
      "objeto": this.Fnx
    }
    this.Fnx.estatus = this.estatus != 'S' ? parseInt(this.estatus) : 0
    this.apiService.ExecColeccion(obj).subscribe(
      (data) => {
        let rs = data.UpsertedID != undefined ? "registrado funcion " + data.UpsertedID : "actualizado la funcion"
        this.ngxService.stopLoader("loader")
        this.apiService.Mensaje('Proceso exitoso se ha ' + rs, 'Felicitaciones', 'success', 'afiliado')
        this.limpiar()
      },
      (error) => {
        this.toastrService.warning('La (Fnx) no se ha registrado ' + error, `Sandra Server`)
        this.ngxService.stopLoader("loader")
      }
    )

  }


  SeleccionarPrograma() {
    this.divTiempo = false
    switch (this.Fnx.categoria) {
      case "PROGRAM":
        this.divTiempo = true
        break;

      default:
        break;
    }
  }

  openHelp() {
    this.dialog.open(Dialogo);
  }



  validarVersion() {

    let version = this.Fnx.version.split('.')
    let mayor = parseInt(version[0])
    let menor = parseInt(version[1])
    let menor_aux = parseInt(version[2])

    const _fnx = this.Fnx
    const _aux = this.FnxAux

    if (_fnx.retorno != _aux.retorno || _fnx.lenguaje != _aux.lenguaje || _fnx.nombre != _aux.nombre) {
      mayor = parseInt(version[0]) + 1
    }

    if (_fnx.tipo != _aux.tipo || _fnx.categoria != _aux.categoria) {
      menor = parseInt(version[1]) + 1
    }

    if (_fnx.descripcion != _aux.descripcion || _fnx.codigo != _aux.codigo) {
      menor_aux = parseInt(version[2]) + 1
    }

    return mayor + '.' + menor + '.' + menor_aux

  }

}


@Component({
  selector: 'dialogo',
  templateUrl: 'dialogo.html',
})
export class Dialogo {
  constructor(
    public dialog: MatDialog) {


  }

  cerrar() {
    this.dialog.closeAll();
  }
}