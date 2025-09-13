'use client'

import { OrbitControls, Html, useGLTF } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'

import type * as THREE from 'three'

export interface BrainRegionData {
  id: string
  name: string
  description: string
  functions: string[]
  color: string
  position: [number, number, number]
  size: number
}

export const brainRegions: BrainRegionData[] = [
  {
    id: 'frontal',
    name: 'Płat czołowy',
    description:
      'Odpowiedzialny za funkcje wykonawcze, planowanie, kontrolę impulsów i osobowość',
    functions: ['Planowanie', 'Kontrola impulsów', 'Osobowość', 'Podejmowanie decyzji'],
    color: '#3B82F6',
    position: [0, 0.3, 0.8],
    size: 0.15
  },
  {
    id: 'temporal',
    name: 'Płat skroniowy',
    description: 'Przetwarza informacje słuchowe i wzrokowe, pamięć, język i emocje',
    functions: ['Słyszenie', 'Pamięć', 'Język', 'Emocje'],
    color: '#10B981',
    position: [-0.5, -0.1, 0.2],
    size: 0.12
  },
  {
    id: 'occipital',
    name: 'Płat potyliczny',
    description: 'Główny ośrodek przetwarzania informacji wzrokowych',
    functions: ['Wzrok', 'Przetwarzanie wizualne', 'Rozpoznawanie wzorców'],
    color: '#F59E0B',
    position: [0, -0.4, -0.6],
    size: 0.11
  },
  {
    id: 'parietal',
    name: 'Płat ciemieniowy',
    description: 'Integruje informacje sensoryczne i przestrzenne',
    functions: ['Dotyk', 'Świadomość ciała', 'Orientacja przestrzenna'],
    color: '#8B5CF6',
    position: [0.4, 0.2, 0.3],
    size: 0.13
  },
  {
    id: 'hippocampus',
    name: 'Hipokamp',
    description: 'Krytyczny dla tworzenia nowych wspomnień i nawigacji przestrzennej',
    functions: ['Formowanie wspomnień', 'Nawigacja', 'Uczenie się'],
    color: '#EF4444',
    position: [-0.3, -0.5, 0.4],
    size: 0.08
  },
  {
    id: 'amygdala',
    name: 'Ciała migdałowate',
    description:
      'Przetwarza emocje, szczególnie strach i agresję, ośrodek walki lub ucieczki',
    functions: ['Emocje', 'Strach', 'Agresja', 'Odpowiedź na stres'],
    color: '#EC4899',
    position: [-0.4, -0.6, 0.2],
    size: 0.07
  }
]

interface BrainMeshProps {
  region: BrainRegionData
  isSelected: boolean
  onClick: (region: BrainRegionData) => void
  animateRegionId?: string | null
}

/**
 *
 */
const BrainMesh = ({ region, isSelected, onClick, animateRegionId }: BrainMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      const material = meshRef.current.material
      const targetOpacity = isSelected ? 1 : hovered ? 0.8 : 0.6

      // Type-safe material opacity handling
      if (Array.isArray(material)) {
        material.forEach((mat) => {
          if ('opacity' in mat && typeof mat.opacity === 'number') {
            mat.opacity = targetOpacity
            if ('needsUpdate' in mat) {
              mat.needsUpdate = true
            }
          }
        })
      } else if (
        material &&
        'opacity' in material &&
        typeof material.opacity === 'number'
      ) {
        material.opacity = targetOpacity
        if ('needsUpdate' in material) {
          material.needsUpdate = true
        }
      }

      // Pulse animation for supplement interaction / attention
      const pulseActive = animateRegionId === region.id && !hovered
      const pulse = pulseActive
        ? 1 + 0.08 * (1 + Math.sin(state.clock.elapsedTime * 3)) * 0.5
        : 1
      const base = hovered || isSelected ? 1.2 : 1
      const scale = base * pulse
      meshRef.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={region.position}
      onClick={() => onClick(region)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[region.size, 16, 16]} />
      <meshLambertMaterial
        color={region.color}
        transparent
        opacity={isSelected ? 1 : hovered ? 0.8 : 0.6}
      />
      {(hovered || isSelected) && (
        <Html
          position={[
            region.position[0],
            region.position[1] + region.size + 0.1,
            region.position[2]
          ]}
          center
          className="pointer-events-none"
        >
          <div className="max-w-48 rounded-lg border border-gray-300 bg-white p-2 text-center shadow-lg">
            <div className="text-sm font-semibold text-gray-800">{region.name}</div>
            <div className="mt-1 text-xs text-gray-600">{region.description}</div>
          </div>
        </Html>
      )}
    </mesh>
  )
}

interface Brain3DProps {
  selectedRegion?: BrainRegionData | null
  onRegionClick?: (region: BrainRegionData) => void
  arMode?: boolean
  animateRegionId?: string | null
}

/**
 *
 */
const BrainModel = () => {
  const { scene } = useGLTF('/assets/brain-model.glb')
  return <primitive object={scene} scale={0.8} />
}

/**
 *
 */
export default function Brain3D({
  selectedRegion,
  onRegionClick,
  arMode = false,
  animateRegionId = null
}: Brain3DProps) {
  const [internalSelected, setInternalSelected] = useState<BrainRegionData | null>(null)

  const handleRegionClick = (region: BrainRegionData) => {
    setInternalSelected(region)
    onRegionClick?.(region)
  }

  return (
    <div
      className="relative h-96 w-full overflow-hidden rounded-lg bg-gradient-to-br from-slate-100 to-slate-200"
      aria-label="Interaktywny model mózgu"
    >
      <Canvas
        camera={{ position: [0, 0, 3], fov: arMode ? 75 : 60 }}
        onCreated={({ gl }) => {
          // Placeholder for future WebXR integration (no new deps). Keep renderer ready.
          gl.xr.enabled = false // WebXR AR requires HTTPS and user gesture; we only toggle UI for now.
        }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.4} />

        {/* Main brain with interactive regions */}
        <group>
          <BrainModel />

          {brainRegions.map((region) => (
            <BrainMesh
              key={region.id}
              region={region}
              isSelected={
                selectedRegion?.id === region.id || internalSelected?.id === region.id
              }
              onClick={handleRegionClick}
              animateRegionId={animateRegionId}
            />
          ))}
        </group>

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          maxDistance={5}
          minDistance={1.5}
          enabled={!arMode}
        />
      </Canvas>

      {/* Instructions */}
      {!arMode ? (
        <div className="absolute bottom-4 left-4 rounded bg-white/80 px-3 py-2 text-xs text-gray-600">
          Kliknij region mózgu aby zobaczyć szczegóły • Przeciągnij aby obrócić • Scroll
          aby przybliżyć
        </div>
      ) : (
        <div className="absolute bottom-4 left-4 rounded border border-green-200 bg-green-50/90 px-3 py-2 text-xs text-green-800">
          Tryb AR: podgląd symulowany. Pełna obsługa WebXR zostanie włączona na
          urządzeniach zgodnych i w bezpiecznym połączeniu (HTTPS).
        </div>
      )}
    </div>
  )
}
