describe('Appearance state priority', () => {
    it('keeps highlighted above focus and disabled above both', () => {
        for (const stylesheet of [
            'gizmos/button/button.module.css',
            'hud/hexagon/hexagon.module.css',
            'forms/toggle-switch/toggle-switch.module.css',
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
                <button id="button" class="button">Button</button>
                <section id="hexagon" class="hexagon interactive depth-inset" tabindex="0">
                    <svg><path class="polygon-base" /><path class="polygon-inset-shadow-edges" /></svg>
                    <span class="content">Hexagon</span>
                </section>
                <label id="toggle" class="toggle-switch" tabindex="0">
                    <span class="track"></span><span class="label">Toggle</span>
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
                root: '#toggle',
                surface: '#toggle .track',
                surfaceProperty: 'background-color',
                glyphs: '#toggle .label',
            },
        ]) {
            cy.get(control.surface).should('have.css', control.surfaceProperty, 'rgb(10, 0, 0)');
            cy.get(control.root).focus();
            cy.get(control.surface).should('have.css', control.surfaceProperty, 'rgb(20, 0, 0)');
            cy.get(control.glyphs).should('have.css', 'color', 'rgb(20, 0, 0)');

            cy.get(control.root).invoke('addClass', 'highlighted');
            cy.get(control.surface).should('have.css', control.surfaceProperty, 'rgb(30, 0, 0)');
            cy.get(control.glyphs).should('have.css', 'color', 'rgb(30, 0, 0)');
            if (control.root === '#hexagon') {
                cy.get('#hexagon .polygon-inset-shadow-edges').should('have.css', 'stroke', 'rgb(30, 0, 0)');
            }

            cy.get(control.root).invoke('addClass', 'disabled');
            cy.get(control.surface).should('have.css', control.surfaceProperty, 'rgb(40, 0, 0)');
            cy.get(control.glyphs).should('have.css', 'color', 'rgb(40, 0, 0)');
            cy.get(control.root).blur();
        }
    });
});
