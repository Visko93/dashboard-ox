import type { Vehicle } from "../../api/types"


export const VehicleCard = ({ color, name, plate_number }: Vehicle) => (
  <div >
    <h2>{name}</h2>
    <span className='plate' style={{ backgroundColor: color }}>{plate_number}</span>
    <span style={{ width: '100%', flex: 1, backgroundColor: color || "transparent" }}></span>
  </div>
)