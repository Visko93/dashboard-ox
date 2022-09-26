import { Html } from "@react-three/drei"

type Props = Text

export const Text = ({ text, color = "#000" }: { text: string, color?: string }) => {
  return (
    <Html style={{ textAlign: 'left' }}>
      <h3 style={{ color: color }}>
        {text}
      </h3>
    </Html>)
}