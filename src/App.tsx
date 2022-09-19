import * as React from 'react'
import { Canvas, ThreeElements, useFrame } from '@react-three/fiber'
import { apiClient } from './api'
import type { TelemetryMessage, Vehicle } from './api/types'

import './App.css'

const BASE_URL = 'https://vehicle-api-test.herokuapp.com/api/'

const VehicleCard = ({ color, name, plate_number }: Vehicle) => (
  <div>
    <h2>{name}</h2>
    <small>{plate_number}</small>
  </div>
)


function App() {
  const [vehicleList, setVehicleList] = React.useState<Array<Vehicle> | []>([])

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


  return (
    <div className="App">
      <header>
        <ul className='slider'>
          {vehicleList.length > 0
            ? vehicleList.map((vehicle) => (
              <li>
                <VehicleCard key={vehicle.id} {...vehicle} />
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
