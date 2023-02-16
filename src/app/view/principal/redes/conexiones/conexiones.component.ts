
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService, IAPICore } from '../../../../service/apicore/api.service';
import { ComunicacionesService } from '../../../../service/comunicaciones/comunicaciones.service';
import { ConexionesService, IConexiones } from '../../../../service/conexiones/conexiones.service';
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-conexiones',
  templateUrl: './conexiones.component.html',
  styleUrls: ['./conexiones.component.scss']
})
export class ConexionesComponent implements OnInit {

  columnDefs = [
    { field: "id", headerName: 'Driver'},
    { field: "basedatos", headerName: 'Base de Datos'},
    { field: "descripcion"},
    { field: "host"},
    { field: "puerto"},
  ];

  drivers = []
  hosts = []
  rowData = []
  host = '0'
  driver = '0'
  loading = false;
  identificador : string
  usuario : string
  basedatos : string
  clave : string
  puerto : string
  url : string
  descripcion : string
  estatus = 0
  protocolo = '0'
  divDBng = 'none'
  divURLng = 'none'

  public xAPI : IAPICore = {
    funcion: '',
    parametros: '',
    relacional: false,
    concurrencia : false,
    protocolo: '',
    ruta : '',
    retorna : false,
    migrar : false,
    modulo : '',
    valores : {},
    coleccion : '',
    http : 0,
    https : 0,
    consumidores : 0,
    puertohttp : 0,
    puertohttps : 0,
    driver : '',
    query : '',
    metodo : '',
    tipo : '',
    prioridad : '',
    entorno: '',
    logs : false
  };


  public xDri : IConexiones = {
    id : '',
    driver : '',
    usuario : '',
    basedatos : '',
    clave : '',
    host : '',
    puerto : '',
    url : '',
    descripcion : '',
    estatus : false,
  }

  rowSelection = ''
  paginationPageSize = 10 
  
  private gridApi;
  private gridColumnApi;


  constructor(private comunicacionesService : ComunicacionesService, private apiService : ApiService, 
    private conexionesService : ConexionesService, 
    private toastrService: ToastrService,
    private ngxService: NgxUiLoaderService) {

      this.rowSelection = 'single';
   }

  ngOnInit(): void {
    this.ngxService.start(); 
   

    this.ListarIP()
    this.CargarDrivers()
    this.ListarConexiones()
  }

  async ListarIP(){
    
    await this.comunicacionesService.Listar().subscribe(
      (data) => {
        this.hosts = data
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async CargarDrivers(){
   
    await this.comunicacionesService.ListarDrivers().subscribe(
      (data) => {
        this.drivers = data
      },
      (error) => {
        console.error(error)
      }
    )
  }

  async ListarConexiones(){
    this.xAPI.funcion = "LESBDrivers";
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.rowData = data;
      },
      (error) => {
        console.log(error)
      }
    )
  }

  Obtener(){
    var est = this.estatus==1?true:false
    var surl = (this.protocolo === "0" || this.protocolo == undefined)?"":this.protocolo.toLowerCase() + "://" + this.url.toLowerCase()
    this.xDri = {
      id : this.identificador,
      driver : this.driver,
      usuario : this.usuario,
      basedatos : this.basedatos,
      clave : this.clave,
      host : this.host,
      puerto : this.puerto,
      url : surl,
      descripcion : this.descripcion,
      estatus : est,
    }
    return this.xDri
  }

  onVisibleDrive(){
    this.divDBng = ''
    this.divURLng = ''
    if (this.driver == "puenteurl"){
      this.divDBng = 'none'
      this.divURLng = ''
    }else{
      this.divDBng = ''
      this.divURLng = 'none'
      if (this.driver == 'oracle19c') {
        document.getElementById("lblnbd").innerHTML = "Oracle_SID"
      }else{
        document.getElementById("lblnbd").innerHTML = "Base de Datos"
      }
    }
  }

  async Guardar() {
    var jsonG = {};
    var sApi = 'ccoleccion';

    jsonG = {
      coleccion : 'sys-drivers',
      objeto : this.Obtener()
    };
    this.loading = true;
    await this.comunicacionesService.Guardar(jsonG, sApi).subscribe(
      (data)=>{
        this.toastrService.success(
          'Se ha agregado el driver',
          `CodeEpic Middleware`
        );
        if (this.estatus == 0){
          this.Limpiar()
          this.ListarConexiones()
        }else{
          this.EstablecerConexion()
        }
        
        this.loading = false;
      },
      (errot)=>{
        this.Limpiar()
        console.error(errot)
        this.loading = false;
      }
    )
  }

  Limpiar(){
    this.host = '0'
    this.driver = '0'
    this.identificador = ''
    this.usuario = ''
    this.basedatos = ''
    this.clave = ''
    this.puerto = ''
    this.url = ''
    this.descripcion = ''
    this.estatus = 0
  }

  async EvaluarConexion(){
    
    if(this.basedatos == undefined || this.clave == undefined || this.basedatos === "" || this.clave === ""){
      this.toastrService.info(
        'Debe introducir los datos para establecer la conexión',
        `CodeEpic Middleware`
      );
      return false;
    }
    this.ngxService.startLoader("loader-01");
    await this.conexionesService.EvaluarConexion(this.Obtener(), 'evaluarconexion').subscribe(
      (data)=>{
        this.toastrService.success(
          data.msj,
          `CodeEpic Middleware`
        );
        this.estatus = 1
        this.ngxService.stopLoader("loader-01");
      },
      (errot)=>{
        this.toastrService.warning(
          errot.msj,
          `CodeEpic Middleware`
        );
        this.estatus = 0
        this.ngxService.stopLoader("loader-01");
      }
    )
  }

  async EstablecerConexion(){
    if(this.basedatos == '' || this.clave == ''){
      this.toastrService.warning(
        'Debe introducir los datos para establecer la conexión',
        `CodeEpic Middleware`
      );
      return false;
    }
    this.loading = true;
    await this.conexionesService.EstablecerConexion(this.Obtener(), 'establecerconexion').subscribe(
      (data)=>{
        this.toastrService.success(
          data.msj,
          `CodeEpic Middleware`
        );
        this.Limpiar()
        this.ListarConexiones()
        this.estatus = 1
        this.loading = false;
      },
      (errot)=>{
        this.toastrService.warning(
          errot.msj,
          `CodeEpic Middleware`
        );
        this.Limpiar()
        this.ListarConexiones()
        this.estatus = 0
        this.loading = false;
      }
    )
  }

  onSelectionChanged(e){
    var selectedRows = this.gridApi.getSelectedRows();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

  }

  async EvaluarPuente(){
    if(this.host === '0' || this.host == undefined){
      this.toastrService.info(
        'Debe seleccionar un host de origen',
        `CodeEpic Middleware`
      );
      return false;
    }
    if(this.url === '' || this.url == undefined){
      this.toastrService.info(
        'Debe introducir datos para una dirección',
        `CodeEpic Middleware`
      );
      return false;
    }
    this.loading = true;
    var surl = this.protocolo.toLowerCase() + "://" + this.url.toLowerCase()
    await this.conexionesService.EvaluarPuente('evaluarpuente?id=' + surl).subscribe(
      (data)=>{
        this.toastrService.success(
          data.msj,
          `CodeEpic Middleware`
        );
        this.estatus = 1
        this.loading = false;
      },
      (e)=>{
        
        var data = e.error
        this.toastrService.error(
          e.statusText + ":" + e.status + " " + data.msj,
          `CodeEpic Middleware`
        );
        this.estatus = 0
        this.loading = false;
      }
    )
  }

  onProtocol(){
    this.url = ""
    if(this.protocolo != "0"){
      this.url = this.host
    }
  }
}
