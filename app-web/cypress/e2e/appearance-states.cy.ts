describe('Appearance state priority', () => {
    it('keeps highlighted above focus and disabled above both', () => {
        for (const stylesheet of [
            'gizmos/button/button.module.css',
            'hud/hexagon/hexagon.module.css',
            'hud/surface.module.css',
            'forms/toggle-switch/toggle-switch.module.css',
            'forms/checkbox/checkbox.module.css',
            'forms/radio/radio.module.css',
        ]) {
            cy.readFile<string>(`../ui/web/src/${stylesheet}`).then((css) => {
                cy.document().then((document) => {
                    const style = document.createElement('style');
                    style.textContent = css;
                    document.head.appendChild(style);
                });
            });
        }

        cy.document().then((document) => {
            const stateColors: Record<string, string> = {
                default: 'rgb(10, 0, 0)',
                'hover-focus': 'rgb(20, 0, 0)',
                'active-pressed': 'rgb(30, 0, 0)',
                disabled: 'rgb(40, 0, 0)',
            };
            for (const [state, color] of Object.entries(stateColors)) {
                for (const channel of ['surface', 'border', 'glyphs']) {
                    document.documentElement.style.setProperty(`--appearance-${state}-${channel}`, color);
                }
            }
            document.documentElement.style.setProperty('--appearance-inset-default-inner-start', 'rgb(10, 0, 0)');
            document.documentElement.style.setProperty('--appearance-inset-active-pressed-inner-start', 'rgb(30, 0, 0)');
            document.body.innerHTML = `
                <button id="button" class="surface rectangle button" data-interactive="true">Button</button>
                <section id="hexagon" class="surface hexagon depth-inset" data-interactive="true" tabindex="0">
                    <svg class="drawing"><path class="paint polygon-base" /><path class="inset-shadow" /></svg>
                    <span class="content">Hexagon</span>
                </section>
                <section id="panel" class="surface rectangle" data-interactive="true" tabindex="0">Panel</section>
                <section id="bevel" class="surface" data-interactive="true" tabindex="0">
                    <svg class="drawing"><path class="paint" /></svg><span class="content">Bevel</span>
                </section>
                <section id="notched" class="surface" data-interactive="true" tabindex="0">
                    <svg class="drawing"><path class="paint" /></svg><span class="content">Notched</span>
                </section>
                <label id="toggle" class="toggle-switch" tabindex="0">
                    <span class="track"></span><span class="label">Toggle</span>
                </label>
                <label id="checkbox" class="checkbox" tabindex="0">
                    <input class="input" type="checkbox" />
                    <span class="box"></span><span class="label">Checkbox</span>
                </label>
                <label id="radio" class="radio" tabindex="0">
                    <input class="input" type="radio" />
                    <span class="box"></span><span class="label">Radio</span>
                </label>
                <label id="checkbox-hexagon" class="checkbox" tabindex="0">
                    <input class="input" type="checkbox" />
                    <span class="box corners-hexagon"><svg class="drawing"><polygon class="paint" /></svg></span>
                    <span class="label">Hexagon checkbox</span>
                </label>
                <label id="radio-hexagon" class="radio" tabindex="0">
                    <input class="input" type="radio" />
                    <span class="box corners-hexagon"><svg class="drawing"><polygon class="paint" /></svg></span>
                    <span class="label">Hexagon radio</span>
                </label>
            `;
        });

        for (const control of [
            {
                root: '#button',
                surface: '#button',
                surfaceProperty: 'background-color',
                glyphs: '#button',
            },
            {
                root: '#hexagon',
                surface: '#hexagon .polygon-base',
                surfaceProperty: 'fill',
                glyphs: '#hexagon .content',
            },
            {
                root: '#panel',
                surface: '#panel',
                surfaceProperty: 'background-color',
                glyphs: '#panel',
            },
            {
                root: '#bevel',
                surface: '#bevel .paint',
                surfaceProperty: 'fill',
                glyphs: '#bevel .content',
            },
            {
                root: '#notched',
                surface: '#notched .paint',
                surfaceProperty: 'fill',
                glyphs: '#notched .content',
            },
            {
                root: '#toggle',
                surface: '#toggle .track',
                surfaceProperty: 'background-color',
                glyphs: '#toggle .label',
            },
            {
                root: '#checkbox',
                surface: '#checkbox .box',
                surfaceProperty: 'background-color',
                glyphs: '#checkbox .label',
            },
            {
                root: '#radio',
                surface: '#radio .box',
                surfaceProperty: 'background-color',
                glyphs: '#radio .label',
            },
            {
                root: '#checkbox-hexagon',
                surface: '#checkbox-hexagon .paint',
                surfaceProperty: 'fill',
                glyphs: '#checkbox-hexagon .label',
            },
            {
                root: '#radio-hexagon',
                surface: '#radio-hexagon .paint',
                surfaceProperty: 'fill',
                glyphs: '#radio-hexagon .label',
            },
        ]) {
            cy.get(control.surface).should('have.css', control.surfaceProperty, 'rgb(10, 0, 0)');
            cy.get(control.root).focus();
            cy.get(control.surface).should('have.css', control.surfaceProperty, 'rgb(20, 0, 0)');
            cy.get(control.glyphs).should('have.css', 'color', 'rgb(20, 0, 0)');

            const usesSurfaceAppearance = control.root !== '#toggle';
            if (usesSurfaceAppearance) {
                if (!control.root.startsWith('#checkbox') && !control.root.startsWith('#radio')) {
                    cy.get(control.root).invoke('attr', 'data-pressed', 'true');
                    cy.get(control.surface).should('have.css', control.surfaceProperty, 'rgb(30, 0, 0)');
                    cy.get(control.root).invoke('removeAttr', 'data-pressed');
                }
                cy.get(control.root).invoke('attr', 'data-highlighted', 'true');
            } else {
                cy.get(control.root).invoke('addClass', 'highlighted');
            }
            cy.get(control.surface).should('have.css', control.surfaceProperty, 'rgb(30, 0, 0)');
            cy.get(control.glyphs).should('have.css', 'color', 'rgb(30, 0, 0)');
            if (control.root === '#hexagon') {
                cy.get('#hexagon .inset-shadow').should('have.css', 'stroke', 'rgb(30, 0, 0)');
            }

            if (usesSurfaceAppearance) {
                cy.get(control.root).invoke('css', '--appearance-active-pressed-glyphs-override', 'rgb(50, 0, 0)');
                cy.get(control.root).invoke('attr', 'data-disabled', 'true');
            } else {
                cy.get(control.root).invoke('addClass', 'disabled');
            }
            cy.get(control.surface).should('have.css', control.surfaceProperty, 'rgb(40, 0, 0)');
            cy.get(control.glyphs).should('have.css', 'color', 'rgb(40, 0, 0)');
            cy.get(control.root).blur();
        }
    });
});
