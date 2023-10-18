import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './about-us/about-us.component';

const homeRoutes: Routes = [
	{ path: 'about-us', component: AboutUsComponent }
];

@NgModule({
	imports: [RouterModule.forChild(homeRoutes)],
	exports: [RouterModule],
})
export class AboutRoutingModule {}
