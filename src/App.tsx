import { useTheme } from '@/features/enem-correcao/hooks/useTheme'
import { EnemCorrecaoFeature } from '@/features/enem-correcao'

export default function App() {
  const { theme } = useTheme()

  return (
    <div className={theme === 'light' ? 'light' : ''}>
      <EnemCorrecaoFeature />
    </div>
  )
}
