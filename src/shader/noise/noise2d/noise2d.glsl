// Simple 2D value noise
// Source: adapted from Inigo Quilez / IQ

// Hash function: maps a 2D point to a pseudo‑random float in [0,1)
float hash( vec2 p ) {
    // dot, sin, fract trick
    return fract( sin( dot(p, vec2(127.1, 311.7)) ) * 43758.5453123 );
}

// 2D value noise at position p
float noise( vec2 p ) {
    // integer cell
    vec2 i = floor(p);
    // fractional part
    vec2 f = fract(p);

    // four corners in the cell
    float a = hash(i + vec2(0.0, 0.0));
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    // smooth interpolation weights
    vec2 u = f * f * (3.0 - 2.0 * f);

    // bilinear interpolate
    return mix(
        mix(a, b, u.x),
        mix(c, d, u.x),
        u.y
    );
}
