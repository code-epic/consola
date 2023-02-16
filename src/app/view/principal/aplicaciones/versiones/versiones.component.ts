import { Component, OnInit } from '@angular/core';
import { ApiService, IAPICore } from '../../../../service/apicore/api.service';

@Component({
  selector: 'app-versiones',
  templateUrl: './versiones.component.html',
  styleUrls: ['./versiones.component.scss']
})
export class VersionesComponent implements OnInit {

  public lstApp = []

  public xAPI : IAPICore = {
    funcion       : '',
    parametros    : '',
    valores       : null,
  }


  constructor(private apiService : ApiService) { }

  ngOnInit(): void {
      this.lstAplicaciones()
  }

  clonar(){}

  actualizar(){}

  async lstAplicaciones(){
    this.xAPI.funcion = "LstAplicaciones";
    this.xAPI.valores = null;

    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {

        this.lstApp  = data.Cuerpo
        // data.Cuerpo.forEach(e => {          
         
        // });             
      },
      (error) => {
        console.log(error)
      }
    )
  }
}
