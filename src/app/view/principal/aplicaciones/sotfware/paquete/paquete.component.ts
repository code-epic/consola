import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../../environments/environment.prod';

@Component({
  selector: 'app-paquete',
  templateUrl: './paquete.component.html',
  styleUrls: ['./paquete.component.scss']
})
export class PaqueteComponent implements OnInit {
  closeResult : string  = ''
  lenguaje : string = '0'
  
  afuConfig = {
    multiple: false,
    formatsAllowed: ".zip, .tar, .war",
    maxSize: "100",
    uploadAPI:  {
      url: '/v1/api/file',
      method:"POST",
      headers: {
     "Content-Type" : "text/plain;charset=UTF-8",
     "Authorization" : `Bearer ${sessionStorage.getItem('token')}`
      },
      params: {
        'opt': 'app'
      },
      responseType: 'blob',
    },
    theme: " attachPin", //dragNDrop
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    fileNameIndex: true,
    replaceTexts: {
      selectFileBtn: 'Seleccionar la aplicación que desea instalar, en formato (zip, tar, o war)',
      resetBtn: 'Limpiar Formulario',
      uploadBtn: 'Subir archivo',
      dragNDropBox: 'Arrastrar y soltar',
      attachPinBtn: 'Seleccionar Archivos...',
      afterUploadMsg_success: 'El archivo subio con exito!',
      afterUploadMsg_error: 'Fallo la carga del archivo!',
      sizeLimit: 'Limite del Archivo '
    }
  };

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }


  modalAccion(content){
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
