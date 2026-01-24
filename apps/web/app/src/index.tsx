import { createRoot } from 'react-dom/client';
import { StateWarden } from '@apparatus';
import { App } from "./App";
import "./index.css";

const stateWarden = new StateWarden(localStorage);

const container = document.getElementById('app');
const root = createRoot(container!);

root.render(<App stateWarden={stateWarden} />);
