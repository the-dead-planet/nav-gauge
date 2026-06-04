import { createRoot } from 'react-dom/client';
import { MachineGear } from '@apparatus';
import { WebMachineWard } from './machine-ward';
import { ErrorFallbackPage, LoadingPage } from './pages';
import "./index.css";

declare const __GEAR_REGISTRY__: string[];

const container = document.getElementById('app');
const root = createRoot(container!);

async function initializeApp() {
    root.render(<LoadingPage stage="gears" />);

    try {
        const modules = await Promise.allSettled(__GEAR_REGISTRY__.map((gearName) => import(`../../gears/${gearName}/web/src`)));
        const [gears, rejected] = modules
            .reduce<[MachineGear<maplibregl.Map>[], string[]]>(
                (acc, module, i) => {
                    const gearName = __GEAR_REGISTRY__[i];
                    if (module.status === 'fulfilled') {
                        acc[0].push(module.value.default);
                    } else {
                        acc[1].push(`${gearName} (${module.reason})`);
                    }
                    return acc;
                },
                [[], []]
            );

        const machineWard = new WebMachineWard(gears);
        root.render(machineWard.render());

        if (rejected.length > 0) {
            console.warn('Some gears could not be engaged:', rejected);
            machineWard.signaliumBureau.addNotice({
                id: 'gear-load-errors',
                type: 'warning',
                text: `Some gears could not be engaged: ${rejected.join(', ')}.`,
            });
        }
    } catch (err) {
        const error = err as Error;
        root.render(<ErrorFallbackPage error={error} errorInfo={{ componentStack: error.stack }} />);
    }

}

initializeApp();
