import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FooterModule } from '../footer/footer.module';
import { NavbarModule } from '../navbar/navbar.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { StatsComponent } from './stats/stats.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersModule } from '../users/users.module';
import { PedidosComponent } from './pedidos/pedidos.component';
import { ProductosComponent } from './productos/productos.component';
import { ProductoComponent } from './producto/producto.component';
import { ProductoDetailComponent } from './producto-detail/producto-detail.component';
import { PedidoDetailComponent } from './pedido-detail/pedido-detail.component';

@NgModule({
	declarations: [DashboardComponent, StatsComponent, PedidosComponent, ProductosComponent, ProductoComponent, ProductoDetailComponent, PedidoDetailComponent],
	imports: [SharedModule, DashboardRoutingModule, UsersModule, NavbarModule, FooterModule],
})
export class DashboardModule {}
