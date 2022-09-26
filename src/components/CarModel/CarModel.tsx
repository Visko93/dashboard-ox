import * as React from "react"
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const BASE_COLOR = "#CECECE"

export const CarModel = ({ url, color = BASE_COLOR }: { url: string, color?: string }) => {
  const gltf = useLoader(GLTFLoader, url);

  React.useMemo(() => {
    gltf.materials['Metal Bodywork']?.color.set(color)
  }, [color])

  return <>
    <primitive object={gltf.scene} dispose={null} />;
  </>
}