<script lang="ts">
	import { ShieldAlert } from '@lucide/svelte';

	interface IParticle {
		alpha	: number;
		color	: string;
		decay	: number;
		radius	: number;
		speedX	: number;
		speedY	: number;
		x		: number;
		y		: number;
	}

	let canvasElement: HTMLCanvasElement | null = $state( null );
	let mouseX: number                         = $state( typeof window !== 'undefined' ? window.innerWidth / 2 : 0 );
	let mouseY: number                         = $state( typeof window !== 'undefined' ? window.innerHeight / 2 : 0 );

	const particleColors: string[] = [ '#00e676', '#10b981', '#69f0ae', '#34d399', '#059669' ];

	function createParticle( width: number, height: number ): IParticle {
		return ({
			alpha	: Math.random() * 0.7 + 0.3,
			color	: particleColors[ Math.floor( Math.random() * particleColors.length ) ],
			decay	: Math.random() * 0.005 + 0.002,
			radius	: Math.random() * 2.2 + 0.8,
			speedX	: ( Math.random() - 0.5 ) * 0.8,
			speedY	: -( Math.random() * 1.2 + 0.5 ),
			x		: Math.random() * width,
			y		: Math.random() * height + height * 0.2,
		});
	}

	function handleMouseMove( event: MouseEvent ): void {
		mouseX = event.clientX;
		mouseY = event.clientY;
	}

	$effect( () => {
		if ( !canvasElement ) {
			return;
		}

		const canvas: HTMLCanvasElement = canvasElement;
		const ctx: CanvasRenderingContext2D | null = canvas.getContext( '2d' );

		if ( !ctx ) {
			return;
		}

		let animationFrameId: number;
		let width: number  = ( canvas.width = window.innerWidth );
		let height: number = ( canvas.height = window.innerHeight );

		const particlesCount: number = Math.min( 70, Math.floor( ( width * height ) / 18000 ) );
		const particles: IParticle[] = [];

		for ( let i: number = 0; i < particlesCount; i++ ) {
			particles.push( createParticle( width, height ) );
		}

		function handleResize(): void {
			if ( !canvas ) {
				return;
			}
			width  = ( canvas.width  = window.innerWidth );
			height = ( canvas.height = window.innerHeight );
		}

		function render(): void {
			if ( !ctx ) {
				return;
			}

			ctx.clearRect( 0, 0, width, height );

			for ( let i: number = 0; i < particles.length; i++ ) {
				const p: IParticle = particles[ i ];

				p.x     += p.speedX;
				p.y     += p.speedY;
				p.alpha -= p.decay;

				if ( p.y < -10 || p.alpha <= 0 ) {
					particles[ i ] = createParticle( width, height );
					particles[ i ].y = height + 10;
				}

				ctx.save();
				ctx.beginPath();
				ctx.arc( p.x, p.y, p.radius, 0, Math.PI * 2 );
				ctx.fillStyle   = p.color;
				ctx.globalAlpha = Math.max( 0, p.alpha );
				ctx.shadowBlur  = 12;
				ctx.shadowColor = p.color;
				ctx.fill();
				ctx.restore();
			}

			animationFrameId = requestAnimationFrame( render );
		}

		window.addEventListener( 'resize', handleResize );
		render();

		return () => {
			window.removeEventListener( 'resize', handleResize );
			cancelAnimationFrame( animationFrameId );
		};
	} );
</script>

<div
	role="alert"
	aria-live="assertive"
	class="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#07130c] select-none p-4"
	onmousemove={ handleMouseMove }
>
	<!-- Animated Canvas Ember Particles -->
	<canvas
		bind:this={ canvasElement }
		class="pointer-events-none absolute inset-0 h-full w-full opacity-80"
	></canvas>

	<!-- High-Tech Cyber Grid Background -->
	<div class="pointer-events-none absolute inset-0 bg-cyber-grid opacity-35"></div>
	<div class="pointer-events-none absolute inset-0 bg-radial-vignette"></div>

	<!-- Ambient Background Glows -->
	<div class="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-brand/15 blur-[120px] animate-pulse-slow"></div>
	<div class="pointer-events-none absolute -bottom-40 -right-40 h-[550px] w-[550px] rounded-full bg-brand-bright/15 blur-[130px] animate-pulse-slow-reverse"></div>
	<div class="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[650px] w-[650px] rounded-full bg-brand-dark/25 blur-[150px]"></div>

	<!-- Interactive Spotlight following cursor -->
	<div
		class="pointer-events-none absolute h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-bright/10 blur-[100px] transition-transform duration-75 ease-out"
		style="left: { mouseX }px; top: { mouseY }px;"
	></div>

	<!-- Main Futuristic Glass Card -->
	<div class="relative z-10 flex flex-col items-center justify-center max-w-3xl w-full text-center rounded-3xl border border-brand/25 bg-gradient-to-b from-brand-dark/20 via-black/50 to-black/80 px-6 py-12 sm:px-12 sm:py-16 shadow-[0_0_80px_rgba(0,230,118,0.18)] backdrop-blur-2xl overflow-hidden">
		<!-- Sci-Fi Corner Brackets -->
		<div class="pointer-events-none absolute top-3 left-3 h-5 w-5 border-t-2 border-l-2 border-brand/70"></div>
		<div class="pointer-events-none absolute top-3 right-3 h-5 w-5 border-t-2 border-r-2 border-brand/70"></div>
		<div class="pointer-events-none absolute bottom-3 left-3 h-5 w-5 border-b-2 border-l-2 border-brand/70"></div>
		<div class="pointer-events-none absolute bottom-3 right-3 h-5 w-5 border-b-2 border-r-2 border-brand/70"></div>

		<!-- Laser Scanline moving down -->
		<div class="pointer-events-none absolute inset-x-0 h-20 bg-gradient-to-b from-transparent via-brand/15 to-transparent animate-scanline"></div>

		<!-- Radar Pulse Rings & Icon Pod -->
		<div class="relative flex items-center justify-center mb-8">
			<!-- Animated Concentric Pulse Waves -->
			<div class="absolute h-48 w-48 rounded-full border border-brand/30 animate-radar-1 pointer-events-none"></div>
			<div class="absolute h-64 w-64 rounded-full border border-brand/20 animate-radar-2 pointer-events-none"></div>
			<div class="absolute h-80 w-80 rounded-full border border-brand-bright/15 animate-radar-3 pointer-events-none"></div>

			<!-- Rotating HUD Rings -->
			<div class="absolute h-32 w-32 sm:h-36 sm:w-36 rounded-full border-2 border-dashed border-brand/30 animate-spin-slow pointer-events-none"></div>
			<div class="absolute h-36 w-36 sm:h-40 sm:w-40 rounded-full border border-brand/15 animate-reverse-spin pointer-events-none"></div>

			<!-- Central Icon Pod with Glass Shield -->
			<div class="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-3xl bg-gradient-to-b from-brand/25 via-brand-dark/50 to-black/70 border border-brand/50 shadow-[0_0_40px_rgba(0,230,118,0.35)] backdrop-blur-xl">
				<div class="absolute inset-0 rounded-3xl bg-brand/15 animate-ping-slow pointer-events-none"></div>
				<div class="animate-icon-float flex items-center justify-center">
					<ShieldAlert class="h-10 w-10 sm:h-12 sm:w-12 text-brand drop-shadow-[0_0_15px_rgba(0,230,118,0.9)]" />
				</div>
			</div>
		</div>

		<!-- Status Pill Badge -->
		<div class="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-brand-dark/70 border border-brand/40 shadow-[0_0_20px_rgba(0,230,118,0.25)] backdrop-blur-md mb-6">
			<span class="relative flex h-2.5 w-2.5">
				<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-bright opacity-75"></span>
				<span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand shadow-[0_0_8px_var(--color-brand)]"></span>
			</span>
			<span class="text-xs sm:text-sm font-black uppercase tracking-widest text-brand-bright font-display">
				Aviso de Seguridad
			</span>
		</div>

		<!-- Hero Message with Shimmer Gradient Effect -->
		<div class="relative px-2 py-1">
			<h1 class="text-3xl sm:text-5xl md:text-6xl font-black font-display tracking-tight text-transparent bg-clip-text animate-shimmer-text leading-tight">
				El servicio ha sido suspendido
			</h1>

			<!-- Bottom Soft Ambient Glow -->
			<div class="pointer-events-none absolute -bottom-3 left-1/2 -translate-x-1/2 h-4 w-3/4 bg-brand/25 blur-xl rounded-full"></div>
		</div>

		<!-- High-Tech Activity Equalizer -->
		<div class="flex items-center justify-center gap-1.5 mt-8 opacity-80">
			<div class="w-1 h-3 rounded-full bg-brand/50 animate-eq-1"></div>
			<div class="w-1 h-6 rounded-full bg-brand/80 animate-eq-2"></div>
			<div class="w-1 h-4 rounded-full bg-brand/60 animate-eq-3"></div>
			<div class="w-1 h-7 rounded-full bg-brand-bright animate-eq-4"></div>
			<div class="w-1 h-5 rounded-full bg-brand/70 animate-eq-5"></div>
			<div class="w-1 h-3 rounded-full bg-brand/50 animate-eq-1"></div>
		</div>
	</div>
</div>

<style>
	/* Cyber grid background */
	.bg-cyber-grid {
		background-image :
			linear-gradient( to right, rgba( 0, 230, 118, 0.08 ) 1px, transparent 1px ),
			linear-gradient( to bottom, rgba( 0, 230, 118, 0.08 ) 1px, transparent 1px );
		background-size  : 48px 48px;
	}

	/* Radial vignette mask */
	.bg-radial-vignette {
		background : radial-gradient( circle at 50% 50%, transparent 20%, rgba( 7, 19, 12, 0.85 ) 70%, #07130c 100% );
	}

	/* Shimmer text animation */
	@keyframes shimmerText {
		0% {
			background-position : 0% 50%;
		}
		50% {
			background-position : 100% 50%;
		}
		100% {
			background-position : 0% 50%;
		}
	}

	.animate-shimmer-text {
		background-image : linear-gradient( 90deg, #ffffff 0%, #a7f3d0 20%, #10b981 40%, #00e676 60%, #a7f3d0 80%, #ffffff 100% );
		background-size  : 250% auto;
		animation        : shimmerText 5s ease-in-out infinite;
		filter           : drop-shadow( 0 0 25px rgba( 0, 230, 118, 0.45 ) );
	}

	/* Radar wave expansions */
	@keyframes radarPulse {
		0% {
			transform : scale( 0.6 );
			opacity   : 0.8;
		}
		100% {
			transform : scale( 1.6 );
			opacity   : 0;
		}
	}

	.animate-radar-1 {
		animation : radarPulse 3s cubic-bezier( 0.2, 0.8, 0.2, 1 ) infinite;
	}

	.animate-radar-2 {
		animation : radarPulse 3s cubic-bezier( 0.2, 0.8, 0.2, 1 ) infinite 1s;
	}

	.animate-radar-3 {
		animation : radarPulse 3s cubic-bezier( 0.2, 0.8, 0.2, 1 ) infinite 2s;
	}

	/* Slow spin for HUD rings */
	@keyframes spinSlow {
		from {
			transform : rotate( 0deg );
		}
		to {
			transform : rotate( 360deg );
		}
	}

	@keyframes reverseSpin {
		from {
			transform : rotate( 360deg );
		}
		to {
			transform : rotate( 0deg );
		}
	}

	.animate-spin-slow {
		animation : spinSlow 20s linear infinite;
	}

	.animate-reverse-spin {
		animation : reverseSpin 25s linear infinite;
	}

	/* Breathing floating icon */
	@keyframes iconFloat {
		0%, 100% {
			transform : translateY( 0 ) scale( 1 );
		}
		50% {
			transform : translateY( -4px ) scale( 1.05 );
		}
	}

	.animate-icon-float {
		animation : iconFloat 3s ease-in-out infinite;
	}

	/* Ambient pulse glows */
	@keyframes pulseSlow {
		0%, 100% {
			opacity   : 0.15;
			transform : scale( 1 );
		}
		50% {
			opacity   : 0.28;
			transform : scale( 1.1 );
		}
	}

	.animate-pulse-slow {
		animation : pulseSlow 7s ease-in-out infinite;
	}

	.animate-pulse-slow-reverse {
		animation : pulseSlow 9s ease-in-out infinite 3.5s;
	}

	@keyframes pingSlow {
		0% {
			transform : scale( 1 );
			opacity   : 0.6;
		}
		75%, 100% {
			transform : scale( 1.4 );
			opacity   : 0;
		}
	}

	.animate-ping-slow {
		animation : pingSlow 3s cubic-bezier( 0, 0, 0.2, 1 ) infinite;
	}

	/* Scanline vertical laser animation */
	@keyframes scanlineMove {
		0% {
			transform : translateY( -100% );
		}
		100% {
			transform : translateY( 600% );
		}
	}

	.animate-scanline {
		animation : scanlineMove 4s linear infinite;
	}

	/* Tech Equalizer Bars */
	@keyframes eqHeight {
		0%, 100% {
			transform : scaleY( 0.3 );
		}
		50% {
			transform : scaleY( 1 );
		}
	}

	.animate-eq-1 {
		animation : eqHeight 1.2s ease-in-out infinite;
	}

	.animate-eq-2 {
		animation : eqHeight 1.5s ease-in-out infinite 0.2s;
	}

	.animate-eq-3 {
		animation : eqHeight 1.1s ease-in-out infinite 0.4s;
	}

	.animate-eq-4 {
		animation : eqHeight 1.7s ease-in-out infinite 0.1s;
	}

	.animate-eq-5 {
		animation : eqHeight 1.3s ease-in-out infinite 0.3s;
	}
</style>
