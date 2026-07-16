// ==============================================================================
// MÓDULO 1: REGISTRO DE CLIENTES Y MASCOTAS
// ==============================================================================

window.addEventListener('loadRegistroView', initRegistroModule);

function initRegistroModule() {
    const form = document.getElementById('form-cliente-mascota');
    if (!form) return;

    // Limpiar formulario al entrar a la vista
    form.reset();

    // Evitamos duplicar eventos si se vuelve a cargar la vista
    form.removeEventListener('submit', handleRegistroSubmit);
    form.addEventListener('submit', handleRegistroSubmit);
}

async function handleRegistroSubmit(e) {
    e.preventDefault();
    
    // 1. Verificación de Seguridad de Supabase
    if (typeof supabase === 'undefined' || typeof supabase.from !== 'function') {
        console.error("❌ ERROR: El cliente de Supabase no se ha inicializado correctamente.");
        return showToast('Error de sistema: Supabase no está configurado o inicializado.', true);
    }
    
    try {
        // 2. Insertar Cliente (Conforme a la tabla public.clientes)
        const clienteData = {
            nombre_propietario: document.getElementById('cli-nombre').value.trim(),
            email: document.getElementById('cli-email').value.trim() || null, // Admite nulos en SQL
            telefono: document.getElementById('cli-telefono').value.trim()    // Obligatorio en SQL
        };

        console.log("⏳ Enviando datos de propietario...", clienteData);

        const { data: cliente, error: errorCli } = await supabase
            .from('clientes')
            .insert([clienteData])
            .select()
            .single();

        if (errorCli) {
            console.error('❌ Error de Supabase al guardar cliente:', errorCli);
            return showToast('Error al registrar cliente: ' + errorCli.message, true);
        }

        if (!cliente || !cliente.id) {
            return showToast('Error: No se pudo rescatar el ID del cliente registrado.', true);
        }

        console.log("✅ Propietario guardado con ID:", cliente.id);

        // 3. Insertar Mascota (Conforme a la tabla public.mascotas)
        const pesoRaw = parseFloat(document.getElementById('mas-peso').value);
        
        const mascotaData = {
            cliente_id: cliente.id,                                         // Relaciona con el cliente recién creado
            nombre: document.getElementById('mas-nombre').value.trim(),     // Obligatorio en SQL
            tipo: document.getElementById('mas-tipo').value,                 // Debe ser idéntico al ENUM de Postgres
            edad_anios: parseInt(document.getElementById('mas-anios').value) || 0,
            edad_meses: parseInt(document.getElementById('mas-meses').value) || 0,
            peso_kg: isNaN(pesoRaw) ? 0.0 : pesoRaw,                        // Evita mandar valores vacíos o NaN
            sexo: document.getElementById('mas-sexo').value,                 // Debe ser idéntico al ENUM de Postgres
            raza: document.getElementById('mas-raza').value.trim() || null,
            actividad_fisica: document.getElementById('mas-actividad').value, // Debe ser idéntico al ENUM de Postgres
            condicion_medica: document.getElementById('mas-condicion').value.trim() || null,
            picky_eater: document.getElementById('mas-picky').checked,      // Booleano
            alergias: document.getElementById('mas-alergias').value.trim() || null
        };

        console.log("⏳ Enviando datos de la mascota...", mascotaData);

        const { error: errorMas } = await supabase
            .from('mascotas')
            .insert([mascotaData]);

        if (errorMas) {
            console.error('❌ Error de Supabase al guardar mascota:', errorMas);
            return showToast('Error al registrar mascota: ' + errorMas.message, true);
        }

        // Éxito absoluto
        showToast('¡Propietario y Mascota registrados con éxito!');
        e.target.reset();

    } catch (err) {
        console.error('❌ Error inesperado durante el flujo de registro:', err);
        showToast('Ocurrió un error inesperado al procesar el registro.', true);
    }
}

// Función auxiliar para alertas visuales rápidas
function showToast(message, isError = false) {
    if (typeof window.showToast === 'function') {
        window.showToast(message, isError);
    } else {
        alert((isError ? '❌ ' : '✅ ') + message);
    }
}