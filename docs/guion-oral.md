# 🎤 GUIÓN ORAL DE PRESENTACIÓN (3-5 MINUTOS)
## StockTrack360 - Sistema de Gestión de Inventario

---

## ⏱️ DISTRIBUCIÓN DE TIEMPO

- **Introducción:** 30 segundos
- **Problema & Solución:** 45 segundos
- **Arquitectura & Tecnología:** 60 segundos
- **Demo en Vivo:** 90 segundos
- **Resultados & Próximos Pasos:** 45 segundos
- **Preguntas:** 30 segundos
- **TOTAL:** ~4 minutos

---

## 📝 GUIÓN DETALLADO

### [0:00 - 0:30] 🎯 INTRODUCCIÓN

**"Buenos días profesores. Somos el equipo de StockTrack360.**

**Hemos desarrollado un sistema integral de gestión de inventario, especialmente diseñado para pequeños y medianos negocios en Colombia.**

**Nuestro objetivo es resolver los problemas más comunes de control de stock: pérdida de información, productos vencidos no detectados a tiempo y falta de visibilidad operativa.**

**Todo esto lo logramos a través de una arquitectura moderna basada en microservicios."**

---

### [0:30 - 1:15] 🔴 PROBLEMA & SOLUCIÓN

**"Actualmente, muchas pymes gestionan inventario manualmente, en hojas de cálculo desordenadas. Esto genera:**

- **Pérdida de control:** No saben cuántas unidades hay disponibles
- **Productos vencidos:** No hay seguimiento de fechas
- **Errores manuales:** Sin auditoría de quién y cuándo se hizo cada movimiento
- **Sin reportes:** Imposible tomar decisiones basadas en datos

**Nuestra solución:**

StockTrack360 centraliza toda la gestión en una plataforma web intuitiva con:
- Registro automático de entradas y salidas
- Alertas inteligentes de stock bajo y vencimientos
- Dashboard en tiempo real con indicadores clave
- Reportes ejecutivos para tomar mejores decisiones"**

---

### [1:15 - 2:15] 🏗️ ARQUITECTURA & TECNOLOGÍA

**"Desde el punto de vista técnico:**

**Implementamos dos microservicios modulares:**

1. **Inventory Service** - Gestiona:
   - Productos con categorías predefinidas
   - Stock disponible en tiempo real
   - Entradas y salidas de inventario
   - Historial completo de movimientos

2. **Reporting-Alerts Service** - Genera:
   - Alertas automáticas de stock bajo
   - Alertas de productos vencidos
   - Dashboard con 8 KPIs principales
   - 3 tipos de reportes ejecutivos

**Tecnológicamente usamos:**
- **Frontend:** React con Next.js
- **Backend:** API REST en Next.js
- **Almacenamiento:** En memoria para MVP, preparado para PostgreSQL
- **Control de versiones:** Git con ramas estratégicas

**La arquitectura tiene 5 capas:**
- Models (entidades de dominio)
- Repositories (acceso a datos)
- UseCases (lógica de negocio)
- Validators (validaciones)
- Controllers (handlers de API)

Esto nos permite código modular, testeable y escalable."**

---

### [2:15 - 3:45] 🎬 DEMO EN VIVO

**"Veamos el sistema en acción:**

[Mostrar pantalla con app corriendo en localhost:3000]

**Primero, creamos un producto:**
- SKU: ARROZ001
- Nombre: Arroz Premium 1kg
- Categoría: Alimentos
- Stock: 100 unidades
- Stock mínimo: 20

[Mostrar producto creado]

**Ahora registramos una entrada de inventario:**
- Agregamos 50 unidades más
- El sistema actualiza automáticamente el stock a 150

[Mostrar stock actualizado]

**Luego, registramos una salida:**
- Sacamos 10 unidades
- Stock final: 140

[Mostrar movimiento registrado]

**Ahora consultemos el dashboard:**
- Total de productos: 1
- Total de stock: 140
- Alertas activas: 0

[Mostrar dashboard]

**Finalmente, vemos un reporte:**
[Mostrar reporte de top movimientos]

**Como ven, el sistema funciona en tiempo real, valida datos y mantiene auditoría completa de operaciones."**

---

### [3:45 - 4:30] ✨ RESULTADOS & PRÓXIMOS PASOS

**"Resultados logrados:**

✅ **26 archivos implementados** con código limpio y modular
✅ **13 endpoints API** completamente funcionales
✅ **Arquitectura escalable** preparada para producción
✅ **Documentación completa** con ejemplos y diagramas
✅ **Validaciones robustas** que previenen errores
✅ **Sin stock negativo** garantizado

**Lo siguiente que haremos:**

1. **Integración con BD Real** - PostgreSQL/Supabase
2. **Autenticación JWT** - Roles de Admin y Usuario
3. **Tests Automatizados** - Unitarios e integración
4. **CI/CD Completo** - GitHub Actions para automatización
5. **Monitoring en Producción** - Logs y alertas
6. **Documentación API** - Swagger/OpenAPI

**El MVP está completamente funcional y listo para que cualquier pyme empiece a controlarel inventario desde hoy.**"**

---

### [4:30 - 5:00] ❓ PREGUNTAS

**"Agradecemos su atención. Estamos disponibles para preguntas sobre:**
- Arquitectura técnica
- Funcionalidades específicas
- Validaciones de negocio
- Próximas fases del proyecto

**¿Tienen preguntas?"**

---

## 🎥 NOTAS PARA PRESENTADORES

### Puntos Clave a Enfatizar
- ✅ Arquitectura modular y escalable
- ✅ MVP completamente funcional
- ✅ Validaciones que previenen errores de negocio
- ✅ Preparado para integración con BD
- ✅ Documentación profesional

### Qué NO decir
- ❌ "Está sin terminar"
- ❌ "Fue muy difícil"
- ❌ "Casi no tuvimos tiempo"

### Lenguaje a Usar
- ✅ "Implementamos"
- ✅ "Desarrollamos"
- ✅ "Nuestro sistema"
- ✅ "El MVP está listo"

### Velocidad de Habla
- Hablar claro y a ritmo moderado
- Hacer pausas entre conceptos
- No apresurarse con la demo

### Gestos y Contacto Visual
- Mirar al profesor ocasionalmente
- Usar gestos para enfatizar puntos clave
- Apuntar a la pantalla cuando demuestres algo

---

## 📊 ALTERNATIVAS SI HAY PREGUNTAS DIFÍCILES

**P: "¿Por qué no usan una BD real?"**
R: "Para el MVP académico, una solución en memoria nos permitió enfocarnos en la lógica de negocio. Ya tenemos el código preparado para integrar con PostgreSQL/Supabase en la siguiente fase."

**P: "¿Y la seguridad?"**
R: "Este es un MVP. La seguridad (JWT, roles, encriptación) será integrada en la siguiente fase. El código está arquitecturado para agregar estas capas sin modificar la lógica central."

**P: "¿Cómo escala?"**
R: "La arquitectura modular permite convertir cada servicio en microservicios independientes desplegados separadamente. También podemos cachear datos frecuentes y agregar workers para procesamiento asincrónico."

**P: "¿Qué pasa si falla un servicio?"**
R: "Implementamos degradación controlada - el sistema muestra información disponible y un mensaje informativo, sin fallar completamente."

---

## ✅ CHECKLIST ANTES DE PRESENTAR

- [ ] Practicar el guión en voz alta
- [ ] Cronometrar para no exceder 5 minutos
- [ ] Tener laptop lista con app funcionando
- [ ] Probar que localhost:3000 funciona
- [ ] Tener ejemplos de curl listos si es necesario
- [ ] Memorizar los datos de ejemplo (SKU, cantidades)
- [ ] Vestir profesionalmente
- [ ] Llegar 15 minutos antes
- [ ] Hacer backup de slides y documentos
- [ ] Silenciar teléfono

