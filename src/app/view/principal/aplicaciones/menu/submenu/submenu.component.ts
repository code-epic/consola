import { Component, OnInit } from '@angular/core';
import { NgbModal,  ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-submenu',
  templateUrl: './submenu.component.html',
  styleUrls: ['./submenu.component.scss']
})
export class SubmenuComponent implements OnInit {


  columnDefsSub = [
    { field: "#", width: 50},
    { field: "Nombre"},
    { field: "Clase"},
    { field: "Estatus"},
  ];

  rowDataSubAcc: any
  closeResult : string  = '';
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
