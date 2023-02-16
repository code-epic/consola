import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-rol',
  templateUrl: './modal-rol.component.html',
  styleUrls: ['./modal-rol.component.scss']
})
export class ModalRolComponent implements OnInit {
  bodyText: string;

  subdirectiva: string


  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    this.bodyText = 'Detalles de Privilegios';
  }

  closeModal(id: string) {
    this.modalService.dismissAll(id);
  }

}
