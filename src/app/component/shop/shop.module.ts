import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FooterModule } from '../footer/footer.module';
import { NavbarModule } from '../navbar/navbar.module';
import { ProductListComponent } from './product-list/product-list.component';
import { ShopRoutingModule } from './shop-routing.module';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { WishListComponent } from './wish-list/wish-list.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { ShippingComponent } from './shipping/shipping.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailsComponent } from './order-details/order-details.component';

@NgModule({
	declarations: [ProductListComponent, ProductDetailsComponent, CategoryListComponent, ShoppingCartComponent, WishListComponent, ProductCardComponent, NotFoundComponent, PaymentMethodComponent, ShippingComponent, OrdersComponent, OrderDetailsComponent],
	imports: [SharedModule, ShopRoutingModule, NavbarModule, FooterModule],
})
export class ShopModule {}
