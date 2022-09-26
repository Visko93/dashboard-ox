import * as React from "react"
import { ThreeElements } from "@react-three/fiber"
import { Text } from "../CanvasText"
import { ProgressBar } from "../ProgressBar"
import { CarModel } from "../CarModel"


export const Panel = ({ userData }: ThreeElements['mesh']) => {

    return (
        <group>
            <directionalLight intensity={1} position={[-2, 3, 4]} />
            <directionalLight intensity={1} position={[2, 3, 4]} />
            <React.Suspense>
                <CarModel url="/Cybertruck.gltf" color={userData?.color} />
            </React.Suspense>
            <ProgressBar value={userData?.battery_level} label={'Batery'} />
            <group>
                <mesh position={[5, -5, 1]}>
                    <ringGeometry args={[0, 4, 100, 8, 0, Math.PI]} />
                    <meshBasicMaterial color={'#ececec'} />
                </mesh>
                <mesh position={[5, -5, 1.01]}  >
                    <Text text={`Speed ${userData?.speed}`} color={"#0c0c0c"} />
                    <ringGeometry args={[1, 3.5, 100, 0, Math.PI * 2, Math.PI * ((userData?.speed / 100))]} attach="geometry" />
                    <meshBasicMaterial color={'#1c9706'} attach="material" />
                </mesh>

            </group>
        </group>
    )
}