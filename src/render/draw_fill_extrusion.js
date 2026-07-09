@@
         program.draw(context, context.gl.TRIANGLES, depthMode, stencilMode, colorMode, CullFaceMode.backCCW,
             uniformValues, layer.id, bucket.layoutVertexBuffer, bucket.indexBuffer,
             bucket.segments, layer.paint, painter.transform.zoom,
             programConfiguration,
             painter.terrain ? bucket.centroidVertexBuffer : null,
             isGlobeProjection ? bucket.layoutVertexExtBuffer : null);
+
+        // Draw outline using the same geometry but with a shader that offsets vertices in screen space.
+        const outlineColor = layer.paint.get('fill-extrusion-outline-color') || [0, 0, 0];
+        const outlineOpacity = layer.paint.get('fill-extrusion-outline-opacity') || 1.0;
+        const outlineWidth = layer.paint.get('fill-extrusion-outline-width') || 1.0; // in pixels
+
+        const outlineDepthMode = new DepthMode(painter.context.gl.LEQUAL, DepthMode.ReadOnly, painter.depthRangeFor3D);
+        const outlineProgram = painter.useProgram('fillExtrusionOutline', programConfiguration, baseDefines);
+
+        const drawingBufferSize = [context.gl.drawingBufferWidth, context.gl.drawingBufferHeight];
+        const outlineUniforms = fillExtrusionOutlineUniformValues(
+            matrix, outlineColor, outlineOpacity, outlineWidth, drawingBufferSize, coord,
+            heightLift, globeToMercator, mercatorCenter, invMatrix);
+
+        painter.prepareDrawProgram(context, outlineProgram, coord.toUnwrapped());
+
+        outlineProgram.draw(context, context.gl.TRIANGLES, outlineDepthMode, stencilMode, painter.colorModeForRenderPass(), CullFaceMode.backCCW,
+            outlineUniforms, layer.id, bucket.layoutVertexBuffer, bucket.indexBuffer,
+            bucket.segments, layer.paint, painter.transform.zoom,
+            programConfiguration,
+            painter.terrain ? bucket.centroidVertexBuffer : null,
+            isGlobeProjection ? bucket.layoutVertexExtBuffer : null);
