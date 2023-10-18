import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { NavbarModule } from '../navbar/navbar.module';
import { FooterModule } from '../footer/footer.module';
import { AboutUsComponent } from './about-us/about-us.component';
import { AboutRoutingModule } from './about-routing.module';

@NgModule({
	declarations: [
		AboutUsComponent
	],
	imports: [
		SharedModule,
		AboutRoutingModule,
		NavbarModule,
		FooterModule
	]
})
export class AboutModule {}
