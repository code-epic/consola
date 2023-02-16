import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ApiService, IAPICore } from '../../../../service/apicore/api.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  columnDefsAcc = [
    { field: "accid", headerName: '#', width: 50},
    { field: "accnomb", headerName: 'Nombre'},
    { field: "func", headerName: 'Funcion'},
    { field: "endpoint", headerName: 'EndPoint'},
  ];


  columnDefsSub = [
    { field: "#", width: 50},
    { field: "Nombre"},
    { field: "Clase"},
    { field: "Estatus"},
  ];

  public xAPI : IAPICore = {
    funcion: '',
    relacional: false,
    concurrencia : false,
    retorna : false,
    migrar : false,
    parametros: '',
    modulo : '',
    valores : {},
    logs : false,
    cache: 0,
    estatus: false
  };

  aplicacion :string = ''
  rowDataAcc: any
  rowDataSub: any
  closeResult : string  = ''
  lstApps = []

  keyword = 'name'
  dataModulo = []
  datamenu = []

  colormenu = "btn-success"
  modulo    : string = ''
  xmodulo   : string = ''
  moduloid  : string = ''
  menu      : string = '' //id
  menuid    : string = ''
  accionid  : string = ''
  xmenu     : string = '' //nombre
  xnombre   : string = '' //nombre
  xurl      : string = ''
  xjs       : string = ''
  xcss      : string = ''
  xcolor    : string = ''
  xicono    : string = ''
  
  xestatus  : string = '1'

  metodo    : string = '0'
  nombre    : string = ''
  funcion   : string = ''
  endpoint  : string = ''
  directiva : string = ''
  

  divSubAcciones = 'none'
  public bGuardar : boolean = false

  constructor(private modalService: NgbModal, private apiService : ApiService) { }

  ngOnInit(): void {
    this.lstAplicaciones()
  }

  async lstAplicaciones(){
    this.xAPI.funcion = "LstAplicaciones";
    this.xAPI.valores = null;
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        console.info(data)
        this.lstApps = data.Cuerpo
      },
      (error) => {
        console.error(error)
      }
    )
  }

  selModulo() : void {
    this.xAPI.funcion = "LstModulos";
    this.xAPI.parametros = this.aplicacion;
    this.dataModulo = [];
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.forEach(e => {          
          this.dataModulo.push({ id: e.id, name: e.nomb  })
        });             
      },
      (error) => {
        console.log(error)
      }
    )
  }

  selectEventModulo(item) {
    this.moduloid = item.id;
    this.modulo = item.name;
    this.consultarMenu()
  }

  onFocusedModulo(item) {
    this.moduloid = '';
    this.modulo = '';
  }

  onFocusedMenu(item) {
    if( this.moduloid == '' ) this.guardarModulo()
    this.menu =  ''
    this.menuid = ''
  }

  selectEventMenu(item) {
    this.menu =  item.name
    this.menuid = item.id
  }

  guardarModulo(){
    this.xAPI.parametros =  this.xmodulo + "," + this.aplicacion
    this.xAPI.funcion = "AgregarModulo"
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
       this.moduloid = data.msj
      },
      (error) => {
        console.log(error)
      }
    )
  }

  selectEventUrl(item) {
    this.xurl = item.name;
  }

  consultarMenu(acc : string = ''){
    this.xAPI.funcion = "LstMenus"
    
    this.xAPI.parametros = this.moduloid
    this.xnombre = this.menu
    this.datamenu = []
    console.log(this.moduloid)
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        
        data.Cuerpo.forEach(e => {          
          this.datamenu.push({id: e.id, name: e.nomb });  
        });       
      },
      (error) => {
        console.log(error)
      }
    )
  }

  OMenuAccion(){
    this.bGuardar = true
    this.colormenu = "btn-warning"
    if ( this.menuid == '' ) {
      this.xnombre = this.menu
      this.colormenu = "btn-success"
      return
    }
    this.xAPI.funcion = "OMenuAccion"
    this.xAPI.parametros = this.menuid
    console.info(this.xAPI)
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        var i = 0
        var lista = []
        data.Cuerpo.forEach(e => {    
          if(i == 0 ) {
            this.xnombre = e.nomb     
            this.xurl = e.url 
            this.xjs = e.js
            this.xcss = e.clase
            //this.xicon = e.icon
            //this.xcolor  = e.color
            this.xestatus = e.type
          }
          if ( e.endpoint != undefined ){
            lista.push(e)
          }
          console.log(e)
        });       
        
        this.rowDataAcc = lista;  
      },
      (error) => {
        console.log('')
      }
    )
  }

  GuardarMenu(){
    this.xAPI.parametros = this.xurl + "," + this.xjs + ",icon-test,"+ this.xnombre + ","
    this.xAPI.parametros +=  this.xcss + "," + this.xcolor + "," + this.xestatus + "," + this.moduloid
    this.xAPI.funcion = "AgregarMenu";
    if(this.menuid != ''){
      this.xAPI.funcion = "ActualizarMenu";
      this.xAPI.parametros += "," + this.menuid
    }   
    console.info(this.xAPI)
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        console.log(data) 
       this.menuid = this.xAPI.funcion == "AgregarMenu"? data.msj: this.menuid
      },
      (error) => {
        console.log(error)
      }
    )

  }

  GuardarAccion(){
    this.xAPI.funcion = "AgregarAccion";
    this.xAPI.parametros = this.endpoint + "," + this.nombre + ","+ this.funcion + "," + this.directiva     
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        console.info(data) 
        this.accionid = data.msj
        this.MenuAccionGuardar()
      },
      (error) => {
        console.log(error)
      }
    )
  }

  MenuAccionGuardar(){
    this.xAPI.funcion = "AgregarAccionMenu";
    this.xAPI.parametros = this.menuid + "," + this.accionid
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        console.info(data) 
        this.OMenuAccion()
      },
      (error) => {
        console.log(error)
      }
    )
  }

  limpiarMenu(){
    this.xnombre = ''     
    this.xurl = '' 
    this.xjs = ''
    this.xcss = ''
    //this.xicon = e.icon
    //this.xcolor  = e.color
    this.xestatus = "1"
  }

  limpiarMenuAcciones(){
    this.metodo= "0"
    this.nombre = ''
    this.funcion = ''
    this.directiva = ''
    this.endpoint = ''
  }

  modalAccion(content){
    console.log("Consultado menu ID: " + this.menuid)
    this.modalService.open(content, {centered: true, size: 'lg', ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


}
