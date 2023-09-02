import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExtractArrayValue } from '../pipes/extractvalue.pipe';

@NgModule({
	declarations: [
		ExtractArrayValue
	],
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
	],
	exports: [
		CommonModule,
		FormsModule,
		RouterModule
	]
})
export class SharedModule {}
