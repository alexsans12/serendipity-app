import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { UsuarioComponent } from './usuario/usuario.component';
import { UsuarioRoutingModule } from './usuario-routing.module';
import { FooterModule } from '../footer/footer.module';
import { NavbarModule } from '../navbar/navbar.module';

@NgModule({
	declarations: [UsuarioComponent],
	imports: [SharedModule, UsuarioRoutingModule, NavbarModule, FooterModule],
})
export class UsuarioModule {}
