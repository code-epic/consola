import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgWizardConfig, NgWizardService, StepChangedArgs, StepValidationArgs, STEP_STATE, THEME } from 'ng-wizard';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';


import JSONFormatter from 'json-formatter-js';
import { ApiService, IAPICore } from '../../../../../service/apicore/api.service';
import { ComunicacionesService } from '../../../../../service/comunicaciones/comunicaciones.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LoginService } from '../../../../../service/seguridad/login.service';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.scss']
})
export class RegistrarComponent implements OnInit, OnDestroy {

  //editor: Editor;
  html: '';

  stepStates = {
    normal: STEP_STATE.normal,
    disabled: STEP_STATE.disabled,
    error: STEP_STATE.error,
    hidden: STEP_STATE.hidden
  }

  config: NgWizardConfig = {
    selected: 0,
    theme: THEME.arrows,
    lang: {
      next: 'Siguiente',
      previous: 'Anterior'
    },
    toolbarSettings: {
      toolbarExtraButtons: [
        { text: 'Guardar', class: 'btn btn-info', event: () => { this.Guardar() } }
      ],
    }
  }

  driver: string = '0'


  http = 0
  https = 0
  consumidores: string = '0'
  puertohttp: string = '0'
  puertohttps: string = '0'
  tipo: string = '0'
  relacional: boolean = false
  xrelacional: boolean = false
  xcondicion: boolean = true

  coleccion: string = ''
  metodo: string = '0'
  totalizar: string = '0'
  consulta: string = ''
  version: string = '0.0.1'


  duracion = `<b>Duración:</b> 00.00.00 seg &nbsp; <b>Peso:</b> 0.00 KB<hr>`


  closeResult: string = '';
  xparametro: string = '';



  descripcion: string = ''

  log: boolean = false
  accion: boolean = false
  cache: string = '0'
  entorno: string = 'desarrollo'
  concurrencia: boolean = false
  retorna: boolean = true
  xruta: string = ''
  entradas: string = ''
  salidas: string = ''

  divCodigofuente = 'none'
  divConsultang = 'none'
  divArchivosng = 'none'

  drivers: any

  modulo: string = '0'
  modulos: any

  archivo: string = '0'

  archivos: []

  lstDml: any = []

  Dml: any = [
    { "id": "$values", "nombre": "VALUES", "tipo": "INSERTAR" },
    { "id": "$set", "nombre": "SET", "tipo": "ACTUALIZAR" },
    { "id": "$where", "nombre": "WHERE", "tipo": "ACTUALIZAR" },
    { "id": "$where", "nombre": "WHERE", "tipo": "ELIMINAR" },
  ]

  codigo: string = ''
  funcion: string = ''
  query: string = ''
  columna: string = ''

  loading: boolean = false

  @Input() ApiCore: any

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    relacional: false,
    concurrencia: false,
    protocolo: '',
    ruta: '',
    version: '0.0.1',
    retorna: false,
    migrar: false,
    modulo: '',
    valores: {},
    coleccion: '',
    http: 0,
    https: 0,
    consumidores: 0,
    puertohttp: 0,
    puertohttps: 0,
    driver: '0',
    query: '',
    metodo: 'S',
    tipo: 'S',
    totalizar: 'S',
    prioridad: '0',
    entorno: 'desarrollo',
    logs: false,
    accion: false,
    cache: 0,
    estatus: false,
    categoria: '0',
    funcionalidad: '0',
    entradas: '',
    salidas: '',
    autor: '',
    fecha: ''
  };

  public xAPIAux: IAPICore

  public xAPIDB: IAPICore = {
    funcion: '',
    parametros: ''
  }


  campo: any = ''
  alias: string = ''
  tipodato: string = 'S'
  tabla: any = ''
  xdml: string = 'S'
  defecto: string = ''
  condicion: string = ''

  public DML: any = ["$values", "$set", "$where"]
  //Listado general de entradas
  public IEntradas = {
    "$values": [],
    "$set": [],
    "$where": []
  }

  public IEntrada = [] //Detalles de la entrada


  xcategoria: string = 'S'
  xfuncionalidad: string = 'S'


  codeJson: any = {
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

  codeSQL: any = {
    theme: 'idea',
    mode: 'text/x-sql',
    lineNumbers: true,
    lineWrapping: true,
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
    autoCloseBrackets: true,
    matchBrackets: true,
    lint: true
  };

  public _user: any

  public existe: boolean = false

  public dataModulo = []

  public dataCampo = []

  keyword = 'name'

  keywords = 'name'

  constructor(
    private comunicacionesService: ComunicacionesService,
    private apiService: ApiService,
    private modalService: NgbModal,
    private login: LoginService,
    private ngWizardService: NgWizardService,
    private toastrService: ToastrService,
    private ngxService: NgxUiLoaderService
  ) {
    this._user = this.login.getUserDecrypt().Usuario

  }

  ngOnInit(): void {
    //this.editor = new Editor();
    this.CargarModulos()
    this.CargarDrivers()
  }
  ngOnDestroy(): void {
    //this.editor.destroy();
  }

  async ngOnChanges() {
    if (this.ApiCore != undefined && this.ApiCore != "" && this.ApiCore != "InVuZGVmaW5lZCI=") {
      this.existe = true
      this.xAPI = JSON.parse(atob(this.ApiCore))
      this.SeleccionarChk(1)
      this.SeleccionarChks(1)
      this.onTipo(this.xAPI.tipo)
      this.clickRefresh(0)
      this.xAPIAux = JSON.parse(atob(this.ApiCore))
    } else {
      this.LimpiarFormulario()
      this.existe = false
    }

  }



  setEditorContent(event) {
    //console.log(event)

  }

  //agregarEntrada a los elementos de la interfaz de una API
  async agregarEntrada() {

    if (this.xdml == "S") {
      this.toastrService.warning(
        'Debe registrar todos los campos requeridos seleccione el campo VALUES',
        `Sandra Server`
      );
      return
    }

    if (this.campo.name == "" || this.alias == "" || this.tipodato == "S") {
      this.toastrService.warning(
        'Debe registrar todos los campos requeridos; nombre, alias, tipo de dato',
        `Sandra Server`
      );
      return
    }

    var e = {
      campo: this.campo.name,
      defecto: this.defecto,
      alias: this.alias,
      tipo: this.tipodato
    }
    this.IEntradas[this.xdml].push(e)

    var blAct = await this.selEntradas().then(e => { return e })
    if (this.xAPI.metodo == "ACTUALIZAR" && blAct != true) {
      console.log("Es recomendable agragar un parametro para actualizar WHERE")
    }
    this.xAPI.entradas = JSON.stringify(this.IEntrada, null, '\t')

    this.selMetodo()
    this.clickRefresh(0)
    this.eliminarCampoModulo(this.campo.name)
    this.tipodato = '0'
    this.campo = ''
    this.alias = ''

    this.defecto = ''


  }

  async selEntradas(): Promise<boolean> {
    var blAct = false //Actualizar
    var cond = ''
    this.IEntrada = []

    await this.DML.forEach(e => {
      if (this.IEntradas[e].length > 0) {
        if (e == "$where") {
          cond = this.condicion
          blAct = true
        }
        this.IEntrada.push({
          "dml": e,
          "condicion": cond,
          "entradas": this.IEntradas[e],
        })
      }
    })

    return blAct


  }


  clickRefresh(event) {
    this.codeJson = {
      theme: 'idea',
      mode: 'application/ld+json',
      lineNumbers: true,
      lineWrapping: true,
      foldGutter: true,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
      autoCloseBrackets: true,
      matchBrackets: true,
      lint: true
    }

    this.codeSQL = {
      theme: 'idea',
      mode: 'text/x-sql',
      lineNumbers: true,
      lineWrapping: true,
      foldGutter: true,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
      autoCloseBrackets: true,
      matchBrackets: true,
      lint: true
    }

  }

  selMetodo() {

    switch (this.xAPI.metodo) {
      case "INSERTAR":
        this.xAPI.query = `INSERT INTO ${this.tabla.name} $exec`
        break;
      case "ACTUALIZAR":
        this.xAPI.query = `UPDATE ${this.tabla.name} $exec`
        break;
      case "DELETE":
        this.xAPI.query = `DELETE FROM ${this.tabla.name} $exec`
        break;
      default:
        this.xAPI.query = `SELECT * FROM `
        break;
    }
  }

  focusRefresh(event) {
    console.log(event)
  }

  isValidTypeBoolean: boolean = true;

  showPreviousStep(event?: Event) {
    this.ngWizardService.previous();
  }

  showNextStep(event?: Event) {

  }

  resetWizard(event?: Event) {
    this.ngWizardService.reset();
  }

  setTheme(theme: THEME) {
    this.ngWizardService.theme(theme);
  }

  stepChanged(args: StepChangedArgs) {
    //console.log(args.step);
  }


  isValidFunctionReturnsBoolean(args: StepValidationArgs) {
    var valor = false

    if (this.xAPI.driver != '' && this.xAPI.descripcion != '' && this.xAPI.funcionalidad != 'S') {
      valor = true

      //this.Guardar()
    } else {
      this.toastrService.warning(
        'Debe registrar todos los campos requeridos',
        `CodeEpic Middleware`
      );
    }
    return valor;
  }

  isValidFunctionReturnsObservable(args: StepValidationArgs) {
    return of(true);
  }

  selDataBase(): void {
    this.xAPIDB.funcion = "_SYS_MYSQL";
    this.xAPIDB.parametros = this.consultarBDDriver();
    this.dataModulo = [];
    this.apiService.Ejecutar(this.xAPIDB).subscribe(
      (data) => {
        console.log(data)
        let i = 0
        data.Cuerpo.forEach(e => {
          i++
          this.dataModulo.push({ id: e.tabla, name: e.tabla, definicion: e.definicion })
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }

  /**
   * Tabla
   * @param item 
   */
  selectEventModulo(item) {
    this.dataCampo = []
    let i = 0
    let campos = JSON.parse(item.definicion)
    campos.forEach(e => {
      this.dataCampo.push({ id: e.col, name: e.col, tipo: e.tp, pos: i })
      i++
    });

  }

  /**
   * Eliminar un campo de los elementos de las columnas de las tablas
   * @param name 
   */
  eliminarCampoModulo(name) {
    let aux = this.dataCampo.filter(e => {
      return e.name != name
    });
    this.dataCampo = aux
  }

  onFocusedModulo(item) {

  }

  /**
   * Campo
   * @param item 
   */
  selectEventModulos(item) {
  }

  onFocusedModulos(item) {
  }


  SeleccionarChk(obj: any) {
    if (obj != "0") {
      this.xAPI.http = 1;
    } else {
      this.xAPI.http = 0;
    }
  }

  SeleccionarChks(obj: any) {
    if (obj != "0") {
      this.xAPI.https = 1;
    } else {
      this.xAPI.https = 0;
    }
  }

  async CargarDrivers() {
    this.xAPI.funcion = "LESBDrivers";

    await this.comunicacionesService.ListarConexiones().subscribe(
      (data) => {

        this.drivers = data
        this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {

            data.forEach(e => {
              this.drivers.push(e)
            });
          },
          (error) => { console.log(error) }
        )
      },
      (error) => { console.log(error) }
    )

  }

  consultarBDDriver() {
    let bd = ''
    this.drivers.forEach(e => {
      if (this.xAPI.driver == e.id) {
        bd = e.basedatos
        return
      }
    });
    return bd

  }

  async CargarModulos() {
    await this.apiService.ListarModulos().subscribe(
      (data) => {
        this.modulos = data;
      },
      (errot) => {
        this.modulos = [];
      }
    )
  }

  async CargarArchivos() {
    await this.apiService.ListarArchivos(this.modulo).subscribe(
      (data) => {
        this.archivos = data;
      },
      (errot) => {
        this.archivos = [];
      }
    )
  }

  async ProcesarArchivos() {
    var jsonG = {
      "modulo": this.modulo,
      "archivo": this.archivo
    };
    await this.apiService.ProcesarArchivos(jsonG).subscribe(
      (data) => {
        data.rs.forEach(el => {
          this.codigo = el;
        });
        this.funcion = data.msj;
        document.getElementById('duracion').innerHTML = `<b>Duración:</b> <font color="blue">${data.txtduracion} </font>&nbsp; <b>Peso:</b> <font color="blue">${data.peso}</font><hr>`
      },
      (errot) => {
        this.archivos = [];
      }
    )

  }

  onTipo(e) {
    this._divInit()
    switch (this.xAPI.tipo) {
      case 'CODIGO':
        this.divCodigofuente = ''
        this.divArchivosng = ''
        break;
      case 'ARCHIVO':

        break;
      case 'LOGICA':
        this.divCodigofuente = ''
        this.divArchivosng = ''
        break;
      case 'CONSULTA':
        this.divConsultang = ''
        this.clickRefresh(0)
        break;
      case 'INTERFAZ':

        break;

      default:

        break;
    }
  }

  _divInit() {
    this.divCodigofuente = 'none'
    this.divConsultang = 'none'
    this.divArchivosng = 'none'

  }

  async ejecutarApi() {

    this.xAPI.parametros = this.xparametro;
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        const formatter = new JSONFormatter(data);
        document.getElementById("xrs").appendChild(formatter.render());
      },
      (error) => {
        //this.resultado = error;
        console.log(error)
      }
    )
  }

  LimpiarFormulario() {
    this.xAPI = {
      funcion: '',
      parametros: '',
      relacional: false,
      concurrencia: false,
      protocolo: '',
      ruta: '',
      version: '0.0.1',
      retorna: false,
      migrar: false,
      modulo: '',
      valores: {},
      coleccion: '',
      http: 0,
      https: 0,
      consumidores: 0,
      puertohttp: 0,
      puertohttps: 0,
      driver: 'S',
      query: '',
      metodo: 'S',
      tipo: 'S',
      totalizar: 'S',
      prioridad: '0',
      entorno: 'desarrollo',
      logs: false,
      accion: false,
      cache: 0,
      estatus: false,
      categoria: 'S',
      funcionalidad: 'S',
      entradas: '',
      salidas: '',
      autor: '',
      fecha: ''
    }
    
  }

  Obtener() {
    this.xAPI.puertohttp = parseInt(this.puertohttp)
    this.xAPI.puertohttps = parseInt(this.puertohttps)
    this.xAPI.relacional = this.xrelacional ? true : false
    if (this.xAPI.query == "") this.xAPI.relacional = this.relacional ? true : false

    this.xAPI.protocolo = this.xAPI.puertohttps == 0 ? 'HTTP' : 'HTTPS'
    this.xAPI.logs = this.log ? true : false
    this.xAPI.accion = this.accion ? true : false
    this.xAPI.concurrencia = this.concurrencia ? true : false
    this.xAPI.retorna = this.retorna ? true : false
    this.xAPI.version = this.existe ? this.validarVersion() : this.xAPI.version
    this.xAPI.autor = this._user.id + '|' + this._user.nombre
    this.xAPI.cache = parseInt(this.cache)
    this.xAPI.fecha = new Date().toISOString()
  }

  async Guardar() {



    if (this.xAPI.funcionalidad == '' || this.xAPI.descripcion == '') {
      this.toastrService.warning(
        'Debe registrar todos los campos requeridos',
        `CodeEpic Middleware`
      );
      return false
    }

    this.Obtener()


    this.ngxService.startLoader("loader-registrar");
    var jsonG = {};
    var sApi = 'gapihtml';



    if (this.archivo == "0") {
      jsonG = {
        "coleccion": "apicore",
        "relacional": this.relacional ? true : false,
        "tipo": 'INSERTAR',
        "entorno": 'produccion',
        "valores": this.xAPI
      };
      sApi = 'crud';
    } else {
      jsonG = {
        "modulo": this.modulo,
        "archivo": this.archivo,
        "ApiCore": this.xAPI
      };
    }

    await this.apiService.Guardar(jsonG, sApi).subscribe(
      (data) => {
        this.LimpiarFormulario()
        let id = data.UpsertedID != null ? "registrada codigo: " + data.UpsertedID : "actualizada " 
        this.toastrService.success(
          'Tu (API) ha sido ' + id,
          `Code-Epic ESB`
        );
        this.ngxService.stopLoader("loader-registrar")
        this.ngWizardService.reset();

      },
      (errot) => {
        this.ngxService.stopLoader("loader-registrar")
        this.toastrService.error(
          'Fallo la conexión, con el API',
          `Code-Epic ESB`
        );

      }
    )
  }



  validarVersion() {

    let version = this.xAPI.version.split('.')
    let mayor = parseInt(version[0])
    let menor = parseInt(version[1])
    let menor_aux = parseInt(version[2])

    const _api = this.xAPI
    const _aux = this.xAPIAux

    if (_api.tipo != _aux.tipo || _api.driver != _aux.driver ||
      _api.concurrencia != _aux.concurrencia || _api.entradas != _aux.entradas ||
      _api.query != _aux.query) {
      mayor = parseInt(version[0]) + 1
    }

    if (_api.logs != _aux.logs || _api.cache != _aux.cache || _api.prioridad != _aux.prioridad || _api.accion != _aux.accion) {
      menor = parseInt(version[1]) + 1
    }

    if (_api.descripcion != _aux.descripcion || _api.categoria != _aux.categoria) {
      menor_aux = parseInt(version[2]) + 1
    }

    return mayor + '.' + menor + '.' + menor_aux

  }

  seleccionarUrl() {
    var id = '{Hash}'

    this.xruta = this.seleccionrEtorno(this.entorno) + ":" + id

  }

  seleccionrEtorno(key: string): string {
    var entorno = ''
    switch (key) {
      case "produccion":
        entorno = '/v1/api/'
        break;
      case "calidad":
        entorno = '/qua/api/'
        break;
      default:
        entorno = '/dev/api/'
        break;
    }
    return entorno
  }

  onMetodo(ev) {
    this.lstDml = []
    
    this.Dml.forEach(e => {
      console.log(e.tipo, this.xAPI.metodo)
      if (e.tipo == this.xAPI.metodo) {
        this.lstDml.push(e)
      }
    });
  }

  onDml(ev) {
    this.xcondicion = true
    if (this.xdml == "$where") {
      this.xcondicion = false
    }

  }

}
