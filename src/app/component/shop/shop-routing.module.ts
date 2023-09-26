import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';

const shopRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'shop',
				component: ProductListComponent
			},
			{
				path: 'shop/category/:nombre',
				component: ProductListComponent
			},
			{
				path: 'shop/product/:sky',
				component: ProductDetailsComponent
			},
			{
				path: 'shop/category',
				redirectTo: 'shop',
			}
		]
	},
];

@NgModule({
	imports: [RouterModule.forChild(shopRoutes)],
	exports: [RouterModule],
})
export class ShopRoutingModule {}
