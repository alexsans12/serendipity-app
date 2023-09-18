import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FooterModule } from '../footer/footer.module';
import { NavbarModule } from '../navbar/navbar.module';
import { ProductListComponent } from './product-list/product-list.component';
import { ShopRoutingModule } from './shop-routing.module';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { BrandListComponent } from './brand-list/brand-list.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { WishListComponent } from './wish-list/wish-list.component';

@NgModule({
	declarations: [ProductListComponent, ProductDetailsComponent, CategoryListComponent, BrandListComponent, ShoppingCartComponent, WishListComponent],
	imports: [SharedModule, ShopRoutingModule, NavbarModule, FooterModule],
})
export class UsuarioModule {}
