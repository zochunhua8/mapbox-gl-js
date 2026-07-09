@@
 export type FillExtrusionUniformsType = {|
@@
 |};
+
+export type FillExtrusionOutlineUniformsType = {|
+    'u_matrix': UniformMatrix4f,
+    'u_outline_color': Uniform3f,
+    'u_outline_opacity': Uniform1f,
+    'u_outline_width': Uniform1f,
+    'u_viewport_size': Uniform2f,
+    'u_tile_id': Uniform3f,
+    'u_zoom_transition': Uniform1f,
+    'u_inv_rot_matrix': UniformMatrix4f,
+    'u_merc_center': Uniform2f,
+    'u_up_dir': Uniform3f,
+    'u_height_lift': Uniform1f
+|};
@@
 const fillExtrusionUniformValues = (
@@
 );
+
+const fillExtrusionOutlineUniformValues = (
+    matrix: Float32Array,
+    outlineColor: [number, number, number],
+    outlineOpacity: number,
+    outlineWidth: number,
+    drawingBufferSize: [number, number],
+    coord: OverscaledTileID,
+    heightLift: number,
+    zoomTransition: number,
+    mercatorCenter: [number, number],
+    invMatrix: Float32Array
+): UniformValues<FillExtrusionOutlineUniformsType> => {
+    const values = fillExtrusionUniformValues(matrix, ({}: any), false, 1.0, coord, heightLift, zoomTransition, mercatorCenter, invMatrix);
+    return extend(values, {
+        'u_outline_color': outlineColor,
+        'u_outline_opacity': outlineOpacity,
+        'u_outline_width': outlineWidth,
+        'u_viewport_size': drawingBufferSize
+    });
+};
@@
 export {
     fillExtrusionUniforms,
     fillExtrusionPatternUniforms,
     fillExtrusionUniformValues,
     fillExtrusionPatternUniformValues
+    , fillExtrusionOutlineUniformValues
 };
