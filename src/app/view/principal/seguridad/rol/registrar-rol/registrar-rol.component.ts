import { Component, OnInit, Injectable, Output, EventEmitter } from '@angular/core';
import { ApiService, IAPICore } from '../../../../../service/apicore/api.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ModalRolComponent } from '../modal-rol/modal-rol.component';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Aplicacion, IRol, Menu, SubMenu, Privilegios, IModulo } from '../../../../../service/seguridad/rol.service'


@Component({
  selector: 'app-registrar-rol',
  templateUrl: './registrar-rol.component.html',
  styleUrls: ['./registrar-rol.component.scss'],
})
export class RegistrarRolComponent implements OnInit {


  public xApp = []
  public xMen = [] //Listado General de Menu



  public xAplicacion: Aplicacion = {
    nombre: '',
    url: '',
    comentario: '',
    version: '',
    autor: ''
  }

  public xRol: IRol = {
    nombre: '',
    descripcion: '',
    Modulo: []
  };


  public xModulo: IModulo = {
    nombre: '',
    Menu: []
  }



  public xMenu: Menu = {
    url: '',
    js: '',
    icono: '',
    descripcion: '',
    nombre: '',
    accion: '',
    clase: '',
    color: ''
  }

  userProfileForm = new FormGroup({
    nombre: new FormControl(''),
  });

  public xAPI: IAPICore = {
    funcion: '',
    relacional: false,
    concurrencia: false,
    retorna: false,
    migrar: false,
    parametros: '',
    modulo: '',
    valores: {},
    logs: false,
    cache: 0,
    estatus: false
  };

  aplicacion: string = ''
  descripcion: string = ''
  // xcheckbox :string = ''
  rowDataAcc: any
  rowDataSub: any
  closeResult: string = ''

  keyword = 'name'
  dataModulo = []
  datamenu = []

  public Roles = []
  public PushListPrivilegio = []
  public XListApp: {}
  // public xcheckbox = []

  colormenu = "btn-success"
  modulo: string = ''
  xmodulo: string = ''
  moduloid: string = ''
  menu: string = '' //id
  submenu: string = '' //id
  menuid: string = ''
  accionid: string = ''
  xcheckbox: boolean = false
  xmenu: string = '' //nombre
  xnombre: string = '' //nombre
  xurl: string = ''
  xjs: string = ''
  xcss: string = ''
  xcolor: string = ''
  xicono: string = ''

  xestatus: string = '1'

  metodo: string = '0'
  nombre: string = ''
  funcion: string = ''
  endpoint: string = ''
  directiva: string = ''
  isDisabled: boolean = false
  isBtnDisable: boolean = true
  isDisabledAdjunt: boolean = true

  divSubAcciones = 'none'
  private bGuardar: boolean = false
  lstApps: any;


  constructor(private apiService: ApiService, private modalService: NgbModal) { }

  @Output() evenData = new EventEmitter<any>();

  ngOnInit(): void {
    this.lstAplicaciones()
  }

 
  async lstAplicaciones() {
    this.xAPI.funcion = "LstAplicaciones";
    this.xAPI.valores =  ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.lstApps = data.Cuerpo
      },
      (error) => {
        console.error(error)
      }
    )
  }


  Adjuntar() {
    this.isDisabled = true
    this.isBtnDisable = false
    var xpri = []
    var menu: any

    this.rowDataAcc.forEach(e => {
       
      menu = {
        nombre: e.nomb,
        js: e.js,
        url: e.url,
        icono: e.icon
      }
    })

    this.xMenu = menu
    this.xMenu.Privilegios = xpri

    this.xModulo.Menu.push(this.xMenu)

    let listApp = this.lstApps[this.aplicacion.split('|')[0]];
    let listModule = this.dataModulo[this.xmodulo.split('|')[0]];
    let listMenu = this.datamenu[this.menu.split('|')[0]];

    var ObjRol = {
      'aplicacion': listApp.nomb,
      'nombre': this.nombre,
      'descripcion': this.descripcion,
      'modulo': listModule.name,
      'menu': listMenu.name,
      // 'privilegios' : this.rowDataAcc,
    }
    this.Roles.push(ObjRol)

  }

  deleteMsg(msg: string) {
    this.Roles.pop()
    this.isBtnDisable = true
  }

  LimpiarForm(msg: any) {
    for (let i = this.Roles.length; i > 0; i--) {
      this.Roles.pop()
    }
    this.aplicacion = ''
    this.nombre = ''
    this.descripcion = ''
    this.xmodulo = ''
    this.menu = ''
    this.rowDataAcc = ['']
    this.isDisabledAdjunt = true
    this.isDisabled = false
    this.isBtnDisable = true

  }


  Salvar(): any {
    this.xModulo.nombre = this.xmodulo
    this.xRol.nombre = this.nombre
    this.xRol.descripcion = this.descripcion
    this.xRol.Modulo.push(this.xModulo)
    this.xAplicacion.nombre = this.aplicacion
    this.xAplicacion.Rol = this.xRol
    console.info(this.xAplicacion)
  }

  EditarRol(i: any) {
    console.warn(i)
  }

  openModlaLg(content, itemRol) {
    this.modalService.open(ModalRolComponent, { centered: true, size: 'lg', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  ViewModal(itemRol) {
    this.evenData.emit(itemRol)
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

  selModulo(): void {
    this.xAPI.funcion = "LstModulos";
    this.xAPI.parametros = this.aplicacion.split('|')[1];
    this.dataModulo = [];
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.dataModulo = data.Cuerpo.map( e => {
          e.name =  e.nomb
          return e
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }

  selectEventModulo(item) {
    this.moduloid = item.id;
    this.modulo = item.name;
    this.consultarMenu()
  }


  selectEventMenu(item) {
    this.menu = item.name
    this.menuid = item.id
  }


  selectEventUrl(item) {
    this.xurl = item.name;
  }

  consultarMenu(acc: string = '') {
    this.xAPI.funcion = "LstMenus"
    this.xAPI.parametros = acc.split('|')[1];
    this.xnombre = this.menu
    this.datamenu = []
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.forEach(e => {
          this.datamenu.push({ id: e.id, name: e.nomb });
          this.isDisabledAdjunt = false
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }

  OMenuAccion(menuId: string = '') {
    this.bGuardar = true
    this.colormenu = "btn-warning"
    if (menuId == '') {
      this.xnombre = this.menu
      this.colormenu = "btn-success"
      return
    }
    this.xAPI.funcion = "OMenuAccion"
    this.xAPI.parametros = menuId
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        var i = 0
        var lista = []
        data.Cuerpo.forEach(e => {
          if (i == 0) {
            this.xnombre = e.nomb
            this.xurl = e.url
            this.xjs = e.js
            this.xcss = e.clase
            //this.xicon = e.icon
            //this.xcolor  = e.color
            this.xestatus = e.type
          }
          if (e.endpoint != undefined) {
            lista.push(e)
          }

        });

        this.rowDataAcc = lista;
      },
      (error) => {
        console.log('')
      }
    )
  }

  activar(i: number, event) {
    this.rowDataAcc[i].active = event.target.checked    
  }


}
