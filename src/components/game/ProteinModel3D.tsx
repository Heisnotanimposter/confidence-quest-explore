
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
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial 
        color={color}
        emissive={isHighlighted || hovered ? color : "#000000"}
        emissiveIntensity={isHighlighted ? 0.7 : hovered ? 0.4 : 0}
        metalness={0.5}
        roughness={0.2}
      />
      {(hovered || isHighlighted) && (
        <Html distanceFactor={10}>
          <div className="bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
            {coordinates}
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

  // Generate axis markers with reduced frequency for clarity
  const generateAxisMarkers = () => {
    const markers = [];
    const step = gridSize > 5 ? 2 : 1; // Show every second label for larger grids
    
    for (let i = 0; i < gridSize; i += step) {
      // Only add axis labels at the edges of the grid
      if (i === 0 || i === gridSize - 1 || i === Math.floor(gridSize / 2)) {
        const pos = getPosition(i, 0);
        markers.push(
          <Html key={`row-${i}`} position={[pos[0] - 2, pos[1], pos[2]]} center>
            <div className="text-xs font-bold px-1 py-0.5 bg-white bg-opacity-70 rounded">
              {i + 1}
            </div>
          </Html>
        );
        
        const colPos = getPosition(0, i);
        markers.push(
          <Html key={`col-${i}`} position={[colPos[0], colPos[1] - 2, colPos[2]]} center>
            <div className="text-xs font-bold px-1 py-0.5 bg-white bg-opacity-70 rounded">
              {i + 1}
            </div>
          </Html>
        );
      }
    }
    
    return markers;
  };

  return (
    <group ref={group}>
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

      {/* Axis labels */}
      {generateAxisMarkers()}
    </group>
  );
}

export default function ProteinModel3D(props: ProteinModel3DProps) {
  return (
    <div className="relative w-full h-[400px]">
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
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white p-2 rounded-md text-xs pointer-events-none">
        Drag to rotate • Scroll to zoom • Right-click to pan
      </div>
      <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-2 rounded-md text-xs pointer-events-none">
        Hover over nodes to see coordinates
      </div>
    </div>
  );
}
