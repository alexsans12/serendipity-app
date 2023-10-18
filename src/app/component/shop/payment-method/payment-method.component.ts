import { Component, OnInit } from '@angular/core';
import {
	BehaviorSubject,
	Observable,
	catchError,
	map,
	of,
	startWith,
} from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import {
	Address,
	Cart,
	CustomHttpResponse,
	Page,
	Pay,
} from 'src/app/interface/appstates';
import { CreditCard } from 'src/app/interface/creditCard';
import { PaymentInfo } from 'src/app/interface/paymentInfo';
import { State } from 'src/app/interface/state';
import { CarritoService } from 'src/app/service/carrito.service';
import { DireccionService } from 'src/app/service/direccion.service';
import { NotificationService } from 'src/app/service/notificacion.service';
import {
	loadStripe,
	Order,
	StripeElements,
} from '@stripe/stripe-js';
import { UsuarioService } from 'src/app/service/usuario.service';
import { Router } from '@angular/router';
import { CheckoutService } from 'src/app/service/checkout.service';
import { PagoService } from 'src/app/service/pago.service';
import { EstadoPago } from '../../../enum/estado-pago.enum';
import { TipoPago } from 'src/app/enum/tipo-pago.enum';
import { PedidoService } from 'src/app/service/pedido.service';
import { EstadoPedido } from 'src/app/enum/estado-pedido.enum';
import { Direccion } from 'src/app/interface/direccion';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-payment-method',
	templateUrl: './payment-method.component.html',
	styleUrls: ['./payment-method.component.scss'],
})
export class PaymentMethodComponent implements OnInit {
	cartState$: Observable<State<CustomHttpResponse<Cart>>>;
	direccionState$: Observable<State<CustomHttpResponse<Address>>>;
	payState$: Observable<State<CustomHttpResponse<Pay>>>;
	orderState$: Observable<State<CustomHttpResponse<Order>>>;
	private dataSubject = new BehaviorSubject<CustomHttpResponse<Page>>(null);
	private isLoadingSubject = new BehaviorSubject<boolean>(false);
	isLoading$ = this.isLoadingSubject.asObservable();
	private showLogsSubject = new BehaviorSubject<boolean>(false);
	showLogs$ = this.showLogsSubject.asObservable();
	readonly DataState = DataState;
	selectedIndex: number | null = null;
	paypalEmail: string = '';
	creditCard: CreditCard = {
		cardNumber: '',
		cardExpire: '',
		cardExpMonth: '',
		cardExpYear: '',
		cardCvc: '',
	};

	prevExpireValue: string = '';
	creditCardElement: any;
	displayError: any = '';

	// Initialize Stripe
	stripe: any;
	elements: any;

	paymentInfo: PaymentInfo;

	private client_secret: string | null;

	constructor(
		private router: Router,
		private addressService: DireccionService,
		private carritoService: CarritoService,
		private usuarioService: UsuarioService,
		private checkoutService: CheckoutService,
		private pagoService: PagoService,
		private pedidoService: PedidoService,
		private notificationService: NotificationService
	) {
		this.client_secret = environment.stripe_client_key;
	}

	async ngOnInit(): Promise<void> {
		if (!this.usuarioService.isAuthenticated()) {
			this.router.navigate(['/']);
		}

		this.cartState$ = this.carritoService.cart$().pipe(
			map((response) => {
				if(response.data.carrito === null || response.data.carrito.carritoProductos.length === 0){
					this.router.navigate(['/']);
				}
				this.dataSubject.next(response);
				return { dataState: DataState.LOADED, appData: response };
			}),
			startWith({ dataState: DataState.LOADING }),
			catchError((error: string) => {
				return of({
					dataState: DataState.ERROR,
					appData: this.dataSubject.value,
					error,
				});
			})
		);

		this.direccionState$ = this.addressService.direccionesByUsuario$().pipe(
			map((response) => {
				this.dataSubject.next(response);
				return { dataState: DataState.LOADED, appData: response };
			}),
			startWith({ dataState: DataState.LOADING }),
			catchError((error: string) => {
				return of({
					dataState: DataState.ERROR,
					appData: this.dataSubject.value,
					error,
				});
			})
		);

		let initValue = this.initStripe();
		this.stripe = (await initValue).stripe;
		this.elements = (await initValue).elements;

		//setup Stripe payment form
		this.setupStripePaymentForm();
	}

	async initStripe() {
		const stripe = await loadStripe(this.client_secret);
		const elements = await stripe?.elements;
		return { stripe: stripe, elements: elements };
	}

	setupStripePaymentForm() {
		let elements: StripeElements = this.stripe.elements();
		this.creditCardElement = elements.create('card', { hidePostalCode: true });
		this.creditCardElement.mount('#card-element');
		this.creditCardElement.on('change', (event: any) => {
			this.displayError = document.getElementById('card-errors');

			if (event.complete) {
				this.displayError.textContent = '';
			} else if (event.error) {
				// show validation error
				this.displayError.textContent = event.error.message;
			}
		});
	}

	selectAddress(index: number): void {
		this.selectedIndex = index;
	}

	isPaypalValid(): boolean {
		const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

		// Test the PayPal email against the regular expression
		return emailPattern.test(this.paypalEmail);
	}

	isCardFormValid(): boolean {
		return this.displayError.textContent === "";
	}


	isFormValid(): boolean {
		return (
			(this.isPaypalValid() || this.isCardFormValid()) &&
			this.selectedIndex !== null
		);
	}

	async doOrder(): Promise<void> {
		if (!this.isFormValid() || this.selectedIndex === null) {
			// Handle form invalid case (you might want to notify the user)
			if(this.selectedIndex === null) {
				this.notificationService.onWarning("Es necesario seleccionar una dirección de envío para continuar.");
			}
			this.notificationService.onWarning("Es necesario completar el formulario de pago para continuar.");
			return;
		}

		let cart: any | null = null;

		const cartStore = this.cartState$.subscribe(state => {
			if (state.dataState === DataState.LOADED) {
				cart = state.appData?.data; // Assuming the cart data is here
			}
			// Handle other states like ERROR or LOADING as per your requirement
		});

		this.paymentInfo = {
			amount: (cart.carrito.total - cart.carrito.descuento) * 100,
			currency: "GTQ",
		};

		let address: Direccion;

		const addressStore = this.direccionState$.subscribe(state => {
			if (state.dataState === DataState.LOADED) {
				address = state.appData?.data?.direcciones[this.selectedIndex];
			}
		});

		this.checkoutService.paymentIntent$(this.paymentInfo).subscribe(
			(paymentIntentResponse) => {
				this.stripe.confirmCardPayment(paymentIntentResponse.data?.paymentIntent.clientSecret, {
					payment_method: {
						card: this.creditCardElement,
					}
				}, { handleActions: false })
				.then((result: any) => {
					if (result.error) {
						this.pagoService.createPago$(TipoPago.CARD, this.paymentInfo.amount/100, EstadoPago.RECHAZADO).subscribe(
							(pagoResponse) => {
								this.notificationService.onError("El pago no pudo ser procesado.");
							}
						);
						this.notificationService.onError(result.error.message);
					} else {
						this.pagoService.createPago$(TipoPago.CARD, this.paymentInfo.amount/100, EstadoPago.APROBADO).subscribe(
							(pagoResponse) => {
								this.pedidoService.createPedido$(pagoResponse.data?.pago.idPago, address.idDireccion, EstadoPedido.EN_PROCESO).subscribe(
									(pedidoResponse) => {
										this.notificationService.onSuccess("Pedido creado exitosamente.");
										this.router.navigate(['/']);
									}
								);
							}
						);
					}
				});
			}
		);
	}
}
