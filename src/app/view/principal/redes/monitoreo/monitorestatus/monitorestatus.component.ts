import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-monitorestatus',
  templateUrl: './monitorestatus.component.html',
  styleUrls: ['./monitorestatus.component.css']
})
export class MonitorestatusComponent implements OnInit {

  data : any
  texto = 'Activo'
  color = 'success'

  constructor() { }

  agInit(params){
    this.data = params.data
    this.texto = params.value==true?'Activo':'Inactivo'
    this.color = params.value==true?'success':'danger'
  }

  ngOnInit(): void {
  }

}
