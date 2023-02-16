import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Comunicaciones, ComunicacionesService, IComunicaciones } from '../../../../service/comunicaciones/comunicaciones.service';
import { EstatusComponent } from './componente/estatus/estatus.component';
import { ScanComponent } from './componente/scan/scan.component';
import { ToastrService } from 'ngx-toastr';
import { WsocketsService } from '../../../../service/websockets/wsockets.service';
import { ApiService, IAPICore } from '../../../../service/apicore/api.service';

import { NgxUiLoaderService } from "ngx-ui-loader"; // Import NgxUiLoaderService

@Component({
  selector: 'app-comunicaciones',
  templateUrl: './comunicaciones.component.html',
  styleUrls: ['./comunicaciones.component.scss']
})
export class ComunicacionesComponent implements OnInit, OnDestroy {


  columnDefs = [
    { field: "estatus", cellRendererFramework: EstatusComponent, width: 60, headerName: '#'},
    { field: "host"},
    { field: "mac"},
    { field: "tipo", width: 60},
    { field: "id",  headerName: 'Identificador'},
    { field: "descripcion"},
    { field: "#", cellRendererFramework: ScanComponent},
  ];

  host: string = ''
  mac: string = ''
  descripcion: string = ''
  identificador: string = ''
  estatus = 0
  rowData: any;
  dispositivo: string = '0'
  dispositivos = []


  public Conn : Comunicaciones = {
    id : '',
    host : '',
    mac : '',
    tipo : '',
    descripcion : '',
    estatus : false,
  }

  public IConn : IComunicaciones = {
    coleccion: 'sys-conection',
    objeto : this.Conn,
  }

  public loading = false;
  public loadingGrid = false
  data =  [ 0, 0]
  // Pie
  public pieChartLabels: string[] = [ 'Activos','Inactivos'];
  public pieChartData = [{
    label: 'My First Dataset',
    data: this.data,
    backgroundColor: [
      'rgb(54, 162, 235)',
      'rgb(77, 189, 116)',
      'rgb(248, 108, 107)'
    ],
    hoverOffset: 4
  }]
  public pieChartType = 'pie';

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
  paginationPageSize = 10


  constructor(private comunicacionesService : ComunicacionesService, private ruta: Router, 
              private modalService: NgbModal, 
              private toastrService: ToastrService,
              private ws : WsocketsService,
              private apiService : ApiService,
              private ngxService: NgxUiLoaderService) { 
    
  }


  ngOnInit(): void {
    this.dispositivos = [
      {id:'SRV', descripcion: 'SERVIDORES'},
      {id:'ROU', descripcion: 'ROUTERS'},
      {id:'SWI', descripcion: 'SWITCHES'},
      {id:'IMP', descripcion: 'IMPRESORAS'},
      {id:'LHU', descripcion: 'LECTOR BIOMETRICO'},
      {id:'DVR', descripcion: 'DVR - CAMARAS'},
      {id:'CIP', descripcion: 'CAMARAS IP'},
    ]
    
    //this.CargarConexiones()
    
    this.CargarDataPie()
  }

  CargarDataPie(){
    this.ws.lst$.subscribe(
      e => {
        this.evaluarDataPie(e)
      }
    )
  }

  evaluarDataPie(edata: any){
    var reg = 0, act = 0, ina = 0
        edata.forEach(el => {
          act += el.estatus == true?1:0
          ina += el.estatus == true?0:1
        });
        reg = act + ina
        this.pieChartData = [{
          label: 'Resumen',
          data: [ act, ina],
          backgroundColor: [
            'rgb(77, 189, 116)',
            'rgb(248, 108, 107)'
          ],
          hoverOffset: 4
        }]
  }

  async CargarConexiones( e: any){
    console.log(e.target.name)

    this.loadingGrid = true;
    this.xAPI.funcion = "LstComunicaciones";
    this.xAPI.valores = null;
    this.xAPI.parametros = e.target.name
   
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.rowData = data
        this.loadingGrid = false
      },
      (error) => {
        console.log(error)
        this.loadingGrid = false
      }
    )
   
  }

  Limpiar(){
    this.identificador  = ''
    this.host  = ''
    this.mac  = ''
    this.dispositivo = ''
    this.descripcion = ''
    this.estatus = 0
  }

  Obtener() : IComunicaciones{
    this.IConn.coleccion = 'sys-conection'
    var est = this.estatus==1?true:false
    this.Conn = {
      id : this.identificador,
      host : this.host,
      mac : this.mac,
      tipo: this.dispositivo,
      descripcion : this.descripcion,
      estatus : est,
    }
    this.IConn.objeto = this.Conn

    return this.IConn;

  }

  async Guardar() {
    var jsonG = {};
    var sApi = 'ccoleccion';

    jsonG = this.Obtener();
    this.loading = true;
    
    await this.comunicacionesService.Guardar(jsonG, sApi).subscribe(
      (data)=>{
        
        this.Limpiar()
        this.toastrService.success(
          'Tu (Comunicacion) ha sido registrada codigo: ' + data.InsertedID,
          `Code-Epic Ok`
        );
        //this.CargarConexiones()
        this.loading = false;
      },
      (errot)=>{
        this.Limpiar()
        this.toastrService.error(
          errot,
          `Code-Epic Error`
        );
        this.loading = false;
      }
    )
  }

  async ScanRed(){
    this.ngxService.startLoader("loader-01");
    await this.comunicacionesService.ScanMac(this.host).subscribe(
      (data)=>{ 
        this.mac = data.msj
        this.ngxService.stopLoader("loader-01")
      },
      (errot)=>{
        console.error(errot)
        this.ngxService.stopLoader("loader-01")
      }
    )
    
  }

  chartHovered(e){

  }

  chartClicked(e){

  }

  ngOnDestroy(): void{
    console.log('Saliendo del modulo')
  }


  activarCargador(){
    this.ngxService.startBackground("do-background-things");
    // Do something here...
    this.ngxService.stopBackground("do-background-things");

    this.ngxService.startLoader("loader-01"); // start foreground spinner of the loader "loader-01" with 'default' taskId
   
  }


}
