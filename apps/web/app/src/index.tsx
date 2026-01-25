import { createRoot } from 'react-dom/client';
import { routeGear } from '@gears';
import { WebMachineWard } from './machine-ward';
import "./index.css";

const machineWard = new WebMachineWard(
    { route: routeGear },
    localStorage,
    window.matchMedia("(prefers-color-scheme: light)").matches
);

const container = document.getElementById('app');
const root = createRoot(container!);

root.render(machineWard.render());
