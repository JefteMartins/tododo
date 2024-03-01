import { ToDo } from './components/ToDo'
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes'

function App() {

  return (
      <Theme appearance='dark'  accentColor="crimson" grayColor="sand" radius="large" scaling="95%" >
        <ToDo />
      </Theme>
  )
}

export default App
