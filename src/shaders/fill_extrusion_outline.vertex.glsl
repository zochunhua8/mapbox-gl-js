uniform mat4 u_matrix;
uniform vec3 u_outline_color;
uniform float u_outline_opacity;
uniform vec2 u_viewport_size;
uniform float u_outline_width;

#ifdef PROJECTION_GLOBE_VIEW
uniform mat4 u_inv_rot_matrix;
uniform vec2 u_merc_center;
uniform vec3 u_tile_id;
uniform float u_zoom_transition;
uniform vec3 u_up_dir;
uniform float u_height_lift;
attribute vec3 a_pos_3;
attribute vec3 a_pos_normal_3;
#endif

attribute vec4 a_pos_normal_ed;
attribute vec2 a_centroid_pos;

#pragma mapbox: define highp float base
#pragma mapbox: define highp float height

#pragma mapbox: define highp vec4 color

void main() {
    #pragma mapbox: initialize highp float base
    #pragma mapbox: initialize highp float height
    #pragma mapbox: initialize highp vec4 color

    vec3 pos_nx = floor(a_pos_normal_ed.xyz * 0.5);
    mediump vec3 top_up_ny = a_pos_normal_ed.xyz - 2.0 * pos_nx;
    float x_normal = pos_nx.z / 8192.0;
    vec3 normal = top_up_ny.y == 1.0 ? vec3(0.0, 0.0, 1.0) : normalize(vec3(x_normal, (2.0 * top_up_ny.z - 1.0) * (1.0 - abs(x_normal)), 0.0));

    float t = top_up_ny.x;

#if defined(HAS_CENTROID) || defined(TERRAIN)
    vec2 centroid_pos = a_centroid_pos;
#else
    vec2 centroid_pos = vec2(0.0);
#endif

#ifdef TERRAIN
    float ele = elevation(pos_nx.xy);
    float c_ele = 0.0;
    bool flat_roof = centroid_pos.x != 0.0 && t > 0.0;
    float h = flat_roof ? max(c_ele + height, ele + base + 2.0) : ele + (t > 0.0 ? height : base == 0.0 ? -5.0 : base);
    vec3 pos = vec3(pos_nx.xy, h);
#else
    vec3 pos = vec3(pos_nx.xy, t > 0.0 ? height : base);
#endif

#ifdef PROJECTION_GLOBE_VIEW
    float lift = float((t + base) > 0.0) * u_height_lift;
    vec3 globe_normal = normalize(mix(a_pos_normal_3 / 16384.0, u_up_dir, u_zoom_transition));
    vec3 globe_pos = a_pos_3 + globe_normal * (u_tile_up_scale * (pos.z + lift));
    vec3 merc_pos = mercator_tile_position(u_inv_rot_matrix, pos.xy, u_tile_id, u_merc_center) + u_up_dir * u_tile_up_scale * pos.z;
    pos = mix_globe_mercator(globe_pos, merc_pos, u_zoom_transition);
#endif

    vec4 clip = u_matrix * vec4(pos, 1.0);

    // Small nudged position to compute screen-space normal direction
    float eps = 1e-3;
    vec3 pos_nudged = pos + vec3(normal.xy * eps, 0.0);
    vec4 clip_nudged = u_matrix * vec4(pos_nudged, 1.0);

    vec2 ndc = clip.xy / clip.w;
    vec2 ndc_nudged = clip_nudged.xy / clip_nudged.w;
    vec2 dir_ndc = normalize(ndc_nudged - ndc + vec2(1e-6));

    vec2 ndc_offset = (dir_ndc * u_outline_width) / u_viewport_size * 2.0;
    clip.xy += ndc_offset * clip.w;

    gl_Position = clip;
}
