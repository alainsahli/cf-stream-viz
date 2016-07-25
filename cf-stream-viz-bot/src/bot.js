import { minibotBuilder } from 'minibot';
import recognizer from './recognizer';

export default function (connector) {
    minibotBuilder('CF Stream Visualization Bot', connector)
        .recognizer(recognizer)
        .build();
}
