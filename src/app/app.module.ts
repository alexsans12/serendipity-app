import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FormsModule } from '@angular/forms';
import { CoreModule } from './core/core.module';
import { AuthModule } from './component/auth/auth.module';
import { HomeModule } from './component/home/home.module';
import { DashboardModule } from './component/dashboard/dashboard.module';
import { UsersModule } from './component/users/users.module';

@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [
		BrowserModule,
		FormsModule,
		CoreModule,
		HttpClientModule,
		AuthModule,
		DashboardModule,
		UsersModule,
		HomeModule,
		AppRoutingModule,
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
