import { Component } from '@angular/core';

@Component({
  selector: 'app-page-container',
  standalone: true,
  template: `<ng-content />`,
  styles: [`
    :host {
      display: block;
      width: 100%;
      max-width: 1120px;
      margin: 0 auto;
    }
  `],
})
export class PageContainerComponent {}
