import { createRoot } from 'react-dom/client';
import { MachineGear } from '@apparatus';
import { WebMachineWard } from './machine-ward';
import "./index.css";

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(<div>Loading...</div>);

async function initializeApp() {
  const gears: MachineGear<maplibregl.Map>[] = [];
  const machineWard = new WebMachineWard(gears);
  root.render(machineWard.render());
}

initializeApp();
