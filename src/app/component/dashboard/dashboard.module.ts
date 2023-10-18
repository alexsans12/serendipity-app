import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FooterModule } from '../footer/footer.module';
import { NavbarModule } from '../navbar/navbar.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { StatsComponent } from './stats/stats.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersModule } from '../users/users.module';

@NgModule({
	declarations: [DashboardComponent, StatsComponent],
	imports: [SharedModule, DashboardRoutingModule, UsersModule, NavbarModule, FooterModule],
})
export class DashboardModule {}
