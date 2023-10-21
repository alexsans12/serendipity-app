import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { UsersComponent } from './users/users.component';
import { UserComponent } from './user/user.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

@NgModule({
	declarations: [UsersComponent, UserComponent, UserDetailComponent],
	imports: [SharedModule],
	exports: [UsersComponent],
})
export class UsersModule {}
