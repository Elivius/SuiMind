"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { forwardRef, useRef, useMemo, useLayoutEffect, JSX } from "react"
import { Color, Mesh, ShaderMaterial, IUniform } from "three"

// Convert hex color to normalized RGB
const hexToNormalizedRGB = (hex: string): [number, number, number] => {
    const cleanHex = hex.replace("#", "")
    return [
        parseInt(cleanHex.slice(0, 2), 16) / 255,
        parseInt(cleanHex.slice(2, 4), 16) / 255,
        parseInt(cleanHex.slice(4, 6), 16) / 255,
    ]
}

// Vertex Shader
const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
void main() {
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

// Fragment Shader
const fragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform vec3 uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

float rand(vec2 co) {
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2 rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  float rnd = rand(gl_FragCoord.xy);
  vec2 uv = rotateUvs(vUv * uScale, uRotation);
  vec2 tex = uv * uScale;
  float tOffset = uSpeed * uTime;

  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

  float pattern = 0.6 + 0.4 * sin(
    5.0 * (tex.x + tex.y + cos(3.0 * tex.x + 5.0 * tex.y) + 0.02 * tOffset)
    + sin(20.0 * (tex.x + tex.y - 0.1 * tOffset))
  );

  // Ensure minimum brightness to avoid black areas
  pattern = max(pattern, 0.4);

  vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
  col.a = 1.0;
  gl_FragColor = col;
}
`

// Uniform type
interface SilkUniforms {
    uSpeed: IUniform<number>
    uScale: IUniform<number>
    uNoiseIntensity: IUniform<number>
    uColor: IUniform<Color>
    uRotation: IUniform<number>
    uTime: IUniform<number>
    [uniform: string]: IUniform<any>
}

interface SilkPlaneProps {
    uniforms: SilkUniforms
}

const SilkPlane = forwardRef<Mesh, SilkPlaneProps>(({ uniforms }, ref) => {
    const { viewport } = useThree()

    const internalRef = useRef<Mesh>(null)

    // Scale plane to viewport
    useLayoutEffect(() => {
        if (internalRef.current) {
            internalRef.current.scale.set(viewport.width, viewport.height, 1)
            internalRef.current.position.set(0, 0, 0)
        }
    }, [viewport])


    // Animate uTime
    useFrame((_, delta) => {
        if (internalRef.current) {
            const material = internalRef.current.material as ShaderMaterial
            if (material.uniforms?.uTime) material.uniforms.uTime.value += 0.1 * delta
        }
    })


    return (
        <mesh
            ref={(instance) => {
                internalRef.current = instance
                if (typeof ref === "function") ref(instance)
                else if (ref) (ref as React.MutableRefObject<Mesh | null>).current = instance
            }}
        >
            <planeGeometry args={[1, 1, 1, 1]} />
            <shaderMaterial
                uniforms={uniforms as unknown as JSX.IntrinsicElements["shaderMaterial"]["uniforms"]}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
            />
        </mesh>
    )

})

SilkPlane.displayName = "SilkPlane"

// Silk Props
interface SilkProps {
    speed?: number
    scale?: number
    color?: string
    noiseIntensity?: number
    rotation?: number
    className?: string
}

const Silk = ({
    speed = 3,
    scale = 1,
    color = "#6FBEE5ff",
    noiseIntensity = 1.5,
    rotation = 0,
    className,
}: SilkProps) => {
    const meshRef = useRef<Mesh>(null)

    const uniforms = useMemo<SilkUniforms>(
        () => ({
            uSpeed: { value: speed },
            uScale: { value: scale },
            uNoiseIntensity: { value: noiseIntensity },
            uColor: { value: new Color(...hexToNormalizedRGB(color)) },
            uRotation: { value: rotation },
            uTime: { value: 0 },
        }),
        [speed, scale, noiseIntensity, color, rotation]
    )

    return (
        <div className={className}>
            <Canvas
                className="w-full h-full"
                dpr={[1, 2]}
                frameloop="always"
                camera={{ position: [0, 0, 1] }}
            >
                <SilkPlane ref={meshRef} uniforms={uniforms} />
            </Canvas>
        </div>
    )
}

export default Silk
