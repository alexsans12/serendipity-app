import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from '../interceptor/token.interceptor';
import { CacheInterceptor } from '../interceptor/cache.interceptor';
import { UsuarioService } from '../service/usuario.service';
import { HttpCacheService } from '../service/http.cache.service';
import { NotificationService } from '../service/notificacion.service';
import { ProductoService } from '../service/producto.service';

@NgModule({
	imports: [
		HttpClientModule
	],
	providers: [
		UsuarioService,
		ProductoService,
		HttpCacheService,
		NotificationService,
		{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
	],
})
export class CoreModule {}
