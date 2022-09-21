import * as React from 'react'
import { Canvas, ThreeElements, useFrame, useThree } from '@react-three/fiber'
import { apiClient } from './api'
import type { TelemetryMessage, Vehicle } from './api/types'
import { Model as Car } from "../Car";
import './App.css'
import { GradientTexture, OrbitControls, PerspectiveCamera, Plane, PresentationControls } from '@react-three/drei';
import THREE, { Shape, Vector2, Vector3 } from 'three';

const BASE_URL = 'https://vehicle-api-test.herokuapp.com/api/'
type DashboardProps = TelemetryMessage & Vehicle

const VehicleCard = ({ color, name, plate_number }: Vehicle) => (
  <div >
    <h2>{name}</h2>
    <span className='plate' style={{ backgroundColor: color }}>{plate_number}</span>
    <span style={{ width: '100%', flex: 1, backgroundColor: color || "transparent" }}></span>
  </div>
)

function Panel({ userData }: ThreeElements['mesh']) {
  const { setSize } = useThree()

  const mesh = React.useRef<THREE.Mesh>(null!)
  const bar = React.useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = React.useState(false)
  return (
    <group>
      <mesh >
        <boxGeometry args={[20, 12, 1]} />
        <meshStandardMaterial color={'#0c0c0c'} transparent />
      </mesh>
      <mesh ref={bar} position={[5, 3, 1.5]} >
        <extrudeGeometry args={[new Shape([new Vector2(2, 1), new Vector2(- 2, 1), new Vector2(- 2, - 0.25), new Vector2(2, - 0.25)])]} />
        <meshStandardMaterial color={'green'} />
      </mesh>
      <mesh ref={bar} position={[5, 3, 1.5]} >
        <extrudeGeometry args={[new Shape([new Vector2(2, 1), new Vector2(- 2, 1), new Vector2(- 2, - 0.25), new Vector2(2, - 0.25)])]} />

      </mesh>
      <mesh ref={bar} position={[5, 1, 1.5]} >
        <extrudeGeometry args={[new Shape([new Vector2(2, 1), new Vector2(- 2, 1), new Vector2(- 2, - 0.25), new Vector2(2, - 0.25)])]} />
      </mesh>
      <mesh ref={bar} position={[5, -1, 1.5]} >
        <extrudeGeometry args={[new Shape([new Vector2(2, 1), new Vector2(- 2, 1), new Vector2(- 2, - 0.25), new Vector2(2, - 0.25)])]} />
      </mesh>
      <mesh position={[5, -5, 1.5]}>
        <circleGeometry args={[2.5, 100, Math.PI * 2, Math.PI]} />
        <meshBasicMaterial color={'#FFF'} />
      </mesh>
      <mesh position={[5, -5, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.5, 100, Math.PI * 2, Math.PI * userData?.speed / 100]} />
        <meshBasicMaterial color={'#0c0c0c'} />
      </mesh>
    </group>
  )
}

function App() {
  const [vehicleList, setVehicleList] = React.useState<Array<Vehicle> | []>([])
  const [dashboardData, setDashboardData] = React.useState<DashboardProps | Vehicle | null>(null)
  const [focusVehicle, setFocusVehicle] = React.useState<string | null>(null)

  const getFocusVehicle = (id: string) => vehicleList.filter(vehicle => vehicle.id === id)[0] || null

  const vehicleFetcher = React.useCallback(() => (
    (async () => await apiClient<Vehicle[]>({ url: `${BASE_URL}vehicles` })
    )()
  ), [])

  React.useEffect(() => {
    (async () => {
      const vehicles = await vehicleFetcher()
      vehicles && setVehicleList(vehicles)
    })()
  }, [])

  React.useEffect(() => {
    if (!focusVehicle) return
    const vehicle = getFocusVehicle(focusVehicle);

    (async () => {
      const data = await apiClient<TelemetryMessage>({ url: `${BASE_URL}vehicles/${focusVehicle}/telemetry` })
      if (data) {

        data ? setDashboardData({ ...data, ...vehicle }) : setDashboardData({ ...vehicle })
      }
    })()
  }, [focusVehicle])

  const handleSelection = (id: string) => setFocusVehicle(id)

  return (
    <div className="App">
      <header>
        <ul className='slider'>
          {vehicleList.length > 0
            ? vehicleList.map((vehicle) => (
              <li key={vehicle.id} onClick={() => handleSelection(vehicle.id)}>
                <VehicleCard   {...vehicle} />
              </li>
            ))
            : null}
        </ul>
      </header>
      <hr />
      <Canvas style={{ width: '100%', height: '70vh' }} >
        <OrbitControls />
        <PerspectiveCamera makeDefault={true} fov={75} position={[0, 0, 10]} />
        <Panel userData={dashboardData || undefined} />
      </Canvas>
    </div>
  )
}

export default App
