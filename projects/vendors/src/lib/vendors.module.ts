import { NgModule } from '@angular/core';
// import { VendorsComponent } from './vendors.component';
import { MatButtonModule } from '@angular/material/button';




@NgModule({
//  declarations: [VendorsComponent],
  imports: [MatButtonModule], 
//   exports: [VendorsComponent]
  exports: [MatButtonModule] 
})
export class VendorsModule { }
