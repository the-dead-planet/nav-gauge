import { createRoot } from 'react-dom/client';
import { WebMachineWard } from './machine-ward';
import { WebRouteStoryGear } from '../../gears/route-story/src';
import "./index.css";

const machineWard = new WebMachineWard(
    {
        navigate: null,
        'route-story': WebRouteStoryGear,
        "record-route": null,
        "submit-data": null,
    },
    localStorage,
    window.matchMedia("(prefers-color-scheme: light)").matches
);

const container = document.getElementById('app');
const root = createRoot(container!);

root.render(machineWard.render());
