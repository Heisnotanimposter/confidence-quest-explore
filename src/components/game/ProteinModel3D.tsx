
import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { PaeCell } from '@/types/game';
import * as THREE from 'three';

interface ProteinModel3DProps {
  paeGrid: PaeCell[][];
  selectedCell: PaeCell | null;
  gridSize: number;
}

function Node({ position, color, isHighlighted, coordinates }: { 
  position: [number, number, number]; 
  color: string; 
  isHighlighted: boolean;
  coordinates: string;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Subtle pulse animation for highlighted nodes
  useFrame((state) => {
    if (mesh.current && isHighlighted) {
      mesh.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      mesh.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      mesh.current.scale.z = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <mesh 
      position={position} 
      ref={mesh}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.22, 32, 32]} />
      <meshStandardMaterial 
        color={color}
        emissive={isHighlighted || hovered ? color : "#000000"}
        emissiveIntensity={isHighlighted ? 0.7 : hovered ? 0.4 : 0}
        metalness={0.4}
        roughness={0.3}
      />
      {(hovered || isHighlighted) && (
        <Html distanceFactor={10}>
          <div className="bg-foreground/80 text-white px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap shadow-lg backdrop-blur-sm">
            Section {coordinates}
          </div>
        </Html>
      )}
    </mesh>
  );
}

function Connection({ start, end, color, isHighlighted }: { 
  start: [number, number, number]; 
  end: [number, number, number]; 
  color: string;
  isHighlighted: boolean;
}) {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(...start),
    new THREE.Vector3(
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2,
      (start[2] + end[2]) / 2 + 0.5
    ),
    new THREE.Vector3(...end)
  ]);

  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color: isHighlighted ? "#38bdf8" : color,
    linewidth: isHighlighted ? 3 : 1,
    transparent: true,
    opacity: isHighlighted ? 1 : 0.5
  });

  return (
    <primitive object={new THREE.Line(geometry, material)} />
  );
}

function Scene({ paeGrid, selectedCell, gridSize }: ProteinModel3DProps) {
  const group = useRef<THREE.Group>(null);
  const [userInteracted, setUserInteracted] = useState(false);

  // Gentle auto-rotation when user hasn't interacted
  useFrame(() => {
    if (group.current && !userInteracted && !selectedCell) {
      group.current.rotation.y += 0.003;
    }
  });

  const getColor = (confidence: string) => {
    switch (confidence) {
      case "high":
        return "#4ade80";
      case "medium":
        return "#fbbf24";
      case "low":
        return "#f87171";
      default:
        return "#9ca3af";
    }
  };

  const getPosition = (row: number, col: number): [number, number, number] => {
    const spacing = 1.5;
    const x = (col - (gridSize - 1) / 2) * spacing;
    const y = (row - (gridSize - 1) / 2) * spacing;
    const z = Math.sin(row * col * 0.5) * 1.5;
    return [x, y, z];
  };

  const isHighlighted = (rowIndex: number, colIndex: number) => {
    if (!selectedCell) return false;
    return selectedCell.row === rowIndex || selectedCell.col === colIndex;
  };

  return (
    <group 
      ref={group}
      onPointerDown={() => setUserInteracted(true)}
    >
      {/* Nodes */}
      {paeGrid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Node
            key={`node-${rowIndex}-${colIndex}`}
            position={getPosition(rowIndex, colIndex)}
            color={getColor(cell.confidence)}
            isHighlighted={isHighlighted(rowIndex, colIndex)}
            coordinates={`${rowIndex + 1},${colIndex + 1}`}
          />
        ))
      )}

      {/* Horizontal connections */}
      {paeGrid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (colIndex < gridSize - 1) {
            return (
              <Connection
                key={`conn-right-${rowIndex}-${colIndex}`}
                start={getPosition(rowIndex, colIndex)}
                end={getPosition(rowIndex, colIndex + 1)}
                color={getColor(cell.confidence)}
                isHighlighted={isHighlighted(rowIndex, colIndex) || isHighlighted(rowIndex, colIndex + 1)}
              />
            );
          }
          return null;
        })
      )}

      {/* Vertical connections */}
      {paeGrid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (rowIndex < gridSize - 1) {
            return (
              <Connection
                key={`conn-bottom-${rowIndex}-${colIndex}`}
                start={getPosition(rowIndex, colIndex)}
                end={getPosition(rowIndex + 1, colIndex)}
                color={getColor(cell.confidence)}
                isHighlighted={isHighlighted(rowIndex, colIndex) || isHighlighted(rowIndex + 1, colIndex)}
              />
            );
          }
          return null;
        })
      )}

      {/* Diagonal connections */}
      {paeGrid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (rowIndex < gridSize - 1 && colIndex < gridSize - 1) {
            return (
              <Connection
                key={`conn-diag-${rowIndex}-${colIndex}`}
                start={getPosition(rowIndex, colIndex)}
                end={getPosition(rowIndex + 1, colIndex + 1)}
                color={getColor(cell.confidence)}
                isHighlighted={isHighlighted(rowIndex, colIndex) || isHighlighted(rowIndex + 1, colIndex + 1)}
              />
            );
          }
          return null;
        })
      )}
    </group>
  );
}

export default function ProteinModel3D(props: ProteinModel3DProps) {
  return (
    <div className="relative w-full h-[400px] glass-card rounded-2xl overflow-hidden">
      <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.4} />
        <Scene {...props} />
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          rotateSpeed={0.5}
          panSpeed={0.5}
          zoomSpeed={0.5}
          minDistance={5}
          maxDistance={20}
          dampingFactor={0.05}
          screenSpacePanning={true}
        />
      </Canvas>
      <div className="absolute bottom-3 left-3 bg-foreground/60 text-white px-3 py-1.5 rounded-lg text-xs pointer-events-none backdrop-blur-sm">
        🖱️ Drag to spin · Scroll to zoom
      </div>
      <div className="absolute top-3 left-3 bg-foreground/60 text-white px-3 py-1.5 rounded-lg text-xs pointer-events-none backdrop-blur-sm">
        Each sphere = a section of the protein
      </div>
    </div>
  );
}
