import {Template} from '../template';

export function renderComponent(t: Template, ...args: any[]): string {
    if (args.length < 1) {
        throw new Error('hopin_loadComponent needs a file for the first argument')
    }

    const componentPath = args[0]
    if (typeof componentPath != "string") {
        throw new Error(`hopin_loadComponent cannot use '${componentPath}' as a component path`);
    }

    console.log(`Load component: ${componentPath}`);
    console.log(`-------------> t`, t);
    console.log(`-------------> args`, args);

    return 'Hello Matt';
}