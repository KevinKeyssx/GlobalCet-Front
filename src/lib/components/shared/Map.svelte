<script lang="ts">
    let {
        width       = "600",
        height      = "450",
        className   = "rounded-2xl"
    } = $props();
</script>

<iframe
    src             = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3326.535596885627!2d-70.66365022261785!3d-33.5134577733647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662dae77280f9a5%3A0xa41f77df80511943!2sPrimera%20Transversal%206370%2C%208920550%20Santiago%2C%20San%20Miguel%2C%20Regi%C3%B3n%20Metropolitana!5e0!3m2!1ses-419!2scl!4v1781820300920!5m2!1ses-419!2scl"
    width           = { width }
    height          = { height }
    style           = "border:0;"
    loading         = "lazy"
    referrerpolicy  = "no-referrer-when-downgrade"
    title           = "Mapa de ubicación de CET Chile SpA / GlobalCET"
    class           = { className }
></iframe>
