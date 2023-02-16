import { Component, OnInit } from '@angular/core';




import { ComunicacionesService } from '../../../../service/comunicaciones/comunicaciones.service';
import { WsocketsService } from '../../../../service/websockets/wsockets.service';
import { MonitorestatusComponent } from './monitorestatus/monitorestatus.component';

import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-monitoreo',
  templateUrl: './monitoreo.component.html',
  styleUrls: ['./monitoreo.component.scss']
})

export class MonitoreoComponent implements OnInit {

  columnDefsServer = [
    { field: "host",  width: 130, headerName: 'IP/Host'},
    { field: "descripcion",  width: 140},
    { field: "estatus",width: 90, cellRendererFramework: MonitorestatusComponent},
  ];

  columnDefsSwitch = [
    { field: "host",  width: 130, headerName: 'IP/Host'},
    { field: "descripcion",  width: 130},
    { field: "estatus",width: 90},
  ];

  columnDefsSistemas = [
    { field: "sistema",  width: 260},
    { field: "estatus", width: 90},
  ]

  columnDefsLog = [
    { field: "sistema"},
    { field: "estatus"},
  ]

  loadingServidores = false
  rowDataServidores = []


  data =  [ 45, 23]
  // Pie
  public pieChartLabels: string[] = [ 'Activos','Inactivos'];
  public pieChartData = [{
    label: 'My First Dataset',
    data: this.data,
    backgroundColor: [
      'rgb(54, 162, 235)',
      'rgb(77, 189, 116)',
      'rgb(248, 108, 107)'
    ],
    hoverOffset: 4
  }]
  public pieChartType = 'pie';

  rowDataSwitch = []
  rowDataSitemas = []

    // lineChart4
    public lineChart4Data: Array<any> = [
      {
        data: [4, 18, 9, 17, 34, 22, 11, 3, 15, 12, 18, 9],
        label: 'Series A'
      }
    ];
    public lineChart4Labels: Array<any> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    public lineChart4Options: any = {
      tooltips: {
        enabled: false,
        custom: CustomTooltips
      },
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          display: false,
          points: false,
        }],
        yAxes: [{
          display: false,
        }]
      },
      elements: { point: { radius: 0 } },
      legend: {
        display: false
      }
    };
    public lineChart4Colours: Array<any> = [
      {
        backgroundColor: 'transparent',
        borderColor: 'rgba(255,255,255,.55)',
        borderWidth: 2
      }
    ];
    public lineChart4Legend = false;
    public lineChart4Type = 'line';
  
  
    // barChart2
    public barChart2Data: Array<any> = [
      {
        data: [4, 18, 9, 17, 34, 22, 11, 3, 15, 12, 18, 9],
        label: 'Series A',
        barPercentage: 0.6
      }
    ];
    public barChart2Labels: Array<any> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    public barChart2Options: any = {
      tooltips: {
        enabled: false,
        custom: CustomTooltips
      },
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          display: false,
        }],
        yAxes: [{
          display: false,
          ticks: {
            beginAtZero: true,
          }
        }]
      },
      legend: {
        display: false
      }
    };
    public barChart2Colours: Array<any> = [
      {
        backgroundColor: 'rgba(0,0,0,.2)',
        borderWidth: 0
      }
    ];
    public barChart2Legend = false;
    public barChart2Type = 'bar';
  

  constructor( private comunicacionesService: ComunicacionesService, private ws : WsocketsService, 
    private ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {
    
    this.ws.lst$.subscribe( e => {
      console.log(e)
      this.rowDataServidores = e
    })
    //this.CargarServidores()
  }

  async CargarServidores(){
    this.loadingServidores = true;
    await this.comunicacionesService.Listar().subscribe(
      (data) => {
        this.rowDataServidores = data
        this.loadingServidores = false;
      },
      (error) => {
        console.log(error)
        this.loadingServidores = false;
      }
    )
  }
}
