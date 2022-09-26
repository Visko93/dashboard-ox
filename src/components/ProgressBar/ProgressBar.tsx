import { Text } from "../CanvasText"

export const ProgressBar = ({ value, label }: { value: number, label?: string }) => {
    const labelString = label ? `${label} ${value}` : `${value}`

    return (
        <>
            <group position={[5, 3, 1.5]} >
                <Text text={labelString} color={"#0c0c0c"} />
                <mesh >
                    <planeGeometry args={[5 * (value / 100), 1]} attach="geometry" />
                    <meshStandardMaterial color={'#1c9706'} attach="material" />
                </mesh>

            </group >
        </>
    )
}