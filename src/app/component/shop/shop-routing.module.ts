import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from 'src/app/guard/authentication.guard';
import { ProductListComponent } from './product-list/product-list.component';

const shopRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				component: ProductListComponent,
				canActivate: [AuthenticationGuard],
			},
		]
	},
];

@NgModule({
	imports: [RouterModule.forChild(shopRoutes)],
	exports: [RouterModule],
})
export class ShopRoutingModule {}
