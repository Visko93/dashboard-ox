import * as React from 'react'
import { Canvas, ThreeElements, useFrame, useLoader, useThree } from '@react-three/fiber'
import { apiClient } from './api'
import type { TelemetryMessage, Vehicle } from './api/types'
import { Model as Car } from "../Car";
import './App.css'
import { GradientTexture, Html, OrbitControls, PerspectiveCamera, Plane, PresentationControls } from '@react-three/drei';
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

const ProgressBar = ({ max, min, value }: { max: number, min: number, value: number }) => {
  const bar = React.useRef<THREE.Mesh>(null!)

  return (
    <mesh ref={bar} position={[5, 3, 1.5]} >
      <boxGeometry args={[5, 2, 2]} />
      <meshStandardMaterial color={'#FF0'} />
    </mesh>
  )
}
const Text = ({ text, color = "#000" }: { text: string, color?: string }) => {
  return (
    <Html>
      <div>
        <h3 style={{ color: color }}>
          {text}
        </h3>
      </div>
    </Html>)
}

function Panel({ userData }: ThreeElements['mesh']) {
  const { setSize } = useThree()

  const mesh = React.useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = React.useState(false)
  return (
    <group>
      <mesh >
        <boxGeometry args={[20, 12, 1]} />
      </mesh>

      <ProgressBar min={0} max={100} value={userData?.battery_level} />

      <group>

        <mesh position={[5, -5, 1.5]}>
          <ringGeometry args={[0, 4, 100, 8, 0, Math.PI]} />
          <meshBasicMaterial color={'#040404'} />
        </mesh>
        <mesh position={[5, -5, 1.55]} >
          <ringGeometry args={[1, 3, 100, 0, Math.PI * 2, Math.PI * ((userData?.speed / 100))]} />
          <meshBasicMaterial color={'#1c9706'} />
        </mesh>
        <Text text={String(userData?.speed)} color={"#1c9706"} />
      </group>
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
