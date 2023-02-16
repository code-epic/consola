import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiService, IAPICore } from '../../../../service/apicore/api.service';
import JSONFormatter from 'json-formatter-js';
import { RegistrarRolComponent } from './registrar-rol/registrar-rol.component'; 

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.scss']
})
export class RolComponent implements OnInit {

  @ViewChild(RegistrarRolComponent) registraRol: RegistrarRolComponent

    public focus;


    public developer = []
    public testing = []
    public quality = []
    public production = []
    public tabPosicion = 0
  
    lst = []
    lengthOfi = 0;
    pageSizeOfi = 10;
    pageSizeOptions: number[] = [5, 10, 25, 100];
   
    sectionConsultar = ''
    sectionRegistar = 'none'
  
    data : any;
    resultado: any;
    xresultado: any;
    xparametro : string = ''
    closeResult : string  = ''
    xAPI : IAPICore;
    xentorno : string = ''
  
    constructor(
      private apiService : ApiService, 
      private ruta: Router, 
      private modalService: NgbModal, 
      private toastrService: ToastrService) {
    }
  
    ngOnInit(): void {
      //document.getElementById('duracion').innerHTML = this.duracion;
     
     
     
      
    }
  
  
    seccionRegistrar( valor ){
      if (valor != '') {
        this.sectionConsultar = ''
        this.sectionRegistar = 'none'
      }else{
        this.sectionConsultar = 'none'
        this.sectionRegistar = ''
  
      }
    }
  
   
    pageChangeEvent(e){
      
      this.recorrerElementos(e.pageIndex+1)
    }
  
    //recorrerElementos para paginar listados
    recorrerElementos(posicion : number){
      if (posicion > 1) posicion = posicion * 10
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
  
   
  
  
  
   
    private getDismissReason(reason: any): string {
      if (reason === ModalDismissReasons.ESC) {
        return 'ESC';
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        return 'backdrop';
      } else {
        return `with: ${reason}`;
      }
    }
  

  
  
  
  }
  