import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-estatus',
  templateUrl: './estatus.component.html',
  styleUrls: ['./estatus.component.css']
})
export class EstatusComponent implements OnInit {

  icono = 'fa-check-circle'
  data : any
  constructor(private modalService: NgbModal) { }


  agInit(params){
    this.data = params.data
    this.icono = params.value=="true"?'fa-check-circle':'fa-times-circle'
  }

  ngOnInit(): void {
  }

}
