import { Component, OnInit } from '@angular/core';
import { ApiService, IAPICore } from '../../../../../service/apicore/api.service';
import { Wdefinicion, WListaEstado, WorkflowService } from '../../../../../service/workflow/workflow.service';
import { ComunicacionesService } from '../../../../../service/comunicaciones/comunicaciones.service';


@Component({
  selector: 'app-registrar-workflow',
  templateUrl: './registrar-workflow.component.html',
  styleUrls: ['./registrar-workflow.component.scss']
})
export class RegistrarWorkflowComponent implements OnInit {



  public xAPI : IAPICore = {
    funcion: '',
    parametros: '',
    valores : {}
  }

  lstApps = []
  dataModulo = []
  aplicacion : string = '-'

  public Definicion = []
  xmodulo :  string = '-'
  xdrivers: string = '-'
  drivers: any

  
  nombre  :  string = ''
  descripcion  :  string = ''
  isBtnSalvar : boolean = true
  isDisabledInput : boolean = false
  isButtonVisibleSalvar : boolean = false
  isButtonVisibleUpdate : boolean = false


  constructor(
    private apiService : ApiService,
    private comunicacionesService: ComunicacionesService,
    private wkf : WorkflowService) { }

  ngOnInit(): void {
    this.lstAplicaciones()    
    this.CargarDrivers()
  }

  async lstAplicaciones(){
    this.xAPI.funcion = "SEC_CAplicaciones";
    this.xAPI.valores = null;
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
      
        this.lstApps = data.Cuerpo
      },
      (error) => {
        console.error(error)
      }
    )
  }

  async CargarDrivers() {
    this.xAPI.funcion = "LESBDrivers";

    await this.comunicacionesService.ListarConexiones().subscribe(
      (data) => {
        
        this.drivers = data
        this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {

            this.drivers = data.filter(e => {
              
               return e.driver.indexOf('mysql') == 0  
              
            });
          },
          (error) => { console.log(error) }
        )
      },
      (error) => { console.log(error) }
    )

  }

  consultarRed(){
    this.xAPI.funcion = 'WKF_CDefinicion'
    let app = this.aplicacion.split('|')
    this.xAPI.parametros = app[0]
    // this.wkf.msjText$.emit( this.aplicacion)
    this.apiService.hash =  ':' + app[1]
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        console.log(data)
        this.isBtnSalvar = false

        if (data.Cuerpo != undefined ) {
          console.log(data.Cuerpo.length)
          if (data.Cuerpo.length == 0 ) return

          this.wkf.msjText$.emit( data.Cuerpo[0].wkf )
          data.Cuerpo.forEach(e => {         
            if (e != ' ') {
              
              this.isBtnSalvar = false
              this.isDisabledInput = true
              this.isButtonVisibleSalvar = true
              this.isButtonVisibleUpdate = true
              this.nombre = e.nomb
              this.xdrivers = e.driver
              this.descripcion = e.obse
            } 
          
          })
        }
      },
      (err) => {
        console.error(err)
      }
    )
  }

  limpiar(){
    this.isBtnSalvar = true
    this.isDisabledInput = false
    this.isButtonVisibleSalvar = false
    this.isButtonVisibleUpdate = false
    this.nombre = ''
    this.descripcion = ''
    this.aplicacion = '-'
    this.xmodulo = '-'
    this.xdrivers = '-'
    this.wkf.msjText$.emit( 'CLEAN' )
  }

  salvar(){
    var ObjSalvar = {
      'aplicacion' : this.aplicacion,
      'modulo' : this.xmodulo,
      'nombre' : this.nombre,
      'driver' : this.xdrivers,
      'descripcion' : this.descripcion,
    }
    this.Definicion.push(ObjSalvar)
    this.xAPI.funcion = 'WKF_IDefinicion'
    this.xAPI.valores = JSON.stringify(ObjSalvar)
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        console.log(data.msj)
        this.apiService.Mensaje('Proceso exitoso se ha ' + data.msj, 'Felicitaciones', 'success', 'wkf')
      },
      (err) => {
        console.error(err)
      }
    )
  }

}
