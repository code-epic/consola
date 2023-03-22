import { Component, OnInit } from '@angular/core';
import { ApiService, IAPICore } from '../../../../service/apicore/api.service';

@Component({
  selector: 'app-versiones',
  templateUrl: './versiones.component.html',
  styleUrls: ['./versiones.component.scss']
})
export class VersionesComponent implements OnInit {

  public lstApp = []

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: null,
  }


  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.lstAplicaciones()
  }


  actualizar(e : any) {
    if (e.nombre == "Panel") {
      this.actualizarPanel()
      return false;
    }


  }

  async lstAplicaciones() {
    this.xAPI.funcion = "LstAplicaciones";
    this.xAPI.valores = null;

    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {

        this.lstApp = data.Cuerpo
        console.log(this.lstApp)
      },
      (error) => {
        console.log(error)
      }
    )
  }




  //actualizarPanel 
  actualizarPanel() {
    let fnx = {
      "funcion": "fnx.UpdateOption",
      "option": "consola",
    }
    this.apiService.ExecFnx(fnx).subscribe(
      (data) => {
        console.log(data)
      },
      (error) => {
        console.log(error)
      }
    )
  }


  //Clonar aplicaciones
  clonar() {

    let fnx = {
      "funcion": "fnx.UpdateOption",
      "option": "consola",
    }
    this.apiService.ExecFnx(fnx).subscribe(
      (data) => {
        console.log(data)
      },
      (error) => {
        console.log(error)
      }
    )

  }



}
