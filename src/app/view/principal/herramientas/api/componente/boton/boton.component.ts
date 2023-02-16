import { Component, OnInit, ɵConsole } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ApiService, IAPICore } from '../../../../../../service/apicore/api.service';
import JSONFormatter from 'json-formatter-js';


@Component({
  selector: 'app-boton',
  templateUrl: './boton.component.html',
  styleUrls: ['./boton.component.css']
})
export class BotonComponent implements OnInit {

  data : any;
  resultado: any;
  xresultado: any;
  
  closeResult : string  = '';
  xparametro : string = '';
  coleccion : string   = '';
  ruta : string  = '';
  query : string   = '';
  funcion : string  = '';
  parametros : string  = '';
  divVisConsulta = false;
  divVisParametro = false;
  xAPI : IAPICore;
  
  constructor( private modalService: NgbModal, private apiService: ApiService) { }

  agInit(params){
    this.data = params.data;
    
  }

  ngOnInit(): void {
  }
  
  activarFormulario(content) {
    var item = this.data;
    console.log(item);
    this.modalService.open(content, {centered: true, size: 'lg', ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    var api = item.entorno=="produccion"?"/v1/api/crud":"/devel/api/crud"
    var xruta =  api + ":[" + item.funcion + "]";
    this.xparametro = "";
    this.coleccion = item.coleccion;
    this.ruta = xruta;

    this.query = item.query;
    console.info(item);

    // if(item.parametros != undefined && item.parametros != ""){
    //   this.divVisConsulta = false;
    //   this.divVisParametro = true;

    //     var param = JSON.parse(item.parametros);
    //     this.parametros = JSON.stringify(param, null, 4);
        
    // }else{
    //   this.divVisConsulta = true;
    //   this.divVisParametro = false;
    // }

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

  async ejecutarApi(){
    this.xAPI = this.data;
    // console.log(this.data.funcion)

    // this.xAPI.modulo = this.data.modulo;
    // this.xAPI.metodo = this.data.metodo;
    // this.xAPI.coleccion = this.data.coleccion;
    this.xAPI.parametros = this.xparametro;
    // this.xAPI.funcion = this.data.funcion;
    console.log(this.xAPI);
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        //this.resultado = JSON.stringify(data, undefined, 2);
        const formatter = new JSONFormatter(data);
        document.getElementById("xrs").appendChild(formatter.render());
        
      },
      (error) => {
        this.resultado = error;
        console.log(error)
      }
    )
  }
}
