import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CoreModule } from './core/core.module';
import { AuthModule } from './component/auth/auth.module';
import { HomeModule } from './component/home/home.module';
import { DashboardModule } from './component/dashboard/dashboard.module';
import { UsersModule } from './component/users/users.module';
import { NotificationModule } from './notification.module';
import { ShopModule } from './component/shop/shop.module';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		CoreModule,
		AuthModule,
		HomeModule,
		ShopModule,
		DashboardModule,
		UsersModule,
		AppRoutingModule,
		NotificationModule,
		ServiceWorkerModule.register('ngsw-worker.js', {
			enabled: !isDevMode(),
			// Register the ServiceWorker as soon as the application is stable
			// or after 30 seconds (whichever comes first).
			registrationStrategy: 'registerWhenStable:30000',
		}),
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
