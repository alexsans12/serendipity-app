import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeComponent } from './home/home.component';
import { NavbarModule } from '../navbar/navbar.module';
import { HeroComponent } from './hero/hero.component';
import { FooterModule } from '../footer/footer.module';

@NgModule({
	declarations: [
		HomeComponent,
		HeroComponent
	],
	imports: [
		SharedModule,
		HomeRoutingModule,
		NavbarModule,
		FooterModule
	]
})
export class HomeModule {}
