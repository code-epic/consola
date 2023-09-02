import {Component} from '@angular/core';
import { environment } from '../../../environments/environment';
import { navItems } from '../../_nav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;
  public navItems = navItems;

  version = 'Sandra Server'
  fecha = ""
  
  constructor(){
    this.version = environment.version
    this.fecha = environment.fecha

  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }


}
