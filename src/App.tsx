import * as React from 'react'
import { Canvas, ThreeElements, useFrame } from '@react-three/fiber'
import { apiClient } from './api'
import type { TelemetryMessage, Vehicle } from './api/types'

import './App.css'

const BASE_URL = 'https://vehicle-api-test.herokuapp.com/api/'

const VehicleCard = ({ color, name, plate_number }: Vehicle) => (
  <div >
    <h2>{name}</h2>
    <span className='plate' style={{ backgroundColor: color }}>{plate_number}</span>
    <span style={{ width: '100%', flex: 1, backgroundColor: color || "transparent" }}></span>
  </div>
)


function App() {
  const [vehicleList, setVehicleList] = React.useState<Array<Vehicle> | []>([])
  const [focusVehicle, setFocusVehicle] = React.useState<string | null>(null)
  const dashboardData = React.useRef<TelemetryMessage | null>(null)

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

    (async () => {
      const data = await apiClient<TelemetryMessage>({ url: `${BASE_URL}vehicles/${focusVehicle}/telemetry` })
      if (data) {
        dashboardData.current = data
      }
    })()
  }, [focusVehicle])

  console.log(dashboardData.current);

  const handleSelection = (id: string) => {
    setFocusVehicle(id)
  }

  return (
    <div className="App">
      <header>
        <ul className='slider'>
          {vehicleList.length > 0
            ? vehicleList.map((vehicle) => (
              <li onClick={() => handleSelection(vehicle.id)}>
                <VehicleCard key={vehicle.id}  {...vehicle} />
              </li>
            ))
            : null}
        </ul>
      </header>
      <hr />
      <canvas></canvas>
    </div>
  )
}

export default App
