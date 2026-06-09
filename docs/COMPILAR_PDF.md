# 📄 GUÍA PARA COMPILAR PDF DE PRESENTACIÓN

## Opción 1: Markdown a PDF (Recomendado para GitHub)

### Herramienta: Pandoc + mermaid-filter

**Instalación:**

```bash
# Windows (PowerShell como admin)
choco install pandoc
npm install -D mermaid-cli

# o en Linux/Mac
brew install pandoc
npm install -D mermaid-cli
```

**Comando para compilar:**

```bash
pandoc \
  -F mermaid-filter \
  --pdf-engine=xelatex \
  --toc \
  -o presentacion-stocktrack360.pdf \
  docs/PRESENTACION_INDEX.md \
  docs/pipeline-diagram.md \
  docs/checklist-final.md \
  docs/guion-oral.md \
  docs/roles-presentacion.md \
  docs/lista-pantallazos.md \
  docs/MICROSERVICES.md
```

---

## Opción 2: Google Docs a PDF

**Pasos:**

1. Copia todo el contenido de markdown a Google Docs
2. Formatea y organiza
3. File → Download → PDF Document
4. Guarda como `presentacion-stocktrack360.pdf`

---

## Opción 3: Visual Studio Code + Extension

### Extension recomendada: Markdown PDF

1. Abre VS Code
2. Instala: `Markdown PDF` (yzane.markdown-pdf)
3. Clic derecho en archivo .md
4. Selecciona "Markdown PDF: Export (pdf)"

---

## Opción 4: Script Automático (Node.js)

**Instala:**

```bash
npm install --save-dev md-to-pdf
```

**Script en package.json:**

```json
{
  "scripts": {
    "compile-pdf": "md-to-pdf docs/PRESENTACION_INDEX.md --output presentacion-stocktrack360.pdf"
  }
}
```

**Ejecuta:**

```bash
npm run compile-pdf
```

---

## Contenido del PDF Final

El PDF debe incluir (en este orden):

```
1. Portada
   - Título: StockTrack360 - Sistema de Gestión de Inventario
   - Equipo: José David, [Nombre 2], [Nombre 3]
   - Fecha: [Fecha actual]
   - Institución: [Tu universidad]

2. Tabla de Contenidos

3. ÍNDICE DE PRESENTACIÓN

4. Pipeline & Arquitectura
   - Diagrama Mermaid del pipeline
   - Descripción técnica

5. Checklist Final
   - Todos los features completados
   - Validaciones implementadas
   - Estado actual

6. Guion Oral
   - Script completo
   - Timing
   - Transiciones

7. Roles y Presentadores
   - Quién dice qué
   - Duración por integrante

8. Lista de Pantallazos
   - 20 screenshots descritos
   - Qué mostrar en cada uno
   - Datos de ejemplo

9. Documentación Técnica
   - Microservicios overview
   - Endpoints
   - Instrucciones de setup

10. Apéndices
    - Screenshots (opcional)
    - Comandos útiles
```

---

## Estructura del Archivo PDF Compilado

**Mejor orden en PDF:**

```bash
pandoc \
  --pdf-engine=pdflatex \
  --toc \
  --toc-depth=2 \
  --number-sections \
  -V documentclass=report \
  -V geometry:margin=1in \
  -V fontsize=11pt \
  -V linestretch=1.5 \
  -o presentacion-stocktrack360.pdf \
  docs/caratula.md \
  docs/PRESENTACION_INDEX.md \
  docs/pipeline-diagram.md \
  docs/checklist-final.md \
  docs/guion-oral.md \
  docs/roles-presentacion.md \
  docs/lista-pantallazos.md
```

---

## Template para Portada (caratula.md)

Crea `docs/caratula.md`:

```markdown
---
title: "StockTrack360"
subtitle: "Sistema Integral de Gestión de Inventario"
author: "José David, [Nombre 2], [Nombre 3]"
date: "Febrero 2025"
---

# StockTrack360

## Sistema Integral de Gestión de Inventario para PYMEs Colombianas

**Equipo de Desarrollo:**
- José David (Lead Developer)
- [Nombre 2] (Arquitecto Técnico)
- [Nombre 3] (Gestor de Proyectos)

**Institución:** [Tu Universidad]

**Asignatura:** Desarrollo de Software III

**Profesor:** [Nombre del profesor]

**Fecha de Presentación:** [Fecha]

---

### Resumen Ejecutivo

StockTrack360 es una plataforma web de gestión de inventario diseñada específicamente para pequeños y medianos negocios (PYMEs) colombianos. 

**Características principales:**
- ✅ Gestión centralizada de productos e inventario
- ✅ Registro automático de entradas y salidas
- ✅ Alertas en tiempo real
- ✅ Dashboard con indicadores KPI
- ✅ Reportes ejecutivos
- ✅ Arquitectura escalable basada en microservicios

Este documento contiene la presentación técnica completa, incluyendo arquitectura, validaciones, roadmap y guion de presentación.

**Estado:** MVP Completamente Funcional (26 archivos, 13 endpoints)
```

---

## Verificación del PDF

**Antes de entregar, verifica:**

- [ ] PDF tiene todas las páginas
- [ ] Tabla de contenidos funciona (links clickeables)
- [ ] Imágenes se ven claramente
- [ ] Formato es consistente
- [ ] Mermaid diagrams se renderizaron correctamente
- [ ] Nombres y fechas son correctos
- [ ] Tamaño del archivo < 50MB
- [ ] Se puede abrir en cualquier lector PDF

---

## Comandos Rápidos

**Windows PowerShell:**

```powershell
# Compilar todo a PDF
pandoc --pdf-engine=xelatex --toc -o presentacion.pdf (Get-ChildItem docs/*.md | Select-Object -ExpandProperty FullName | Join-String -Separator ' ')

# O más simple, si tienes el orden correcto:
pandoc --toc -o presentacion.pdf docs/caratula.md docs/PRESENTACION_INDEX.md docs/pipeline-diagram.md docs/checklist-final.md docs/guion-oral.md docs/roles-presentacion.md docs/lista-pantallazos.md
```

**Linux/Mac:**

```bash
pandoc --toc -o presentacion.pdf \
  docs/caratula.md \
  docs/PRESENTACION_INDEX.md \
  docs/pipeline-diagram.md \
  docs/checklist-final.md \
  docs/guion-oral.md \
  docs/roles-presentacion.md \
  docs/lista-pantallazos.md
```

---

## Troubleshooting

**Error: pandoc not found**
→ Instala pandoc: https://pandoc.org/installing.html

**Error: mermaid-filter not working**
→ Usa Pandoc sin mermaid-filter y pon diagrama como imagen PNG

**PDF en blanco**
→ Verifica que los archivos .md existan en la ruta correcta

**Mermaid no se renderiza**
→ Exporta diagrama como PNG desde mermaid.live y úsalo como imagen

---

## Resultado Final

Cuando todo esté compilado, tendrás:

```
presentacion-stocktrack360.pdf
├── Portada
├── Índice Presentación
├── Pipeline (con Mermaid diagram)
├── Checklist Final
├── Guion Oral
├── Roles y Presentadores
├── Lista de Pantallazos
└── Documentación Técnica
```

**Listo para presentar ante profesores.**

