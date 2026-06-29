<script lang="ts">
	import { slide }    from 'svelte/transition';
	import { Send }     from '@lucide/svelte';

	import { formatCLP } from '$lib/utils/price';

	interface FormErrors {
		companyName	: string;
		rut			: string;
		contactName	: string;
		email		: string;
		address		: string;
		phoneNumber	: string;
	}

	interface DataFormProps {
		companyName		: string;
		rut				: string;
		contactName		: string;
		email			: string;
		address			: string;
		phoneNumber		: string;
		isSubmitting	: boolean;
		submitError		: string;
		hasSomePrice	: boolean;
		estimatedTotal	: number;
		onsubmit		: ( ) => void;
	}

	let {
		companyName		= $bindable( '' ),
		rut				= $bindable( '' ),
		contactName		= $bindable( '' ),
		email			= $bindable( '' ),
		address			= $bindable( '' ),
		phoneNumber		= $bindable( '' ),
		isSubmitting,
		submitError,
		hasSomePrice,
		estimatedTotal,
		onsubmit,
	} : DataFormProps = $props();

	let errors = $state<FormErrors>( {
		companyName	: '',
		rut			: '',
		contactName	: '',
		email		: '',
		address		: '',
		phoneNumber	: '',
	} );

	function validateEmail( emailVal: string ): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test( emailVal );
	}

	function validateRut( fullRut: string ): boolean {
		const cleanRut = fullRut.replace( /[^0-9kK]/g, '' );
		if ( cleanRut.length < 8 ) {
			return false;
		}

		const body = cleanRut.slice( 0, -1 );
		const dv = cleanRut.slice( -1 ).toUpperCase();

		let sum = 0;
		let multiplier = 2;

		for ( let i = body.length - 1; i >= 0; i-- ) {
			sum += parseInt( body.charAt( i ) ) * multiplier;
			multiplier = ( multiplier < 7 ) ? multiplier + 1 : 2;
		}

		const expectedDv = 11 - ( sum % 11 );
		const calculatedDv = ( expectedDv === 11 ) ? '0' : ( expectedDv === 10 ) ? 'K' : expectedDv.toString();

		return dv === calculatedDv;
	}

	function formatRut( value: string ): string {
		let clean = value.replace( /[^0-9kK]/g, '' );
		if ( clean.length > 9 ) {
			clean = clean.slice( 0, 9 );
		}
		if ( clean.length === 0 ) {
			return '';
		}
		if ( clean.length === 1 ) {
			return clean.toUpperCase();
		}

		const body = clean.slice( 0, -1 );
		const dv = clean.slice( -1 ).toUpperCase();

		let formattedBody = '';
		const reversed = body.split( '' ).reverse().join( '' );
		const blocks = [ ];
		for ( let i = 0; i < reversed.length; i += 3 ) {
			blocks.push( reversed.slice( i, i + 3 ) );
		}
		formattedBody = blocks.join( '.' ).split( '' ).reverse().join( '' );

		return `${ formattedBody }-${ dv }`;
	}

	function handleRutInput( e: Event ): void {
		const target = e.target as HTMLInputElement;
		rut = formatRut( target.value );
		errors.rut = '';
	}

	function validateField( field: keyof FormErrors ): boolean {
		if ( field === 'companyName' ) {
			if ( !companyName.trim() ) {
				errors.companyName = 'La razón social es requerida';
				return false;
			}
			errors.companyName = '';
			return true;
		}

		if ( field === 'rut' ) {
			if ( !rut.trim() ) {
				errors.rut = 'El RUT es requerido';
				return false;
			}
			if ( !validateRut( rut ) ) {
				errors.rut = 'El RUT ingresado no es válido';
				return false;
			}
			errors.rut = '';
			return true;
		}

		if ( field === 'contactName' ) {
			if ( !contactName.trim() ) {
				errors.contactName = 'El nombre de contacto es requerido';
				return false;
			}
			errors.contactName = '';
			return true;
		}

		if ( field === 'email' ) {
			if ( !email.trim() ) {
				errors.email = 'El correo electrónico es requerido';
				return false;
			}
			if ( !validateEmail( email ) ) {
				errors.email = 'El correo electrónico no es válido';
				return false;
			}
			errors.email = '';
			return true;
		}

		if ( field === 'phoneNumber' ) {
			if ( !phoneNumber.trim() ) {
				errors.phoneNumber = 'El teléfono de contacto es requerido';
				return false;
			}
			const phoneRegex = /^[2-9]\d{8}$/;
			if ( !phoneRegex.test( phoneNumber.trim() ) ) {
				errors.phoneNumber = 'El teléfono debe tener 9 dígitos (ej: 912345678)';
				return false;
			}
			errors.phoneNumber = '';
			return true;
		}

		if ( field === 'address' ) {
			if ( !address.trim() ) {
				errors.address = 'La dirección es requerida';
				return false;
			}
			errors.address = '';
			return true;
		}

		return true;
	}

	function handleBlur( field: keyof FormErrors ): void {
		validateField( field );
	}

	function handleInput( field: keyof FormErrors ): void {
		errors[ field ] = '';
	}

	function handleSubmit( e: Event ): void {
		e.preventDefault();

		const isCompanyValid = validateField( 'companyName' );
		const isRutValid     = validateField( 'rut' );
		const isContactValid = validateField( 'contactName' );
		const isEmailValid   = validateField( 'email' );
		const isPhoneValid   = validateField( 'phoneNumber' );
		const isAddressValid = validateField( 'address' );

		if ( isCompanyValid && isRutValid && isContactValid && isEmailValid && isPhoneValid && isAddressValid ) {
			onsubmit();
		}
	}
</script>

<form onsubmit={ handleSubmit } novalidate class="space-y-4">
	<!-- Razón Social -->
	<div class="space-y-1">
		<label for="companyName" class="block text-[10px] font-black uppercase tracking-wider text-text-muted">
			Razón Social *
		</label>
		<input
			id="companyName"
			type="text"
			placeholder="Ej: Empresa GlobalCet S.A."
			bind:value={ companyName }
			oninput={ ( ) => handleInput( 'companyName' ) }
			onblur={ ( ) => handleBlur( 'companyName' ) }
			class="
				w-full rounded-xl border px-4 py-2.5 text-xs text-text outline-none transition-all duration-300
				{ errors.companyName
					? 'border-red-500 bg-red-500/5 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
					: 'border-brand/20 bg-input focus:border-brand focus:bg-card focus:ring-4 focus:ring-brand/10'
				}
			"
		/>
		{#if ( errors.companyName )}
			<p transition:slide={ { duration : 200 } } class="text-red-400 text-[10px] font-bold mt-1 uppercase tracking-wider">
				{ errors.companyName }
			</p>
		{/if}
	</div>

	<!-- RUT -->
	<div class="space-y-1">
		<label for="rut" class="block text-[10px] font-black uppercase tracking-wider text-text-muted">
			RUT *
		</label>
		<input
			id="rut"
			type="text"
			placeholder="Ej: 77.777.777-7"
			value={ rut }
			oninput={ handleRutInput }
			onblur={ ( ) => handleBlur( 'rut' ) }
			class="
				w-full rounded-xl border px-4 py-2.5 text-xs text-text outline-none transition-all duration-300
				{ errors.rut
					? 'border-red-500 bg-red-500/5 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
					: 'border-brand/20 bg-input focus:border-brand focus:bg-card focus:ring-4 focus:ring-brand/10'
				}
			"
		/>
		{#if ( errors.rut )}
			<p transition:slide={ { duration : 200 } } class="text-red-400 text-[10px] font-bold mt-1 uppercase tracking-wider">
				{ errors.rut }
			</p>
		{/if}
	</div>

	<!-- Nombre Contacto -->
	<div class="space-y-1">
		<label for="contactName" class="block text-[10px] font-black uppercase tracking-wider text-text-muted">
			Nombre de Contacto *
		</label>
		<input
			id="contactName"
			type="text"
			placeholder="Ej: Juan Pérez"
			bind:value={ contactName }
			oninput={ ( ) => handleInput( 'contactName' ) }
			onblur={ ( ) => handleBlur( 'contactName' ) }
			class="
				w-full rounded-xl border px-4 py-2.5 text-xs text-text outline-none transition-all duration-300
				{ errors.contactName
					? 'border-red-500 bg-red-500/5 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
					: 'border-brand/20 bg-input focus:border-brand focus:bg-card focus:ring-4 focus:ring-brand/10'
				}
			"
		/>
		{#if ( errors.contactName )}
			<p transition:slide={ { duration : 200 } } class="text-red-400 text-[10px] font-bold mt-1 uppercase tracking-wider">
				{ errors.contactName }
			</p>
		{/if}
	</div>

	<!-- Correo Electrónico -->
	<div class="space-y-1">
		<label for="email" class="block text-[10px] font-black uppercase tracking-wider text-text-muted">
			Correo Electrónico *
		</label>
		<input
			id="email"
			type="email"
			placeholder="Ej: contacto@globalcet.cl"
			bind:value={ email }
			oninput={ ( ) => handleInput( 'email' ) }
			onblur={ ( ) => handleBlur( 'email' ) }
			class="
				w-full rounded-xl border px-4 py-2.5 text-xs text-text outline-none transition-all duration-300
				{ errors.email
					? 'border-red-500 bg-red-500/5 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
					: 'border-brand/20 bg-input focus:border-brand focus:bg-card focus:ring-4 focus:ring-brand/10'
				}
			"
		/>
		{#if ( errors.email )}
			<p transition:slide={ { duration : 200 } } class="text-red-400 text-[10px] font-bold mt-1 uppercase tracking-wider">
				{ errors.email }
			</p>
		{/if}
	</div>

	<!-- Teléfono de Contacto -->
	<div class="space-y-1">
		<label for="phoneNumber" class="block text-[10px] font-black uppercase tracking-wider text-text-muted">
			Teléfono de Contacto *
		</label>
		<input
			id="phoneNumber"
			type="tel"
			placeholder="Ej: 912345678"
			bind:value={ phoneNumber }
			oninput={ ( ) => handleInput( 'phoneNumber' ) }
			onblur={ ( ) => handleBlur( 'phoneNumber' ) }
			class="
				w-full rounded-xl border px-4 py-2.5 text-xs text-text outline-none transition-all duration-300
				{ errors.phoneNumber
					? 'border-red-500 bg-red-500/5 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
					: 'border-brand/20 bg-input focus:border-brand focus:bg-card focus:ring-4 focus:ring-brand/10'
				}
			"
		/>
		{#if ( errors.phoneNumber )}
			<p transition:slide={ { duration : 200 } } class="text-red-400 text-[10px] font-bold mt-1 uppercase tracking-wider">
				{ errors.phoneNumber }
			</p>
		{/if}
	</div>

	<!-- Dirección -->
	<div class="space-y-1">
		<label for="address" class="block text-[10px] font-black uppercase tracking-wider text-text-muted">
			Dirección *
		</label>
		<input
			id="address"
			type="text"
			placeholder="Ej: Av. Providencia 1234, Oficina 501"
			bind:value={ address }
			oninput={ ( ) => handleInput( 'address' ) }
			onblur={ ( ) => handleBlur( 'address' ) }
			class="
				w-full rounded-xl border px-4 py-2.5 text-xs text-text outline-none transition-all duration-300
				{ errors.address
					? 'border-red-500 bg-red-500/5 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
					: 'border-brand/20 bg-input focus:border-brand focus:bg-card focus:ring-4 focus:ring-brand/10'
				}
			"
		/>
		{#if ( errors.address )}
			<p transition:slide={ { duration : 200 } } class="text-red-400 text-[10px] font-bold mt-1 uppercase tracking-wider">
				{ errors.address }
			</p>
		{/if}
	</div>

	<!-- Quote Totals Breakdown -->
	<div class="mt-6 pt-4 border-t border-brand/15 space-y-2">
		{#if ( hasSomePrice )}
			<div class="flex items-center justify-between">
				<span class="text-xs font-semibold text-text-muted">Total Estimado:</span>
				<span class="text-xl font-black text-brand-bright font-mono">
					{ formatCLP( estimatedTotal ) }
				</span>
			</div>
			<p class="text-[9px] text-text-muted leading-relaxed">
				* El total estimado solo suma los productos que tienen precio asignado. No incluye los elementos marcados "Por Cotizar".
			</p>
		{:else}
			<div class="flex items-center justify-between">
				<span class="text-xs font-semibold text-text-muted">Total:</span>
				<span class="text-sm font-bold text-text-muted italic">Por Cotizar</span>
			</div>
			<p class="text-[9px] text-text-muted leading-relaxed">
				* Todos los elementos seleccionados requieren validación de precio. El total final te será enviado por correo.
			</p>
		{/if}
	</div>

	<!-- Submit error message -->
	{#if ( submitError )}
		<div class="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs font-semibold text-red-700 dark:text-red-400">
			{ submitError }
		</div>
	{/if}

	<!-- Submit Button -->
	<button
		type="submit"
		disabled={ isSubmitting }
		class="
			w-full rounded-xl bg-brand text-surface-dark py-3 px-6 mt-4
			text-xs font-black uppercase tracking-wider text-center
			hover:bg-brand-bright hover:scale-[1.01] active:scale-95
			disabled:opacity-50 disabled:cursor-not-allowed
			transition-all duration-300 shadow-md shadow-brand/10 cursor-pointer
			flex items-center justify-center gap-2
		"
	>
		{#if ( isSubmitting )}
			<span class="h-4 w-4 animate-spin rounded-full border-2 border-surface-dark border-t-transparent"></span>
			<span>Procesando...</span>
		{:else}
			<Send class="size-3.5" />
			<span>Enviar Solicitud de Cotización</span>
		{/if}
	</button>
</form>
