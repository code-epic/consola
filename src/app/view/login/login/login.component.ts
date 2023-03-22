import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IToken, LoginService } from '../../../service/seguridad/login.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';



@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit{
  redirectDelay: number;
  showMessages: any;
  strategy: string;
  errors: string[];
  messages: string[];
  usuario : string;
  clave: string;

  submitted: boolean;
  rememberMe: boolean;

  loading = false;
  isHidden: boolean = true;
  public iToken: IToken = {
    token: '',
  };

  public itk: IToken;
  private index: number = 0;

  version = "1.0.0"
  fecha = ""

  constructor(private router: Router, private loginService: LoginService, private toastrService: ToastrService){
    if (sessionStorage.getItem("token") != undefined ){
      this.router.navigate(['principal']);
    }
  }

  ngOnInit() {
    this.version = environment.version
    this.fecha = environment.fecha
  }


  async login(position, status){
    this.loading = true;
    await this.loginService.getLogin(this.usuario, this.clave).subscribe(
      (data) => { // Success
        this.itk = data;
        sessionStorage.setItem("token", this.itk.token );
        this.loading = false;
        this.isHidden = false;
        this.router.navigate(['principal']);

      },
      (error) => {
        this.loading = false;
        this.isHidden = false;

        this.toastrService.error(
          'Error al acceder a los datos de conexion',
          `Bus Empresarial`
        );
      }
    );
  }


}
