import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiService, IAPICore } from '../../../../service/apicore/api.service';
import { RegistrarComponent } from './registrar/registrar.component'

import JSONFormatter from 'json-formatter-js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import Swal from 'sweetalert2';


declare var $: any;

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss']
})

export class ApiComponent implements OnInit {


  @ViewChild(RegistrarComponent) registraApi: RegistrarComponent

  public focus;


  public developer = []
  public testing = []
  public quality = []
  public production = []
  public lstOriginal = []

  public tabPosicion = 0

  lst = []

  lengthOfi = 0;
  pageSizeOfi = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  sectionConsultar = ''
  sectionRegistar = 'none'
  buscar = ''

  data: any;
  resultado: any;
  xresultado: any;
  xparametro: string = ''
  closeResult: string = ''

  xAPI: IAPICore;

  public apiPromover: IAPICore = {
    funcion: '',
    entorno: ''
  }

  xentorno: string = ''
  pageEvent: any
  valores: string = ''

  ApiCore: any;

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

  codeJson: any = {
    theme: 'idea',
    mode: 'text/typescript',
    lineNumbers: true,
    lineWrapping: true,
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
    autoCloseBrackets: true,
    matchBrackets: true,
    lint: true
  };

  codeTypeJs = ''

  constructor(
    private apiService: ApiService,
    private ruta: Router,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private ngxService: NgxUiLoaderService) {
  }

  async ngOnInit() {
    //document.getElementById('duracion').innerHTML = this.duracion;

    await this.ListarApis(true)

  }

  seleccionEditor(e) {

  }

  setEditorContent(event) {
    this.xparametro = ''

  }


  clickRefresh(e) {
    this.codeJson = {
      theme: 'idea',
      mode: 'text/typescript',
      lineNumbers: true,
      lineWrapping: true,
      foldGutter: true,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
      autoCloseBrackets: true,
      matchBrackets: true,
      lint: true
    }
  }

  async seccionRegistrar(valor: string) {

    if (valor != '') {

      this.sectionConsultar = ''
      this.sectionRegistar = 'none'
      await this.ListarApis(false)
    } else {
      const base = btoa(JSON.stringify('undefined'))
      this.ApiCore = base
      this.sectionConsultar = 'none'
      this.sectionRegistar = ''
    }
  }

  async ListarApis(cargar: boolean) {
    this.developer = []
    this.quality = []
    this.production = []
    this.ngxService.startLoader("loader-apis");
    await this.apiService.Listar().subscribe(
      (data) => {
        data.forEach(e => {
          //console.log(e.driver, ' \t', e.entorno, ' \t', e.funcion,' \t', e.metodo)
          switch (e.entorno) {
            case "desarrollo":
              this.developer.push(e)
              break;
            case "calidad":
              this.quality.push(e)
              break;
            case "produccion":
              this.production.push(e)
              break;
            default:
              break;
          }
          if (cargar) {
            this.CargarListadoAPI(0)
          } else {
            this.CargarListadoAPI(this.tabPosicion)
          }
          this.ngxService.stopLoader("loader-apis");
        });

      },
      (error) => {
        console.error(error)
        this.ngxService.stopLoader("loader-apis");
      }
    );
  }

  CargarListadoAPI(e) {
    if (this.tabPosicion != e) this.ListarApis(false)
    this.tabPosicion = e
    this.lengthOfi = 0;
    this.pageSizeOfi = 10;
    this.pageSizeOptions = [5, 10, 25, 100];
    this.recorrerElementos(0)
  }

  pageChangeEvent(e) {

    this.recorrerElementos(e.pageIndex + 1)
  }

  //recorrerElementos para paginar listados
  recorrerElementos(posicion: number) {


    if (posicion > 0) {
      posicion -= 1
      posicion = posicion * 10
    }
    switch (this.tabPosicion) {
      case 0:
        this.lengthOfi = this.developer.length
        this.lst = this.developer.slice(posicion, posicion + this.pageSizeOfi)
        break;
      case 1:
        this.lengthOfi = this.quality.length
        this.lst = this.quality.slice(posicion, posicion + this.pageSizeOfi)
        break;
      case 2:
        this.lengthOfi = this.production.length
        this.lst = this.production.slice(posicion, posicion + this.pageSizeOfi)
        break;
      default:
        break;
    }
  }

  //Cargar una API para
  async ConsultarAPIFrm(item) {
    const base = btoa(JSON.stringify(item))
    this.ApiCore = base
    this.sectionConsultar = 'none'
    this.sectionRegistar = ''
  }


  activarFormulario(content, item) {

    console.log(item)

    this.modalService.open(content, {
      centered: true,
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title'
    }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    var api = item.entorno == "produccion" ? "/v1/" : "/devel/"
    this.xentorno = api + "api/crud:" + item.id;
    this.data = item

    if (item.entradas != undefined) {
      this.codeTypeJs = this.apiService.GenerarCodigoDart(item.entradas, item.funcion, this.xentorno)
      this.clickRefresh(0)
    }
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

  async ejecutarApi() {

    this.xAPI = this.data;
    this.xAPI.parametros = this.xparametro
    this.xAPI.valores = this.valores
    console.log(this.xAPI);
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        const formatter = new JSONFormatter(data);
        document.getElementById("xrs").appendChild(formatter.render());
      },
      (error) => {
        this.resultado = error;
      }
    )
  }

  async eliminarAPI(API) {

  }

  //convertir cadena a minuscula y sin carateres especiales
  convertirCadena(cadena: string): string {
    return cadena.toLowerCase().replace(/á/g, "a").replace(/ê/g, "i").replace(/í/g, "i").replace(/ó/g, "o").replace(/ú/g, "u")
  }

  buscarAPI(arr) {
    var lst = []
    const patron = new RegExp(this.convertirCadena(this.buscar))
    arr.forEach(e => {
      const respuesta = patron.test(this.convertirCadena(e.funcion))
      if (respuesta) {
        lst.push(e)
      }
    })

    return lst
  }

  seleccionLista(event) {

    if (event.charCode == 13) {
      switch (this.tabPosicion) {
        case 0:
          this.lstOriginal = this.lstOriginal.length == 0 ? this.developer : this.lstOriginal
          this.developer = this.buscarAPI(this.lstOriginal)
          break
        case 1:
          this.lstOriginal = this.lstOriginal.length == 0 ? this.quality : this.lstOriginal
          this.quality = this.buscarAPI(this.lstOriginal)
          break
        case 2:
          this.lstOriginal = this.lstOriginal.length == 0 ? this.production : this.lstOriginal
          this.production = this.buscarAPI(this.lstOriginal)
        default:
          break;
      }
      this.recorrerElementos(0)
      this.buscar = ''
    }

  }

  /**
 * Promover una api a su siguiente nivel
 * 
 * @param entorno 
 * @param funcion 
 */
  async Promover(entorno: string, funcion: string) {
    this.apiPromover.entorno = entorno
    this.apiPromover.funcion = funcion
    let jsonG = {
      "coleccion": "apicore",
      "relacional": false,
      "tipo": 'INSERTAR',
      "entorno": entorno,
      "valores": this.apiPromover
    };
    let sApi = 'crud';

    await this.apiService.Guardar(jsonG, sApi).subscribe(
      (data) => {

        console.log(data)

        let id = data.UpsertedID != null ? "registrada codigo: " + data.UpsertedID : "actualizada "
        this.toastrService.success(
          'Tu (API) ha sido ' + id,
          `Code-Epic ESB`
        );
        this.sectionConsultar = ''
        this.sectionRegistar = 'none'
        this.ListarApis(false)

        this.ngxService.stopLoader("loader-01")


      },
      (errot) => {
        this.ngxService.stopLoader("loader-01")
        this.toastrService.error(
          'Fallo la conexión, con el API',
          `Code-Epic ESB`
        );

      }
    )


  }

  promover(entorno: string, funcion: string, texto : string){
    console.log(entorno, funcion)
    Swal.fire({
      title: 'Estas seguro que deseas ',
      text: texto + ' la api?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, ' + texto
    }).then((result) => {
      if (result.isConfirmed) {
        this.Promover(entorno, funcion)
      }
    })

  }


}

