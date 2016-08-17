import Letter from './Letter';
import Invoice from './Invoice';
import Report from './Report';
import Slidedeck from './Slidedeck';

const Templates = [
  { id: '', name: 'No template', component: {} },
  { id: 'letter', name: 'Letter', component: Letter },
  { id: 'invoice', name: 'Invoice', component: Invoice },
  { id: 'report', name: 'Report', component: Report },
  { id: 'slidedeck', name: 'Slide deck', component: Slidedeck },
];

export default Templates;
