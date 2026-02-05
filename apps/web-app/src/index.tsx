import { createRoot } from 'react-dom/client';
import { WebMachineWard } from './machine-ward';
import "./index.css";

const machineWard = new WebMachineWard();

const container = document.getElementById('app');
const root = createRoot(container!);

root.render(machineWard.render());
