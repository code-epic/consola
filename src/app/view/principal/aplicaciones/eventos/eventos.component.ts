import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  constructor() { }

  estatus = true
  contador = 0
  eventos = []
  tipo = 89

  data =  [ 45, 35, 20, 60 ]
  // Pie
  public pieChartLabels: string[] = [ 'Error', 'Alertas', 'Info', 'Sistemas' ];
  public pieChartData = [{
    label: 'Eventos Generales',
    data: this.data,
    backgroundColor: [
      'rgb(211, 27, 27)',
      'rgb(249, 186, 18)',
      'rgb(18, 189, 249)',
      'rgb(186, 18, 249)'
    ],
    hoverOffset: 4
  }]
  public pieChartType = 'pie';
  public pieChartLegend = true;

  // barChart
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels: string[] = ['Eventos Generales'];
  public barChartType = 'bar';
  public barChartLegend = true;

  public barChartData: any[] = [
    {data: [40], label: 'Pendiente'},
    {data: [25], label: 'Atendidos'},
  ];


  ngOnInit(): void {
  }

  CargarEventos(){
    this.estatus = this.estatus?false:true

    this.contador += 1
    this.tipo += this.tipo>93?-4:1
    var xevento = {
      tipo: this.tipo,
      nombre: "Consultando datos de seguridad",
      descripcion: "Error de mensaje " + this.contador,
      fecha: "23ABR21 01:20 p.m",
      ubicacion: "SSSIFANB - Nomina",
      usuario: "nomina",
      estatus: this.estatus
    }
    this.eventos.push(xevento)
    var listaHTML = this.replaceAll( document.getElementById("divListaEventos").innerHTML, "fadeIn", "")

    var lst = this.HacerMensaje(xevento)
    document.getElementById("divListaEventos").innerHTML = lst + listaHTML

  }

  HacerMensaje(xevento): string{
    var color = 'info'
    var estilo = ''
    var estatusText = ''
    switch ( xevento.tipo ) {
      case 90:
        color = 'danger'
        estilo = 'style="background-color: #ffefef8c;"'
        estatusText = this.obtenerEstatus(xevento.estatus)
        break;
      case 91:
        color = 'warning'
        break;
      case 92:
        color = 'info'
        break;   
      case 93:
        color = 'primary'
        break; 
      default:
        break;
    }

    return `
      <div class="list-group-item list-group-item-accent-${color} list-group-item-divider animated fadeIn" ${estilo}>
        <div>
          <div class="font-weight-bold" style="color: #720303;">
              <span>Error: ${xevento.nombre}</span>
              <span class="float-right">${estatusText}</span>
          </div>
          <div>
              <span>
                  <small class="text-muted">
                    ${xevento.descripcion}
                  </small>
              </span>
          </div>
        </div>
        <small class="text-muted mr-4"><i class="icon-calendar"></i>&nbsp; ${xevento.fecha}</small>
        <small class="text-muted mr-4"><i class="icon-location-pin"></i>&nbsp; ${xevento.ubicacion}</small>
        <small class="text-muted mr-4"><i class="icon-user-female"></i>&nbsp; ${xevento.usuario}</small>
      </div>`
  }

  obtenerEstatus(estatus: boolean) : string{
    var cadena = ` <i class="icon-envelope-letter" style="font-size: 10px; font-weight: bold; color: #73c543;"></i>
    <small class="text-muted">  Atendidos </small>`
    if (!estatus){
      cadena = ` <i class="icon-envelope" style="font-size: 10px; font-weight: bold; color: #720303;"></i>
      <small class="text-muted">  Pendiente </small>`
    }
    return cadena;
  }
  chartHovered(e){

  }

  chartClicked(e){

  }

  replaceAll(str, find, replace) {
    var escapedFind=find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return str.replace(new RegExp(escapedFind, 'g'), replace);
}

}
