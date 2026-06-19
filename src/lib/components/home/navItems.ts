export interface SubMenuItem {
	title       : string;
	href        : string;
	description : string;
	icon?       : string;
}


export const navItems: SubMenuItem[] = [
    {
        title       : 'Fundamentos',
        href        : '/fundamentals',
        description : 'Ejes fundamentales para la implementación de laboratorios de ciencias.',
        icon        : '🧬',
    },
    {
        title       : 'Código de Ética',
        href        : '/code-ethics',
        description : 'Nuestros compromisos normativos, equidad de género y sellos corporativos.',
        icon        : '🛡️',
    },
    {
        title       : 'Términos Comerciales',
        href        : '/commercial-terms',
        description : 'Términos de servicio, cotizaciones y políticas de entrega.',
        icon        : '📄',
    },
];


export const ourItems: SubMenuItem[] = [
    {
        title       : 'Misión & Visión',
        href        : '/vision-mission',
        description : 'Nuestra misión, visión y reseña de trayectoria fundacional.',
        icon        : '🎯',
    },
    {
        title       : 'Infraestructura',
        href        : '/infrastructure',
        description : 'Conoce las instalaciones y capacidades operativas de GlobalCET.',
        icon        : '🏢',
    },
];
