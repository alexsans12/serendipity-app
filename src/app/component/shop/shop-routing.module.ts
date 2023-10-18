import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { WishListComponent } from './wish-list/wish-list.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailsComponent } from './order-details/order-details.component';

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
				path: 'shop/product/:sku',
				component: ProductDetailsComponent
			},
			{
				path: 'shop/cart',
				component: ShoppingCartComponent
			},
			{
				path: 'wishlist',
				component: WishListComponent
			},
			{
				path: 'checkout',
				component: PaymentMethodComponent
			},
			{
				path: 'orders',
				component: OrdersComponent
			},
			{
				path: 'order/:id',
				component: OrderDetailsComponent
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
