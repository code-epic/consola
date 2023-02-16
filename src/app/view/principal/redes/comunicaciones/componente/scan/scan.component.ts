import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import  JSONFormatter from 'json-formatter-js';
import { ComunicacionesService } from '../../../../../../service/comunicaciones/comunicaciones.service';
import { NgxUiLoaderService } from "ngx-ui-loader"; // Import NgxUiLoaderService


@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css']
})
export class ScanComponent implements OnInit {

  data : any
  closeResult = '';
  xrs = ''

  constructor(private modalService: NgbModal, 
    private comunicacionesService : ComunicacionesService,
    private ngxService: NgxUiLoaderService) { }

  agInit(params){
    this.data = params.data
  }

  ngOnInit(): void {
  }

  activarFormulario(content) {
    var item = this.data;
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

  async ScanRed(){
    this.ngxService.startLoader("loader-01");
    
    await this.comunicacionesService.ScanNmap(this.data.host).subscribe(
      (data)=>{
        console.log(data)
        this.xrs = data.msj
        this.ngxService.stopLoader("loader-01");
      },
      (errot)=>{
        this.ngxService.stopLoader("loader-01");
        console.error(errot)
      }
    )
  }
}
