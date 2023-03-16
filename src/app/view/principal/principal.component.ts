import { Component, OnInit } from '@angular/core';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { Router } from '@angular/router';

import { timer } from 'rxjs';
import { WsocketsService } from '../../service/websockets/wsockets.service';

// import { CodeEpic, Configuracion } from 'code.epic.module'


@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent implements OnInit {

  // public Epic = new CodeEpic()

  // public cf: Configuracion = {
  //   token: ''
  // }
  constructor(private ruta: Router, private ws: WsocketsService) {



  }

  radioModel: string = 'Month';


  // social box charts

  public brandBoxChartData1: Array<any> = [
    {
      data: [65, 59, 84, 84, 51, 55, 40],
      label: 'Facebook'
    }
  ];
  public brandBoxChartData2: Array<any> = [
    {
      data: [1, 13, 9, 17, 34, 41, 38],
      label: 'Twitter'
    }
  ];
  public brandBoxChartData3: Array<any> = [
    {
      data: [78, 81, 80, 45, 34, 12, 40],
      label: 'LinkedIn'
    }
  ];
  public brandBoxChartData4: Array<any> = [
    {
      data: [35, 23, 56, 22, 97, 23, 64],
      label: 'Google+'
    }
  ];

  public brandBoxChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public brandBoxChartOptions: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false,
      }],
      yAxes: [{
        display: false,
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: false
    }
  };
  public brandBoxChartColours: Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.1)',
      borderColor: 'rgba(255,255,255,.55)',
      pointHoverBackgroundColor: '#fff'
    }
  ];
  public brandBoxChartLegend = false;
  public brandBoxChartType = 'line';

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  listaUsuario: []



  async ngOnInit() {
    console.log("Sockect : ", this.ws.wsk );
    if (this.ws.wsk == undefined) {
      this.ws.instanciar()
      
    }
    this.conectar()

  }

  async conectar() {
    this.ws.wsk.subscribe(
      msg => {
        console.log('message : ', msg)

        if (msg.lst != undefined) {
          this.ws.lst$.emit(msg.lst)
        } else {
          this.ws.lst$.emit(msg.contenido)
        }

        this.ws.estatusText$.emit(msg.msj)
      },
      err => {

        console.log("Despues de 10 segundo se intentara conectar nuevamente")
        this.ws.lst$.emit([])
        this.ws.estatusText$.emit('se intentara conectar nuevamente')

        // timer(10000).subscribe(e => {
        //   this.conectar()
        // })

      },
      () => console.log('complete')
    );
  }



  irA(base: string, ruta: string) {
    this.ruta.navigate([base, ruta])
  }


}
