import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { UsersComponent } from './users/users.component';

@NgModule({
	declarations: [UsersComponent],
	imports: [SharedModule],
	exports: [UsersComponent],
})
export class UsersModule {}
