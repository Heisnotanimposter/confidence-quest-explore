import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Html, Stats } from '@react-three/drei';
import { PaeCell } from '@/types/game';
import * as THREE from 'three';

interface AlphaFoldData {
  pdbData: string;
  confidence: number[];
  secondaryStructure: {
    helices: { start: number; end: number }[];
    sheets: { start: number; end: number }[];
  };
  metadata?: {
    uniprotId: string;
    modelVersion: string;
    confidenceScore: number;
  };
}

interface ProteinModel3DProps {
  paeGrid: PaeCell[][];
  selectedCell: PaeCell | null;
  gridSize: number;
  uniprotId?: string; // e.g., "P69905" for hemoglobin
}

// Domain types based on AlphaFold's TED domains
type DomainType = 'helix' | 'sheet' | 'loop' | 'domain';

interface Domain {
  start: number;
  end: number;
  type: DomainType;
  confidence: number;
}

// Add fallback data for testing
const FALLBACK_DATA: AlphaFoldData = {
  pdbData: `ATOM      1  N   ALA A   1      27.346  24.473   4.124  1.00 20.00
ATOM      2  CA  ALA A   1      26.001  24.001   4.456  1.00 20.00
ATOM      3  C   ALA A   1      25.000  25.089   4.000  1.00 20.00
ATOM      4  O   ALA A   1      25.000  26.000   3.000  1.00 20.00
HELIX    1   1 ALA A    1  ALA A    4   1
SHEET    1   A 2 ALA A   1  ALA A   4  0`,
  confidence: Array(4).fill(0.9),
  secondaryStructure: {
    helices: [{ start: 1, end: 4 }],
    sheets: [{ start: 1, end: 4 }]
  }
};

// Add API configuration
const ALPHAFOLD_API_CONFIG = {
  baseUrl: 'https://alphafold.ebi.ac.uk/api',
  version: 'v1',
  // Use Vite's import.meta.env instead of process.env
  apiKey: import.meta.env.VITE_ALPHAFOLD_API_KEY || ''
};

interface AlphaFoldResponse {
  pdb: string;
  confidence: number[];
  metadata: {
    uniprotId: string;
    modelVersion: string;
    confidenceScore: number;
  };
}

async function fetchAlphaFoldData(uniprotId: string): Promise<AlphaFoldData> {
  try {
    if (!ALPHAFOLD_API_CONFIG.apiKey) {
      console.warn('No AlphaFold API key found. Using fallback data.');
      return FALLBACK_DATA;
    }

    const url = `${ALPHAFOLD_API_CONFIG.baseUrl}/${ALPHAFOLD_API_CONFIG.version}/protein/${uniprotId}`;
    console.log('Fetching AlphaFold data from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${ALPHAFOLD_API_CONFIG.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`AlphaFold API error: ${response.status} ${response.statusText}`);
    }

    const data: AlphaFoldResponse = await response.json();
    
    // Parse PDB to extract secondary structure
    const secondaryStructure = parsePDBSecondaryStructure(data.pdb);

    return {
      pdbData: data.pdb,
      confidence: data.confidence,
      secondaryStructure,
      metadata: data.metadata
    };
  } catch (error) {
    console.error('Error fetching AlphaFold data:', error);
    console.warn('Using fallback data due to fetch error');
    return FALLBACK_DATA;
  }
}

function parsePDBSecondaryStructure(pdbData: string) {
  const helices: { start: number; end: number }[] = [];
  const sheets: { start: number; end: number }[] = [];
  
  const lines = pdbData.split('\n');
  lines.forEach(line => {
    if (line.startsWith('HELIX')) {
      const start = parseInt(line.substring(21, 25));
      const end = parseInt(line.substring(33, 37));
      helices.push({ start, end });
    } else if (line.startsWith('SHEET')) {
      const start = parseInt(line.substring(22, 26));
      const end = parseInt(line.substring(33, 37));
      sheets.push({ start, end });
    }
  });

  return { helices, sheets };
}

function RibbonSegment({ 
  start, 
  end, 
  type, 
  confidence,
  width = 0.3,
  height = 0.1,
  points
}: { 
  start: [number, number, number]; 
  end: [number, number, number]; 
  type: DomainType;
  confidence: number;
  width?: number;
  height?: number;
  points: THREE.Vector3[];
}) {
  // Create a smooth curve through the actual backbone points
  const curve = new THREE.CatmullRomCurve3(points);

  // Create a custom shape for the ribbon
  const shape = new THREE.Shape();
  shape.moveTo(-width/2, -height/2);
  shape.lineTo(width/2, -height/2);
  shape.lineTo(width/2, height/2);
  shape.lineTo(-width/2, height/2);
  shape.lineTo(-width/2, -height/2);

  // Create geometry with more segments for smoother curves
  const geometry = new THREE.ExtrudeGeometry(shape, {
    steps: 100, // Increased for smoother curves
    bevelEnabled: false,
    extrudePath: curve
  });

  // Create material with different properties based on structure type
  const getMaterial = () => {
    const baseColor = type === 'helix' ? '#4ade80' : '#60a5fa';
    return new THREE.MeshPhongMaterial({
      color: baseColor,
      shininess: 100,
      specular: 0x444444,
      transparent: true,
      opacity: confidence > 0.8 ? 0.9 : 0.7,
      side: THREE.DoubleSide
    });
  };

  return (
    <mesh geometry={geometry} material={getMaterial()} />
  );
}

function PAEHeatmap({ paeGrid, gridSize }: { paeGrid: PaeCell[][]; gridSize: number }) {
  const geometry = new THREE.PlaneGeometry(gridSize, gridSize);
  const material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.3
  });

  return (
    <mesh 
      position={[0, 0, -2]} 
      rotation={[-Math.PI / 2, 0, 0]}
      geometry={geometry}
      material={material}
    />
  );
}

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div style={{ 
      padding: '20px', 
      color: 'red', 
      background: '#fee2e2', 
      borderRadius: '4px',
      margin: '10px'
    }}>
      <h3>Something went wrong:</h3>
      <pre>{error.message}</pre>
    </div>
  );
}

function DebugInfo({ domains }: { domains: Domain[] }) {
  return (
    <Html position={[0, 0, 0]} style={{ color: 'white', background: 'rgba(0,0,0,0.7)', padding: '10px' }}>
      <div>Domains: {domains.length}</div>
    </Html>
  );
}

function BasicProteinStructure({ gridSize }: { gridSize: number }) {
  const getPosition = (row: number, col: number): [number, number, number] => {
    const spacing = 1.5;
    const x = (col - (gridSize - 1) / 2) * spacing;
    const y = (row - (gridSize - 1) / 2) * spacing;
    const z = Math.sin(row * col * 0.5) * 1.5;
    return [x, y, z];
  };

  // Create a continuous ribbon path
  const points: THREE.Vector3[] = [];
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      points.push(new THREE.Vector3(...getPosition(row, col)));
    }
  }

  const curve = new THREE.CatmullRomCurve3(points);
  const geometry = new THREE.TubeGeometry(curve, 100, 0.1, 8, false);

  return (
    <group>
      <mesh geometry={geometry}>
        <meshPhongMaterial 
          color="#60a5fa"
          shininess={100}
          specular={0x444444}
          transparent={true}
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function LoadingMessage({ progress, uniprotId }: { progress?: number; uniprotId?: string }) {
  return (
    <Html center>
      <div style={{ 
        color: 'white', 
        background: 'rgba(0,0,0,0.7)', 
        padding: '20px', 
        borderRadius: '8px',
        textAlign: 'center',
        minWidth: '200px'
      }}>
        <div>Loading AlphaFold data{uniprotId ? ` for ${uniprotId}` : ''}...</div>
        {progress !== undefined && (
          <div style={{ 
            marginTop: '10px',
            width: '100%',
            height: '4px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: '#60a5fa',
              transition: 'width 0.3s ease'
            }} />
          </div>
        )}
        {!ALPHAFOLD_API_CONFIG.apiKey && (
          <div style={{ 
            marginTop: '10px',
            fontSize: '12px',
            color: '#fbbf24'
          }}>
            No API key found. Using test data.
          </div>
        )}
      </div>
    </Html>
  );
}

function ErrorMessage({ error }: { error: Error }) {
  return (
    <Html center>
      <div style={{ 
        color: 'white', 
        background: 'rgba(220,38,38,0.7)', 
        padding: '20px', 
        borderRadius: '8px',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <h3>Error loading protein data:</h3>
        <p>{error.message}</p>
      </div>
    </Html>
  );
}

function Scene({ paeGrid, selectedCell, gridSize, uniprotId }: ProteinModel3DProps) {
  const group = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [alphaFoldData, setAlphaFoldData] = useState<AlphaFoldData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  useEffect(() => {
    if (uniprotId) {
      setLoadingProgress(0);
      const loadData = async () => {
        try {
          // Simulate progress
          const progressInterval = setInterval(() => {
            setLoadingProgress(prev => Math.min(prev + 10, 90));
          }, 500);

          const data = await fetchAlphaFoldData(uniprotId);
          clearInterval(progressInterval);
          setLoadingProgress(100);
          
          setAlphaFoldData(data);
          console.log('AlphaFold data loaded:', data);
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Failed to load protein data'));
          console.error('Error loading AlphaFold data:', err);
        }
      };

      loadData();
    }
  }, [uniprotId]);

  useFrame(() => {
    if (group.current && isDragging) {
      group.current.rotation.y *= 0.95;
    }
  });

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (!alphaFoldData) {
    return <LoadingMessage progress={loadingProgress} uniprotId={uniprotId} />;
  }

  return (
    <group ref={group}>
      {/* Debug Info */}
      <Html position={[0, 0, 0]} style={{ color: 'white', background: 'rgba(0,0,0,0.7)', padding: '10px' }}>
        <div>Helices: {alphaFoldData.secondaryStructure.helices.length}</div>
        <div>Sheets: {alphaFoldData.secondaryStructure.sheets.length}</div>
      </Html>

      {/* Render helices */}
      {alphaFoldData.secondaryStructure.helices.map((helix, index) => {
        const points = parsePDBBackbone(alphaFoldData.pdbData, helix.start, helix.end);
        return (
          <RibbonSegment
            key={`helix-${index}`}
            start={points[0].toArray() as [number, number, number]}
            end={points[points.length - 1].toArray() as [number, number, number]}
            type="helix"
            confidence={alphaFoldData.confidence[helix.start]}
            width={0.4}
            height={0.15}
            points={points}
          />
        );
      })}

      {/* Render sheets */}
      {alphaFoldData.secondaryStructure.sheets.map((sheet, index) => {
        const points = parsePDBBackbone(alphaFoldData.pdbData, sheet.start, sheet.end);
        return (
          <RibbonSegment
            key={`sheet-${index}`}
            start={points[0].toArray() as [number, number, number]}
            end={points[points.length - 1].toArray() as [number, number, number]}
            type="sheet"
            confidence={alphaFoldData.confidence[sheet.start]}
            width={0.3}
            height={0.1}
            points={points}
          />
        );
      })}
    </group>
  );
}

function parsePDBBackbone(pdbData: string, start: number, end: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const lines = pdbData.split('\n');
  
  for (let i = start; i <= end; i++) {
    const line = lines.find(l => l.startsWith('ATOM') && parseInt(l.substring(22, 26)) === i);
    if (line) {
      const x = parseFloat(line.substring(30, 38));
      const y = parseFloat(line.substring(38, 46));
      const z = parseFloat(line.substring(46, 54));
      points.push(new THREE.Vector3(x, y, z));
    }
  }
  
  return points;
}

export default function ProteinModel3D(props: ProteinModel3DProps) {
  return (
    <div style={{ width: '100%', height: '400px', position: 'relative', background: '#1a1a1a' }}>
      <Canvas 
        camera={{ position: [0, 0, 20], fov: 45 }}
        onCreated={({ gl }) => {
          gl.setClearColor('#1a1a1a', 1);
          gl.setPixelRatio(window.devicePixelRatio);
        }}
      >
        <Suspense fallback={<LoadingMessage />}>
          <Stats />
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <pointLight position={[-10, -10, -10]} intensity={0.8} />
          <spotLight
            position={[0, 10, 0]}
            angle={0.3}
            penumbra={1}
            intensity={1}
            castShadow
          />
          <Scene {...props} />
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            rotateSpeed={0.5}
            panSpeed={0.5}
            zoomSpeed={0.5}
            minDistance={5}
            maxDistance={30}
            dampingFactor={0.05}
            screenSpacePanning={true}
            makeDefault
          />
        </Suspense>
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