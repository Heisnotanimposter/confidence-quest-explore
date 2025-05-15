import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { PaeCell } from '@/types/game';
import * as THREE from 'three';

interface ProteinModel3DProps {
  paeGrid: PaeCell[][];
  selectedCell: PaeCell | null;
  gridSize: number;
}

function Node({ position, color, isHighlighted }: { position: [number, number, number]; color: string; isHighlighted: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);

  return (
    <mesh position={position} ref={mesh}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial 
        color={color}
        emissive={isHighlighted ? color : "#000000"}
        emissiveIntensity={isHighlighted ? 0.5 : 0}
        metalness={0.5}
        roughness={0.2}
      />
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
    color: isHighlighted ? "#60a5fa" : color,
    linewidth: isHighlighted ? 3 : 1,
    transparent: true,
    opacity: isHighlighted ? 1 : 0.6
  });

  return (
    <primitive object={new THREE.Line(geometry, material)} />
  );
}

function Scene({ paeGrid, selectedCell, gridSize }: ProteinModel3DProps) {
  const group = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);

  useFrame(() => {
    if (group.current && isDragging) {
      group.current.rotation.y *= 0.95;
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
    <group ref={group}>
      {paeGrid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Node
            key={`node-${rowIndex}-${colIndex}`}
            position={getPosition(rowIndex, colIndex)}
            color={getColor(cell.confidence)}
            isHighlighted={isHighlighted(rowIndex, colIndex)}
          />
        ))
      )}

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
    <div style={{ width: '100%', height: '400px', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
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
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        background: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '8px',
        borderRadius: '4px',
        fontSize: '12px',
        pointerEvents: 'none'
      }}>
        Drag to rotate • Scroll to zoom • Right-click to pan
      </div>
    </div>
  );
} 