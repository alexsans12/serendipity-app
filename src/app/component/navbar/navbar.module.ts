import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { NavbarComponent } from './navbar.component';

@NgModule({
	declarations: [NavbarComponent],
	imports: [SharedModule],
	exports: [NavbarComponent],
})
export class NavbarModule {}
