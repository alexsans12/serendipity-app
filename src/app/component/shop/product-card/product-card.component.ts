import { Component, Input } from '@angular/core';
import { Producto } from 'src/app/interface/producto';

@Component({
	selector: 'app-product-card',
	templateUrl: './product-card.component.html',
	styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
	@Input() producto: Producto;
}
