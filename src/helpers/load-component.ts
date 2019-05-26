import * as handlebars from 'handlebars';
import * as path from 'path';
import * as fs from 'fs-extra';

import {ComponentTemplate} from '../models/component-template';
import { parseYaml } from '../parse-yaml';

// tslint:disable-next-line:no-any
export function loadComponent(t: ComponentTemplate, ...args: any[]): handlebars.SafeString {
    if (args.length < 2) {
        throw new Error('hopin_loadComponent needs a file for the first argument');
    }

    const componentPath = args[0];
    if (typeof componentPath !== "string") {
        throw new Error(`hopin_loadComponent cannot use '${componentPath}' as a component path`);
    }
    
    let componentArgs = {};
    if (args.length >= 2) {
        componentArgs = args[1].hash;
    }

    const fullComponentPath = path.join(t.relativePath, componentPath);
    const componentRelPath = path.dirname(fullComponentPath);
    const cmpBuffer = fs.readFileSync(fullComponentPath);
    const hopinYaml = parseYaml(cmpBuffer.toString(), componentRelPath);
    const compTemplate = new ComponentTemplate(componentRelPath, hopinYaml);
    const bundle = compTemplate.render({args: componentArgs});
    t.appendStyles(bundle.styles);
    t.appendScripts(bundle.scripts);
    t.appendElements(bundle.elements);
    return new handlebars.SafeString(bundle.renderedTemplate);
}