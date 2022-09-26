import * as React from 'react'
import { Canvas } from '@react-three/fiber'
import { apiClient } from './api'
import type { TelemetryMessage, Vehicle } from './api/types'
import './App.css'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { VehicleCard } from './components/VehicleCard';
import { Panel } from './components/Panel';
import { Text } from './components/CanvasText';

const BASE_URL = import.meta.env.VITE_BASE_URL
const PI = Math.PI
const CAMERA_DISTANCE = 100

type DashboardProps = TelemetryMessage & Vehicle

function App() {
  const [vehicleList, setVehicleList] = React.useState<Array<Vehicle> | []>([])
  const [dashboardData, setDashboardData] = React.useState<DashboardProps | Vehicle | null>(null)
  const [focusVehicle, setFocusVehicle] = React.useState<string | null>(null)

  const getFocusVehicle = (id: string) => vehicleList
    .filter(vehicle => vehicle.id === id)[0] || null

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
      const data = await apiClient<TelemetryMessage>({
        url: `${BASE_URL}vehicles/${focusVehicle}/telemetry`
      }
      )
      if (data) {
        data
          ? setDashboardData({ ...data, ...vehicle })
          : setDashboardData({ ...vehicle })
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
              <li
                key={vehicle.id}
                onClick={() => handleSelection(vehicle.id)}
                className={vehicle.id === dashboardData?.id ? "active" : ""}
                //@ts-ignore
                style={{ '--active-color': vehicle.color }}
              >
                <VehicleCard  {...vehicle} />
              </li>
            ))
            : null}
        </ul>
      </header>
      <hr />
      <Canvas style={{ width: '100%', height: '70vh' }} >
        <OrbitControls
          enableDamping maxPolarAngle={0}
          minPolarAngle={PI / 2}
          maxAzimuthAngle={PI - 2.75}
          minAzimuthAngle={PI + 2.75} />
        <ambientLight />
        <PerspectiveCamera makeDefault={true} fov={CAMERA_DISTANCE} position={[0, 0, 10]} />
        {dashboardData
          ? <Panel userData={dashboardData} />
          : <Text text='Select a car' />
        }
      </Canvas>
    </div>
  )
}

export default App
